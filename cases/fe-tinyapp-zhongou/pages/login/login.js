// pages/entry/entry.js
var { APIS } = require('../../const.js');
var { request } = require('../../libs/request');
var user = require('../../libs/user');
var app = getApp()
var { APIS } = require('../../const');
Page({

  data: {
      realNam:'请输入您的名字',
	  	realName:'',
	  	phon:'请输入您的手机号码',
	  	phone:'',
	    class :'请选择班级',
	    classes :'',
	    moduleId:'',
	    firstclass:'',
      selectclass:false,
  }, onLoad: function (options) {
  	console.log(options)
  	this.setData({
  		moduleId:options.moduleId
  	})
  	user.login();
    wx.request({
      url:  APIS.GET_PERSONALBASEINFO,
      data: {
      },
      header: {
            auth: wx.getStorageSync('token')
         },
      success: function(res){
        console.log(res.data)
        if(res.data.data.isPhoneVarified==true){
          wx.redirectTo({
            url: "../myInfo/myInfo?moduleId="+options.moduleId
          })
        }
        // success
      }
    })   
    
  },
  //点击选择班级类型
  clickclass:function(){
    var selectclass = this.data.selectclass;
    console.log(selectclass)
    if(selectclass == true){
     this.setData({
     selectclass:false,
  })
    }else{
     this.setData({
		     selectclass:true,
		  })
    }
  } ,
   //点击切换
  mySelect:function(e){
  	  var selectclass = this.data.selectclass;
  	console.log(selectclass)
  	
   this.setData({
     classes:e.target.dataset.me,
     selectclass:true,
   })
  },
   realNamechange:function(e){
    this.setData({
      realName:e.detail.value
    })
  },
  phonechange:function(e){
    this.setData({
      phone:e.detail.value
    })
  },
    //匹配个人信息
bindingIdentity:function(){
    var that=this;
    var realName=that.data.realName;
    var phone=that.data.phone;
    var classes=that.data.classes;
    console.log(realName,phone,classes)
//   if (phone==undefined||phone=='') {
//     wx.showToast({
//   title: '请输入手机号！',
//   icon: 'success',
//   duration: 1500
//  })
//		  return false;
//		 }
		if(phone){
			if (phone.length != 11) {
		       wx.showToast({
		     title: '号码不合法！',
		     icon: 'success',
		     duration: 1500
		    })
		  return false;
		 }
		 var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
		 if (!myreg.test(phone)) {
		       wx.showToast({
		     title: '手机号不合法！',
		     icon: 'success',
		     duration: 1500
		    })
		  return false;
		 }
		}
		 
		if(realName==undefined||realName==''){
    	wx.showToast({
					 title: '请填写姓名',
					})
    }else if(classes==undefined||classes==''){
    	wx.showToast({
					 title: '请填写班级',
					})
    }else{
    	wx.request({
	      url: APIS.GET_IDENTITY,
	       data: {
	        realName:realName,
	        classes:classes,
	        phone:phone,
	      },
	     header: {
            auth: wx.getStorageSync('token')
         }, 
	      method: "POST", 
	      success: function(res) { 
	      	console.log(res)
	      	if(res.data.success==true){
	      		 setTimeout(function(){
							 wx.showToast({
								 title: '登录成功',
								})
				    },500);
				     wx.redirectTo({
		            url:  "../myInfo/myInfo?moduleId="+that.data.moduleId
		          })
	      	}else{
	      		 wx.showToast({
							 title: res.data.message,
							})
	      	}
	       
	      },
	      fail: function(){  
          wx.showToast({
					 title: res.data.message,
					})
        }  
	    }) 
    }
} ,


})