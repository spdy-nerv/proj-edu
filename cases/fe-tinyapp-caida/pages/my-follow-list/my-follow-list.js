//index.js

var { monthFormatList, dayFormatList, APIS } = require('../../const');

var util = require('../../utils/util');
var user = require('../../libs/user');
var { request } = require('../../libs/request');

var app = getApp();
var theme = app.getTheme();

//获取应用实例
var app = getApp();

Page({
  data: {

    clrMain: theme.clrMain,

    footerData: {
      actListSelectedCls: 'act-list-selected'
    },
    year: 0,
    month: 0,
    formatedMonth: '',
    date: 0,
    todayDate: 0,
    events: [],
    eventDays: [],
    isShowSimpleCal: 'none',
    onBindScroll: '',
    toggleCalBundary: 0,
    calendar: [],
    scrollIntoViewId: '',
    screenWidth: 0,
    scrollLeft: 0,
    verticalScrollAnim: false,
    filterMaskAnim: {},
    filterPanelAnim: {},
    filterMaskDisplay: 'none',
    eventTypeList: [
      { id: '', typeName: '全部' }
    ],
    eventTypeIndex: 0,
    publisherTypeList: [
      { roleId: '', roleName: '全部' }
    ],
    publisherTypeIndex: 0,
    listPaddingBottom: 0,
    filterOpenCls: '',
    filterMoreToggle: 'onTapFilterMore',
    isFilterOpen: false

  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function () {
    wx.showLoading({
      mask: true,
      title: '数据加载中'
    });

    // 处理兼容性
    /*
    var sysInfo = wx.getSystemInfoSync();
    if (sysInfo.system.toUpperCase().indexOf('IOS') != -1) {
      this.setData({
        listPaddingBottom: 150
      });
    } 
    */
    user.login(this.renderUI, this, true);
  },

  onShow: function () {
  },

  renderUI: function () {
    this.setData({
      screenWidth: wx.getSystemInfoSync().screenWidth
    });
    this.getCurrentDate();
    this.getEventList();
  },

  getEventList: function () {
    var that = this;
    var et = this.data.eventTypeList;
    var ei = this.data.eventTypeIndex;
    request({
      url: APIS.GET_MY_FOLLOW_LIST,
      header: {
        auth: wx.getStorageSync('token')
      },
      data: {
        pageNo: 0,
        pageSize: 9999
      },
      method: 'POST',
      realSuccess: function (data) {
        var list = data.list;
        list = list.map(function (e, i) {
          e.dayName = dayFormatList[e.day].chi;
          if (i == 0 || e.date != list[i - 1].date) {
            e.isFirstEventInDay = true;
          }
          return e;
        });
        that.setData({
          events: list,
          eventDays: data.eventDays
        });
        wx.hideLoading();
        /*
        if (list.length == 0) {
          wx.showToast({
            title: '当前月份没有事件！'
          });
        }
        */
        //that.renderCalendar();
      },
      loginCallback: this.getEventList,
      realFail: function (msg) {
        wx.hideLoading();
        wx.showToast({
          title: msg
        });
      }
    }, true, this);
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
  }
})
