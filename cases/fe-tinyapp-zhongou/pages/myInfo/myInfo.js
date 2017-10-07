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
  	name:'请输入您的名字',
  	phone:'请输入您的手机号码',
  	photo:'上传图片',
    class :'请选择班级',
    firstclass:'',
    selectclass:true,
    writecode:'请输入验证码',
    sendcode:'发送验证码',
    license:'请输入车牌号码',
    ischecked:false,
    photograph:'拍照识别',
    content:'请在此输入公司发票信息',
    money:'请输入拆分金额',
    myUniform:'请输入您的小幅尺寸',
    myphoto:'请输入您的照片编号',
    hotel:'请输入您的酒店房号',
    Baggage:'请输入您的行李编号',
    items: [
      {name: '不需要', value: '不需要'},
      {name: 'T2', value: 'T2',},
      {name: 'T3', value: 'T3'},
    ],
  	loadText:'点击加载更多...',
  	list:[]
  	
  },
 //点击选择类型
  clickclass:function(){
    var selectclass = this.data.selectclass;
    if(selectclass == true){
     this.setData({
     selectclass:false,
  })
    }else{
     this.setData({
     selectclass:true,
  })
    }
  } ,
   //点击切换
  mySelect:function(e){
   this.setData({
     firstclass:e.target.dataset.me,
     selectclass:true,
   })
  },
  namechange:function(e){
    this.setData({
      name:e.detail.value
    })
  },
  phonechange:function(e){
    this.setData({
      phone:e.detail.value
    })
  },
  photochange:function(e){
    this.setData({
      photo:e.detail.value
    })
  },
    writecodechange:function(e){
    this.setData({
      writecode:e.detail.value
    })
  },
    sendcodechange:function(e){
    this.setData({
      sendcode:e.detail.value
    })
  },
    licensechange:function(e){
    this.setData({
      license:e.detail.value
    })
  },
    photograph:function(e){
    this.setData({
      photograph:e.detail.value
    })
  },
  contentchange:function(e){
    this.setData({
      content:e.detail.value
    })
  },
  moneychange:function(e){
    this.setData({
      money:e.detail.value
    })
  },
  myUniformchange:function(e){
    this.setData({
      myUniform:e.detail.value
    })
  },
  myphotochange:function(e){
    this.setData({
      myphoto:e.detail.value
    })
  },
  hotelchange:function(e){
    this.setData({
      hotel:e.detail.value
    })
  },
  Baggagechange:function(e){
    this.setData({
      Baggage:e.detail.value
    })
  },
  onLoad: function () {
  	wx.showLoading({
	      mask: true,
	      title: '数据加载中'
	    });
	    user.login(this.onLoadData(false), this, false);
  },
  onLoad: function () {
  	wx.showLoading({
	      mask: true,
	      title: '数据加载中'
	    });
	    user.login(this.onLoadData(false), this, false);
  },
  checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
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
