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
  	baggageNo:'请输入您的行李号码',
  	loadText:'点击加载更多...',
  	list:[]
  	
  },
  onLoad: function () {
  	wx.showLoading({
	      mask: true,
	      title: '数据加载中'
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
  	var photoNo=that.data.photoNo;
  	wx.request({
	      url: APIS.ADD_COMPLETE,
	      data: {
	      	moduleId: wx.getStorageSync('moduleId'),
  				baggageNo: baggageNo  
	      },
	     header: {'content-type': 'application/x-www-form-urlencoded'},  
	      method: "POST", 
	      success: function(res) {  
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
