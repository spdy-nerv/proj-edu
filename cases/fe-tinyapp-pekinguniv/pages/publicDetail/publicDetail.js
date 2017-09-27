//detail.js
//获取应用实例
/*var app = getApp()*/


var { monthFormatList, dayFormatList, APIS } = require('../../const');
var util = require('../../utils/util');
var user = require('../../libs/user');
var { request } = require('../../libs/request');
 Page({
  
   data: {
     eventId: "",
     fromShare:'',
     datas:{},
     modules:[],
     name:"",
     formatedMonth:"",
     day:'',
     content:''

   },
 
   onLoad: function (options) {
    
     this.setData({
       eventId: options.eventId,
       fromShare: options.fromShare || 0
     });

     wx.showLoading({
       mask: true,
       title: '数据加载中'
     });
     user.login(this.onLoadData, this, true);
     
   },
   onLoadData: function () {
     const that = this;
     const getEventBaseParams = {
       sid: wx.getStorageSync('sid') || '',
       eventId: that.data.eventId
     };
     wx.request({
       url:APIS.GET_NEW_GONGGAOLISTDETAIL,
       data:{id:that.data.eventId},
       success: function(res){
         // success
         console.log(res.data);
         var data = res.data;
    
         that.setData({
           name:data.title,
           formatedMonth:data.createTime.substring(5,7),
           day:data.createTime.substring(8,10),
           content:data.content
         })
         
         ;
         wx.hideLoading();
       },
       fail: function() {
         // fail
       },
       complete: function() {
         // complete
       }
     })
    //  request({
    //    url: APIS.GET_NEW_GONGGAOLISTDETAIL,
    //    data:{id:that.data.eventId},
    //    method: 'POST',
    //    realSuccess: function (data) {
    //      console.log(data);
    //      var datas = data;
    //      var en = datas.startTime.substring(5, 7);
    //      that.setData({
    //        "modules": data.modules,
    //        "name": data.name,
    //        "formatedMonth": monthFormatList[en - 1].eng ,
    //        "day": datas.startTime.substring(8, 10)
    //      });
    //      let mL = that.data.modules.length;
    //      for (let i = 0; i < mL; i++) {
    //        if (that.data.modules[i].moduleType == "1") {

    //          const getDescriptionModuleParams = {
    //            sid: wx.getStorageSync('sid') || '',
    //            moduleId: that.data.modules[i].moduleId
    //          };
    //          wx.request({
    //            url: APIS.GET_DESCRIPTION_MODULE,
    //            data: getDescriptionModuleParams,
    //            method: 'POST',
    //            success: function (res) {
    //              console.log("详情！", res);
                
    //              var d = res.data.resultData.data;
    //              var paragraphs = d.paragraphs.map(function(p) {
    //                p.value = p.value.replace(/\n(\n|\t|\u00A0)*\t/mg, '\n\t\n\t');
    //                return p;
    //              });

    //              that.setData({
    //                "datas": {
    //                  paragraphs: paragraphs
    //                }
    //              });
                
    //            }
    //          })
    //          wx.hideLoading();
    //          break;
    //        }
    //      }
    //    },
    //    realFail: function (msg) {
    //      wx.hideLoading();
    //      wx.showToast({
    //        title: msg
    //      });
    //    }
    //  }, true);
     console.log(that.data.modules)
 
    
     

   },
   getModule:function(){
     const that = this;
     const getEventBaseParams = {
       sid: wx.getStorageSync('sid') || '',
       eventId: that.data.eventId
     };
     request({
       url: APIS.GET_EVENT_BASE,
       data: getEventBaseParams,
       method: 'POST',
       realSuccess: function (data) {
         var datas = data;
         that.setData({
           "modules": data.modules
         });

       },
       realFail: function (msg) {

         wx.showToast({
           title: msg
         });
       }
     }, true);
   },
   /**
    * 生命周期函数--监听页面初次渲染完成
    */
   onReady: function () {
     
   },
 
   /**
    * 生命周期函数--监听页面显示
    */
   onShow: function () {
     
   },
 
   /**
    * 生命周期函数--监听页面隐藏
    */
   onHide: function () {
     
   },
 
   /**
    * 生命周期函数--监听页面卸载
    */
   onUnload: function () {
     
   },
 
   /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
   onPullDownRefresh: function () {
     
   },
 
   /**
    * 页面上拉触底事件的处理函数
    */
   onReachBottom: function () {
     
   },
 
   onShareAppMessage: function () {
     // 用户点击右上角分享
     var path = '/pages/publicDetail/publicDetail';
     
     return {
       title: '北京大学-' + this.data.eventName, // 分享描述
       path: path + '?eventId=' + this.data.eventId + '&eventName=' + this.data.eventName + '&fromShare=1' // 分享路径
     }
   },
 })