//detail.js
//获取应用实例
/*var app = getApp()*/


var { monthFormatList, dayFormatList, APIS } = require('../../const');
var util = require('../../utils/util');
var user = require('../../libs/user');
var { request } = require('../../libs/request');

//引入通知
var WxNotificationCenter = require('../../vendors/WxNotificationCenter.js')

Page({
	data: {
		pictureUrls: [
		],  //事情图片
	    indicatorDots: true,  
	    autoplay: true,  
	    interval: 5000,  
	    duration: 500,
   		offset: 1,
		eventId: "",
		
		des:{
			isShowBottom:true,
			description:'',
			hasMore:false,
			isFollow:true,
			//评论数据
			commentData: {
				data: {
					commentList:[]
				}
			},
			createAt:'',
			isAllowComment:true
		},
		
		eventName: "", //事件名称
		startTime: "",
		endTime: "",
		address: "",
		poster: '',
		formatedMonth: '',
		
		startTime: { //开始时间
			year: "", //年份
			month: "",
			day: "",
			hours:"23"
		},
		endTime: { //开始时间
			year: "", //年份
			month: "",
			day: "",
			hours:"23"
		},
		isFollow: false, //是否关注了事件，默认false
		isStar: false, //是否点赞了
		starCount: 0, //点赞总数，默认0
		isAllow:true,
		hasEnrolled:false,
		enrollModuleId:"",
		isShowEnroll:false,//是否有参加模块
		enrollData:{},
		latitude:'',
		longitude:'',
		isShowShare:true,
		isPhoneVarifie:false,//是否认证身份

		//模块Id, moduleType 1:详情事件，2:评论，3：报名，4：投票，5:问卷，6：评价
		modules: [],
		scrollToId: '',
		fromShare: 0,
		date:{
			toDAte:'',
			goDat:'',
			roomNum:'',
		}
		,
		eventInfo:{
			hotelCheckInDate:'',
			hotelCheckOutDate:'',
			hotelRoomNo:'',
			address:'',
			placeName:'',
			poster:'',
			telephone:'',
			
		},
		disabled:{
			disabled:''
		},
		report:{
			dataStatus:'',
			isInvoice:'',
			isPhoneVarified:'',
			isPhoneVarifie:false,//是否认证身份
			isReported:'',
			isSubmitIpad:'',
			isTakeBus:'',
			uniformSize:'',
			photoNo:'',
			isBaggageConfirm:''
		},
		hotelId:'hotelId',
		moduelObject:{
		},
		details:'',
		detailInfo:'',
		hidden:true,
		reportInfo:{

		},
		iconUp:false
	},

	onLoad: function(options){
		var that = this;
		console.log(options)
		this.setData({
			eventId:options.eventId,
			fromShare: options.fromShare || 0
		});
		user.login();
	    wx.request({
	      url:  APIS.GET_PERSONALBASEINFO,
	      data: {
	      },
	      header: {
	            auth: wx.getStorageSync('token')
	         },
	      success: function(res){
	        console.log(res.data.data.isPhoneVarified)
	       that.setData({
	       	   'reportInfo.isPhoneVarifie':res.data.data.isPhoneVarified
	       })
	      }
	    })   
		wx.showLoading({
	      mask: true,
	      title: '数据加载中'
	    });
		user.login(this.onLoadData, this, true);
		this.prestrain();
		//注册通知
		WxNotificationCenter.addNotification('NotificationName', that.didNotification, that)
	    
	},
	onUnload: function () {
		//移除通知
		var that = this
		WxNotificationCenter.removeNotification('NotificationName', that)
	 },
	  //通知处理
	  didNotification: function (info) {
		//更新数据
		console.log(info.uniformSize);
		console.log(info.photoNo);
		console.log(info)
		this.setData({
			'reportInfo.uniformSize':info.uniformSize,
			'reportInfo.photoNo':info.photoNo,
			'reportInfo.isSubmitIpad':info.isSubmitIpad,
			'reportInfo.isBaggageConfirm':info.isBaggageConfirm,
			'reportInfo.dataStatus':info.dataStatus
		})
	  },
	//页面加载的函数
	onLoadData: function() {
		const that = this;
	
		const getEventBaseParams = {
			pageNo:1,
			pageSize:999,
			eventId: that.data.eventId
		};
		request({
	      url: APIS.GET_EVENT_BASE,
		  data: getEventBaseParams,
		  header: {
			auth: wx.getStorageSync('token')
		  },
	      method: 'POST',
	      realSuccess: function(data){
			    var datas=data.data;
	      		console.log("base",datas.modules[0].moduleId);
				  console.log("base",datas.modules);
				// var en = parseInt(datas.startTime.substring(5, 7));
				// edit by 梁冬
				// 依照ui图重新排列模块的渲染顺序
				var modules = that.sortModulesByPriority(data.modules);
				var moduelObject = {};
				for(var m of datas.modules){
					console.log(m)
					moduelObject[m.moduleType] = m;
				}
				console.log(111)
				that.setData({
					    'moduelObject':moduelObject,
						"modules": datas.modules,
						"eventName": datas.name,
						"address": datas.address,
						"poster": datas.poster,
						// "formatedMonth": monthFormatList[en-1].arabic + '月',
						// "startTime": { //开始时间
						// 	"year": datas.startTime.substring(0, 4), //年份
						// 	"month": datas.startTime.substring(5, 7),
						// 	"day": datas.startTime.substring(8, 10),
						// 	"hours": datas.startTime.substring(11, 16)
						// },
						// "endTime": { //结束时间
						// 	"year": datas.endTime.substring(0, 4), //年份
						// 	"month": datas.endTime.substring(5, 7),
						// 	"day": datas.endTime.substring(8, 10),
						// 	"hours": datas.endTime.substring(11, 16)
						// },
						"pictureUrls" :datas.pictureUrls,
						"isFollow": datas.isFollow, //是否关注了事件，默认false
						"des.isFollow": datas.isFollow, 
						"isStar": datas.isStar, //是否点赞了
						"starCount": datas.starCount, //点赞总数，默认0
						"latitude":datas.latitude,
						"longitude":datas.longitude
				});
				that.getEnrollModuleData();
				that.getCommentData();
				that.getHotelRoom();
				that.reportResult();
				that.showInfo();
	        	wx.hideLoading();
	      },
	      realFail: function(msg) {
	        wx.hideLoading();
	        wx.showToast({
	          title: msg
	        });
	      }
	    }, true);
    
	},
	//获取报名模块数据
	getEnrollModuleData:function(){
		let that = this;
		let mL = that.data.modules.length;
		for(let i=0;i<mL;i++){
			if(that.data.modules[i].moduleType=="3"){
				console.log(that.data.modules[i].moduleId);
				const getEnrollModuleParams = {
					sid: wx.getStorageSync('sid') || '',
					moduleId: that.data.modules[i].moduleId
				};
				
				request({
					url: APIS.GET_ENROLL_MODULE,
					data: getEnrollModuleParams,
					method: 'POST',
					realSuccess: function(res) {
						console.log("bm",res);
						that.setData({
							"hasEnrolled":res.data.hasEnrolled,
							"enrollModuleId": that.data.modules[i].moduleId //把moduleId保存，报名的时候用到
						});
					},
					realFail: function(msg) {
						wx.showToast({
							title: msg
						});
					}
				}, false);
				
				break;
			}
		}
		
	},
	//参加点击报名
	clickEnrollBtn: function(e) {
		let that = this;
		//如果该用户允许报名
		if(that.data.enrollModuleId){
		const addEnrollParams = {
			sid: wx.getStorageSync('sid') || '',
			moduleId:that.data.enrollModuleId
		};
		
		if(that.data.isAllow && !that.data.hasEnrolled){
			wx.request({
					url: APIS.ADD_ENROLL,
					data: addEnrollParams,
					method: 'POST',
					success: function(res) {
						console.log("报名",res);
						wx.showToast({
			              title: res.data.resultMsg,
			              icon: 'success',
			              duration: 2000,
			          	});
			          	if(res.data.errCode=='0000'){
				          	that.setData({
				          		"isAllow": !that.data.isAllow,
								"hasEnrolled": !that.data.hasEnrolled
							});
			          	}
					},
				});
				
		}else{
			wx.showToast({
              title: "您已经报名！",
              icon: 'success',
              duration: 2000,
          	});
		}
		}else{
			wx.showToast({
              title: "事件发布者暂时没有开通报名模块！",
          	});
		}
	},
	//点击关注
	clickFollowEventBtn: function(e) {
		console.log("关注", e);
		
		let that = this;
		const followEventParams = {
			sid: wx.getStorageSync('sid') || '',
			eventId: that.data.eventId
		};
		
		if(that.data.isFollow){
			//true 就取消关注
			wx.request({
				url: APIS.UN_FOLLOW_EVENT,
				data: followEventParams,
				method: 'POST', 
				success: function(res) {
					console.log(res);
					wx.showToast({
		              title: res.data.resultMsg,
		              icon: 'success',
		              duration: 2000,
		          	});
		          that.setData({
						"isFollow": !that.data.isFollow,
						"des.isFollow": !that.data.isFollow
					});
				}
			})
		}else{
			//false 关注
			wx.request({
				url: APIS.FOLLOW_EVENT,
				data: followEventParams,
				method: 'POST', 
				success: function(res) {
					console.log(res);
					wx.showToast({
		              title: res.data.resultMsg,
		              icon: 'success',
		              duration: 2000,
		          	});
		          	that.setData({
						"isFollow": !that.data.isFollow,
						"des.isFollow": !that.data.isFollow
					});
				}
			})
		}
	},
	//点赞
	clickAddStarBtn: function(e) {
		let that = this;
		const addStarParams = {
			sid: wx.getStorageSync('sid') || '',
			eventId: that.data.eventId
		};
		if(that.data.isStar){
			wx.showToast({
              title:"您已经点赞！",
              icon: 'success',
          	});
			return;
		}
		wx.request({
			url: APIS.ADD_STAR,
			data: addStarParams,
			method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
			// header: {}, // 设置请求的 header
			success: function(res) {
				console.log(res);
				that.setData({
					"starCount": res.data.resultData.starCount,
					"isStar":!that.data.isStar
				});
				// success
			}
		})

	},
	
	//请求评论模块数据
	getCommentData:function(isReloadComment){

		// 重新刷新评论列表
		if (isReloadComment) {
			this.setData({
				offset: 1,
				"des.commentData": {
					data: {
						commentList:[]
					}
				}
			});
		}

		let that = this;
		let mL = that.data.modules.length;
		for(let i=0;i<mL;i++){
			if(that.data.modules[i].moduleType=="COMMENT"){
				console.log(that.data.modules[i].moduleId);
				const getCommentModuleParams = {
					pageNo:1,
					pageSize:999,
					moduleId: that.data.modules[i].moduleId
				};
				wx.request({
					url: APIS.GET_COMMENT_MODULE,
					data: getCommentModuleParams,
					method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
					// header: {}, // 设置请求的 header
					success: function(res) {
						var num = 0;
						console.log("获取评论数据！",res);
						var moreData=res.data.data.list;
						var num = 0;
						for (var i in moreData) {
							moreData[i].picNum = moreData[i].content.length - 1;
						}
						var data=that.data.des.commentData.data.commentList.concat(moreData);
						that.setData({
							"des.hasMore":res.data.data.hasMore,
							//"des.commentData.commentList":data,
							"des.commentData": res.data,
							"des.commentData.data.commentList": data,
							"des.isAllowComment":!res.data.data.config.isAllowComment
						});
						
						console.log(that.data.des.commentData);
						// success
					}
				})
				break;
			}
		}
	},
	showMoreComment:function(e){
		var that=this;
		console.log(e);
		if(that.data.des.hasMore){
			that.setData({
				"offset":that.data.offset+1
			});
			that.getCommentData();
		}
	},
	showInfo:function(){
		var that = this;
		wx.request({
			url: APIS.GET_DESCRIPTION_MODULE,
			data: {eventId:that.data.eventId,
				pageNo:1,
				pageSize:99},
			method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
			// header: {}, // 设置请求的 header
				success: function(res){
				console.log(res.data)
				if(res.data.code=='success'){
					that.setData({
						details:true
					})
				}
			},
			
		})
	},
	clickShowInfo: function() {
		let that = this;
		let mL = that.data.modules.length;
		that.setData({
			
			scrollToId: !that.data.des.isShowBottom ? '' : 'J_detail',
			"des.isShowBottom":!that.data.des.isShowBottom,
			hidden:!that.data.hidden,
			iconUp:!that.data.iconUp
		});
	},
	prestrain:function(){ //预加载图文详情图片
		const that = this;
		const getDescription = {
			eventId:that.data.eventId,
			pageNo:1,
			pageSize:99
		};
		wx.request({
			url: APIS.GET_DESCRIPTION_MODULE,
			data: getDescription,
			method: 'POST',
			success: function(res) {
				console.log("详情！",res);
				that.setData({
					"des.description":res.data,
					detailInfo:res.data.data.details
				
				});
			}
		})
},
	// 提交酒店入住模块的数据
	roomNum:function(e){
		this.setData({
			'date.roomNum':e.detail.value
		})
	},
	formSubmit: function(e) {
		var that =this;
		var hotel = that.data.modules;
			for(var i =0;i < that.data.modules.length;i++){
				if(that.data.modules[i].moduleType=='HOTELSTAY'){
					const parmar = {
						 'moduleId': that.data.modules[i].moduleId,
						"hotelRoomNo":that.data.date.roomNum,
					};
					
				
			
		if(that.data.date.roomNum){
			request({
				url: APIS.ADD_HOTELROOM,
				header: {
				  auth: wx.getStorageSync('token')
				},
				data: parmar,
				method: 'POST',
				realSuccess:function(res){
					
				  console.log(res.code);
				  if(res.code=='SUCCESS'){
					wx.showToast({
						title: '提交成功',
						duration: 2000
					  })
					  that.setData({
						  disabled:{
							  disabled:true
						  }
					  })
					  setTimeout(function() {
						wx.navigateBack();  
					  }, 500);
					 
				  }else if(res.code=='UNKNOWN'){
					wx.showToast({
						title: '输入信息有误！',
						duration: 2000
					  })
				}
				},
				realFail: function(msg) {
					console.log(msg)
				  wx.showToast({
					title: msg.message
				  });
				}
			  }, true, this);
		}else{
			wx.showToast({
				title: '请输入入住信息',
				duration: 2000
			  })
		
	}
}
}
},
//获取酒店入住信息
getHotelRoom:function(){
	var that =this;
	var hotel = that.data.modules;
		for(var i =0;i < that.data.modules.length;i++){
			if(that.data.modules[i].moduleType=='HOTELSTAY'){
				const parmars = {
					 'moduleId': that.data.modules[i].moduleId,
				};
				
	request({
		url: APIS.GET_HOTELROOM,
		header: {
		  auth: wx.getStorageSync('token')
		},
		data: parmars,
		method: 'get',
		realSuccess:function(res){
			
		  console.log(res.data);
		  that.setData({
			eventInfo:{
				hotelCheckInDate:res.data.hotelCheckInDate,
				hotelCheckOutDate:res.data.hotelCheckOutDate,
				hotelRoomNo:res.data.hotelRoomNo,
				address:res.data.eventInfo.address,
				placeName:res.data.eventInfo.placeName,
				poster:res.data.eventInfo.poster,
				telephone:res.data.eventInfo.telephone
			}
		  })
		},
		realFail: function(msg) {
			console.log(msg)
		  wx.showToast({
			title: msg.message
		  });
		}
	  }, true, this);
	}
}
},
	//点击分享
	clickShareBtn:function(e){
		console.log("分享",e);
		this.setData({
			isShowShare:!this.data.isShowShare
		})
		//wx.showShareMenu();
	},
	hiddenShare:function(e){
		this.setData({
			isShowShare:!this.data.isShowShare
		})
	},
	//页面展示
	onShow: function() {
		this.getCommentData(true);
	},
	onShareAppMessage: function() {
		// 用户点击右上角分享
		var path = '';
		if (this.data.poster) {
			path = '/pages/eventPoster/eventPoster';
		} else {
			path = '/pages/detail/detail';
		}
		return {
			title: '中欧商学院-' + this.data.eventName, // 分享描述
			path: path + '?eventId='+this.data.eventId+'&eventName='+this.data.eventName+'&fromShare=1' // 分享路径
		}
	},

	openLocation: function() {
		wx.openLocation({
		  latitude: +this.data.latitude,
		  longitude: +this.data.longitude,
		  scale: 28, // 缩放比例
		  name: this.data.address
		})
	},
	//重新排序modules
	sortModulesByPriority: function(modules) {
		// 详情1，投票4，问卷5，评价6，评论2
		var priority = {
			"3": 0,
			"4": 1,
			"5": 2,
			"6": 3,
			"1": 4,
			"2": 5
		};
		// modules.sort(function(mA, mB) {
		// 	return priority[mA.moduleType] - priority[mB.moduleType];
		// });

		return modules;
	},

	onToComment: function() {
		console.log('hahah');
		for (var i in this.data.modules) {
			if (this.data.modules[i].moduleType == 2) {
				wx.navigateTo({
				  url: '../commentSubmit/commentSubmit?moduleId=' + this.data.modules[i].moduleId
				});
			}
		}
	},

	scrollToComment: function() {
		console.log('hahaha');
		this.setData({
			scrollToId: 'J_comment'
		});
	},

	onPreviewSlider: function(e) {
		wx.previewImage({
		  current: e.target.dataset.url, // 当前显示图片的链接，不填则默认为 urls 的第一张
		  urls: this.data.pictureUrls
		});
	},

	onPreviewComment: function(e) {
		var i = +e.target.dataset.index;
		var pics = this.data.des.commentData.data.commentList[i].content;
		var rtPics = [];
		for (var i in pics) {
			if (pics[i].type == 2) {
				rtPics.push(pics[i].content);
			}
		}
		wx.previewImage({
		  current: e.target.dataset.url, // 当前显示图片的链接，不填则默认为 urls 的第一张
		  urls: rtPics
		});
	},

	onPreviewDetail: function(e) {
		var i = +e.target.dataset.index;
		var pics = this.data.des.description.paragraphs;
		var rtPics = [];
		
		for (var i in pics) {
			if (pics[i].type == 2) {
				rtPics.push(pics[i].content);
			}
		}
		console.log(rtPics);
		wx.previewImage({
		  current: e.target.dataset.url, // 当前显示图片的链接，不填则默认为 urls 的第一张
		  urls: rtPics
		});		
	},
	// 请求报到结果数据
	reportResult:function(){
		let that = this;
		let mL = that.data.modules.length;
		for(let i=0;i<mL;i++){
			if(that.data.modules[i].moduleType=="TASK"){
				console.log(that.data.modules[i].moduleId);
				const getReportResult = {
					moduleId: that.data.modules[i].moduleId
				};
				request({
					url: APIS.GET_TASK,
					header: {
					  auth: wx.getStorageSync('token')
					},
					data: getReportResult,
					method: 'get',
					realSuccess:function(res){
					  console.log(res.data);
					  that.setData({
						'report.dataStatus':res.data.dataStatus,
						'report.isInvoice':res.data.isInvoice,
						'report.isPhoneVarified':res.data.isPhoneVarified,
						'report.isReported':res.data.isReported,
						'report.isSubmitIpad':res.data.isSubmitIpad,
						'report.isTakeBus':res.data.isTakeBus,
						'report.uniformSize':res.data.uniformSize,
						'report.photoNo':res.data.photoNo,
						'report.isBaggageConfirm':res.data.isBaggageConfirm
					  })
					},
					realFail: function(msg) {
						console.log(msg)
					  wx.showToast({
						title: msg.message
					  });
					}
				},true,this)



	}
  }
 }
})