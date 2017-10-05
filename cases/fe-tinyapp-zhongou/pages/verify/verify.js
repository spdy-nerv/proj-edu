//personCenter.js
var {
	APIS
} = require('../../const');
var user = require('../../libs/user');

var { request } = require('../../libs/request');
var { validate } = require('../../libs/validate');
Page({
	data: {
		roleList:[],
		realName: "",
		phone: "", //昵称
		email: "",
		code: "",
		tips:"",
		isHideT:true,
		isUP:true,
		plain: false,
		disabled: false,
		loading: false
	},
	onLoad: function() {
		//this.disableButton();
		this.getRoleList();
	},
	//没有输入必填项提交按钮置灰色
	/*disableButton: function(inputType,value){
		console.log(value);
		
		if(value){
			this.setData({
				disabled:!this.data.disabled,
				plain: !this.data.plain
			});
		}
	},*/
	//单选框
	radioChange: function(e) {
		console.log('携带value值为：', e.detail.value);
		this.setData({
			roleId: e.detail.value
		})
	},
	
	verfyPhone: function(phone){
		var that = this;
		var corr_phone = validate.phone(phone);
		if(!corr_phone){
			 that.setData({
			    tips:"输入11位有效的数字！",
			    isHideT:!that.data.isHideT
			   });
			setTimeout(function() {
			   that.setData({
			    isHideT:!that.data.isHideT
			   })
		  }, 3000);
           return false;
		}
		return true;
	},
	
	verfyEmail: function(email){
		var that = this;
		var corr_email = validate.email(email);
		if(!corr_email){
			 that.setData({
			    tips:"正确邮箱地址！",
			    isHideT:!that.data.isHideT
			   })
			setTimeout(function(){
			   that.setData({
			    isHideT:!that.data.isHideT
			   })
		  }, 3000)
           return false;
		}
		return true;
	},

	verifyRealName: function(realName){
		var that = this;
		
		if(realName.length==0){
			 that.setData({
			    tips:"请输入您的真实姓名！",
			    isHideT:!that.data.isHideT
			   })
			setTimeout(function(){
			   that.setData({
			    isHideT:!that.data.isHideT
			   })
		  }, 3000)
           return false;
		}
		return true;
	},
	
	bindPhoneInput: function(e){
		this.setData({
	      phone: e.detail.value
	    })
	},
	
	getCode:function(e){
		var that = this;
		var corr_phone = validate.phone(that.data.phone);
		if(!corr_phone){
			wx.showToast({
				title: "请输入11位的手机号码！"
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
				data: {phone:that.data.phone},
				method: 'POST',
				realSuccess: function(res) {
					setTimeout(function() {
					   that.setData({
								plain: !that.data.plain,
								disabled: !that.data.disabled,
								loading: !that.data.loading
							});
				  }, 3000);
		  
					
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
	
	getRoleList: function(){
		  	var that = this;
		    request({
		      url: APIS.GET_ROLE_LIST,
		      method: 'GET', 
		      realSuccess: function(data){
		        var list = data.list;
		        list = list.map(function(r) {
		            r.isChecked = true;
		            return r;
		        });
		        that.setData({
		          roleList: list
		        });
		      }
		    }, false);
	},
	
	formSubmit: function(e) {
		console.log('数据为：', e.detail.value)
		var that = this;
		var params = {
			sid: wx.getStorageSync('sid'),
			data: {
				phone: e.detail.value.phone,
				code: e.detail.value.code,
				email: e.detail.value.email,
				roleId: that.data.roleId,
				realName: e.detail.value.realName,
			}
		};
		if(that.verifyRealName(e.detail.value.realName) && that.verfyPhone(e.detail.value.phone) && that.verfyEmail(e.detail.value.email) ){

		wx.request({
		  	url: APIS.CERTIFICATION,
			data: params,
			method: 'POST',
		  	success: function(res){
				if(res.data.errCode=='0000'){
					wx.showToast({
		              title: res.data.resultMsg,
		              icon: 'success',
		          	});
		          	/*that.setData({
		          		isUP:!that.data.isUP
		          	})*/
		          	wx.navigateBack();
	          	}
		  	},
		  	fail: function(res) {
				wx.showToast({
					title: res.data.resultMsg
				});
		 	}
		})

			
		}
	},
	
	confirmTap: function(e){
		this.setData({
			isUP:!this.data.isUP
		});
		wx.navigateBack();
	}
})