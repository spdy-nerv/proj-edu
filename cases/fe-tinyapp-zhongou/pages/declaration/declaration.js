//declaration.js
var {
	APIS
} = require('../../const');
var user = require('../../libs/user');

var { request } = require('../../libs/request');
Page({
	data: {
		declaration:""
	},
	onLoad: function(options) {
		
		this.setData({
			declaration:options.declaration
		})
	},
	
	formSubmit: function(e) {
		var dec = e.detail.value.declaration;
		var that = this;
		var params = {
			sid: wx.getStorageSync('sid'),
			data: {
				declaration:dec
			}
		};
		
		request({
				url: APIS.EDIT_CARD,
				data: params,
				method: 'POST',
				realSuccess: function(res) {
					wx.setStorageSync("declaration", e.detail.value.declaration);
					wx.navigateBack();
					
				},
				realFail: function(msg) {
					wx.hideLoading();
					wx.showToast({
						title: msg
					});
				}
			}, true);
		
		/*wx.redirectTo({
		  url: '../myCard/myCard?declaration='+dec+'&type=0'
		});*/
	}
	
})