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
  	baggageN:'请输入您的行李号码',
  	baggageNo:'',
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
     			baggageNo:data.data.baggageNo,
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
      baggageNo:e.detail.value
    })
  }, 
  cancel:function(e){
  	var that=this;
  	var baggageNo=that.data.baggageNo;
  	if(baggageNo){
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
	      	if(res.data.success==true){
	      		 wx.showToast({
		          title: '提交成功'
		        });
		        setTimeout(function(){
				     wx.navigateBack({
							  delta: 1
							})
				    },500);
		         
	      	}else{
	      		 wx.showToast({
		          title: '您已提交过行李号码'
		        })
	      	}
	        
	      }  
	   })  
  	}else{
  		 wx.showToast({
		          title: '请输入您的行李号码'
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
