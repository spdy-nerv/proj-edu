//app.js
var { APIS } = require('./const.js');
var { request } = require('./libs/request');
var theme = require('./themes/bjshida.js');

App({
  onLaunch: function() {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: theme.clrMain,
    });

    this.getTopColumns();
  },

  getTopColumns: function() {
    var that = this;
    request({
      url: APIS.TOP_COLUMNS,
      method: 'POST',
      realSuccess: function(data) {
        var topColumns = [];
        data.forEach(function(c, i) {
          if (c.valueType != 'IMAGE') {
            topColumns.push(c);
          }
        });
        topColumns.sort(function(a, b) {
          return a.sort - b.sort;
        });
        /*
        topColumns.push({
          id: '-1',
          valueType: 'ACT',
          viewName: '活动'
        });
        */
        that.topColumns = topColumns;
      },
      realFail: function(msg) {
        wx.showToast({
          title: msg
        })
      }
    }, false);
  },

  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData: {
    userInfo: null
  },

  getTheme: function() {
    return theme;
  }
})
