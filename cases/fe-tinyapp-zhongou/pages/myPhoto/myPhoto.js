//myFollows .js
var { APIS } = require('../../const');
var user = require('../../libs/user');
var { request } = require('../../libs/request');
var { validate } = require('../../libs/validate');

Page({
  data: {
		footerConfig: { 
      pagePersonal: true
    },
    offset: 1,
    loading:false,
    disabled:false,
    hasMore:'',
  	isNoData:"",
  	photoNo:'请输入您的照片号码',
  	moduleId:'',
  	
  },
  onLoad: function (options) {
  	console.log(options)
  	this.setData({
      moduleId: options.moduleId
   });
	    user.login(this.onLoadData(false), this, false);
  },
  
  onLoadData: function(load){
  	if(load){
  		that.setData({
  			loading:!that.data.loading,
		    disabled:!that.data.disabled,
		  	loadText:'加载中...',
  		})
  	}
  },
  contentchange:function(e){
    this.setData({
      photoNo:e.detail.value
    })
  }, 
  sendphotoNo:function(e){
  	var that=this;
  	var photoNo=that.data.photoNo;
  	wx.request({
	      url: APIS.ADD_COMPLETE,
	      data: {
	      	moduleId: that.data.moduleId,
  				photoNo: photoNo  
	      },
	     header: {
            auth: wx.getStorageSync('token')
         },
	      method: "POST", 
	      success: function(res) {  
	        console.log(res)
	         wx.showToast({
		          title: '提交成功'
		        });
		         wx.navigateTo({
						  url: '../detail/detail'
						});
	      }  
	   })  
  }, 
  showMore:function(e){
		var that=this;
		if(that.data.hasMore){
			that.setData({
				offset:that.data.offset+1,
			});
			that.onLoadData(true);
		}
	}
})
