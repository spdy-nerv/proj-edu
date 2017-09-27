//declaration.js
var {
	APIS
} = require('../../const');
var user = require('../../libs/user');
var { validate } = require('../../libs/validate');

var { request } = require('../../libs/request');
Page({
	data: {
		declaration:""
	},
	onLoad: function(options) {
		
		this.setData({
			phone:options.phone
		})
	},
	bindPhoneInput: function(e){
		this.setData({
	      phone: e.detail.value
	    })
	},
	getCode:function(e){
		var that = this;
		var vp=validate.phone(this.data.phone);
		if(!vp){
			  wx.showToast({
		          title: "请输入11位手机号码",
		          icon: 'success',
		      	});
			return;
		}
		that.setData({
			plain: !that.data.plain,
			disabled: !that.data.disabled,
			loading: !that.data.loading
		});
		request({
				url: APIS.SEND_SMS,
				data: {phone:this.data.phone},
				method: 'POST',
				realSuccess: function(res) {
					setTimeout(function() {
					   that.setData({
								plain: !that.data.plain,
								disabled: !that.data.disabled,
								loading: !that.data.loading
							});
				  }, 3000);
			  wx.showToast({
	          title: "验证码发送成功！",
	          icon: 'success',
	      	});
					console.log(res);
				},
				realFail: function(msg) {
					wx.hideLoading();
					wx.showToast({
						title: msg
					});
					that.setData({
						loading:!that.data.loading
					});
				}
			}, false);
	},
	
	formSubmit: function(e) {
		var that = this;
		var params = {
			sid: wx.getStorageSync('sid'),
			data: {
				phone:e.detail.value.phone,
				code:e.detail.value.code
			}
		};
		request({
				url: APIS.EDIT_CARD,
				data: params,
				method: 'POST',
				realSuccess: function(res) {
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