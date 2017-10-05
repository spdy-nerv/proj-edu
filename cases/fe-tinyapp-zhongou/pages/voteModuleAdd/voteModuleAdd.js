// pages/voteModuleAdd/voteModuleAdd.js
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
    title: '',
    description: '',
    options: [
      '', '', ''
    ],
    allowRoleIds: []
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      eventId: options.eventId,
      moduleId: options.moduleId,
      //startTime: options.startTime,
      //endTime: options.endTime,
      //allowRoleIds: options.allowViewId.split(',')
    });

    if (this.data.moduleId) {
      user.login(this.renderVote, this, true);
    }
  },

  renderVote: function() {
      var that = this;
      wx.showLoading({
        mask: true,
        title: '获取投票模块中'
      });
      request({
          url: APIS.GET_VOTE_MODULE,
          method: 'POST',
          data: {
              moduleId: this.data.moduleId,
              sid: wx.getStorageSync('sid')
          },
          realSuccess: function(data) {
              var options = data.data.options;
              var simpleOptions = [];
              for (var i in options) {
                simpleOptions.push(options[i].optionName);
              }
              that.setData({
                title: data.data.title,
                description: data.data.description,
                options: simpleOptions
              });
              wx.hideLoading();
          },
          loginCallback: this.renderVote,
          realFail: function(msg) {
            //wx.hideLoading();
            wx.showToast({
                title: msg
            });
          }
      }, true, this);
  },

  onAddOption: function() {
    if (this.data.options.length >= 20) {
      wx.showToast({
        title: '最多只能添加20个选项！'
      });
      return;
    }
    var options = this.data.options;
    options.push('');
    this.setData({
      options: options
    });
  },

  onDeleteOption: function(e) {
    var index = e.target.dataset.index;
    var options = this.data.options;
    options.splice(index, 1);
    this.setData({
      options: options
    });
  },

  onInputTitle: function(e) {
    this.setData({
      title: e.detail.value
    });
  },

  onInputOption: function(e) {
    var index = +e.target.dataset.index;
    var options = this.data.options;
    options[index] = e.detail.value;
    this.setData({
      options: options
    });
  },

  onTapPublish: function() {
    if (this.data.title == '') {
      wx.showToast({
        title: '投票内容描述不能为空！'
      });
      return;
    }
    for (var i in this.data.options) {
      if (this.data.options[i] == '') {
        wx.showToast({
          title: '选项不能为空！'
        });
        return;
      }
    }

    var d = {
      eventId: this.data.eventId,
      moduleType: 4,
      sid: wx.getStorageSync('sid'),
      options: this.data.options
    };
    var config = {
      isActive: true,
      startTime: '2017-01-01 00:00:00',
      endTime: '2099-01-01 23:59:59',
      //startTime: this.data.startTime,
      //endTime: this.data.endTime,
      //allowRoleIds: this.data.allowRoleIds,
      title: this.data.title,
      description: this.data.description
    };
    d.config = config;
    if (this.data.moduleId) {
      d.moduleId = this.data.moduleId
    }
    request({
      url: APIS.ADD_VOTE_CONFIG,
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