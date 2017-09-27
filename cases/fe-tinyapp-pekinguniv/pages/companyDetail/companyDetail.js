//detail.js
//获取应用实例
/*var app = getApp()*/


var { monthFormatList, dayFormatList, APIS } = require('../../const');
var util = require('../../utils/util');
var user = require('../../libs/user');
var { request } = require('../../libs/request');
 Page({
  
   data: {
     companyId: "",
     companyName:"",
     details:'',
     eventId:'',
     eventName:''
   },
 
   onLoad: function (options) {
     this.setData({
       companyId: options.Id
     });

     wx.showLoading({
       mask: true,
       title: '数据加载中'
     });
     user.login(this.onLoadData, this, true);
     
   },
   onLoadData: function () {
     const that = this;
     const params = {
       //sid: wx.getStorageSync('sid') || '',
       companyId: that.data.companyId
     };
     request({
       url: APIS.GET_COMPANY_DETAILS,
       data: params,
       method: 'POST',
       realSuccess: function (data) {
         var datas = data.details;
         that.setData({
           "companyName": datas.companyName,
           "eventName": datas.eventName,
           "details": datas.details
         });
         wx.hideLoading();
       },
       realFail: function (msg) {
         wx.hideLoading();
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
     var path = '/pages/companyDetail/companyDetail';
     
     return {
       title: '北京大学-' + this.data.eventName, // 分享描述
       path: path + '?eventId=' + this.data.eventId + '&eventName=' + this.data.eventName + '&fromShare=1' // 分享路径
     }
   },
 })