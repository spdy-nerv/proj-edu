 
Page({
  data: {
    history:[],
    famous:[]
  },
  /**
   * 页面的初始数据
   */
  /*全部历史点击事件 */
  allTap:function(){
    wx.navigateTo({
      url: '../history-all/history-all',
    })
  },
  /*查看更多校友事件 */
  famousTap:function(){
    wx.navigateTo({
      url: '../famous/famous',
    })
  },
/*历史详情页点击事件 */
  onFilterTap:function(option){
    var id = option.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../history-detail/history-detail?id=' + id,
    })
  },
  onTap:function(option){
    var id = option.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../famous/famous-detail/famous-detail?id=' + id,
    })
  },





  schoolTap: function () {
    wx.navigateTo({
      url: '../school/school',
    })
  },
  introduceTap:function(){
    wx.navigateTo({
      url: '../introduce/introduce',
    })
  },
  cultureTap:function(){
    wx.navigateTo({
      url: '../culture/culture',
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
    module.exports = this.data.history;
    module.exports = this.data.famous;
    this.getmarkszb();
  },
  getmarkszb: function () {
    let that = this;
    wx.request({
      url: 'http://dev.im-cc.com:38880/cms/viewData/subcolumn_posts/8',
      method: 'POST',
      success: function (res) {
        console.log(res.data.data.list)
        that.setData({
          history: res.data.data.list[0].posts,
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