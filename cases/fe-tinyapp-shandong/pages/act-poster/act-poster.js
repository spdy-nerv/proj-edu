// pages/eventPoster/eventPoster.js
var { APIS } = require('../../const');
var util = require('../../utils/util');
var user = require('../../libs/user');
var { request } = require('../../libs/request');

var app = getApp();
var theme = app.getTheme();
Page({
  data:{
    eventId: '',
    poster: '',
    fromShare: 0,
    winHeight: 0,
    clrMain: theme.clrMain
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var sysInfo = wx.getSystemInfoSync();
    this.setData({
      eventId: options.eventId || 1,
      fromShare: options.fromShare || 0,
      winHeight: sysInfo.windowHeight
    });
    user.login(this.getEventPoster, this, true);
  },

  getEventPoster: function() {
    var that = this;
    request({
          url: APIS.GET_EVENT_POSTER,
          method: 'POST',
          data: {
              eventId: this.data.eventId
          },
          realSuccess: function(data) {
              that.setData({
                poster: data.poster
              });
          },
          loginCallback: this.getEventPoster,
          realFail: function(msg) {
            //wx.hideLoading();
            wx.showToast({
                title: msg
            });
          }
      }, false, this);
  },

  onShareAppMessage: function() {
		// 用户点击右上角分享
		return {
			title: '最美校园小程序', // 分享描述
			path: '/pages/act-poster/act-poster?eventId='+this.data.eventId+'&fromShare=1' // 分享路径
		}
	},
})