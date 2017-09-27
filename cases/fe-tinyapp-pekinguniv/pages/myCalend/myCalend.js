var app = getApp();

Page({
	
	data: {
    // text:"这是一个页面"
    title:'请输入标题',
    company :'请输入单位名称',
    locatio:'请输入地点',
    content:'请输入内容',
    remark:'请输入备注',
    addreValue:0,
    addreRange:['投递','笔试','面试','宣讲会','双选会','其他'],
    dateValue:'　预约日期',
    timeValue:'　时间',
    price:'7',
    sign:Date.now()+'0'+Math.ceil(Math.random()*10000) 
	},
	
	addrePickerBindchange:function(e){
    this.setData({
      addreValue:e.detail.value
    })
},
 //取消
  cancel: function(){
  		 wx.navigateTo({
			  url: '../mySchedule/mySchedule'
			});
  },   
timePickerBindchange:function(e){
    this.setData({
      timeValue:e.detail.value
    })
},
datePickerBindchange:function(e){
    this.setData({
      dateValue:e.detail.value
    })
},
timePickerBindchange:function(e){
    this.setData({
      timeValue:e.detail.value
    })
},
titlechange:function(e){
    this.setData({
      title:e.detail.value
    })
},
companychange:function(e){
    this.setData({
      company:e.detail.value
    })
},
locationchange:function(e){
    this.setData({
      locatio:e.detail.value
    })
},
remarkchange:function(e){
    this.setData({
      remark:e.detail.value
    })
},
contentchange:function(e){
    this.setData({
      content:e.detail.value
    })
},
onLoad: function(options) {  
	    this.setData({    
	      keywords: options.keywords  
	    })
	} ,

 formSubmit: function(e) {  
    var that = this;  
    var formData = e.detail.value;
    var category=that.data.addreValue;
    console.log(category)
     var warn = "";//弹框时提示的内容
    var flag = true;//判断信息输入是否完整
   
     var startTime=e.detail.value.date;
   
    if(e.detail.value.title==""){
      warn = "请填写标题！";
    }else if(e.detail.value.company==""){
      warn = "请填写单位名称！";
    }else if(e.detail.value.date=='　预约日期'){
      warn = "请选择日期";
    }else if(e.detail.value.time=='　时间'){
      warn = "请选择时间";
    }else if(e.detail.value.locatio==''){
      warn = "请选择地点";
    }else if(e.detail.value.content==''){
      warn = "请填写内容";
    }else{
       flag=false;//若必要信息都填写，则不用弹框，且页面可以进行跳转
       console.log(wx.getStorageSync('openId'),category,that.data.title,that.data.company,startTime,that.data.content,that.data.remark,that.data.locatio)
     wx.request({
      url: 'http://47.94.133.195/wechat-student-calendar!interest',
            data: {
        wechatOpenId: wx.getStorageSync('openId'),
       'business.category':category,
       'business.title':that.data.title,
       'business.enterpriseName':that.data.company,
       'business.startTime':startTime,
       'business.content':that.data.content,
       'business.remark':that.data.remark,
       'business.location':that.data.locatio,
      },
     header: {'content-type': 'application/x-www-form-urlencoded'},  
      method: "POST", 
      success: function(res) {  
        console.log(res)
        wx.navigateTo({
			  url: '../mySchedule/mySchedule'
			});
      }  
    })  
     console.log('form发生了submit事件，携带数据为：', e.detail.value);
    }
    if(flag==true){
      wx.showModal({
	      title: '提示',
	      content:warn
	    })
	}
  },  

})
//Page({
//data: {
//  // text:"这是一个页面"
//  title:'请输入标题',
//  company :'请输入单位名称',
//  location:'请输入地点',
//  content:'请输入内容',
//  remark:'请输入备注',
//  addreValue:0,
//  addreRange:['投递','笔试','面试','宣讲会','双选会','其他'],
//  door:'例如：xx小区x单元xxx室',
//  dateValue:'　预约日期',
//  timeValue:'　时间',
//  price:'7',
//  sign:Date.now()+'0'+Math.ceil(Math.random()*10000) 
//},
//
// onLoad: function(options) {    
//  this.setData({    
//    keywords: options.keywords  
//  })
//} ,
//  
//addrePickerBindchange:function(e){
//  this.setData({
//    addreValue:e.detail.value
//  })
//},
// 
//timePickerBindchange:function(e){
//  this.setData({
//    timeValue:e.detail.value
//  })
//},
//datePickerBindchange:function(e){
//  this.setData({
//    dateValue:e.detail.value
//  })
//},
//formSubmit: function(e) {
//  var warn = "";//弹框时提示的内容
//  var flag = true;//判断信息输入是否完整
//  //判断的顺序依次是：姓名-手机号-地址-具体地址-预约日期-预约时间-开荒面积
//  if(e.detail.value.title==""){
//    warn = "请填写标题！";
//  }else if(e.detail.value.company==""){
//    warn = "请填写单位名称！";
//  }else if(e.detail.value.date=='　预约日期'){
//    warn = "请选择日期";
//  }else if(e.detail.value.time=='　时间'){
//    warn = "请选择时间";
//  }else if(e.detail.value.location==''){
//    warn = "请选择地点";
//  }else if(e.detail.value.content==''){
//    warn = "请填写内容";
//  }else{
//     flag=false;//若必要信息都填写，则不用弹框，且页面可以进行跳转
//     var that = this;
//     var startTime=e.detail.value.date+''+e.detail.value.time,
//     var category=that.data.addreRange[that.data.addreValue],
//     //？后面跟的是需要传递到下一个页面的参数
//     console.log(category,e.detail.value.title,e.detail.value.company,
//     startTime,e.detail.value.content,e.detail.value.content,e.detail.value.location)
//     wx.request({
//      url: 'http://47.94.133.195/wechat-student-calendar!interest',
//            data: {
//      wechatOpenId: wx.getStorageSync('openId'),
//      business.category:category,
//      business.title:e.detail.value.title,
//      business.enterpriseName:e.detail.value.company,
//      business.startTime:startTime,
//      business.content:e.detail.value.content,
//     business.remark:e.detail.value.remark,
//     business.location:e.detail.value.location,
//     business.id:Date.parse(new Date())
//    },
//    header: {
//      'content-type': 'application/json'
//    },
//    success: function (res) {
//      console.log(res);     
//
//    }
//      }) 
//     console.log('form发生了submit事件，携带数据为：', e.detail.value);
//  }
//  //如果信息填写不完整，弹出输入框
//  if(flag==true){
//    wx.showModal({
//    title: '提示',
//    content:warn
//  })
//}
// },
//})
//
//
