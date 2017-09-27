// pages/descriptionModuleAdd/descriptionModuleAdd.js
var { APIS } = require('../../const');
var user = require('../../libs/user');
var { uploadPic } = require('../../libs/upload');
var { request } = require('../../libs/request');
var Q = require('../../libs/q/q');

Page({
  data:{
    eventId: '',
    moduleId: '',
    paragraphs: [
      {
        type: 1,
        value: ''
      }
    ]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      eventId: options.eventId,
      moduleId: options.moduleId
    });

    this.picCount = 0;

    // TODO 修改
    if (this.data.moduleId) {
        user.login(this.renderDescription, this, true);
    }

  },

  renderDescription: function() {
      var that = this;
      wx.showLoading({
        mask: true,
        title: '获取事件详情中'
      });
      request({
          url: APIS.GET_DESCRIPTION_MODULE,
          method: 'POST',
          data: {
              moduleId: this.data.moduleId,
              sid: wx.getStorageSync('sid')
          },
          realSuccess: function(data) {
              that.setData({
                paragraphs: data.data.paragraphs
              });
              wx.hideLoading();
          },
          loginCallback: this.renderDescription,
          realFail: function(msg) {
            //wx.hideLoading();
            wx.showToast({
                title: msg
            });
          }
      }, true, this);
  },

  onInput: function(e) {
    var value = e.detail.value;
    var index = +e.target.dataset.index;
    var pArr = this.data.paragraphs;
    pArr[index].value = value;
    this.setData({
      paragraphs: pArr
    });
  },

  onSelectPic:  function() {
    if (this.picCount >= 3) {
      wx.showToast({
        title: '最多只能上传3张图片！'
      });
      return;
    }

    var that = this;
    var count = 3 - this.picCount;
    wx.chooseImage({
      count: count, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res){
        // success
        var tempFilePaths = res.tempFilePaths;
        var pArr = that.data.paragraphs;

        for (var i in tempFilePaths) {
          pArr.push({
            type: 2,
            value: tempFilePaths[i]
          });
        }
        that.picCount += tempFilePaths.length;
        that.setData({
          paragraphs: pArr
        });
      }
    })
  },

  onAddTextParagraph: function() {
    var pArr = this.data.paragraphs;
    pArr.push({
      type: 1,
      value: ''
    });
    this.setData({
      paragraphs: pArr
    });
  },

  onDeletePreview: function(e) {
    var index = e.target.dataset.index;
    var pArr = this.data.paragraphs;
    var dP = pArr.splice(index, 1);
    this.setData({
      paragraphs: pArr
    });
    if (dP[0].type == 2) {
      this.picCount--;
    }
  },

  onPublish: function() {
    var that = this;
    if (!this.validateCanSubmit()) {
      wx.showToast({
          title: '事件详情不能为空！'
      });
      return;     
    }

    var fnArr = [];
    var localPicIndexArr = [];
    var pArr = this.data.paragraphs;
    for (var i in pArr) {
      if (pArr[i].type == 2) {
        // 本地临时图片才上传
        if (pArr[i].value.indexOf('wxfile://') == 0) {
          fnArr.push(uploadPic(pArr[i].value));
          localPicIndexArr.push(i);
        }
      }
    }
    wx.showLoading({
      mask: true,
      title: '数据提交中'
    });
    Q.all(fnArr)
    .then(function(picUrls) {
      var pArr = that.data.paragraphs;
      for (var i in picUrls) {
        pArr[localPicIndexArr[i]] = {
          type: 2,
          value: picUrls[i]
        }
      }
      that.setData({
        paragraphs: pArr
      });

      var filterP = [];
      for (var i in pArr) {
        if (pArr[i].type == 1 && pArr[i].value == '') {
          continue;
        }
        filterP.push(pArr[i]);
      }
      var d = {
        eventId: that.data.eventId,
        moduleType: 1,
        sid: wx.getStorageSync('sid'),
        data: {
          paragraphs: filterP
        }
      };
      if (that.data.moduleId) {
        d.moduleId = that.data.moduleId
      }
      request({
        url: APIS.ADD_EVENT_DETAILED,
        data: d,
        method: 'POST',
        realSuccess: function(data) {
          // TODO
          // 成功后返回上一页
          wx.navigateBack();
          //wx.hideLoading();
          wx.showToast({
            title: '成功'
          });
        },
        loginCallback: that.onPublish,
        realFail: function(msg, errCode) {
          //wx.hideLoading();
          wx.showToast({
            title: msg
          });
        }
      }, true, that);
    })
    .catch(function(e) {
      //wx.hideLoading();
      wx.showToast({
        title: e.errMsg || '事件详情提交失败，请稍后重试！'
      });
    });
  },

  validateCanSubmit: function() {
    var canSubmit = false;
    for (var i in this.data.paragraphs) {
      // 只要存在图片，就一定可以提交
      if (this.data.paragraphs[i].type == 2) {
        canSubmit = true;
        break;
      // 文字为空，有可能不能提交
      } else if (this.data.paragraphs[i].type == 1 && this.data.paragraphs[i].value != '') {
        canSubmit = true;
        break;  
      }
    }
    return canSubmit;
  }
})