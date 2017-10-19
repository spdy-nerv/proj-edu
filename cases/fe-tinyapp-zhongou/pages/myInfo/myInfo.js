//myFollows .js
//引入通知
var WxNotificationCenter = require('../../vendors/WxNotificationCenter.js')
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
  	realNam:'请输入您的名字',
  	realName:'',
  	phon:'请输入您的手机号码',
  	phone:'',
    class :'请选择班级',
    classes :'',
    eventId:'',
    firstclass:'',
    selectclass:false,
    plateNumbe:'请输入车牌号码',
    plateNumber:'',
    ischecked:false,
    photograph:'拍照识别',
    compan:'请在此输入公司发票信息',
    company:'',
    mone:'请输入拆分金额',
    money:'',
    uniformSiz:'请输入您的校服尺寸',
    uniformSize:'',
    photoN:'请输入您的照片编号',
    photoNo:'',
    hotelRoomN:'请输入您的酒店房号',
    hotelRoomNo:'',
    marry:'匹配个人信息',
    verify:'确认提交',
    isInvoice:false,
    isTakeBus:false,
    isSubmitIpad:false,
    isBaggageConfirm:false,
    isReported:false,
    busLine:'',
    selectbus:false,
    isPhoneVarified:false,
    disabled:false,
    disable:false,
    code:'',
    issure:false,
    buses: [
      {name: '不需要', value: '不需要'},
      {name: 'T2', value: 'T2',},
      {name: 'T3', value: 'T3'},
      {name: '北京南站', value: '北京南站'},
    ],
  	loadText:'点击加载更多...',
  	list:[]
  	
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
  photoNochange:function(e){
    this.setData({
      photoNo:e.detail.value
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
  onLoad: function (options) {
  	var that=this;
  	that.setData({
       moduleId: options.moduleId,
      eventId:options.eventId
   });
   wx.request({
      url:  APIS.GET_PERSONALBASEINFO,
      data: {
      },
      header: {
            auth: wx.getStorageSync('token')
         },
      success: function(res){
        that.setData({
			      classes: res.data.data.classes,
			  });
      }
    });
	    user.login(this.onLoadData(false), this, false);
  },
  checkChange:function(e) {
  	var isInvoice=this.data.isInvoice
    if(isInvoice==true){ 	
	    this.setData({
	      isInvoice :false
	    })
    }else{
    	 this.setData({
	      isInvoice :true
	    })
    }
  },
  checkboxChange: function(e) {
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
      	if(data.data.dataStatus=='SUBMIT'){
      		that.setData({
			      disable:true,
			      verify:'已提交'
			    })
      	}
     		that.setData({
     			isBaggageConfirm:data.data.isBaggageConfirm,
     			company:data.data.company,
     			dataStatus:data.data.dataStatus,
     			hotelRoomNo:data.data.hotelRoomNo,
     			isInvoice:data.data.isInvoice,
		      isPhoneVarified:data.data.isPhoneVarified,
		      isReported:data.data.isReported,
		      isSubmitIpad:data.data.isSubmitIpad,
		      isTakeBus:data.data.isTakeBus,
		      photoNo:data.data.photoNo,
		      plateNumber:data.data.plateNumber,
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
  					isBaggageConfirm: that.data.isBaggageConfirm,
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
  	if(that.data.plateNumber){
  		if(that.data.plateNumber.length!== 7) {
		         wx.showToast({
						 title: '车牌号不合法',
						})
		 			that.setData({
			      issure:false
			    })
		 }
			if(that.data.plateNumber.length==7){
			       var myreg = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/;
					 if (!myreg.test(that.data.plateNumber)){
					       wx.showToast({
					     title: '车牌号不合法！',
					    })
					        that.setData({
							      issure:false
							    })
					   }
	  	}
			 
		 }
	if(that.data.issure==true){
    if(that.data.busLine==undefined){
    	wx.showToast({
					 title: '请选择大巴路线',
					})
    }else if(that.data.isReported==undefined){
    	wx.showToast({
					 title: '请先想班主任报到',
					})
    }else if(that.data.isSubmitIpad ==undefined){
    	wx.showToast({
					 title: '请先提交ipad',
					})
    }else if(that.data.isBaggageConfirm ==undefined){
    	wx.showToast({
					 title: '请确认行李寄存',
					})
    }else if(that.data.photoNo  ==undefined){
    	wx.showToast({
					 title: '请填写照片编号',
					})
    }else if(that.data.uniformSize   ==undefined){
    	wx.showToast({
					 title: '请选择校服尺寸',
					})
    }else{
    	wx.request({
	      url: APIS.ADD_SUBMIT,
	      data: {
  				isBaggageConfirm: that.data.isBaggageConfirm,
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
	      	if(res.data.success==true){
	      		 wx.showToast({
							 title: '提交成功',
							})
		        that.setData({
					     disable:true,
					     verify:'已提交'
						})
						WxNotificationCenter.postNotificationName('NotificationName', {dataStatus:'SUBMIT'})
						 wx.showModal({  
			            title: '提示',  
			            content: '祝贺您已完成入学注册流程，祝您中欧学习之旅愉快顺利！',  
			            success: function(res) {  
			                if (res.confirm) {  
				                setTimeout(function(){
													wx.navigateBack({
														delta: 1
														})
										    },500);      
			                } else if (res.cancel) {  
				                setTimeout(function(){
													wx.navigateBack({
														delta: 1
														})
										    },500);    
			                }  
			            }  
			        })  
	      	}else{
	      		 wx.showToast({
							 title: '数据已提交',
							})
	      	}	       
	      },
	      fail: function(){  
          wx.showToast({
					 title: '提交失败',
					})
        }  
	   })  
    }
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
