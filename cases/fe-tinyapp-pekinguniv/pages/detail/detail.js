//detail.js
//获取应用实例
/*var app = getApp()*/


var { monthFormatList, dayFormatList, APIS } = require('../../const');
var util = require('../../utils/util');
var user = require('../../libs/user');
var { request } = require('../../libs/request');


Page({
	data: {
		imgUrls: [
			'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1505115443002&di=68c6673e47ee01bece39213f51c760f6&imgtype=0&src=http%3A%2F%2Fpic115.nipic.com%2Ffile%2F20161122%2F24085696_205330442000_2.jpg',
			'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1505115608590&di=1bb280bd16531e608d9e0537d4a5969e&imgtype=0&src=http%3A%2F%2Fpic117.nipic.com%2Ffile%2F20161213%2F24416158_170424174000_2.jpg',
			'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1505115384481&di=dee76df195152a4a075a2ba185694d4b&imgtype=0&src=http%3A%2F%2Fpic72.nipic.com%2Ffile%2F20150718%2F19410031_233913942084_2.jpg'
			
		  ],
		pictureUrls: [],  //事情图片
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
			hasEnrolled:false,
			eventId: "", //雙選會用到，必須放在des中
			//评论数据
			commentData: {
				data: {
					commentList:[]
				}
			},
			createAt:'',
			isAllowComment:true
		},location:{
			SunshineHall:{latitude:39.9906230000,location:116.3138760000},
			SunStudentCenter:{latitude:39.9888600000,location:116.3111500000},
			MoonlightHall:{latitude:39.9906340000,location:116.3136870000}
	},
		
		eventName: "", //事件名称
		startTime: "",
		endTime: "",
		startTimeDay:"",
		address: "",
		poster: '',
		formatedMonth: '',
		eventType: "",//事件类型
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
		hasEnrolled:true,
		enrollModuleId:"",
		isShowEnroll:false,//是否有参加模块
		enrollData:{},
		latitude:'',
		longitude:'',
		isShowShare:true,
		isJoin:'',
		

		//模块Id, moduleType 1:详情事件，2:评论，3：报名，4：投票，5:问卷，6：评价
		modules: [],
		scrollToId: '',
		fromShare: 0,
		hr:0,
		endHr:0,
		viewCount:0,
		contactPerson:'加载中...',
		contactTelephone:"",
		email:"",
		attend:''
	},

	onLoad: function(options){
		//console.log(options.eventId);
		console.log(options.isJoin)
		if(options.isJoin==true){
			this.setData({
				isJoin:true
			})
		}else{
			this.setData({
				isJoin:false
			})
		}
		this.setData({
			isFollow:options.isJoin,
			isJoin:options.isJoin,
			hasEnrolled:options.isJoin,
			eventId:options.eventId,
			'des.eventId':options.eventId,
			fromShare: options.fromShare || 0,
			hr:options.hour,
			endHr:parseInt(options.hour)+2+':00'
			//startTime:{hours:options.hour}
		});
		wx.showLoading({
	      mask: true,
	      title: '数据加载中'
	    });
		user.login(this.onLoadData, this, true)
		if( wx.getStorageSync('checked')==true){
			//this.setData({hasEnrolled:true})
			
		}
	    
	},
	//页面加载的函数
	onLoadData: function() {

		const that = this;
		const getEventBaseParams = {
			wechatOpenId:wx.getStorageSync('openId'),
			id: that.data.eventId,
			category:3
		};
		wx.request({
			url: APIS.GET_NEW_EVENTLISTDETAIL,
			data:{
				id: that.data.eventId,
				category:3,
				wechatOpenId:wx.getStorageSync('openId'),
			},
			header: {
				'content-type': 'application/json'
			  },
			success: function(res){
				console.log(res);
				console.log(res.data);
				var data = res.data;
				that.year = data.startTime.substring(0,4);
				//console.log(that.year);
				//console.log(data.startTime.substring(8,10));
				that.setData({
					attend:data.attend,
					formatedMonth:data.startTime.substring(6,7),
					startTimeDay:data.startTime.substring(8,10),
					eventName:data.title,
					address:data.locationName,
					viewCount:data.viewCount,
					contactPerson:data.contactPerson,
					contactTelephone:data.contactTelephone,
					email:data.email,
					startTime:{
						'year': data.startTime.substring(0, 4), //年份
						'month': data.startTime.substring(5, 7),
						'day': data.startTime.substring(8, 10),
						'startHours':that.data.hr
					},
					endTime:{
						"year": data.endTime.substring(0, 4), //年份
						"month": data.endTime.substring(5, 7),
						"day": data.endTime.substring(8, 10),
						'endHours':that.data.endHr
						
					}
				});
				wx.hideLoading();
				that.getEnrollModuleData();
				that.getCommentData();
				that.clickShowInfo();		
				
			},
			fail: function() {
				// fail
				wx.hideLoading();
				    wx.showToast({
				      title: msg
				    });
			},
			complete: function() {
				// complete
			}, loginCallback: this.onLoadData,
			
		})
		// request({
	    //   url: APIS.GET_NEW_EVENTLISTDETAIL,
	    //   data: getEventBaseParams,
	    //   method: 'POST',
	    //   realSuccess: function(data){
	    //   		console.log("base",data);
	    //     	var datas=data;
		// 		var en = parseInt(datas.startTime.substring(5, 7));
		// 		 if (datas.eventType == "双选会") {
		// 		          var module = {};
		// 		          module.moduleId = this.data.eventId;
		// 		          module.moduleType = "7";
		// 		        datas.modules.push(module);
		// 	        }
		// 		// edit by 梁冬
		// 		// 依照ui图重新排列模块的渲染顺序
		// 		var modules = that.sortModulesByPriority(data.modules);

		// 		that.setData({
		// 				"modules": modules,
		// 				"eventName": datas.name,
		// 				"address": datas.address,
		// 				"poster": datas.poster,
		// 				"eventType": datas.eventType,
		// 				"formatedMonth": monthFormatList[en-1].arabic + '月',
		// 				"startTime": { //开始时间
		// 					"year": datas.startTime.substring(0, 4), //年份
		// 					"month": datas.startTime.substring(5, 7),
		// 					"day": datas.startTime.substring(8, 10),
		// 					"hours": datas.startTime.substring(11, 16)
		// 				},
		// 				"endTime": { //结束时间
		// 					"year": datas.endTime.substring(0, 4), //年份
		// 					"month": datas.endTime.substring(5, 7),
		// 					"day": datas.endTime.substring(8, 10),
		// 					"hours": datas.endTime.substring(11, 16)
		// 				},
		// 				"pictureUrls" :datas.pictureUrls,
		// 				"isFollow": datas.isFollow, //是否关注了事件，默认false
		// 				"des.isFollow": datas.isFollow, 
		// 				"isStar": datas.isStar, //是否点赞了
		// 				"starCount": datas.starCount, //点赞总数，默认0
		// 				"latitude":datas.latitude,
		// 				"longitude":datas.longitude
		// 		});
		// 		that.getEnrollModuleData();
		// 		that.getCommentData();
	    //     	wx.hideLoading();
	    //     	that.clickShowInfo();
	    //   },
		//   loginCallback: this.onLoadData,
	    //   realFail: function(msg) {
	    //     wx.hideLoading();
	    //     wx.showToast({
	    //       title: msg
	    //     });
	    //   }
	    // }, true);
    
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
							// "hasEnrolled":res.data.hasEnrolled,
							// 'des.hasEnrolled': res.data.hasEnrolled,
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
		if(!that.data.enrollModuleId){
		const addEnrollParams = {
			sid: wx.getStorageSync('sid') || '',
			moduleId:that.data.enrollModuleId
		};
		
		if(that.data.attend==false){
			wx.request({
					url: APIS.GET_CAREER_TALK,
					data: {
						id: that.data.eventId,
						businessType: 3,
					  wechatOpenId: wx.getStorageSync('openId'),
					  },
					header: {
						'content-type': 'application/json'
					  },
					success: function(res) {
						console.log("报名",res);
						wx.showToast({
			              title: '参加成功',
			              icon: 'success',
			              duration: 2000,
			          	});
			          	if(res.statusCode=='200'){
							console.log('报名成功呀啊')
				          	that.setData({
				          		isAllow: !that.data.isAllow,
								attend: !that.data.attend,
							});
							wx.setStorageSync('checked', true);
							console.log(that.data.hasEnrolled)
			          	}
					},
				});
				
		}else{
			
			  wx.request({
				  url: APIS.GET_TAKE_PART_IN,
				  data: {
					id: that.data.eventId,
					wechatOpenId: wx.getStorageSync('openId')
				  },
				
				  success: function(res){
					console.log(res.data)
					if(res.data.success==true){
						that.setData({
							attend:false
						})
					};
					wx.showToast({
						title: "取消参加成功",
						icon: 'success',
						duration: 2000,
						});
				  }
			  })
		}
		}else{
			wx.showToast({
			  title:"事件发布者暂时没有开通报名模块！",
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
				success: function(res){
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
			if(that.data.modules[i].moduleType=="2"){
				console.log(that.data.modules[i].moduleId);
				const getCommentModuleParams = {
					sid: wx.getStorageSync('sid') || '',
					size: 10,   
				    offset: that.data.offset,
					moduleId: that.data.modules[i].moduleId
				};
				wx.request({
					url: APIS.GET_COMMENT_MODULE,
					data: getCommentModuleParams,
					method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
					// header: {}, // 设置请求的 header
					success: function(res) {
						console.log("获取评论数据！",res);
						var moreData=res.data.resultData.data.commentList;
						for (var i in moreData) {
							moreData[i].picNum = moreData[i].content.length - 1;
						}
						var data=that.data.des.commentData.data.commentList.concat(moreData);
						that.setData({
							"des.hasMore":res.data.resultData.data.hasMore,
							//"des.commentData.commentList":data,
							"des.commentData": res.data.resultData,
							"des.commentData.data.commentList": data,
							"des.isAllowComment":!res.data.resultData.config.isAllowComment
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
	clickShowInfo: function() {
		let that = this;
		let mL = that.data.modules.length;
		that.setData({
			"des.isShowBottom":!that.data.des.isShowBottom,
			scrollToId: !that.data.des.isShowBottom ? '' : 'J_detail'
		});
		for(let i=0;i<mL;i++){
			if(that.data.modules[i].moduleType=="1"){
				const getDescriptionModuleParams = {
					sid: wx.getStorageSync('sid') || '',
					moduleId: that.data.modules[i].moduleId
				};
				wx.request({
					url: APIS.GET_DESCRIPTION_MODULE,
					data: getDescriptionModuleParams,
					method: 'POST',
					success: function(res) {
						console.log("详情！",res);
						that.setData({
							"des.description":res.data.resultData.data
						});
					}
				})
				break;
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
			title: '北京大学-' + this.data.eventName, // 分享描述
			path: path + '?eventId='+this.data.eventId+'&eventName='+this.data.eventName+'&fromShare=1' // 分享路径
		}
	},

	openLocation: function() {
		if(this.data.address=='英杰阳光厅'){
			wx.openLocation({
				latitude: +this.data.location.SunshineHall.latitude,
				longitude: +this.data.location.SunshineHall.location,
				scale: 28, // 缩放比例
				name: this.data.address
			  })
		}else if(this.data.address=='英杰月光厅'){
				wx.openLocation({
					latitude: +this.data.location.MoonlightHall.latitude,
					longitude: +this.data.location.MoonlightHall.location,
					scale: 28, // 缩放比例
					name: this.data.address
				  })
				
	}else if(this.data.address=='新太阳学生中心212室'){
		wx.openLocation({
			latitude: +this.data.location.SunStudentCenter.latitude,
			longitude: +this.data.location.SunStudentCenter.location,
			scale: 28, // 缩放比例
			name: this.data.address
		  })
	}
},
	// 重新排序modules
	sortModulesByPriority: function(modules) {
		// 详情1，投票4，问卷5，评价6，评论2
		var priority = {
			"3": 0,
      		"6": 1,
 			"7": 2,
			"1": 3,
			"2": 4,
      		"4": 5,
      		"5": 6
		};
		modules.sort(function(mA, mB) {
			return priority[mA.moduleType] - priority[mB.moduleType];
		});

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
				rtPics.push(pics[i].value);
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
				rtPics.push(pics[i].value);
			}
		}
		console.log(rtPics);
		wx.previewImage({
		  current: e.target.dataset.url, // 当前显示图片的链接，不填则默认为 urls 的第一张
		  urls: rtPics
		});		
	}
})