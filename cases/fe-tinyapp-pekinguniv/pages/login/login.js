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
    //获取认证的学生信息
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
      }
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
        url: APIS.GET_XCX_LOGIN,
        data: {
         userName:that.data.user_name,
         password:that.data.user_password,
         miniAPPOpenId:wx.getStorageSync('openId')
        },
        header: {
          'content-type':'application/json'
        },
        success: function(res){
          console.log('请求执行了')
          wx.hideLoading();
          console.log(res.data)
          if(res.data.success==true){
            wx.redirectTo({
              url: "../timeLine/timeLine"
            })
          }else if(res.data.success==false){
            wx.showToast({
              title:res.data.msg,
              duration: 2000
            })
          }
          // success
        },
        fail: function(res) {
          console.log(res);
          wx.showToast({
            title: '输入的用户名或密码不正确',
            duration: 2000
          })
        }
      })   
    }
  
   
  }


})