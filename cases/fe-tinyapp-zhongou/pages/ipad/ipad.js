//myFollows .js
var { APIS } = require('../../const');
var user = require('../../libs/user');
var { request } = require('../../libs/request');
var { validate } = require('../../libs/validate');
//引入通知
var WxNotificationCenter = require('../../vendors/WxNotificationCenter.js')
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
  	eventId:'',
  	list:[]
  	
  },
  onLoad: function (options) {
  	this.setData({
       moduleId: options.moduleId,
      eventId:options.eventId
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
  cancel:function(e){
  	var that=this;
  	wx.request({
	      url: APIS.ADD_IPAD,
	      data: {
	      	moduleId: that.data.moduleId
	      },
	     header: {
            auth: wx.getStorageSync('token')
         },
	      method: "POST", 
	      success: function(res) {  
	       if(res.data.success==true){
	      		 wx.showToast({
		          title: '提交成功'
				});
				WxNotificationCenter.postNotificationName('NotificationName', {isSubmitIpad:true})
		        setTimeout(function(){
					wx.navigateBack({
						delta: 1
					  })
				    },500);         
	      	}else{
	      		 wx.showToast({
		          title: '您已提交过IPAD'
		        })
	      	}
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
