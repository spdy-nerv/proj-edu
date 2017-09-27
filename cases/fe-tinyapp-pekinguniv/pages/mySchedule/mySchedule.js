//var app = getApp() 
//Page( { 
// data: { 
//toastHidden: true, 
//city_name: '', 
// }, 
// onLoad: function() { 
//wx.request( { 
// url: 'http://47.94.133.195/wechat-student-calendar!loadCaledarEvent',
//    data: {
//      yearMonth:'2017-09',
//      wechatOpenId: wx.getStorageSync('openId'),
//    },
// header: { 
//  "Content-Type": "application/x-www-form-urlencoded"
// }, 
// method: "POST", 
// complete: function( res ) { 
//console.log(res)
// } 
//}) 
// }
//})
//index.js
import DataService from  '../../datas/DataService';
import {promiseHandle, log, formatNumber} from '../../utils/utils';
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
     data: {},
    year: 0,
    month: 0,
    formatedMonth: '',
    fromShare: 0,
    date: 0,
    todayDate: 0,
    events: [],
    events1: [],
    eventDays: [],
    	getlist:[1,2],
    isShowSimpleCal: 'none',
    time:'',
    section:[true,false],
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
      { typeId: '', typeName: '全部' }
    ],
    eventTypeIndex: 0,
    publisherTypeList: [
      { roleId: '', roleName: '全部' }
    ],
    publisherTypeIndex: 0,
    listPaddingBottom: 100,
    startTime:0,
    Arr:["投","笔","面","宣","双","其"],
    arr:["tou","bi","mian","xuan","shuang","qi"]
  },
  

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    wx.showLoading({
      mask: true,
      title: '数据加载中'
    });
 changeDate.call(this);
    this.setData({
       fromShare: options.fromShare || 0,
      
    });
    // 处理兼容性
    var sysInfo = wx.getSystemInfoSync();
    if (sysInfo.system.toUpperCase().indexOf('IOS') != -1) {
      this.setData({
        listPaddingBottom: 250
      });
    };
    this.changeL();
    var that=this;
    var params = {
  		sid: wx.getStorageSync('sid'),
  		size: 10,   
	    offset: that.data.offset,
  	};
  	 request({
      url: APIS.MY_FOLLOWS,
      data: params,
      method: 'POST',
      realSuccess: function(data){
      	console.log("我的关注asdf",data);
      	var resList=data.list;
      	for (var i=0;i<resList.length;i++) {     		
      		that.setData({
	      		list:that.data.getlist.concat(resList[i].eventId),
	      	});
      	}
      	console.log(that.data.getlist.indexOf(1))
      	
      }
     })
  },
  

  onShow: function () {
    user.login(this.renderUI, this, true);
  },
  
   //添加日程
  toCalendars: function(e){
  		wx.navigateTo({
			  url: '../myCalend/myCalend'
			});
  },
