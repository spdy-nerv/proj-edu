
var { monthFormatList, dayFormatList, APIS } = require('../../const');
var util = require('../../utils/util');
var user = require('../../libs/user');
var { request } = require('../../libs/request');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    events:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    this.getCurrentDate();
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
    this.getMyJoin();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },  getCurrentDate: function () {
    var today = new Date();
    this.setData({
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      formatedMonth: monthFormatList[today.getMonth()].arabic + '月',
      date: today.getDate(),
      todayDate: today.getDate()
    });
  },
  
  getMyJoin(){
    wx.request({
      url: APIS.GET_MY_JOIN,
      data: {
        wechatOpenId: wx.getStorageSync('openId'),
      },
      method:'GET',
      header: {
          'content-type': 'application/json' // 默认值
      },
      success:(res)=> {
        console.log(res.data.results)
        this.setData({
        events:res.data.results
        })
      },
      fail:(res)=>{
        wx.showToast({
          title:res
        })
      }
    })
  }
})