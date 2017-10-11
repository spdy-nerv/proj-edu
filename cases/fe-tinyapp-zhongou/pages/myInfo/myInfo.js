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
    moduleId: '',
    offset: 1,
    loading:false,
    disabled:false,
    hasMore:'',
  	isNoData:"",
  	realName:'请输入您的名字',
  	phone:'请输入您的手机号码',
    class :'请选择班级',
    classes :'',
    firstclass:'',
    selectclass:false,
    verifyCode:'请输入验证码',
    sendcode:'发送验证码',
    plateNumber:'请输入车牌号码',
    ischecked:false,
    photograph:'拍照识别',
    company:'请在此输入公司发票信息',
    money:'请输入拆分金额',
    uniformSize:'请输入您的校服尺寸',
    photoNo:'请输入您的照片编号',
    hotelRoomNo:'请输入您的酒店房号',
    baggageNo:'请输入您的行李编号',
    isInvoice:false,
    isTakeBus:false,
    isSubmitIpad:false,
    isReported:false,
    busLine:'',
    selectbus:false,
    isPhoneVarified:false,
    disabled:false,
    code:'',
    buses: [
      {name: '不需要', value: '不需要'},
      {name: 'T2', value: 'T2',},
      {name: 'T3', value: 'T3'},
      {name: '北京南站', value: '北京南站'},
    ],
  	loadText:'点击加载更多...',
  	list:[]
  	
  },
 //获取验证码
//getcode:function(e){
//	var that=this;
// var mobile=that.data.phone;
//  if (mobile.length == 0) {
//     wx.showToast({
//   title: '请输入手机号！',
//   icon: 'success',
//   duration: 1500
//  })
//		  return false;
//		 }
//		 if (mobile.length != 11) {
//		       wx.showToast({
//		     title: '手机号长度有误！',
//		     icon: 'success',
//		     duration: 1500
//		    })
//		  return false;
//		 }
//		 var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
//		 if (!myreg.test(mobile)) {
//		       wx.showToast({
//		     title: '手机号有误！',
//		     icon: 'success',
//		     duration: 1500
//		    })
//		  return false;
//		 }
//		 else{
//		 	 wx.request({
//	      url: APIS.GET_VERIFYCODE,
//	       data: {
//	        phone:mobile
//	      },
//	     header: {'content-type': 'application/x-www-form-urlencoded'},  
//	      method: "POST", 
//	      success: function(res) {  
//	        console.log(res)
//	        that.setData({
//				     code:res.code,
//				  })
//	      }  
//	    })  
//		 }
//},
  //发送验证码
//sendcode:function(){
//  var that=this;
//  var verifyCode=that.data.verifyCode;
//  var code=that.data.code;
//  if(verifyCode==code){
//  	this.setData({
//		     isPhoneVarified :true,
//		  })
//  }else{
//  	this.setData({
//		     isPhoneVarified :false,
//		  })
//  }
//} ,
    //匹配个人信息
