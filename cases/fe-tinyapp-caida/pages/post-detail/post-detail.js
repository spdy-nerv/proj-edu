// pages/post-detail/post-detail.js
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
    tplData: {
      topColumns: [],
      clrMain: theme.clrMain,
      columnId: '',
      viewId: ''
    },
    columnId: '',
    valueType: '',
    isPost: false,
    postDetail: {},
    hideNav: true,
    marginTop: '0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      "tplData.topColumns": app.topColumns,
      "tplData.columnId": options.id,
      "tplData.topId": options.topId || options.id,
      "tplData.viewId": 'J_type',
      hideNav: options.hideNav || false,
      isPost: options.isPost || false,
      marginTop: options.hideNav ? '0' : '100rpx'
    });

    if (!this.data.hideNav) {
      var d = this.data;
      for (var i = 0, j = app.topColumns.length; i < j; i++) {
        if (app.topColumns[i].id == d.tplData.columnId) {
          this.setData({
            columnId: app.topColumns[i].id,
            valueType: app.topColumns[i].valueType
          });
          wx.setNavigationBarTitle({
            title: app.topColumns[i].viewName,
          })
        }
      }
    } else {
      this.setData({
        columnId: options.id
      });
      wx.setNavigationBarTitle({
        title: '文章详情',
      })
    }

    this.getDetail();
  },

  getDetail: function() {
    var url = '';
    var that = this;
    if (this.data.isPost) {
      url = APIS.POST_DETAIL;
    } else {
      url = APIS.VIEWDATA_POST;
    }
    url = substitute(url, {
      id: this.data.columnId
    }, this);
    request({
      url: url + '?topColumnId=' + this.data.tplData.topId,
      method: 'POST',
      /*
      data: {
        id: this.data.columnId,
        topColumnId: this.data.tplData.topId
      },
      */
      realSuccess: function(data) {
        that.setData({
          postDetail: data
        });
      },
      realFail: function(msg) {
        wx.showToast({
          title: msg
        })
      }
    }, false);
  },

  onClickTopNav: function (e) {
    var columnId = e.currentTarget.dataset.id;
    var valueType = e.currentTarget.dataset.type;
    var url = '';
    // 跳转到文章列表页
    if (valueType == 'COLUMN_POSTS') {
      url = '../post-list/post-list';
      // 跳转到子栏目列表页
    } else if (valueType == 'SUBCOLUMN_POSTS') {
      url = '../post-column/post-column';
      // 跳转到文章详情页
    } else if (valueType == 'POST') {
      url = '../post-detail/post-detail';
      // 活动页面
    } else if (valueType == 'ACTIVITY') {
      wx.navigateTo({
        url: '../timeLine/timeLine'
      });
      return;
    }
    url += '?id=' + columnId;
    wx.redirectTo({
      url: url
    });
  }
})