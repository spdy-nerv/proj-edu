

Page({
  data: {
    famous: [],
  },
  /**
   * 页面的初始数据
   */
  onTap:function(option){
    var id = option.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'famous-detail/famous-detail?id='+id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    module.exports = this.data.famous;
    this.getmarkszb();
  },
  //获取接口
  getmarkszb: function () {
    let that = this;
    wx.request({
      url: 'http://dev.im-cc.com:38880/cms/viewData/subcolumn_posts/8',
      method: 'POST',
      success: function (res) {
        console.log(res.data.data.list[1])
        that.setData({
          famous: res.data.data.list[1].posts,
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