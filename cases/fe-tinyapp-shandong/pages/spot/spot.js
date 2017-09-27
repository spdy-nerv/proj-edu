// pages/spot/spot.js
var { APIS } = require('../../const');
var { request } = require('../../libs/request');
var { substitute } = require('../../utils/util');

var app = getApp();
var theme = app.getTheme();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icSpotToNav: theme.icSpotToNav,
    icSpotStar: theme.icSpotStar,
    icSpotBus: theme.icSpotBus,
    icSpotSubway: theme.icSpotSubway,
    spot: {},

    voiceTips: '语音导览',
    videoTips: '视频导览'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var spotId = options.id;
    this.getSpotDetail(spotId);
    this.isPlayingVoice = false;
    this.isPlayingVideo = false;
  },

  getSpotDetail: function(spotId) {
    var that = this;
    request({
      url: substitute(APIS.GET_NAV_SPOT_DETAIL, {
        id: spotId
      }, this),
      method: 'GET',
      realSuccess: function (data) {
        that.setData({
          spot: data
        });
      },
      realFail: function (msg, code) {
        wx.showToast({
          title: msg
        });
      }
    }, false);
  },

  gotoNav: function() {
    var spot = this.data.spot;
    /*
    wx.openLocation({
      longitude: spot.longitude,
      latitude: spot.latitude,
      name: spot.name,
      address: spot.address
    });
    */
    wx.navigateTo({
      url: '../navigate/navigate?lati=' + spot.latitude + '&long=' + spot.longitude + '&name=' + spot.name
    })
  },

  onToggleAudio: function() {
    if (!this.audioCtx) {
      this.audioCtx = wx.createAudioContext('spotAudio');
    }
    if (!this.isPlayingVoice) {
      this.audioCtx.play();
      this.isPlayingVoice = true;
      this.setData({
        voiceTips: '播放中...'
      });
    } else {
      this.audioCtx.pause();
      this.isPlayingVoice = false;
      this.setData({
        voiceTips: '语音导览'
      });
    }
  },

  onPlayVideo: function(e) {
    var url = e.currentTarget.dataset.video;
    wx.navigateTo({
      url: '../video/video?src=' + url,
    })
  }
})