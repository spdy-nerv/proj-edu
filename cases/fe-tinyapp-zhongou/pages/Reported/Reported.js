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
  	list:[],
  	moduleId:'',
  	eventId:'',
  	pictureUrls: [
			'https://microcloudtech.com/images/campus_zhongou/reported.jpg'

		],  //事情图片
  	helloUrls:['https://microcloudtech.com/images/campus_zhongou/banzhuren.jpg'],
  },
  onLoad: function (options) {
  	this.setData({
      moduleId: options.moduleId,
      eventId:options.eventId
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
		  urls: this.data.helloUrls
		});
	},
 cancel:function(e){
  	var that=this;
  	var moduleId=that.data.moduleId;
  	wx.request({
	      url: APIS.ADD_TEACH,
	      data: {
	      	moduleId: moduleId,
	      },
	     header: {
            auth: wx.getStorageSync('token')
         }, 
	      method: "POST", 
	      success: function(res) {  
		         wx.redirectTo({
						  url: '../myUniform/myUniform?moduleId='+moduleId+'&&isReported =true',
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
