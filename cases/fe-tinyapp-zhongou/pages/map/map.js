//index.js
var app = getApp()

Page({
    data:{
    	//地图的宽高
    mapHeight: '100%',
    mapWidth: '100%',
    mapTop: '0',
    //用户当前位置
    point: {
      latitude: 0,
      longitude: 0
    },
    //标注物
    markers: [],
    //当前地图的缩放级别
    mapScale: 16,
    //地图上不可移动的控件
    controls:[{
            id: 0,
            position: {
              left:10*wx.getStorageSync("kScreenW"),
              top:523*wx.getStorageSync("kScreenH"),
              width:40*wx.getStorageSync("kScreenW"),
              height:40*wx.getStorageSync("kScreenW")
            },
            iconPath: '../../images/location-ico.png',
            clickable: true,
         }]
    },
    onReady: function (e) {
      //通过id获取map,然后创建上下文
      this.mapCtx = wx.createMapContext("myMap");
    },
    //定位到用户当前位置
	getUserCurrentLocation: function () {
	    this.mapCtx.moveToLocation();
	    this.setData({
	      'mapScale': 16
	    })
	},
	    //控件的点击事件
    controltap: function (e) {
	    var that = this;
	    var id = e.controlId;
	    if (id == 0) {
	      //定位当前位置
	      that.getUserCurrentLocation()
	    }
	},
	  regionchange(e) {
	   console.log(e);
	  },
	  markertap(e) {
	     console.log(e.markerId);
	      //使用说明
	      wx.navigateTo({
	      	url: '../logs/logs'
	      })
	  },
  
	  //页面加载的函数
	onLoad: function (options) {
  		console.log('onLoad')
	    var that = this
	    
	    that.setData({
	    	markers: [{
		    	latitude: options.latitude,
		        longitude: options.longitude,
		        iconPath: "../../images/location.png",
		        id: 0,
		        width: 40*wx.getStorageSync("kScreenW"),
		        height: 40*wx.getStorageSync("kScreenW")
    		}],
	    })
	    console.log(that.data.markers);
	    //获取用户的当前位置位置
	    wx.getLocation({
	      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用wx.openLocation 的坐标
	      success: function(res){
	        // success
	        var latitude = res.latitude
	        var longitude = res.longitude
	        var point= {
	          latitude: latitude,
	          longitude: longitude
	        };
	        that.setData({
	          'point': point
	         })
	      }
	    })
	},
  	onReady: function (e) {
      //通过id获取map,然后创建上下文
      this.mapCtx = wx.createMapContext("myMap");
    },
    onShareAppMessage: function() {
      // 用户点击右上角分享
      console.log('onShareAppMessage')
      return {
        desc: '分享给大家看看吧', // 分享描述
        path: '/map/map' // 分享路径
      }
    }
})