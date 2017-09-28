
// var myapp=getApp();
// console.log(myapp.name);
// myapp.say();
Page({

  /**
   * 页面的初始数据
   */



  data: {
  list:[],
  i:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 当前的id号
    module.exports = this.data.list;
    
    var id = options.id;
    
    // 当前对应的数据记录
    this.setData({ 
        i:id
    });
    if(id==1){
      this.getmarkszb1();
    }else if(id==2){
      this.getmarkszb2();
    }else if(id==3){
      this.getmarkszb3();
    }else{
      this.getmarkszb1();
    } 
  },
  

  getmarkszb1: function () {
    let that = this;
    wx.request({
      url: 'http://dev.im-cc.com:38880/cms/post/detail/1',
      method: 'POST',
      success: function (res) {
        console.log(res.data)
        that.setData({
          list: res.data
        })
        that.show();
      }
    });
  },
  getmarkszb2: function () {
    let that = this;
    wx.request({
      url: 'http://dev.im-cc.com:38880/cms/post/detail/2',
      method: 'POST',
      success: function (res) {
        console.log(res.data)
        that.setData({
          list: res.data
        })
        that.show();
      }
    });
  },
  getmarkszb3: function () {
    let that = this;
    wx.request({
      url: 'http://dev.im-cc.com:38880/cms/post/detail/3',
      method: 'POST',
      success: function (res) {
        console.log(res.data)
        that.setData({
          list: res.data
        })
        that.show();
      }
    });
  },
 show:function(){
   let that=this;
   var i=this.data.i-1;
    var detail=this.data.list[i];
    that.setData({
      list:detail
    })
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