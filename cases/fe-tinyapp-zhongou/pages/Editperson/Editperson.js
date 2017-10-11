//personCenter.js
var { APIS } = require('../../const');
var user = require('../../libs/user');
var { request } = require('../../libs/request');
Page({
  data: {
  	realName:'',
  	declaration:'在你的个人资料中添加简介',
  	location:'',
  	birthday:'',
  	professional:'',
  	grade:'',
  	phone:'',
  },
   //我的关注
  toEditperson: function(e){
  	wx.navigateTo({
			  url: '../Editperson/Editperson'
		});
  },
   phonechange:function(e){
    this.setData({
      phone:e.detail.value
    })
  },
   realNamechange:function(e){
    this.setData({
      realName:e.detail.value
    })
  },
   locationchange:function(e){
    this.setData({
      location:e.detail.value
    })
  },
   datePickerBindchange:function(e){
    this.setData({
      birthday:e.detail.value
    })
},
   professionalchange:function(e){
    this.setData({
      professional:e.detail.value
    })
  },
   gradechange:function(e){
    this.setData({
      grade:e.detail.value
    })
  },
  declarationchange:function(e){
    this.setData({
      declaration:e.detail.value
    })
  },
  onLoad: function () {
  	wx.showLoading({
	      mask: true,
	      title: '数据加载中'
	    });
	    user.login(this.onLoadData, this, true);
  },
  onLoadData: function(){
  	var that = this;
  	var params = {
  		sid: wx.getStorageSync('sid')
  	};
  	 request({
      url: APIS.GET_PERSONALBASEINFO,
      header: {
            auth: wx.getStorageSync('token')
         },
      method: 'GET',
      realSuccess: function(data){
      	console.log(data);
        that.setData({
        	realName	:data.data.realName,
        	birthday  :data.data.birthday ,
        	grade 		:data.data.grade ,
        	phone 	  :data.data.phone ,
        	professional :data.data.professional  ,
        	declaration 		:data.data.declaration ,
        	location :	data.data.location 
        });
        wx.hideLoading();
        
      },
      realFail: function(msg) {
        wx.hideLoading();
        wx.showToast({
          title: msg
        });
      }
    }, true);
  },
  //保存
   addmsg:function(){
   	console.log(wx.getStorageSync('token'))
  	var that=this;
  	wx.request({
	      url: APIS.ADD_PERSONALBASEINFO,
	      data: {
  				realName: that.data.realName,
  				birthday: that.data.birthday,
  				grade: that.data.grade,
  				phone: that.data.phone,
  				professional: that.data.professional,
  				declaration: that.data.declaration,
  				location: that.data.location
	      },
	      header: {
            auth: wx.getStorageSync('token')
         }, 
	      method: "POST", 
	      success: function(res) {  
	         wx.showToast({
		          title: '保存成功'
		        });
		        
	      },
	       fail: function(res){  
        console.log(res)
      }  
	   })  
  },
   //取消
  cancel: function(){
  		wx.navigateTo({
			  url: '../personCenter/personCenter'
			});
	 }, 
})
