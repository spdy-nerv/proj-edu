// pages/eventPoster/eventPoster.js
var { APIS } = require('../../const');
var util = require('../../utils/util');
var user = require('../../libs/user');
var { request } = require('../../libs/request');

var app = getApp();
var theme = app.getTheme();
Page({
  data: {
    eventId: '',
    qrcode: '',
    title: '',
    fromShare: 0,
    winHeight: 0,
    clrMain: theme.clrMain
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var sysInfo = wx.getSystemInfoSync();
    this.setData({
      eventId: options.eventId || 1,
      fromShare: options.fromShare || 0,
      winHeight: sysInfo.windowHeight,
      title: options.eventName || '活动二维码'
    });
    user.login(this.getEventQrCode, this, true);
  },

  getEventQrCode: function () {
    var that = this;
    request({
      url: APIS.GET_EVENT_QRCODE,
      method: 'POST',
      data: {
        eventId: this.data.eventId
      },
      realSuccess: function (data) {
        that.setData({
          qrcode: data.qrCode
        });
      },
      loginCallback: this.getEventPoster,
      realFail: function (msg) {
        //wx.hideLoading();
        wx.showToast({
          title: msg
        });
      }
    }, false, this);
  },

  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: '最美校园小程序', // 分享描述
      path: '/pages/act-poster/act-poster?eventId=' + this.data.eventId + '&fromShare=1' // 分享路径
    }
  },

  saveQrcode: function() {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.downloadQrcode();
            }
          })
        } else {
          that.downloadQrcode();
        }
      }
    })
  },

  downloadQrcode: function() {
    var that = this;
    wx.downloadFile({
      url: this.data.qrcode,
      success: function (res) {
        that.saveImageToAlbum(res.tempFilePath);
      }
    })
  },

  saveImageToAlbum: function(tmpFile) {
    wx.saveImageToPhotosAlbum({
      filePath: tmpFile,
      success: function(res) {
        wx.showToast({
          title: '图片已保存至相册！'
        })
      }
    });
  }
})