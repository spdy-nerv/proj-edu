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
  onLoad: function (options) {
  	this.setData({
      moduleId: options.moduleId
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
  	console.log(wx.getStorageSync('token'))
  	wx.request({
	      url: APIS.ADD_UNIFORM,
	      data: {
	      	moduleId: that.data.moduleId,
  				uniformSize: uniformSize  
	      },
	     header: { auth: wx.getStorageSync('token')},  
	      method: "POST", 
	      success: function(res) {  
	        console.log(res)
	         wx.showToast({
		          title: '提交成功'
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
