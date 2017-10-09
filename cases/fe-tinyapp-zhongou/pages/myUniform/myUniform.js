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
  	 selectPerson:true,
    firstPerson:'M',
  	
  },
  //点击选择类型
  clickPerson:function(){
    var selectPerson = this.data.selectPerson;
    if(selectPerson == true){
     this.setData({
     selectPerson:false,
  })
    }else{
     this.setData({
     selectPerson:true,
  })
    }
  } ,
   //点击切换
  mySelect:function(e){
   this.setData({
     firstPerson:e.target.dataset.me,
     selectPerson:true,
   })
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
  cancel:function(e){
  	var that=this;
  	var uniformSize=that.data.firstPerson;
  	wx.request({
	      url: APIS.ADD_UNIFORM,
	      data: {
	      	moduleId: wx.getStorageSync('moduleId'),
  				uniformSize: uniformSize  
	      },
	     header: {'content-type': 'application/x-www-form-urlencoded'},  
	      method: "POST", 
	      success: function(res) {  
	        console.log(res)
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
