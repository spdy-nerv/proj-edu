// pages/demo/demo-detial/demo-detial.js

// 将数据文件引入到当前文件中

// var myapp=getApp();
// console.log(myapp.name);
// myapp.say();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  list:[],
  history:[]
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     // 当前的id号
    var id = options.id;
    module.exports = this.data.history;
    console.log(id);
  
    if (id == 4) {
      this.getmarkszb4();
    } else if (id == 5) {
      this.getmarkszb5();
    } else if (id == 6) {
      this.getmarkszb6();
    } else if (id == 7) {
      this.getmarkszb7();
    } else if (id == 8) {
      this.getmarkszb8();
    } else if (id == 9) {
      this.getmarkszb9();
    }else{
      this.getmarkszb10();
    }
  },


  getmarkszb4: function () {
    let that = this;
    wx.request({
      url: 'http://dev.im-cc.com:38880/cms/post/detail/4',
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
  getmarkszb5: function () {
    let that = this;
    wx.request({
      url: 'http://dev.im-cc.com:38880/cms/post/detail/5',
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
  getmarkszb6: function () {
    let that = this;
    wx.request({
      url: 'http://dev.im-cc.com:38880/cms/post/detail/6',
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
  getmarkszb7: function () {
    let that = this;
    wx.request({
      url: 'http://dev.im-cc.com:38880/cms/post/detail/7',
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
  getmarkszb8: function () {
    let that = this;
    wx.request({
      url: 'http://dev.im-cc.com:38880/cms/post/detail/8',
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
  getmarkszb9: function () {
    let that = this;
    wx.request({
      url: 'http://dev.im-cc.com:38880/cms/post/detail/9',
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
  getmarkszb10: function () {
    let that = this;
    wx.request({
      url: 'http://dev.im-cc.com:38880/cms/post/detail/10',
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
  show:function () {
    let that = this;
    var detail = this.data.history;
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