//personCenter.js
var { APIS } = require('../../const');
var user = require('../../libs/user');
var { request } = require('../../libs/request');
Page({
  data: {
  	
  },
  onLoad: function () {
  	wx.showLoading({
	      mask: true,
	      title: '数据加载中'
	    });
	    user.login(this.onLoadData, this, true);
  },
  onLoadData: function(){
  	var that = this;
  	var params = {
  		sid: wx.getStorageSync('sid')
  	};
  	 request({
      url: APIS.MY_CENTER,
      data: params,
      method: 'POST',
      realSuccess: function(data){
      	console.log(data);
        that.setData({
        	nick:							data.nick,
        	headerImg:				data.headerImg,
        	isCertification:	data.isCertification,
        	roleName:					data.roleName
        });
        wx.hideLoading();
        
      },
      realFail: function(msg) {
        wx.hideLoading();
        wx.showToast({
          title: msg
        });
      }
    }, true);
  },
})
