var Q = require('./q/q');
var { APIS } = require('../const');

function uploadPic(path) {
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
}

module.exports = {
    uploadPic: uploadPic
}