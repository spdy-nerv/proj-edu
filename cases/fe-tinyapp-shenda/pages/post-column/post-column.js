// pages/post-column/post-column.js
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
    subcolumnList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    this.setData({
      "tplData.topColumns": app.topColumns,
      "tplData.columnId": options.id,
      "tplData.viewId": 'J_type',
      hideNav: options.hideNav,
    });

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

    this.getSubcolumnPosts();
  },

  getSubcolumnPosts: function() {
    var that = this;
    request({
      url: substitute(APIS.VIEWDATA_SUBCOLUMN_POSTS, {
        id: this.data.columnId
      }, this),
      method: 'POST',
      data: {
        id: this.data.columnId
      },
      realSuccess: function (data) {
        that.setData({
          subcolumnList: data.list
        });
      },
      realFail: function (msg) {
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
  },

  onOpenMore: function(e) {
    var id = e.currentTarget.dataset.id;
    var title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: '../post-list/post-list?id=' + id + '&hideNav=true&title=' + title + '&topId=' + this.data.tplData.columnId
    });
  },

  onOpenPostDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../post-detail/post-detail?id=' + id + '&hideNav=true&isPost=true&topId=' + this.data.tplData.columnId
    });
  },

  onShareAppMessage: function () { }
})