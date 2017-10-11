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
  	list:[]
  	
  },
  onLoad: function (options) {
  	console.log(options)
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
	        console.log(res)
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
