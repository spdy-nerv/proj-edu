// search.js
var { APIS } = require('../../const.js');
var { request } = require('../../libs/request');
var Q = require('../../libs/q/q');

var app = getApp();
var theme = app.getTheme();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchs: [],
    markers: [],
    count : 0,
    area : 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    request({
      url: APIS.GET_NAV_SPOT_LIST,
      data: { campusId: options.cid },
      realSuccess: function (data) {
        that.setData({
          searchs: data
        });
      }
    }, false, this);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  search: function (e) {
    var key = e.detail.value;
    let searchs = this.data.searchs;
    let count = 0;
    let result = [];
    
    for(var i in searchs) {
      var t = searchs[i]; //每一小条对象
      var spots = t.spots;
      var id=0;
      for (var j  in spots) {
        var m = spots[j]; //每一条数据
        var name = m.name;
        console.log(name)
        if (name  && name.indexOf(''+key) != -1) {
          //m.id=id;
          count += 1;
          m.typeName = i;
          result.push(m);
        }
        id += 1;
      }
    }
    this.setData({
      markers: result,
      count : count
    });
  },

  onGotoSpot: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../spot/spot?id=' + id,
    })
  }
})