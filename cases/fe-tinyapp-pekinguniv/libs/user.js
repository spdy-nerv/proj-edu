var { APIS } = require('../const');
wx.setStorageSync('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyIqIl0sInRlbmVtZW50X2lkIjoiMTAwMiIsImV4cCI6MTY3NDM3NDQ1OCwianRpIjoiNjBhYWUyYjUtOTlkYy00Njk0LWE5NjUtNTUzMTMyZmY2MGE3IiwiY2xpZW50X2lkIjoicGVraW5nam9iIn0.dRXqKS2aaa5PXWaHO62xkIf82MV1GSL5XuO4UnTLu58');
function login(cb, ctx, needCheckSession) {
    if (needCheckSession) {
        var sid = wx.getStorageSync('sid');
        // 如果有sid，执行逻辑
        if (!sid) {
        
            typeof cb == "function" && cb.call(ctx);
        // 如果没有sid，重新wx登录
        } else {
            rawLogin(cb, ctx);
        }
    } else {
        rawLogin(cb, ctx);
    }
}

// wx登录
function rawLogin(cb, ctx) {
    wx.login({
        success: function(res) {
            if (res.code) {
                var code = res.code
                wx.getUserInfo({
                    success: function (res) {
                        var d = {
                            code: code,
                            user_raw: res.userInfo,
                            signature: res.signature
                        }
                        wx.setStorageSync('userInfo', res.userInfo);
                        doAppLogin(d, cb, ctx);
                    }
                });
            } else {
                wx.showToast({
                    title: '登录失败'
                });
            }
        },
        fail: function() {
            wx.showToast({
                title: '登录失败！'
            });
        }
    });
}

// app检查sid的有效性
function checkAppLogin(sid, cb , ctx) {
    wx.request({
      url: APIS.CHECK_SESSION,
      data: {
        sid: sid
      },
      method: 'POST',
      success: function(res){
        var d = res.data;
        //  如果sid有效
        if (d.errCode == '0000') {
            typeof cb == "function" && cb.call(ctx);
        // 如果sid无效
        } else {
            rawLogin(cb, ctx);
        }
      },
      fail: function(res) {
        // fail
        rawLogin(cb, ctx);
      }
    })
}

// app的登录
function doAppLogin(data, cb, ctx) {
    wx.request({
      url: APIS.LOGIN,
      data: data,
      header: { Authorization: wx.getStorageSync('Authorization') },
      method: 'POST',
      success: function(res){
        console.log(res);
        var d = res.data;
        console.log(d);
        if (d.code == 'SUCCESS') {
           var token = d.data.token
           wx.setStorageSync('token', token);
           getOpenId();
            typeof cb == "function" && cb.call(ctx);
        } else {
            wx.showToast({
                title: '登录失败！' + d.resultMsg
            });
        }
      },
      fail: function(res) {
        // fail
        wx.showToast({
            title: '登录失败！'
        });
      }
    })
}
//获取openId
function getOpenId(){
  wx.request({
    url: APIS.CHECK_TOKEN,
    header: {
      auth: wx.getStorageSync('token'),
      Authorization: wx.getStorageSync('Authorization')
    },
    method:'GET',
    success:(res)=>{
    console.log(res);
    var openId = res.data.data.openid;
    console.log(openId)
    wx.setStorageSync('openId', openId);
    },fail:(res)=>{

    }
  })
}

module.exports = {
    login: login
}