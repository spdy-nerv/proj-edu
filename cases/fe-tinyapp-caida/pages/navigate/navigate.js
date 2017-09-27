var amapFile = require('../../libs/amap-wx.js');
var { config } = require('../../const.js');
var app = getApp();
var theme = app.getTheme();
Page({
  data: {
    mapHeight: 500,
    centerLongitude: 113.297035,
    centerLatitude: 23.100052,
    scale: 15,
    desLati: 23.091052,
    desLong: 113.297035,
    type: 'entry',
    name: '中山大学',
    markers: [{
      iconPath: "../../images/Loc.png",
      id: 0,
      latitude: 23.091052,
      longitude: 113.297035,
      width: 23,
      height: 30
    }, {
      iconPath: "../../resources/bestPath.png",
      id: 0,
      latitude: 23.094556,
      longitude: 113.303901,
      width: 34,
      height: 34
    }],
    distance: '加载中',
    cost: '加载中',
    tabsel: 0,
    transits: [],
    polyline: [],
    clrMain: theme.clrMain
  },
  onLoad: function (options) {
    var that = this;
    var key = config.mapkey;
    var myAmapFun = new amapFile.AMapWX({ key: key });
    var mapheigh = wx.getSystemInfoSync().windowHeight - 120;
    wx.showLoading({
      title: '加载中',
      icon: 'loading'
    })
    that.setData({
      mapHeight: mapheigh,
    })
    var desLati = parseFloat(options.lati);
    var desLong = parseFloat(options.long);
    var name = options.name;
    var ctype = options.type;
    that.setData({
      mapHeight: mapheigh,
      centerLongitude: desLong,
      centerLatitude: desLati,
      desLati: desLati,
      desLong: desLong,
      type: ctype,
      name: name,
    });
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        that.setData({
          centerLongitude: res.longitude,
          centerLatitude: res.latitude,
          markers: [{
            iconPath: "../../images/Loc.png",
            id: 0,
            latitude: that.data.desLati,
            longitude: that.data.desLong,
            width: 23,
            height: 30
          }, {
            iconPath: "../../resources/bestPath.png",
            id: 0,
            latitude: res.latitude,
            longitude: res.longitude,
            width: 80,
            height: 30
          }],
        })
        myAmapFun.getDrivingRoute({
          destination: that.data.desLong + ',' + that.data.desLati,
          origin: res.longitude + ',' + res.latitude,
          success: function (data) {
            var points = [];
            if (data.paths && data.paths[0] && data.paths[0].steps) {
              var steps = data.paths[0].steps;
              for (var i = 0; i < steps.length; i++) {
                var poLen = steps[i].polyline.split(';');
                for (var j = 0; j < poLen.length; j++) {
                  points.push({
                    longitude: parseFloat(poLen[j].split(',')[0]),
                    latitude: parseFloat(poLen[j].split(',')[1])
                  })
                }
              }
            }
            that.setData({
              polyline: [{
                points: points,
                color: theme.clrMain,
                width: 3
              }]
            });
            if (data.paths[0] && data.paths[0].distance) {
              that.setData({
                distance: data.paths[0].distance + '米'
              });
            }
            if (data.taxi_cost) {
              that.setData({
                cost: '打车约' + parseInt(data.taxi_cost) + '元'
              });
            }

            wx.hideLoading();

          }
        })
      },
      fail: function (info) {
        wx.showToast({
          title: '无法规划线路！',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  goDetail: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 2000
    })
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude: that.data.desLati,
          longitude: that.data.desLong,
          scale: 18,
          name: that.data.name
        })
      },
      fail: function (err) {
        console.log(err)
      },
    })
  },
  goToCar: function () {
    this.setData({
      tabsel: 0,
    });
    var that = this;
    var key = config.mapkey;
    var myAmapFun = new amapFile.AMapWX({ key: key });
    myAmapFun.getDrivingRoute({
      destination: that.data.desLong + ',' + that.data.desLati,
      origin: that.data.centerLongitude + ',' + that.data.centerLatitude,
      success: function (data) {
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        that.setData({
          polyline: [{
            points: points,
            color: theme.clrMain,
            width: 3
          }]
        });
        if (data.paths[0] && data.paths[0].distance) {
          that.setData({
            distance: data.paths[0].distance + '米'
          });
        }
        if (data.taxi_cost) {
          that.setData({
            cost: '打车约' + parseInt(data.taxi_cost) + '元'
          });
        }
        wx.hideLoading();
      }
    })
  },
  goToWalk: function () {
    this.setData({
      tabsel: 1,
    });
    var that = this;
    var key = config.mapkey;
    var myAmapFun = new amapFile.AMapWX({ key: key });
    if (that.data.distance.length > 5) {
      wx.showToast({
        title: '距离太远，无法规划线路！',
        icon: 'success',
        duration: 2000
      })
    }
    myAmapFun.getWalkingRoute({
      destination: that.data.desLong + ',' + that.data.desLati,
      origin: that.data.centerLongitude + ',' + that.data.centerLatitude,
      success: function (data) {
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        that.setData({
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 6
          }]
        });
        if (data.paths[0] && data.paths[0].distance) {
          that.setData({
            distance: data.paths[0].distance + '米'
          });
        }
        if (data.paths[0] && data.paths[0].duration) {
          that.setData({
            cost: parseInt(data.paths[0].duration / 60) + '分钟'
          });
        }
        wx.hideLoading();
      },
      fail: function (info) {
        wx.showToast({
          title: '无法规划线路！',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  goToBus: function () {
    this.setData({
      tabsel: 2,
    });
    var that = this;
    var key = config.mapkey;
    var myAmapFun = new amapFile.AMapWX({ key: key });
    if (that.data.distance.length > 5) {
      wx.showToast({
        title: '距离太远，无法规划线路！',
        icon: 'success',
        duration: 2000
      })
    }
    myAmapFun.getTransitRoute({
      destination: that.data.desLong + ',' + that.data.desLati,
      origin: that.data.centerLongitude + ',' + that.data.centerLatitude,
      city: '广州',
      success: function (data) {
        if (data && data.transits) {
          var transits = data.transits;
          for (var i = 0; i < transits.length; i++) {
            var segments = transits[i].segments;
            transits[i].transport = [];
            for (var j = 0; j < segments.length; j++) {
              if (segments[j].bus && segments[j].bus.buslines && segments[j].bus.buslines[0] && segments[j].bus.buslines[0].name) {
                var name = segments[j].bus.buslines[0].name
                if (j !== 0) {
                  name = '--' + name;
                }
                transits[i].transport.push(name);
              }
            }
          }
        }
        console.log(transits);
        that.setData({
          transits: transits
        });
        wx.hideLoading();
      },
      fail: function (info) {
        wx.showToast({
          title: '无法规划线路！',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  goToRide: function () {
    this.setData({
      tabsel: 3,
    });
    var that = this;
    var key = config.mapkey;
    var myAmapFun = new amapFile.AMapWX({ key: key });
    if (that.data.distance.length>5) {
      wx.showToast({
        title: '距离太远，无法规划线路！',
        icon: 'success',
        duration: 2000
      })
    }
    myAmapFun.getRidingRoute({
      destination: that.data.desLong + ',' + that.data.desLati,
      origin: that.data.centerLongitude + ',' + that.data.centerLatitude,
      success: function (data) {
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].rides) {
          var steps = data.paths[0].rides;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        that.setData({
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 6
          }]
        });
        if (data.paths[0] && data.paths[0].distance) {
          that.setData({
            distance: data.paths[0].distance + '米'
          });
        }
        if (data.taxi_cost) {
          that.setData({
            cost: '打车约' + parseInt(data.taxi_cost) + '元'
          });
        }
        wx.hideLoading();
      },
      fail: function (info) {
        wx.showToast({
          title: '无法规划线路！',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
})