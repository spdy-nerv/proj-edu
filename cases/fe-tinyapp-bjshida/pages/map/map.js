var { APIS } = require('../../const.js');
var { request } = require('../../libs/request');
var Q = require('../../libs/q/q');

var app = getApp();
var theme = app.getTheme();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clrMain: theme.clrMain,
    icMapDownArrow: theme.icMapDownArrow,
    icSpotToNav: theme.icSpotToNav,

    centerLongitude: '114.362800',
    centerLatitude: '30.537800',
    selects: [true, false, false, false, false, false, false, false],
    markers: [],
    polyline: [],
    controls: [],
    isShowPath: false,
    currentType: 'entry',
    d: null,
    scrollLeft: 0,
    animationData: {},

    campusFilterOpenCls: '',
    campusPanelAnim: {},

    // 坐标点类型列表
    types: [],
    // 校区列表
    campus: [],
    selectedTypeIndex: 0,
    selectedCampusIndex: 0,

    showList: 240,
    mapHeight: 500,
    typeName: '',
    listTop: 5,
    areaImage: 'http://edu-1253427581.coscd.myqcloud.com/%E6%97%A5%E5%8E%86%E4%B8%8B%E6%8B%89.png',
    upImage: theme.icMapDown,
    myLoc: false,

    markerId: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    this.tmpIcon = {};

    // 页面初始化 options为页面跳转所带来的参数
    this.map = wx.createMapContext('map');

    this.pixelRatio = wx.getSystemInfoSync().windowWidth / 375;
    this.setData({
      showList: 240 * this.pixelRatio,
      mapHeight: 500 * this.pixelRatio,
    });

    this.getMapHeight();

    this.campusData = [];

    this.renderControls();
    this.createAnim();

    Q.all([
      this.getNavType(),
      this.getNavCampus()
    ])
    .then(function(arr) {
      console.log(arr)
      that.setData({
        types: arr[0],
        campus: arr[1]
      });
      
      that.locateToCurrentCampus();
      that.getCurrentCampusSpots();
    })
    .catch(function(e) {
      wx.showToast({
        title: e.message || '接口调用失败，请稍后重试！',
      })
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  renderControls: function() {

    var w = wx.getSystemInfoSync().windowWidth

    this.setData({
      controls: [{
        id: 0,
        iconPath: theme.icMapSearch,
        position: {
          left: w - 70 * this.pixelRatio,
          top: this.mapHeight - 197 * this.pixelRatio,
          width: 53 * this.pixelRatio,
          height: 48 * this.pixelRatio
        },
        clickable: true
      }, {
        id: 1,
        iconPath: theme.icMapMyLocation,
        position: {
          left: w - 70 * this.pixelRatio,
          top: this.mapHeight - 149 * this.pixelRatio,
          width: 53 * this.pixelRatio,
          height: 49 * this.pixelRatio
        },
        clickable: true
      }, {
        id: 2,
        iconPath: theme.icMapRecUnselected,
        position: {
          left: w - 70 * this.pixelRatio,
          top: this.mapHeight - 100 * this.pixelRatio,
          width: 53 * this.pixelRatio,
          height: 52 * this.pixelRatio
        },
        clickable: true
      }]
    });
  },

  onToggleCampusPanel: function() {
    // 关闭
    if (this.data.campusFilterOpenCls) {
      this.campusPanelAnim.height('0').step();
      this.setData({
        icMapDownArrow: theme.icMapDownArrow,
        campusFilterOpenCls: '',
        showList: this.data.showList > 0 ? this.data.showList + 75 * this.pixelRatio : 0,
        campusPanelAnim: this.campusPanelAnim.export()
      });
      this.getMapHeight();
      this.renderControls();
    // 打开
    } else {
      this.campusPanelAnim.height((150 * this.pixelRatio) + 'px').step();
      this.setData({
        icMapDownArrow: theme.icMapUpArrow,
        campusFilterOpenCls: 'campus-filter-open',
        showList: this.data.showList > 0 ? this.data.showList - 75 * this.pixelRatio : 0,
        campusPanelAnim: this.campusPanelAnim.export()
      });
      this.getMapHeight();
      this.renderControls();
    }
  },

  createAnim: function() {
    var that = this;
    this.campusPanelAnim = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease'
    });
  },

  getNavType: function() {
    var defer = Q.defer();
    request({
      url: APIS.GET_NAV_TYPE,
      method: 'GET',
      realSuccess: function (data) {
        defer.resolve(data);
      },
      realFail: function (msg, code) {
        defer.reject({
          code: code,
          message: msg
        });
      }
    }, false);

    return defer.promise;
  },

  getNavCampus: function () {
    var defer = Q.defer();
    request({
      url: APIS.GET_NAV_CAMPUS,
      method: 'GET',
      realSuccess: function (data) {
        defer.resolve(data);
      },
      realFail: function (msg, code) {
        defer.reject({
          code: code,
          message: msg
        });
      }
    }, false);

    return defer.promise;
  },

  getCurrentCampusSpots: function() {
    var currentIndex = this.data.selectedCampusIndex;
    var campusId = this.data.campus[currentIndex].id;
    var that = this;

    if (this.campusData[campusId]) {
      this.getCurrentTypeSpotsInCampus();
    } else {
      request({
        url: APIS.GET_NAV_SPOT_LIST,
        method: 'GET',
        data: {
          campusId: campusId
        },
        realSuccess: function (data) {
          that.campusData[campusId] = data;
          that.getCurrentTypeSpotsInCampus();
        },
        realFail: function (msg, code) {
          wx.showToast({
            title: msg
          });
        }
      }, false);
    }
  },

  getCurrentTypeSpotsInCampus: function() {
    var campusIndex = this.data.selectedCampusIndex;
    var campusId = this.data.campus[campusIndex].id
    var typeIndex = this.data.selectedTypeIndex;
    var typeId = this.data.types[typeIndex].id;
    var markImg = this.data.types[typeIndex].markImg;
    var campusData = this.campusData[campusId];
    var filteredSpots = [];
    var that = this;
    for (var i = 0, j = campusData.length; i < j; i++) {
      if (campusData[i].typeId == typeId) {
        filteredSpots = campusData[i].spots;
        break;
      }
    }

    // 未下载
    if (!this.tmpIcon[typeId]) {
      wx.downloadFile({
        url:markImg||'',
        success: function(res) {
          that.tmpIcon[typeId] = res.tempFilePath;
          that.setMarkersByIcon(filteredSpots, that.tmpIcon[typeId]);
        },
        fail: function(res) {
          wx.showModal({
            title: '',
            content: res.errMsg,
          })
        }
      })
    // 已下载
    } else {
      this.setMarkersByIcon(filteredSpots, this.tmpIcon[typeId]);
    }
  },

  setMarkersByIcon: function(spots, icon) {
    var w = wx.getSystemInfoSync().windowWidth;
    var retMarkers = spots.map(function (m, i) {
      m.longitude = +m.longitude;
      m.latitude = +m.latitude;
      m.width = w * 0.13;
      m.height = w * 0.13;
      m.iconPath = icon;
      m.id = m.id;
      return m;
    });

    this.setData({
      markers: retMarkers
    });
  },

  locateToCurrentCampus: function() {
    var currentIndex = this.data.selectedCampusIndex;
    var campus = this.data.campus[currentIndex];

    this.setData({
      centerLongitude: campus.longitude,
      centerLatitude: campus.latitude,
    });
  },

  onSelectType: function(e) {
    var index = e.currentTarget.dataset.index;
    var typeId = e.currentTarget.dataset.id;

    this.setData({
      selectedTypeIndex: index
    });
    this.getCurrentTypeSpotsInCampus();
    this.locateToCurrentCampus();
  },

  onSelectCampus: function(e) {
    var index = e.currentTarget.dataset.index;
    var typeId = e.currentTarget.dataset.id;

    this.setData({
      selectedCampusIndex: index
    });
    this.getCurrentCampusSpots();
    this.locateToCurrentCampus();

    /*
    if (this.data.showList > 0) {
      this.showList();
    }
    */
    this.onToggleCampusPanel();
  },

  onControlTap: function(e) {
    let controlId = e.controlId;
    // 搜索？？
    if (controlId == 0) {
      wx.navigateTo({
        url: '../search/search?cid=' + this.data.campus[this.data.selectedCampusIndex].id,
      })
      // 定位当前位置 
    } else if (controlId == 1) {
      this.map.moveToLocation();

      // toggle线路
    } else if (controlId == 2) {
      //this.togglePolyline();
      wx.showToast({
        title: '暂无推荐线路',
      })
    }
  },

  onGotoDetail: function(e) {
    wx.navigateTo({
      url: '../spot/spot?id=' + e.currentTarget.dataset.id
    });
  },

  onMarkerTap: function(e) {
    var markerId = e.markerId;
    this.setData({
      selectedItemId: markerId
    });
    if (this.data.showList <= 0) {
      this.showList();
    }
  },

  showList: function () {
    if (this.data.showList > 0) {
      this.setData({
        showList: 0,
        upImage: theme.icMapUp
      });
    } else {
      let count = this.data.markers.length;
      if (count > 3) count = 3;
      var h1 = 160 * this.pixelRatio * count;
      this.setData({
        showList: this.data.campusFilterOpenCls ? 165 * this.pixelRatio : 240 * this.pixelRatio,
        upImage: theme.icMapDown
      });
    }
    this.getMapHeight();
    this.renderControls();
    /*
    let ctls = this.data.controls;
    let mapHeight = this.data.mapHeight;
    let wWidth = wx.getSystemInfoSync().windowWidth;
    var h = mapHeight * wWidth / 750
    var p = 5;
    var b = 10;
    ctls[0].position.top = h - ctls[0].position.height - b;
    ctls[1].position.top = h - ctls[1].position.height * 3 - 5 * p - b;
    ctls[2].position.top = h - ctls[2].position.height * 2 - 3 * p - b - 1;
    this.setData({
      controls: ctls
    });
    */
  },

  getMapHeight: function() {
    var wHeight = wx.getSystemInfoSync().windowHeight;
    console.log(wx.getSystemInfoSync());
    this.mapHeight = wHeight - 93 * this.pixelRatio;
    if (this.data.campusFilterOpenCls) {
      this.mapHeight -= 150 * this.pixelRatio;
    }
    if (this.data.showList >0 ) {
      this.mapHeight -= this.data.showList;
    }
    this.setData({
      mapHeight: this.mapHeight
    });
  },

  onShareAppMessage: function () {}
})