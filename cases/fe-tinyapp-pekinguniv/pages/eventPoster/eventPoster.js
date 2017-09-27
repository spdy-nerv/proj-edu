// pages/eventPoster/eventPoster.js
var { APIS } = require('../../const');
var util = require('../../utils/util');
var user = require('../../libs/user');
var { request } = require('../../libs/request');

Page({
  data:{
    eventId: '',
    poster: '',
    fromShare: 0,
    winHeight: 0
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var sysInfo = wx.getSystemInfoSync();
    console.log(sysInfo);
    this.setData({
      eventId: options.eventId || '',
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
              eventId: this.data.eventId,
              sid: wx.getStorageSync('sid')
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
      }, true, this);
  },

  onShareAppMessage: function() {
		// 用户点击右上角分享
		return {
			title: '北京大学就业小助手小程序', // 分享描述
			path: '/pages/eventPoster/eventPoster?eventId='+this.data.eventId+'&fromShare=1' // 分享路径
		}
	},
})