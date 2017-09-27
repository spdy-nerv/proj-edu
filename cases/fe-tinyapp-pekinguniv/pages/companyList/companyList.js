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
    eventId:'',
    offset: 1,
    loading:false,
    disabled:false,
    toggle:'0',
    hasMore:'',
  	isNoData:"",
  	loadText:'点击加载更多...',
  	list:[],
		statusList: {
			statusListData: [
				'未发布', '审核中', '已发布', '不通过', '已结束'
			]
		}	
  },
  onLoad: function (options) {
  	console.log(options);
  	this.setData({
  		eventId:options.eventId
  	})
  	wx.showLoading({
	      mask: true,
	      title: '数据加载中'
	    });
	    //user.login(this.onLoadData(false), this, false);
  },

	onShow: function() {
		this.setData({
			list: [],
			offset: 1
		});
		user.login(this.onLoadData(false), this, false);
	},
  
  onLoadData: function(load){
  	var that = this;
  	var params = {
  		/*sid: wx.getStorageSync('sid'),
  		size: 10,  */ 
	    eventId: that.data.eventId,
  	};
  	if(load){
  		that.setData({
  			loading:!that.data.loading,
		    disabled:!that.data.disabled,
		  	loadText:'加载中...',
  		})
  	}
  	 request({
      url: APIS.GET_COMPANY_LIST,
      data: params,
      method: 'POST',
      realSuccess: function(data){
      	console.log("published",data.companyList);
      	var resList=data.companyList;
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
      	if(data.companyList.length==0){
      		that.setData({
	      		isNoData:"暂时没有发布任何事件！"
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
