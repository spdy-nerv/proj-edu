//personCenter.js
var { APIS } = require('../../const');
var user = require('../../libs/user');
var { request } = require('../../libs/request');
Page({
  data: {
  	headerImg:'',
  },
   //我的关注
  toEditperson: function(e){
  	wx.navigateTo({
			  url: '../Editperson/Editperson'
		});
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
      url: APIS.GET_PERSONALBASEINFO,
      header: {
            auth: wx.getStorageSync('token')
         },
      method: 'GET',
      realSuccess: function(data){
      	console.log(data);
        that.setData({
        	headerImg: data.data.wxHeadImg,
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
