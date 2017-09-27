// pages/map/map.js
// var markersData = require('../../data/markers');
// var polylineData = require('../../data/polyline');
Page({
  data: {
    centerLongitude: '116.365880',
    centerLatitude: '39.961680',
    selects: [true, false, false ,false ,false, false, false, false],
    markers: [],
    polyline: [],
    controls: [],
    isShowPath: false,
    currentType: 'entry',
    d: null,
    scrollLeft: 0,
    animationData: {}
  },
  regionchange(e) {
    console.log(e.type)
  },
  onLoad:function(options){

    this.pathMarker = {
      "latitude": 39.961680,
      "longitude": 116.365880,
      iconPath: '/resources/pathMarker.png',
      width: 75,
      height: 30
    }

    // 加载数据
    this.setData({
      d: wx.getStorageSync('data')
    });

    // 页面初始化 options为页面跳转所带来的参数
    this.map = wx.createMapContext('map');

    var wHeight = wx.getSystemInfoSync().windowHeight;
    var mapHeight = wHeight - 70;

    this.setData({
      controls: [{
        id: 0,
        iconPath: '/resources/yinghuaLoc.png',
        position: {
          left: 10,
          top: mapHeight - 160,
          width: 50,
          height: 50
        },
        clickable: true
      },{
        id: 1,
        iconPath: '/resources/pathLoc.png',
        position: {
          left: 10,
          top: mapHeight - 105,
          width: 50,
          height: 50
        },
        clickable: true
      },{
        id: 2,
        iconPath: '/resources/myLoc.png',
        position: {
          left: 10,
          top: mapHeight - 50,
          width: 50,
          height: 50
        },
        clickable: true
      }]
    });

    this.showMarkers('entry');
    this.togglePolyline();
    
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    this.animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  onControlTap(e) {
    let controlId = e.controlId;
    // 定位景点
    if (controlId == 0) {
      if (this.data.centerLongitude == '114.362800') {
        this.setData({
          centerLongitude: '116.365880',
          centerLatitude: '39.961680',
        });
      } else {
        this.setData({
          centerLongitude: '116.365880',
          centerLatitude: '39.961680',
        });
      }
      this.showMarkers('yinghua');
      this.setData({
        scrollLeft: 120
      });
      this.changeFilterHighlight(1, 36, 120);
    
    // toggle线路
    } else if (controlId == 1) {
      this.togglePolyline();

    // 定位当前位置  
    } else if (controlId == 2) {
      this.map.moveToLocation();  
    }
  },
  // 定位到武汉大学，同时根据过滤条件筛选坐标
  onFilterTap(event) {
    let filterType = event.target.dataset.type;
    let filterIndex = event.target.dataset.index;
    let w = +event.target.dataset.w;
    let l = +event.target.dataset.l;

    if (this.data.currentType == filterType) return;
 
    this.showMarkers(filterType);
    this.setData({
      scrollLeft: l
    });
    this.changeFilterHighlight(filterIndex, w, l);
  },

  // 显示服务点坐标
  showMarkers(type) {
    let markers = this.data.d.markers[type];
    let retMarkers = markers.map(function(m, i) {
      m.longitude = +m.longitude;
      m.latitude = +m.latitude;
      m.width = 30;
      m.height = 30;
      m.iconPath = '/resources/' + type + 'Marker.png';
      m.id = i;
      return m;
    });

    if (this.data.isShowPath) {
      retMarkers.push(this.pathMarker);
    }

    this.setData({
      markers: retMarkers,
      currentType: type
    });
  },

  // 改变筛选条件高亮
  changeFilterHighlight(index, w, l) {
    let newSelects = [];
    for (let i = 0, j = this.data.selects.length; i < j; i++) {
      let flag = false;
      if (i == index) flag = true;
      newSelects.push(flag);  
    }

    this.animation.width(w).left(l).step();

    this.setData({
      selects: newSelects,
      animationData: this.animation.export()
    });  
  },
  onMarkerTap(e) {
    // 暂定只有樱花景点可以打开详情
    if (this.data.currentType == 'check' || this.data.currentType == 'bike') return;
    wx.navigateTo({
          url: '../site/site?type=' + this.data.currentType + '&id=' + e.markerId
    });
  },
  togglePolyline() {
    let ctl = this.data.controls;
    let markers = this.data.markers;
      if (this.data.isShowPath) {
        ctl[1].iconPath = '/resources/pathLoc.png';
        this.setData({
          polyline: [],
          controls: ctl,
          markers: markers.slice(0, markers.length - 1)
        });
      } else {
        ctl[1].iconPath = '/resources/pathLocHl.png';
        markers.push(this.pathMarker);
        this.setData({
          polyline: this.data.d.polyline,
          controls: ctl,
          markers: markers
        });
      }
      this.setData({
        isShowPath: !this.data.isShowPath
      });
  },
  onShareAppMessage: function () {
    return {
      title: "2017武大樱花季－服务导览",
      path: '/pages/map/map'
    }
  }
})