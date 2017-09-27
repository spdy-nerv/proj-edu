// pages/enrollModuleAdd/enrollModuleAdd.js
var { APIS } = require('../../const');
var user = require('../../libs/user');
var { uploadPic } = require('../../libs/upload');
var { request } = require('../../libs/request');

Page({
  data:{
    eventId: '',
    moduleId: '',
    startTime: '',
    endTime: '',
    allowRoleIds: [],
    model: 2,
    totalCount: ''
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      eventId: options.eventId,
      moduleId: options.moduleId,
      //startTime: options.startTime,
      //endTime: options.endTime,
      //allowRoleIds: options.allowViewId ? options.allowViewId.split(',') : []
    });

    if (this.data.moduleId) {
      user.login(this.renderEroll, this, true);
    }
  },

  renderEroll: function() {
      var that = this;
      wx.showLoading({
        mask: true,
        title: '获取报名模块中'
      });
      request({
          url: APIS.GET_ENROLL_MODULE,
          method: 'POST',
          data: {
              moduleId: this.data.moduleId,
              sid: wx.getStorageSync('sid')
          },
          realSuccess: function(data) {
              that.setData({
                totalCount: data.data.totalCount + data.data.leftCount,
                model: data.config.model
              });
              wx.hideLoading();
          },
          loginCallback: this.renderEnroll,
          realFail: function(msg) {
            //wx.hideLoading();
            wx.showToast({
                title: msg
            });
          }
      }, true, this);
  },

  onInputCount: function(e) {
    this.setData({
      totalCount: e.detail.value
    });
  },

  onToggleCheck: function() {
    var model = +this.data.model;
    if (model == 1) {
      model = 2;
    } else {
      model = 1;
    }
    this.setData({
      model: model
    });
  },

  onTapPublish: function() {
    if (this.data.totalCount == '') {
      wx.showToast({
        title: '请输入报名人数上限！'
      });
      return;
    }
    if (isNaN(+this.data.totalCount)) {
      wx.showToast({
        title: '报名人数上限请输入数字！'
      });
      return;
    }

    var d = {
      eventId: this.data.eventId,
      moduleType: 3,
      sid: wx.getStorageSync('sid')
    };
    var config = {
      isActive: true,
      startTime: '2017-01-01 00:00:00',
      endTime: '2099-01-01 23:59:59',
      //startTime: this.data.startTime,
      //endTime: this.data.endTime,
      //allowRoleIds: this.data.allowRoleIds,
      totalCount: Math.round(+this.data.totalCount),
      model: this.data.model
    };
    d.config = config;
    if (this.data.moduleId) {
      d.moduleId = this.data.moduleId
    }
    request({
      url: APIS.ADD_ENROLL_CONFIG,
      method: 'POST',
      data: d,
      realSuccess: function(data) {
        // TODO
        // 成功后返回上一页
        wx.navigateBack();
        //wx.hideLoading();
        wx.showToast({
          title: '成功'
        });
      },
      loginCallback: this.onTapPublish,
      realFail: function(msg, errCode) {
        //wx.hideLoading();
        wx.showToast({
          title: msg
        });
      }
    }, true, this);
  }
})