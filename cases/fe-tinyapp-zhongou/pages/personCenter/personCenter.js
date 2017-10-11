//personCenter.js
var { APIS } = require('../../const');
var user = require('../../libs/user');
var { request } = require('../../libs/request');
Page({
  data: {
  	
  },
   //我的关注
  toEditperson: function(e){
  	wx.navigateTo({
			  url: '../Editperson/Editperson'
		});
  },
  onLoad: function () {
  	
  },
 
})
