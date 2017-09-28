// pages/start/start.js
var { APIS } = require('../../const');
var util = require('../../utils/util');
var user = require('../../libs/user');
var { uploadPic } = require('../../libs/upload');
var { request } = require('../../libs/request');
var Q = require('../../libs/q/q');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    user.login();
    wx.request({
      url:APIS.GET_IS_BLINDING , //链接不是https
      data: {
      wechatOpenId:wx.getStorageSync('openId')
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        if(res.data.success==true){
          wx.redirectTo({
            url: "../timeLine/timeLine"
          })
        }else{
          wx.redirectTo({
            url: '../login/login',
          })
        }
      },
      fail:function(){
 setTimeout(function() {
      wx.redirectTo({
        url: '../login/login',
      })
    }, 3000);
      }
    })
  }
})