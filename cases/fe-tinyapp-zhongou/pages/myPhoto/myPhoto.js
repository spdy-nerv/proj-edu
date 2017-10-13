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
  	photoNo:'',
  	photo:'请输入照片号码',
  	moduleId:'',
  	eventId:'',
  	
  },
  onLoad: function (options) {
  	console.log(options)
  	this.setData({
      moduleId: options.moduleId,
      eventId:options.eventId
   });
	    user.login(this.onLoadData(false), this, false);
  },
  
 onLoadData: function(load){
  	var that = this;
  	console.log(wx.getStorageSync('token'))
  	if(load){
  		that.setData({
  			loading:!that.data.loading,
		    disabled:!that.data.disabled,
		  	loadText:'加载中...',
  		})
  	}
  	
  	 request({
      url: APIS.GET_TASK,
       data:{
		  		moduleId: that.data.moduleId,
		  	},
	      header: {
            auth: wx.getStorageSync('token')
         },
      method: 'GET',
      realSuccess: function(data){
      	console.log("我的关注asdf",data);
     		that.setData({
		      photoNo:data.data.photoNo,
		    })
      },
      realFail: function(msg) {
        wx.hideLoading();
        wx.showToast({
          title: msg
        });
      }
    }, false);
  },
  contentchange:function(e){
    this.setData({
      photoNo:e.detail.value
    })
  }, 
  sendphotoNo:function(e){
  	var that=this;
  	var photoNo=that.data.photoNo;
  	if(photoNo){
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
	      	if(res.data.success==true){
	      		 wx.showToast({
		          title: '提交成功'
		        });
		         setTimeout(function(){
				      wx.navigateTo({url:'/pages/detail/detail?eventId='+that.data.eventId+'&&photoNo='+photoNo}) 
				    },500);    
	      	}else{
	      		 wx.showToast({
		          title: '您已提交过照片号码'
		        });
	      	}
	        
	      }  
	   })  
  	}else{
  		wx.showToast({
		          title: '请输入您的照片号码'
		        });
  	}
  	
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
