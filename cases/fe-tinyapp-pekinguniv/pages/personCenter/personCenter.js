//personCenter.js
var { APIS } = require('../../const');
var user = require('../../libs/user');
var { request } = require('../../libs/request');
Page({
  data: {
  	footerConfig: {
      pagePersonal: true
    },
    nick:"",  //昵称
	  headerImg:"",
	  isCertification:true,   //是否认证
	  roleName:"",
	  isUp:false, //弹窗
    openId:null
  },
  onLoad: function () {
  	// wx.showLoading({
	  //     mask: true,
	  //     title: '数据加载中'
	  //   });
	    //user.login(this.onLoadData, this, true);
  },
  onLoadData: function(){
  	var that = this;
    var u = wx.getStorageSync('userInfo');
    this.setData({
      nick: u.nickName,
      headerImg: u.avatarUrl
    });
    
  	//  request({
    //   url: APIS.MY_CENTER,
    //   data: params,
    //   method: 'POST',
    //   realSuccess: function(data){
    //   	console.log(data);
    //     that.setData({
    //     	nick:							data.nick,
    //     	headerImg:				data.headerImg,
    //     	isCertification:	data.isCertification,
    //     	roleName:					data.roleName
    //     });
    //     wx.hideLoading();
    //     if(!that.data.isCertification){
    //     	 wx.showToast({
    //             title: '您尚未身份认证！2秒后跳转认证界面！',
    //             duration: 2000,
    //             mask: true
    //         });
    //         setTimeout(function() {
    //             wx.navigateTo({
    //             url: '../verify/verify'
    //             });
    //         }, 2000);
    //     }
        
    //   },
    //   realFail: function(msg) {
    //     wx.hideLoading();
    //     wx.showToast({
    //       title: msg
    //     });
    //   }
    // }, true);
  },
  
  unBind: function(){
  	var that = this;
  	var unbindParam = {
  		sid: wx.getStorageSync('sid')
  	};
    wx.showModal({
				 title: "温馨提示",
				 content: '是否解除绑定？',
				 confirmText:'确定',
				 success: function(res) {
				  if (res.confirm) {
				   wx.request({
			    	url: APIS.UNBIND,
			      data: unbindParam,
			      method: 'POST',
			      success: function(res){
			      	if(res.data.errCode=='0000'){
			      		 that.setData({
				        	isCertification:!that.data.isCertification,
				        });
				         wx.showToast({
				          title: res.data.resultMsg
				        });
				        that.onLoadData();
				       // that.showModal(res.data.resultMsg);
			      	}
			      }
			    })
				  }
				 }
			})
  },
  
  //我的卡片
  toMyCard: function(e){
  		wx.navigateTo({
			  url: '../myCard/myCard'
			});
  },
  //我的关注
  toMyFollows: function(e){
  	wx.navigateTo({
			  url: '../myFollows/myFollows'
		});
  },
  //我的发布
  toMyPublic: function(e){
  		wx.navigateTo({
			  url: '../myJoin/myJoin'
			});
  },
    //我的日程
  toMySchedule: function(e){
  		wx.navigateTo({
			  url: '../mySchedule/mySchedule'
			});
  },
  onShow:function(){
  	this.onLoadData();
  },
  showModal: function(msg){
  	wx.showModal({
				 title: msg,
				 content: '您已经解除认证，是否重新认证？',
				 confirmText:'重新认证',
				 success: function(res) {
				  if (res.confirm) {
				   wx.navigateTo({
						  url: '../verify/verify'
						});
				  }
				 }
			})
  }
})
