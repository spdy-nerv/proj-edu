// pages/demo/demo.js
Page({
  data:{
    collected1:true,
    collected2:true,
    id:5
  },
  /**
   * 页面的初始数据
   */
  txt1Tap:function(){
     this.setData({
      collected1:false,
    })
  },
  txt2Tap: function () {
    this.setData({
      collected2: false,
    })
  },
  schoolTap: function () {
    wx.navigateTo({
      url: '../school/school',
    })
  },
  historyTap:function(){
    wx.navigateTo({
      url: '../history/history',
    })
  },
  cultureTap:function(){
    wx.navigateTo({
      url: '../history/history',
    })
  },
  subjectTap:function(){
    wx.navigateTo({
      url: '../subject/subject',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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
  
  }
})