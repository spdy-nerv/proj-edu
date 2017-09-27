var { APIS } = require('../../const.js');
var { request } = require('../../libs/request');
var Q = require('../../libs/q/q');
var user = require('../../libs/user');

var app = getApp();
var theme = app.getTheme();

Page({
  data: {
    pictureUrls: [],  //事情图片
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    offset: 1,
    eventId: "",
    des: {
      isShowBottom: true,
      description: '',
      hasMore: false,
      isFollow: true,
      //评论数据
      commentData: {
        data: {
          commentList: []
        }
      },
      createAt: '',
      isAllowComment: true
    },

/*
    eventName: "2017广东外语外贸大学招聘会", //事件名称
    startTime: "",
    endTime: "",
    address: "地点：广东外语外贸大学英杰交流中心 阳光厅",
    poster: '',
    formatedMonth: '',

    startTime: { //开始时间
      year: "2017", //年份
      month: "08",
      day: "25",
      hours: "23"
    },
    endTime: { //开始时间
      year: "2017", //年份
      month: "09",
      day: "30",
      hours: "23"
    },
  */
    isFollow: false, //是否关注了事件，默认false
    isStar: false, //是否点赞了
    starCount: 0, //点赞总数，默认0
    isAllow: true,
    hasEnrolled: false,
    enrollModuleId: "",
    isShowEnroll: false,//是否有参加模块
    enrollData: {},
    latitude: '',
    longitude: '',
    isShowShare: true,
    scrollPadding: 100,


    //模块Id, moduleType 1:详情事件，2:评论，3：报名，4：投票，5:问卷，6：评价
    modules: [],
    scrollToId: '',
    fromShare: 0,

    clrMain: theme.clrMain,
    icActDetailVote: theme.icActDetailVote,
    icActDetailQuestion: theme.icActDetailVote,

    voteModuleId: '',
    questionModuleId: '',
    signupModuleId: ''
  },

  onLoad: function(options){

    this.setData({
      eventId: options.actId || 1,
      fromShare: options.fromShare || 0
    });

    wx.showLoading({
      mask: true,
      title: '数据加载中'
    });
    user.login(function() {
      this.onLoadData();
      this.getEventDetail();
    }, this, true);

   },

  getEventDetail: function() {
    var that = this;
    request({
      url: APIS.GET_EVENT_DETAIL,
      method: 'POST',
      data: {
        eventId: this.data.eventId
      },
      realSuccess: function(data) {
        that.setData({
          detail: data.details
        });
      },
      realFail: function(msg) {
        wx.showToast({
          title: msg
        })
      }
    }, false);
  },

  //页面加载的函数
  onLoadData: function () {
    const that = this;
    const getEventBaseParams = {
      eventId: that.data.eventId
    };

    request({
      url: APIS.GET_EVENT_BASE,
      header: {
        auth: wx.getStorageSync('token')
      },
      data: getEventBaseParams,
      method: 'POST',
      realSuccess: function (data) {
        var datas = data;
        var en = parseInt(datas.startTime.substring(5, 7));

        // edit by 梁冬
        // 依照ui图重新排列模块的渲染顺序
        var modules = that.sortModulesByPriority(data.modules);

        that.setData({
          "modules": modules,
          "eventName": datas.name,
          "address": datas.address,
          "poster": datas.poster,
          //"formatedMonth": monthFormatList[en - 1].arabic + '月',
          "startTime": { //开始时间
            "year": datas.startTime.substring(0, 4), //年份
            "month": datas.startTime.substring(5, 7),
            "day": datas.startTime.substring(8, 10),
            "hours": datas.startTime.substring(11, 16)
          },
          "endTime": { //结束时间
            "year": datas.endTime.substring(0, 4), //年份
            "month": datas.endTime.substring(5, 7),
            "day": datas.endTime.substring(8, 10),
            "hours": datas.endTime.substring(11, 16)
          },
          "pictureUrls": datas.pictureUrls,
          "isFollow": datas.isFollow, //是否关注了事件，默认false
          "isFollow": datas.isFollow,
          "isStar": datas.isStar, //是否点赞了
          "starCount": datas.starCount, //点赞总数，默认0
          "latitude": datas.latitude,
          "longitude": datas.longitude,
          "isSign": datas.isSign,
          "followInfo": datas.followInfo
        });
        //that.getEnrollModuleData();
        //that.getCommentData();
        that.renderModules(datas.modules);

        wx.hideLoading();
      },
      loginCallback: this.onLoadData,
      realFail: function (msg) {
        wx.hideLoading();
        wx.showToast({
          title: msg
        });
      }
    }, true);

  },

  renderModules: function(modules) {
    var that = this;
    modules.forEach(function(m, i) {
      if (m.moduleType == 'VOTE') {
        that.setData({
          voteModuleId: m.moduleId
        });
      } else if (m.moduleType == 'QUESTIONNAIRE') {
        that.setData({
          questionModuleId: m.moduleId
        });
      } else if (m.moduleType == 'SIGNUP') {
        that.setData({
          signupModuleId: m.moduleId
        });
      }
    });
  },

  //获取报名模块数据
  getEnrollModuleData: function () {
    let that = this;
    let mL = that.data.modules.length;
    for (let i = 0; i < mL; i++) {
      if (that.data.modules[i].moduleType == "3") {
        console.log(that.data.modules[i].moduleId);
        const getEnrollModuleParams = {
          sid: wx.getStorageSync('sid') || '',
          moduleId: that.data.modules[i].moduleId
        };

        request({
          url: APIS.GET_ENROLL_MODULE,
          data: getEnrollModuleParams,
          method: 'POST',
          realSuccess: function (res) {
            console.log("bm", res);
            that.setData({
              "hasEnrolled": res.data.hasEnrolled,
              "enrollModuleId": that.data.modules[i].moduleId //把moduleId保存，报名的时候用到
            });
          },
          realFail: function (msg) {
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
  clickEnrollBtn: function (e) {
    let that = this;
    //如果该用户允许报名
    if (that.data.enrollModuleId) {
      const addEnrollParams = {
        sid: wx.getStorageSync('sid') || '',
        moduleId: that.data.enrollModuleId
      };

      if (that.data.isAllow && !that.data.hasEnrolled) {
        wx.request({
          url: APIS.ADD_ENROLL,
          data: addEnrollParams,
          method: 'POST',
          success: function (res) {
            console.log("报名", res);
            wx.showToast({
              title: res.data.resultMsg,
              icon: 'success',
              duration: 2000,
            });
            if (res.data.errCode == '0000') {
              that.setData({
                "isAllow": !that.data.isAllow,
                "hasEnrolled": !that.data.hasEnrolled
              });
            }
          },
        });

      } else {
        wx.showToast({
          title: "您已经报名！",
          icon: 'success',
          duration: 2000,
        });
      }
    } else {
      wx.showToast({
        title: "事件发布者暂时没有开通报名模块！",
      });
    }
  },
  //点击关注
  clickFollowEventBtn: function (e) {
    console.log("关注", e);

    let that = this;
    const followEventParams = {
      sid: wx.getStorageSync('sid') || '',
      eventId: that.data.eventId
    };

    if (that.data.isFollow) {
      //true 就取消关注
      wx.request({
        url: APIS.UN_FOLLOW_EVENT,
        data: followEventParams,
        method: 'POST',
        success: function (res) {
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
    } else {
      //false 关注
      wx.request({
        url: APIS.FOLLOW_EVENT,
        data: followEventParams,
        method: 'POST',
        success: function (res) {
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



  //页面展示
  onShow: function () {
    //this.getCommentData(true);
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    var path = '';
    if (this.data.poster) {
      path = '/pages/act-poster/act-poster';
    } else {
      path = '/pages/act-detail/act-detail';
    }
    return {
      title: this.data.eventName, // 分享描述
      path: path + '?eventId=' + this.data.eventId + '&eventName=' + this.data.eventName + '&fromShare=1' // 分享路径
    }
  },

  openLocation: function () {
    wx.openLocation({
      latitude: +this.data.latitude,
      longitude: +this.data.longitude,
      scale: 28, // 缩放比例
      name: this.data.address
    })
  },

  // 重新排序modules
  sortModulesByPriority: function (modules) {
    // 详情1，投票4，问卷5，评价6，评论2
    var priority = {
      "3": 0,
      "4": 1,
      "5": 2,
      "6": 3,
      "1": 4,
      "2": 5
    };
    modules.sort(function (mA, mB) {
      return priority[mA.moduleType] - priority[mB.moduleType];
    });

    return modules;
  },

  onToComment: function () {
    console.log('hahah');
    for (var i in this.data.modules) {
      if (this.data.modules[i].moduleType == 2) {
        wx.navigateTo({
          url: '../commentSubmit/commentSubmit?moduleId=' + this.data.modules[i].moduleId
        });
      }
    }
  },

  scrollToComment: function () {
    console.log('hahaha');
    this.setData({
      scrollToId: 'J_comment'
    });
  },

  onPreviewSlider: function (e) {
    wx.previewImage({
      current: e.target.dataset.url, // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: this.data.pictureUrls
    });
  },

  onPreviewComment: function (e) {
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

  onPreviewDetail: function (e) {
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
  },

  onToggleFollow: function() {
    var that = this;
    wx.showLoading({
      title: '关注中，请稍候！',
      mask: 'true'
    })
    request({
      url: APIS.TOGGLE_FOLLOW,
      header: {
        auth: wx.getStorageSync('token')
      },
      data: {
        eventId: this.data.eventId
      },
      method: 'POST',
      realSuccess: function(data) {
        that.setData({
          isFollow: !that.data.isFollow
        });
        wx.hideLoading();
      },
      realFail: function(msg) {
        wx.showToast({
          title: msg
        });
      }
    }, true);
  },

  onSignUp: function(e) {
    var moduleId = e.currentTarget.dataset.id;
    var that = this;
    wx.showLoading({
      title: '报名中，请稍候！',
      mask: 'true'
    })
    request({
      url: APIS.SIGN_UP,
      header: {
        auth: wx.getStorageSync('token')
      },
      data: {
        moduleId: moduleId
      },
      method: 'POST',
      realSuccess: function (data) {
        that.setData({
          isSign: !that.data.isSign
        });
        wx.hideLoading();
      },
      realFail: function (msg) {
        wx.showToast({
          title: msg
        });
      }
    }, true);
  }
})