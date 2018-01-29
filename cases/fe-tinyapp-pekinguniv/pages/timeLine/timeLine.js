//index.js

var { monthFormatList, dayFormatList, APIS } = require('../../const');
var util = require('../../utils/util');
var user = require('../../libs/user');
var { request } = require('../../libs/request');

//获取应用实例
var app = getApp();

Page({
  data: {
    footerConfig: {
      pageEvent: true
    },
    year: 0,
    month: 0,
    start: 0,
    limit: 30,
    formatedMonth: '',
    fromShare: 0,
    date: 0,
    todayDate: 0,
    events: [],
    events1: [],
    eventDays: [],
    isShowSimpleCal: 'none',
    time: '',
    section: [true, false, false, false],
    onBindScroll: '',
    toggleCalBundary: 0,
    calendar: [],
    scrollIntoViewId: '',
    screenWidth: 0,
    scrollLeft: 0,
    currentPage: 0,
    currentPageLength: 0,
    totalPages: 0,
    totalResults: 0,
    pageSize: 0,
    verticalScrollAnim: false,
    filterMaskAnim: {},
    filterPanelAnim: {},
    filterMaskDisplay: 'none',
    eventTypeList: [
      { typeId: '', typeName: '全部' }
    ],
    eventTypeIndex: 0,
    publisherTypeList: [
      { roleId: '', roleName: '全部' }
    ],
    publisherTypeIndex: 0,
    listPaddingBottom: 10,
    startTime: 0,
    hasMoreData: true,
    jobsList: [],
    practiceStart: 0,
    practiceLimit: 30,
    practiceHasMore: true,
    practiceList: [],
    seminarStart: 0,
    seminarLimit: 99
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function (options) {
    //user.login();
    wx.showLoading({
      mask: true,
      title: '数据加载中'
    });
    this.setData({
      fromShare: options.fromShare || 0,

    });
    // 处理兼容性
    var sysInfo = wx.getSystemInfoSync();
    if (sysInfo.system.toUpperCase().indexOf('IOS') != -1) {
      this.setData({
        listPaddingBottom: 110
      });
    }
  },

  onShow: function () {
    user.login(this.renderUI, this, true);
  },

  renderUI: function () {
    this.setData({
      screenWidth: wx.getSystemInfoSync().screenWidth
    });
    this.getCurrentDate();
    this.getEventList1();
    this.getEventList();
    this.getJobsList();
    this.getPracticeList();
    //this.getFilterTypes();
    //this.createAnim();
  },
  //公告列表
  getEventList1: function () {
    var that = this;
    var et = this.data.eventTypeList;
    var ei = this.data.eventTypeIndex;
    var pt = this.data.publisherTypeList;
    var pi = this.data.publisherTypeIndex;
    wx.request({
      url: APIS.GET_NEW_GONGGAOLIST,
      data: {
        category: 13,
      },
      success: function (data) {
        wx.hideLoading();
        console.log(data);
        console.log(data.data.results);
        var list1 = data.data.results
        that.setData({
          events1: list1,
        });

        wx.hideLoading();
        if (list1.length == 0) {
          wx.showToast({
            title: '当前月份没有公告！'
          });
        }

      },
      loginCallback: this.getEventList1,
      realFail: function (msg) {
        wx.hideLoading();
        wx.showToast({
          title: msg
        });
      }
    });

  },
  //宣讲会
  getEventList: function () {
    var that = this;
    var et = this.data.eventTypeList;
    var ei = this.data.eventTypeIndex;
    var pt = this.data.publisherTypeList;
    var pi = this.data.publisherTypeIndex;
    wx.request({
      url: APIS.GET_NEW_EVENTLIST,
      data: {
        start: that.data.seminarStart,
        limit: that.data.seminarLimit,
        wechatOpenId: wx.getStorageSync('openId'),
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        var eventsItem = that.data.events;
        console.log(res.data);
        var list = res.data.results;
        var events = list;
        console.log(list);
        that.setData({
          events: list,
        });

        console.log(eventsItem)
        var time = null;
        list = list.map(function (e, i) {
          e.time = e.startTime.substring(11);
          e.year = e.startTime.substring(0, 10);
          e.day = e.startTime.substring(8, 10)
          return e
        });
        console.log(list)


        wx.hideLoading();
        that.renderCalendar();

      }
    })

    /*
        var events = require('../../mocks/getEventList');
        var list = events.list;
        setTimeout(function() {
          list = list.map(function(e, i) {
            e.dayName = dayFormatList[e.day].chi;
            if (i == 0 || e.date != list[i-1].date) {
              e.isFirstEventInDay = true;
            }
            return e;
          });
          that.setData({
            events: list,
            eventDays: events.eventDays
          });
          wx.hideLoading();
          that.renderCalendar();
        }, 1000);
        */
  },

  getFilterTypes: function () {
    var that = this;
    request({
      url: APIS.GET_EVENT_TYPE_LIST,
      method: 'GET',
      realSuccess: function (data) {
        var list = data.list;
        that.setData({
          eventTypeList: [{ typeId: '', typeName: '全部' }].concat(list)
        });
      }
    }, false);
    request({
      url: APIS.GET_ROLE_LIST,
      method: 'GET',
      realSuccess: function (data) {
        var list = data.list;
        that.setData({
          publisherTypeList: [{ roleId: '', roleName: '全部' }].concat(list)
        });
      }
    }, false);
  },

  getCurrentDate: function () {
    var today = new Date();
    this.setData({
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      formatedMonth: monthFormatList[today.getMonth()].arabic + '月',
      date: today.getDate(),
      todayDate: today.getDate()
    });
  },

  renderCalendar: function () {
    var cal = util.getCalByDate(
      this.data.year,
      this.data.month,
      this.data.date
    );

    var that = this;
    var currentOffset = 0;
    cal[cal.length - 14].initPos = 'initPos';
    cal = cal.map(function (d, i) {
      d.offsetLeft = that.data.screenWidth / 7 * i;
      if (d.mode == 'current' && d.date == that.data.date) {
        // 当前周的第一天滚动到最左边
        currentOffset = cal[i - (i % 7)].offsetLeft;
      }
      // 判断该日期下是否有事件
      if (d.mode == 'current') {
        if (util.inArray(d.date, that.data.eventDays)) {
          d.hasEvents = true;
        }
      }
      return d;
    });

    this.setData({
      calendar: cal,
      //isShowSimpleCal: 'block',
      verticalScrollAnim: false
    });
    setTimeout(function () {
      that.setData({
        //scrollLeft: currentOffset,
        scrollIntoViewId: 'initPos',
        onBindScroll: 'onInitScroll'
      });
    }, 0);
    setTimeout(function () {
      that.setData({
        scrollLeft: currentOffset
      });
    }, 2000);

  },

  // 通过这里获取垂直scroll的初始偏移量，用于后续水平scroll的显示toggle处理
  onInitScroll: function (e) {
    var that = this;
    console.log(e.detail.scrollTop)
    this.setData({
      toggleCalBundary: e.detail.scrollTop,
      onBindScroll: 'onBindScroll',
      verticalScrollAnim: true,
      isShowSimpleCal: 'block'
    });
    setTimeout(function () {
      that.setData({
        scrollIntoViewId: 'anchor' + that.data.date
      });
    }, 0);
  },

  onBindScroll: function (e) {
    console.log("滚动了", this.data.isShowSimpleCal, e);
    if (e.detail.scrollTop < this.data.toggleCalBundary) {
      this.setData({
        isShowSimpleCal: 'none'
      });
    } else {
      this.setData({
        isShowSimpleCal: 'block'
      });
    }

  },

  // onHitTop: function () {
  //   this.setData({
  //     isShowSimpleCal: 'none'
  //   });
  // },
  onHitDown: function () {
    var that = this;
    console.log('已经到底了，没有数据了');
    // if(that.data.hasMore){
    //   wx.showLoading({title:'数据加载中'});
    //   that.getEventList();
    // }else{
    //   wx.showToast({title:'没有更多数据了'})
    // }
    //this.setData({start:16,limit:15})
  },

  // 通过日期选择器修改日期
  bindDateChange: function (e) {
    var dateArr = e.detail.value.split('-');
    this.setData({
      year: +dateArr[0],
      month: +dateArr[1],
      date: +dateArr[2],
      formatedMonth: monthFormatList[+dateArr[1] - 1].arabic + '月'
    });

    this.getEventList();
    this.getEventList1();
    //this.renderCalendar();
  },

  // 点击日历修改日期
  onSelectDate: function (e) {
    console.log('执行了点击事件', e);
    var date = e.target.dataset.date;
    if (!util.inArray(date, this.data.eventDays)) {
      wx.showToast({
        title: '该日期没有事件！'
      });
    } else {
      var offset = 0;
      var that = this;
      this.data.calendar.forEach(function (d, i) {
        if (d.mode == 'current' && d.date == date) {
          offset = that.data.calendar[i - (i % 7)].offsetLeft;
          return false;
        }
      });
      this.setData({
        //scrollLeft: offset,
        scrollIntoViewId: 'anchor' + date,
        date: date
      });
      setTimeout(function () {
        that.setData({
          scrollLeft: offset
        });
      }, 500);
    }
  },

  createAnim: function () {
    var that = this;
    this.filterMaskAnim = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease'
    });
    this.filterPanelAnim = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease'
    })
  },

  // 点击更多筛选条件
  onTapFilterMore: function () {
    this.setData({
      filterMaskDisplay: 'block'
    });
    this.filterMaskAnim.opacity(0.5).step();
    this.filterPanelAnim.right(0).step();
    this.setData({
      filterMaskAnim: this.filterMaskAnim.export(),
      filterPanelAnim: this.filterPanelAnim.export()
    });
  },

  // 关闭更多筛选面板
  onCloseFilterPanel: function () {
    var that = this;
    this.filterMaskAnim.opacity(0).step();
    this.filterPanelAnim.right('-80%').step();
    this.setData({
      filterMaskAnim: this.filterMaskAnim.export(),
      filterPanelAnim: this.filterPanelAnim.export()
    });
    setTimeout(function () {
      that.setData({
        filterMaskDisplay: 'none'
      });
    }, 400);
  },

  onChangeEventType: function (e) {
    this.setData({
      eventTypeIndex: +e.detail.value
    });
  },

  onChangePublisherType: function (e) {
    this.setData({
      publisherTypeIndex: +e.detail.value
    });
  },

  onSubmitFilterMore: function () {
    this.getEventList1();
    this.getEventList();
    this.onCloseFilterPanel();
  },

  onResetFilterMore: function () {
    this.setData({
      eventTypeIndex: 0,
      publisherTypeIndex: 0
    });
  },
  changeL: function (e) {
    var index = e.currentTarget.dataset.id;
    console.log(index);
    //console.log(this.data.section)
    let newSelects = [];
    for (let i = 0, j = this.data.section.length; i < j; i++) {
      let flag = false;
      if (i == index) flag = true;
      newSelects.push(flag);
    }
    this.setData({
      section: newSelects,
    });
    if (index == 0 && this.data.events1.length == 0) {
      wx.showToast({
        title: '当前没有公告！'
      });
    } else if (index == 1 && this.data.events.length == 0) {
      wx.showToast({
        title: '当前没有事件！'
      });
    }

  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      desc: '分享给大家看看吧', // 分享描述
      path: '/pages/timeLine/timeLine'
    }
  },
  //招聘
  getJobsList() {
    wx.showLoading({
      title: '数据加载中',
    })
    wx.request({
      url: APIS.GET_JOBS_LIST,
      method: 'GET',
      data: {
        start: this.data.start,
        limit: this.data.limit,
        wechatOpenId: wx.getStorageSync('openId'),
        category: 1
      },
      success: (res) => {
        console.log(res);
        var jobList = this.data.jobsList;
        if (res.data.results.length < this.data.limit) {
          this.setData({
            jobsList: jobList.concat(res.data.results),
            hasMore: false
          })
        } else {
          this.setData({
            jobsList: jobList.concat(res.data.results),
            hasMore: true,
            start: this.data.start + 30
          })
        }

        wx.hideLoading();
      }, fail: (res) => {
        console.log('失败' + res);
      }
    })
  }
  //实习
  , getPracticeList() {
    wx.showLoading({
      title: '数据加载中',
    })
    wx.request({
      url: APIS.GET_JOBS_LIST,
      method: 'GET',
      data: {
        start: this.data.practiceStart,
        limit: this.data.practiceLimit,
        wechatOpenId: wx.getStorageSync('openId'),
        category: 2
      },
      success: (res) => {
        console.log(res);
        var practiceList = this.data.practiceList;
        if (res.data.results.length < this.data.practiceLimit) {
          this.setData({
            practiceList: practiceList.concat(res.data.results),
            practiceHasMore: false
          })
        } else {
          this.setData({
            practiceList: practiceList.concat(res.data.results),
            practiceHasMore: true,
            practiceStart: this.data.practiceStart + 30
          })
        }
        wx.hideLoading();
      }, fail: (res) => {
        console.log('失败' + res);
      }
    })
  },
  //招聘
  landMore() {
    console.log('加载更多')
    if (this.data.hasMoreData) {
      this.getJobsList()
    } else {
      wx.showToast({
        title: '没有更多数据',
      })
    }
  },
  //实习
  practiceLandMore() {
    console.log('加载更多')
    if (this.data.practiceHasMore) {
      this.getPracticeList()
    } else {
      wx.showToast({
        title: '没有更多数据',
      })
    }
  }
})
