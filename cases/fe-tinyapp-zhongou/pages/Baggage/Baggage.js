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
  	moduleId:'',
  	baggageNo:'请输入您的行李号码',
  	list:[]
  	
  },
  onLoad: function (options) {
  	this.setData({
      moduleId: options.moduleId
   });
	    user.login(this.onLoadData(false), this, false);
  },
  
  onLoadData: function(load){
  	var that = this;
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
      baggageNo:e.detail.value
    })
  }, 
  cancel:function(e){
  	var that=this;
  	var baggageNo=that.data.baggageNo;
  	wx.request({
	      url: APIS.ADD_BAGGAGE,
	      data: {
	      	moduleId: that.data.moduleId,
  				baggageNo: baggageNo  
	      },
	     header: {
            auth: wx.getStorageSync('token')
         },
	      method: "POST", 
	      success: function(res) {  
	         wx.showToast({
		          title: '提交成功'
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
