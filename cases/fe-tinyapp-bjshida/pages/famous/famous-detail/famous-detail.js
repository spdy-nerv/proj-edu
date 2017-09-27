

// 将数据文件引入到当前文件中

// var myapp=getApp();
// console.log(myapp.name);
// myapp.say();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    famous:[]
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    module.exports = this.data.famous;
    console.log(id);

    if (id == 11) {
      this.getmarkszb11();
    } else if (id == 12) {
      this.getmarkszb12();
    } else if (id == 13) {
      this.getmarkszb13();
    } else if (id == 14) {
      this.getmarkszb14();
    } else if (id == 15) {
      this.getmarkszb15();
    }else {
      this.getmarkszb11();
    }
  },


  getmarkszb11: function () {
    let that = this;
    wx.request({
      url: 'http://dev.im-cc.com:38880/cms/post/detail/11',
      method: 'POST',
      success: function (res) {
        console.log(res)
        that.setData({
          famous: res.data
        })
        that.show();
      }
    });
  },
  getmarkszb12: function () {
    let that = this;
    wx.request({
      url: 'http://dev.im-cc.com:38880/cms/post/detail/12',
      method: 'POST',
      success: function (res) {
        console.log(res)
        that.setData({
          famous: res.data
        })
        that.show();
      }
    });
  },
  getmarkszb13: function () {
    let that = this;
    wx.request({
      url: 'http://dev.im-cc.com:38880/cms/post/detail/13',
      method: 'POST',
      success: function (res) {
        console.log(res)
        that.setData({
          famous: res.data
        })
        that.show();
      }
    });
  },
  getmarkszb14: function () {
    let that = this;
    wx.request({
      url: 'http://dev.im-cc.com:38880/cms/post/detail/14',
      method: 'POST',
      success: function (res) {
        console.log(res)
        that.setData({
          famous: res.data
        })
        that.show();
      }
    });
  },
  getmarkszb15: function () {
    let that = this;
    wx.request({
      url: 'http://dev.im-cc.com:38880/cms/post/detail/15',
      method: 'POST',
      success: function (res) {
        console.log(res)
        that.setData({
          history: res.data
        })
        that.show();
      }
    });
  },
  show: function () {
    let that = this;
    var detail = this.data.famous;
    that.setData({
      list: detail
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