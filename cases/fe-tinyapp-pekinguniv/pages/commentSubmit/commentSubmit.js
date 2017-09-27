// pages/commentSubmit/commentSubmit.js
var { APIS } = require('../../const');
var util = require('../../utils/util');
var user = require('../../libs/user');
var { uploadPic } = require('../../libs/upload');
var { request } = require('../../libs/request');
var Q = require('../../libs/q/q');

Page({
  data:{
    // TMP
    moduleId: '',
    avatarUrl: '',
    nickName: '',
    submitDate: '',
    picPaths: [],
    content: ''
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      moduleId: options.moduleId
    });
    // 保证必须有userInfo
    user.login(this.getUserInfo, this, true);
  },

  getUserInfo: function() {
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      avatarUrl: userInfo.avatarUrl,
      nickName: userInfo.nickName
    });

    var date = new Date();
    var dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    this.setData({
      submitDate: dateStr
    });
  },

  onSelectPic: function() {
    if (this.data.picPaths.length >= 3) {
      wx.showToast({
        title: '最多只能上传3张图片！'
      });
      return;
    }

    var that = this;
    var count = 3 - this.data.picPaths.length;
    wx.chooseImage({
      count: count, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res){
        // success
        var tempFilePaths = res.tempFilePaths;
        var pathArr = that.data.picPaths;
        pathArr = pathArr.concat(tempFilePaths);
        that.setData({
          picPaths: pathArr
        });
        //that.uploadPic(tempFilePaths[0]);
      }
    })
  },

/*
  uploadPic: function(path) {
    var defer = Q.defer();
    wx.uploadFile({
      url: APIS.FILE_UPLOAD,
      filePath: path,
      name:'file',
      // header: {}, // 设置请求的 header
      // formData: {}, // HTTP 请求中其他额外的 form data
      success: function(res){
        // success
        if (res.data) {
          try {
            var d = JSON.parse(res.data);
            if (d.resultData && d.resultData.imgUrl) {
              defer.resolve(d.resultData.imgUrl);
            } else {
              defer.reject({
                errMsg: '图片上传失败，请重试！'
              });
            }
          } catch(e) {
            defer.reject({
              errMsg: '图片上传失败，请重试！'
            });
          }
        } else {
          defer.reject({
            errMsg: '图片上传失败，请重试！'
          });
        }
      },
      fail: function(res) {
        // fail
        defer.reject({
          errMsg: res.errMsg
        });
      }
    })

    return defer.promise;
  },
  */

  onInput: function(e) {
    this.setData({
      content: e.detail.value
    });
  },

  // 先并行调用上传图片接口，所有照片上传成功后
  // 才真正调用发表评论接口
  onPublish: function() {
    var that = this;
    if (!this.data.content) {
      wx.showToast({
          title: '评论不能为空！'
      });
      return;
    }

    var fnArr = [];
    for (var i in this.data.picPaths) {
      fnArr.push(uploadPic(this.data.picPaths[i]));
    }
    wx.showLoading({
      mask: true,
      title: '数据提交中'
    });
    Q.all(fnArr)
    .then(function(picUrls) {
      var content = [];
      content.push({
        type: 1,
        value: that.data.content
      });
      for (var i in picUrls) {
        content.push({
          type: 2,
          value: picUrls[i]
        });
      }
      request({
        url: APIS.ADD_COMMENT,
        data: {
            moduleId: that.data.moduleId,
            content: content,
            sid: wx.getStorageSync('sid')
        },
        method: 'POST',
        realSuccess: function(data) {
          // TODO
          // 成功后返回上一页
          wx.navigateBack();
          //console.log('success');
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
        title: e.errMsg || '评论发布失败，请稍后重试！'
      });
    });
    
  },

  onDeletePreview: function(e) {
    var index = e.target.dataset.index;
    var paths = this.data.picPaths;
    paths.splice(index, 1);
    this.setData({
      picPaths: paths
    });
  }
})