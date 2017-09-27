// pages/entry/entry.js
var app = getApp();
var theme = app.getTheme();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icEntryBg: theme.icEntryBg,
    icEntryIntro: theme.icEntryIntro,
    icEntryNav: theme.icEntryNav,
    icEntryAct: theme.icEntryAct
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  onOpenCms: function() {
    var columnId = app.topColumns[0].id;
    var valueType = app.topColumns[0].valueType;
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
    } else if (valueType == 'ACT') {
      wx.navigateTo({
        url: '../timeLine/timeLine'
      });
      return;
    }
    url += '?id=' + columnId;
    wx.navigateTo({
      url: url
    });
  },

  onShareAppMessage: function() {}
})