bindingIdentity:function(){
    var that=this;
    var realName=that.data.realName;
    var phone=that.data.phone;
    var classes=that.data.classes;
    var moduleId=that.data.moduleId;
    var code=that.data.code;
    console.log(realName,phone,classes,moduleId)
     	wx.request({
	      url: APIS.GET_IDENTITY,
	       data: {
	        realName:realName,
	        classes:classes,
	        phone:phone,
	        moduleId:moduleId
	      },
	     header: {
            auth: wx.getStorageSync('token')
         }, 
	      method: "POST", 
	      success: function(res) {  
	        console.log(res)
	        wx.showToast({
					 title: '认证成功',
					})
	        that.setData({
				     isPhoneVarified:true,
				     disabled:true
				  })
	      },
	      fail: function(){  
          wx.showToast({
					 title: '认证失败',
					})
        }  
	    }) 
} ,
 //点击选择班级类型
  clickclass:function(){
    var selectclass = this.data.selectclass;
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
   this.setData({
     classes:e.target.dataset.me,
     selectclass:true,
   })
  },
 //点击选择公交类型
  clickbus:function(){
    var selectbus = this.data.selectbus;
    if(selectbus == true){
     this.setData({
     selectbus:false,
  })
    }else{
     this.setData({
		     selectbus:true,
		  })
    }
  } ,
   //点击切换
  busSelect:function(e){
  	if(e.target.dataset.me=='不需要'){ 	
	    this.setData({
	      isTakeBus:false
	    })
    }else{
    	 this.setData({
	      isTakeBus:true
	    })
    }
   this.setData({
     busLine:e.target.dataset.me,
     selectbus:true,
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
  photoNochange:function(e){
    this.setData({
      photo:e.detail.value
    })
  },
    verifyCodechange:function(e){
    this.setData({
      verifyCode:e.detail.value
    })
  },
    sendcodechange:function(e){
    this.setData({
      sendcode:e.detail.value
    })
  },
    plateNumberchange:function(e){
    this.setData({
      plateNumber:e.detail.value
    })
  },
    photograph:function(e){
    this.setData({
      photograph:e.detail.value
    })
  },
  companychange:function(e){
    this.setData({
      company:e.detail.value
    })
  },
  moneychange:function(e){
    this.setData({
      money:e.detail.value
    })
  },
  uniformSizechange:function(e){
    this.setData({
      uniformSize:e.detail.value
    })
  },
  myphotochange:function(e){
    this.setData({
      myphoto:e.detail.value
    })
  },
  hotelchange:function(e){
    this.setData({
      hotelRoomNo:e.detail.value
    })
  },
  Baggagechange:function(e){
    this.setData({
      Baggage:e.detail.value
    })
  },
  onLoad: function (options) {
  	this.setData({
      moduleId: options.moduleId
   });
	    user.login(this.onLoadData(false), this, false);
  },
  checkChange:function(e) {
  	console.log(e.detail.value)
    if(e.detail.value){ 	
	    this.setData({
	      isInvoice :true
	    })
    }else{
    	 this.setData({
	      isInvoice :false
	    })
    }
  },
  checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e)
    if(e.detail.value=='不需要'){ 	
	    this.setData({
	      isTakeBus:false
	    })
    }else{
    	 this.setData({
	      isTakeBus:true
	    })
    }
  },
  onLoadData: function(load){
  	var that = this;
  	console.log(wx.getStorageSync('token'))
  	var params = {
  		moduleId: that.data.moduleId,
  	};
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
      	if(data.data.isPhoneVarified&&data.data.isPhoneVarified==true){
      		that.setData({
			      disabled:true,
			    })
      	}
     		that.setData({
     			baggageNo:data.data.baggageNo,
     			classes:data.data.classes,
     			company:data.data.company,
     			dataStatus:data.data.dataStatus,
     			hotelRoomNo:data.data.hotelRoomNo,
     			isInvoice:data.data.isInvoice,
		      isPhoneVarified:data.data.isPhoneVarified,
		      isReported:data.data.isReported,
		      isSubmitIpad:data.data.isSubmitIpad,
		      isTakeBus:data.data.isTakeBus,
		      phone:data.data.phone,
		      photoNo:data.data.photoNo,
		      plateNumber:data.data.plateNumber,
		      realName:data.data.realName,
		      uniformSize:data.data.uniformSize,
		      busLine: data.data.busLine,
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
  addmsg:function(){
  	var that=this;
  	wx.request({
	      url: APIS.ADD_DRAFT,
	      data: {
  					baggageNo: that.data.baggageNo,
  				company: that.data.company,
  				hotelRoomNo: that.data.hotelRoomNo,
  				isInvoice: that.data.isInvoice,
  				isReported: that.data.isReported,
  				isSubmitIpad: that.data.isSubmitIpad,
  				isTakeBus: that.data.isTakeBus,
  				moduleId: that.data.moduleId,
  				photoNo: that.data.photoNo,
  				plateNumber: that.data.plateNumber,
  				uniformSize: that.data.uniformSize,
  				busLine: that.data.busLine,
	      },
	      header: {
            auth: wx.getStorageSync('token')
         }, 
	      method: "POST", 
	      success: function(res) {  
	         wx.showToast({
		          title: '保存成功'
		        });
		        
	      }  
	   })  
  },
  sendmsg:function(){
  	var that=this;
  	console.log(that.data.company,that.data.hotelRoomNo)
  	wx.request({
	      url: APIS.ADD_SUBMIT,
	      data: {
  				baggageNo: that.data.baggageNo,
  				company: that.data.company,
  				hotelRoomNo: that.data.hotelRoomNo,
  				isInvoice: that.data.isInvoice,
  				isReported: that.data.isReported,
  				isSubmitIpad: that.data.isSubmitIpad,
  				isTakeBus: that.data.isTakeBus,
  				moduleId: that.data.moduleId,
  				photoNo: that.data.photoNo,
  				plateNumber: that.data.plateNumber,
  				uniformSize: that.data.uniformSize,
  				busLine: that.data.busLine,
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
