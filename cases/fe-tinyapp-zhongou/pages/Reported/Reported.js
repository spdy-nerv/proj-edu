//myFollows .js
var { APIS } = require('../../const');
var user = require('../../libs/user');
var { request } = require('../../libs/request');
var { validate } = require('../../libs/validate');

Page({
  data: {
		footerConfig: { 
      pagePersonal: true
    },
    offset: 1,
    loading:false,
    disabled:false,
    hasMore:'',
  	isNoData:"",
  	loadText:'点击加载更多...',
  	list:[],
  	pictureUrls: [
			'https://microcloudtech.com/images/zhongou/reported.jpg'
		],  //事情图片
  	
  },
  onLoad: function () {
  	wx.showLoading({
	      mask: true,
	      title: '数据加载中'
	    });
	    user.login(this.onLoadData(false), this, false);
  },
  
  onLoadData: function(load){
  	var that = this;
  	var params = {
  		sid: wx.getStorageSync('sid'),
  		size: 10,   
	    offset: that.data.offset,
  	};
  	if(load){
  		that.setData({
  			loading:!that.data.loading,
		    disabled:!that.data.disabled,
		  	loadText:'加载中...',
  		})
  	}
  },
 onPreviewSlider: function(e) {
		wx.previewImage({
		  current: e.target.dataset.url, // 当前显示图片的链接，不填则默认为 urls 的第一张
		  urls: this.data.pictureUrls
		});
	},
 cancel:function(e){
  	var that=this;
  	wx.request({
	      url: APIS.ADD_TEACH,
	      data: {
	      	moduleId: wx.getStorageSync('moduleId'), 
	      },
	     header: {'content-type': 'application/x-www-form-urlencoded'},  
	      method: "POST", 
	      success: function(res) {  
	        console.log(res)
	         wx.showToast({
		          title: '提交成功'
		        });
		         wx.navigateTo({
						  url: '../detail/detail'
						});
	      }  
	   })  
  },  
  showMore:function(e){
		var that=this;
		if(that.data.hasMore){
			that.setData({
				offset:that.data.offset+1,
			});
			that.onLoadData(true);
		}
	}
})