// //修改日程
//editClick: function(e){
//	wx.showLoading();
//	 var id = e.currentTarget.dataset.editid;
//	 
//			setTimeout(function(){
//			      wx.navigateTo({
//			  url: '../myEdit/myEdit?id='+id
//			});
//			},1000);
//		
//}, 
  renderUI: function () {
    this.setData({
      screenWidth: wx.getSystemInfoSync().screenWidth
    });
    this.getCurrentDate();
    this.getEventList1();
    this.getEventList();
    this.getFilterTypes();
    this.createAnim();
  },
  getEventList1: function () {
    var that = this;
    var et = this.data.eventTypeList;
    var ei = this.data.eventTypeIndex;
    var pt = this.data.publisherTypeList;
    var pi = this.data.publisherTypeIndex;
     request({
       url: APIS.GET_EVENT_NOU,
      data: {
         offset: 0,
        size: 9999,
        year: this.data.year,
        month: this.data.month,
        eventType: et[ei].typeId,
        publisherType: pt[pi].roleId,
         sid: wx.getStorageSync('sid')
      },
      method: 'POST',
      realSuccess: function (data) {
        var list1= data.list;
        console.log(list1)
        
        list1 = list1.map(function (e, i) {
          e.createTime = e.createTime.split(' ')[0];
          return e;
        });

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
    }, true, this);
   
  },
  getEventList: function () {
    var that = this;
    var et = this.data.eventTypeList;
    var ei = this.data.eventTypeIndex;
    var pt = this.data.publisherTypeList;
    var pi = this.data.publisherTypeIndex;
    if(this.data.month<10){
    	var yearMonth = this.data.year+'-0'+this.data.month;
    }else{
    	 var yearMonth = this.data.year+'-'+this.data.month;
    };
    wx.request({
      url: APIS.MY_SCHEDULE,
      data: {
        yearMonth:yearMonth,
        wechatOpenId: wx.getStorageSync('openId'),
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        
        var list = res.data.data.results;
        for(var i=0;i<list.length;i++){
        	console.log(that.data.getlist.indexOf(list[i].id))
        	if(that.data.getlist.indexOf(list[i].id)==-1){
        		list[i].isshow=false
        	}else{
        		list[i].isshow=true
        	}
        }
        console.log(list)
        if(list.length>0){
        	  //that.setData({events:list});
	        var time = list[0].startTime.substring(11,16);
	         list = list.map(function(e,i){
	          e.time=e.startTime.substring(11);
	          e.year = e.startTime.substring(0,10)
	          return e
	        });
	        console.log(list)
	        that.setData({
	          events: list,
	          time:time,
	          istrue:true,
	          
	        });
	        
	        wx.hideLoading();
	        console.log(yearMonth)
        }else{
        	that.setData({
	         istrue:false,  
	        });
        }
      
//         wx.request({ 
//         	
// url: 'http://47.94.133.195/wechat-student-calendar!loadCaledarEvent',
//    data: {
//      yearMonth:yearMonth,
//      wechatOpenId: wx.getStorageSync('openId'),
//    },
// header: { 
//  "Content-Type": "application/x-www-form-urlencoded"
// }, 
// method: "POST", 
// complete: function( res ) { 
//console.log(res)
// } 
//}) ;
         that.renderCalendar();

      }
   })
  },
  attention:function(e){
  	console.log(e)
  	var params = {
  		sid: wx.getStorageSync('sid'),
  		size: 10,   
	    offset: that.data.offset,
  	};
  	var id=e.dataset.all.id;
	 wx.request({
     url: APIS.MY_FOLLOWS,
      data: params,
	    header: {'content-type': 'application/x-www-form-urlencoded'},  
	       method: "POST",
      success: function(res) {  
        console.log(res.data)   
      }  
    })  
},
//删除日程
 deleteClick:function(event){
 
  var id = event.currentTarget.dataset.deleteid;
 
  wx.request({
 
   url:  APIS.MY_DELSCHEDULE,
 
   data: {
   	id:id,
   },
 
   success: function(res){
   	wx.redirectTo({
   	 url:'mySchedule',  
	    complete:function(res){  
	        console.log(res)  
	    }  
   	})
 console.log(res)
//  if(res.data.status == 0){
// 
//   wx.showToast({
// 
//    title: res.data.info,
// 
//    icon: 'loading',
// 
//    duration: 1500
// 
//   })
// 
//  }else{
// 
//   wx.showToast({
// 
//    title: res.data.info,
// 
//    icon: 'success',
// 
//    duration: 1000
// 
//   })
// 
//   //删除之后应该有一个刷新页面的效果，等和其他页面刷新跳转一起做
// 
//  }
// 
   },
 
   fail:function(){
 
       wx.showToast({
 
        title: '服务器网络错误!',
 
        icon: 'loading',
 
        duration: 1500
 
       })
 
      }
 
  })
 
 } ,
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
 changeDateEvent(e) {
    const {year, month} = e.currentTarget.dataset;
    changeDate.call(this, new Date(year, parseInt(month) - 1, 1));
   
    this.setData({
    	month:month,
    	year:year
    });
     this.getEventList();
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
  	console.log("滚动了",this.data.isShowSimpleCal,e);
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

  onHitTop: function () {
    this.setData({
      isShowSimpleCal: 'none'
    });
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
  	console.log('执行了点击事件',e);
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
  changeL:function(){
    var index=1;
   let newSelects = [];
   for (let i = 0, j = this.data.section.length; i < j; i++) {
     let flag = false;
     if (i == index) flag = true;
     newSelects.push(flag);
   }
   this.setData({
     section: newSelects,
    });
   if (index == 0 && this.data.events1.length==0){
     wx.showToast({
       title: '当前月份没有公告！'
     });
   } else if (index == 1 && this.data.events.length == 0){
     wx.showToast({
       title: '当前月份没有活动事件！'
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
});

/**
 * 加载事项列表数据
 */
function loadItemListData() {
  const {year, month, date} = this.data.data.selected;
  let _this = this;
  DataService.findByDate(new Date(Date.parse([year, month, date].join('-')))).then((data) => {
    _this.setData({ itemList: data });
  });

}


/**
 * 变更日期数据
 * @param {Date} targetDate 当前日期对象
 */
function changeDate(targetDate) {
  let date = targetDate || new Date();
  let currentDateObj = new Date();

  let month, //当天显示月份
    year, //当前显示年份
    showDay, //当前显示星期
    showDate, //当前显示第几天
    showMonthFirstDateDay, //当前显示月份第一天的星期
    showMonthLastDateDay, //当前显示月份最后一天的星期
    showMonthDateCount; //当前月份的总天数

  let data = [];

  showDate = date.getDate();
  month = date.getMonth() + 1;
  year = date.getFullYear();
  showDay = date.getDay();

  showMonthDateCount = new Date(year, month, 0).getDate();
  date.setDate(1);
  showMonthFirstDateDay = date.getDay()+1; //当前显示月份第一天的星期
  date.setDate(showMonthDateCount);
  showMonthLastDateDay = date.getDay()+1; //当前显示月份最后一天的星期  

  let beforeDayCount = 0,
    beforeYear, //上页月年份
    beforMonth, //上页月份
    afterYear, //下页年份
    afterMonth, //下页月份
    afterDayCount = 0, //上页显示天数
    beforeMonthDayCount = 0; //上页月份总天数

  //上一个月月份
  beforMonth = month === 1 ? 12 : month - 1;
  //上一个月年份
  beforeYear = month === 1 ? year - 1 : year;
  //下个月月份
  afterMonth = month === 12 ? 1 : month + 1;
  //下个月年份
  afterYear = month === 12 ? year + 1 : year;

  //获取上一页的显示天数
  if (showMonthFirstDateDay != 0)
    beforeDayCount = showMonthFirstDateDay - 1;
  else
    beforeDayCount = 6;

  //获取下页的显示天数
  if (showMonthLastDateDay != 0)
    afterDayCount = 7 - showMonthLastDateDay;
  else
    showMonthLastDateDay = 0;

  //如果天数不够6行，则补充完整
  let tDay = showMonthDateCount + beforeDayCount + afterDayCount;
  if (tDay <= 35)
    afterDayCount += (42 - tDay); //6行7列 = 42

  let selected = this.data.data['selected'] || { year: year, month: month, date: Date };
  let selectDateText = selected.year + '年' + formatNumber(selected.month) + '月' + formatNumber(selected.date) + '日';

  data = {
    currentDate: currentDateObj.getDate(), //当天日期第几天
    currentYear: currentDateObj.getFullYear(), //当天年份
    currentDay: currentDateObj.getDay(), //当天星期
    currentMonth: currentDateObj.getMonth() + 1, //当天月份
    month: month, //当前显示月份
    Date: Date, //当前显示月份的第几天 
    year: year, //当前显示月份的年份
    beforeYear: beforeYear, //当前页上一页的年份
    beforMonth: beforMonth, //当前页上一页的月份
    afterYear: afterYear, //当前页下一页的年份
    afterMonth: afterMonth, //当前页下一页的月份
    selected: selected,
    selectDateText: selectDateText
  };

  let dates = [];
  let _id = 0; //为wx:key指定

  if (beforeDayCount > 0) {
    beforeMonthDayCount = new Date(beforeYear, beforMonth, 0).getDate();
    for (let fIdx = 0; fIdx < beforeDayCount; fIdx++) {
      dates.unshift({
        _id: _id,
        year: beforeYear,
        month: beforMonth,
        date: beforeMonthDayCount - fIdx
      });
      _id++;
    }
  }

  for (let cIdx = 1; cIdx <= showMonthDateCount; cIdx++) {
    dates.push({
      _id: _id,
      active: (selected['year'] == year && selected['month'] == month && selected['date'] == cIdx), //选中状态判断
      year: year,
      month: month,
      date: cIdx
    });
    _id++;
  }

  if (afterDayCount > 0) {
    for (let lIdx = 1; lIdx <= afterDayCount; lIdx++) {
      dates.push({
        _id: _id,
        year: afterYear,
        month: afterMonth,
        date: lIdx
      });
      _id++;
    }
  }

  data.dates = dates;


  this.setData({ data: data, pickerDateValue: year + '-' + month });
  loadItemListData.call(this);
}

