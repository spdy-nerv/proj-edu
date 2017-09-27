// pages/demo/demo.js

Page({
  
  /**
   * 页面的初始数据
   */
  data:{
      school:[]
  },
  onTap:function(option){
    var id = option.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../school-detail/school-detail?id=' + id,
    })
  },
  introduceTap: function () {
    wx.navigateTo({
      url: '../introduce/introduce',
    })
  },
  historyTap: function () {
    wx.navigateTo({
      url: '../history/history',
    })
  },
  cultureTap: function () {
    wx.navigateTo({
      url: '../culture/culture',
    })
  },
  subjectTap: function () {
    wx.navigateTo({
      url: '../subject/subject',
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    module.exports = this.data.school;
    this.getmarkszb();
  
  },
  getmarkszb: function () {
    let that = this;
    wx.request({
      url: 'http://dev.im-cc.com:38880/cms/viewData/column_posts/2',
      method: 'POST',
      success: function (res) {
        console.log(res.data.data)
        that.setData({
          school: res.data.data.list
        });
      }
    });
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