//myFollows .js
var { APIS } = require('../../const');
var user = require('../../libs/user');
var { request } = require('../../libs/request');
var { validate } = require('../../libs/validate');
var WxNotificationCenter = require('../../vendors/WxNotificationCenter.js')

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
  	eventId:'',
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
  	console.log(options)
  	this.setData({
       moduleId: options.moduleId,
      eventId:options.eventId
   });
	    user.login(this.onLoadData(false), this, false);
  },
 onLoadData: function(load){
  	var that = this;
  	console.log(that.data.moduleId)
  	if(load){
  		that.setData({
  			loading:!that.data.loading,
		    disabled:!that.data.disabled,
		  	loadText:'加载中...',
  		})
  	}	
  	 request({
      url: APIS.GET_TASK,
       data:{
		  		moduleId: that.data.moduleId,
		  	},
	      header: {
            auth: wx.getStorageSync('token')
         },
      method: 'GET',
      realSuccess: function(data){
      	console.log("我的关注asdf",data);
      	if(uniformSize){
      		that.setData({
		      firstPerson:data.data.uniformSize,
		    })
      	}
     		
      },
      realFail: function(msg) {
        wx.hideLoading();
        wx.showToast({
          title: msg
        });
      }
    }, false);
  },
  cancel:function(e){
  	var that=this;
  	console.log(that.data.moduleId)
  	var uniformSize=that.data.firstPerson;
  	console.log(wx.getStorageSync('token'))
  	if(uniformSize){
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
	      	if(res.data.success==true){
	      		 wx.showToast({
		          title: '提交成功'
						});
						WxNotificationCenter.postNotificationName('NotificationName',{uniformSize: uniformSize })
		         setTimeout(function(){
							wx.navigateBack({
								delta: 1
								})
				    },500);    
	      	}else{
	      		 wx.showToast({
		          title: '您已提交过校服'
		        });
	      	}
	        
	      }  
	   })  
  	}else{
  		 wx.showToast({
		          title: '请选择校服编号'
		        });
  	}
  	
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
