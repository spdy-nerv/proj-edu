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
  	list:[]
  	
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
  	 request({
      url: APIS.MY_FOLLOWS,
      data: params,
      method: 'POST',
      realSuccess: function(data){
      	console.log("我的关注asdf",data);
      	var resList=data.list;
      	that.setData({
      		list:that.data.list.concat(resList),
      		hasMore:data.hasMore
      	});
      	if(load){
      		that.setData({
      			loading:!that.data.loading,
				    disabled:!that.data.disabled,
				  	loadText:'点击加载更多...'
      		})
      	}
      	if(!that.data.hasMore){
      		that.setData({
				  	loadText:'没有更多数据了'
      		})
      	}
      	if(data.list.length==0){
      		that.setData({
	      		isNoData:"暂时没有关注任何事件！"
	      	});
      	}
        wx.hideLoading();
      },
      realFail: function(msg) {
        wx.hideLoading();
        wx.showToast({
          title: msg
        });
      }
    }, false);
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
