var user = require('./user');

/**
 * 对wx.request进行二次封装，统一处理登录、跳转、错误提示等问题
 * obj
 *  url
 *  data
 *  method
 *  realSuccess(resultData)
 *  loginCallback()
 *  realFail(toastMsg)
 * needLogin 接口是否需要登录认证，默认为true
 * ctx 回调函数上下文
 */
function request(obj, needLogin = true, ctx) {
    obj.success = function(res) {
        var d = res.data;
        if (d.errCode == '0000') {
            typeof obj.realSuccess == "function" && obj.realSuccess(d.resultData);
        } else {
            if (needLogin &&
            (d.errCode == '0011' || 
            d.errCode == '0012' || 
            d.errCode == '2000') ) {
                wx.showLoading({
                    mask: true,
                    title: '用户登录失效，重新登录中！'
                });
                user.login(obj.loginCallback, ctx);
            // 未认证或未绑定
            } else if (d.errCode == '0013') {
                wx.showToast({
                    title: '您尚未身份认证，无法操作！',
                    duration: 3000,
                    mask: true
                });
                setTimeout(function() {
                    wx.navigateTo({
                    url: '../verify/verify'
                    });
                }, 3000);
            } else if (d.errCode == '3002') {
                wx.showToast({
                    title: '您的身份没有操作权限！',
                });
            } else if (d.errCode == '0020') {
                wx.showToast({
                    title: '身份认证审核中，无法操作！',
                });
            } else {
                typeof obj.realFail == "function" && obj.realFail('数据获取失败！' + d.resultMsg || '', d.errCode);
            }
        }
    };
    obj.fail = function(res) {
        typeof obj.realFail == "function" && obj.realFail('数据获取失败！');
    };
    wx.request(obj);
}

module.exports = {
    request: request
};