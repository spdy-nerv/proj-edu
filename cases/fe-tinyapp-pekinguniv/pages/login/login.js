//获取应用实例
//myFollows .js
var { APIS } = require('../../const');
var user = require('../../libs/user');
var { request } = require('../../libs/request');
var { validate } = require('../../libs/validate');


var app = getApp()

Page({

  data: {
      user_name:'',
      user_password:'',
      bj:'https://iaaa.pku.edu.cn/iaaa/resources/images/pku_logo.png',
      bj2:'https://iaaa.pku.edu.cn/iaaa/resources/images/pku_view_2.jpg'
  }, onLoad: function (options) {
    user.login(this.getUserInfo, this, true);
    wx.request({
      url: 'https://scc.pku.edu.cn/wechat-student!myInfo',
      data: {

        wechatOpenId:wx.getStorageSync('openId')
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res){
        console.log(res.data)
        if(res.data.success==true){
          wx.redirectTo({
            url: "../timeLine/timeLine"
          })
        }
        // success
      }
    })   

  },
 
  // 跳转到注册页面
  toRegist: function () {
    wx.navigateTo({
      url: '../regist/regist'
    })
  },

//输入用户名
  userNameChange: function (e) {
    this.data.user_name = e.detail.value;
  },
  //输入密码
  userPasswordChange: function (e) {
    this.data.user_password = e.detail.value;
  },

  show: function () {
   const that = this;   
    if(!that.data.user_name&&!that.data.user_password){
      wx.showToast({
        title:'请输入用户名和密码'
      })
    }
    if(that.data.user_name&&that.data.user_password){
      wx.showLoading({title:'登陆中'})
      wx.request({
        url: 'http://wechat.scc.pku.edu.cn/ssologin/xcxLogin',
        data: {
         userName:that.data.user_name,
         password:that.data.user_password,
         miniAPPOpenId:wx.getStorageSync('openId')
        },
        header: {
          'content-type':'application/json'
        },
        success: function(res){
          wx.hideLoading();
          console.log(res.data)
          if(res.data.success==true){
            wx.redirectTo({
              url: "../timeLine/timeLine"
            })
          }else{
            wx.showToast({
              title: '输入的用户名或密码不正确',
              duration: 2000
            })
          }
          // success
        },
        fail: function() {
          
          wx.showToast({
            title: '输入的用户名或密码不正确',
            duration: 2000
          })
        }
      })   
    }
  
   
  }


})