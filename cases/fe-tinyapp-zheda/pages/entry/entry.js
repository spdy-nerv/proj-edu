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
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: '浙江大学小程序', // 分享描述
      path:'/pages/entry/entry',
      success: function(res) {
          console.log('转发成功')
      },
      fail: function(res) {
        console.log('转发失败')
        // 转发失败
      }  // 分享路径
    }
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
  }
})