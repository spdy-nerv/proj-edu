var { APIS } = require('../../const');
var util = require('../../utils/util');
var user = require('../../libs/user');
var { request } = require('../../libs/request');

Page({
  data:{
    // TMP
    moduleId: '',
    isActive: true,
    isAllowVote: true,
    hasVoted: false,
    votedId: '',
    title: '',
    description: '',
    options: [],
    checkFnName: 'onCheck'
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    this.setData({
      moduleId: options.moduleId
    });
    /*
    wx.showLoading({
      mask: true,
      title: '数据加载中'
    });
    */
    user.login(this.renderUI, this, true);
  },

  renderUI: function() {
      this.getVoteModule();
  },

  getVoteModule: function() {
      var that = this;
      request({
        url: APIS.GET_VOTE_MODULE,
        data: {
            moduleId: this.data.moduleId,
            sid: wx.getStorageSync('sid')
        },
        method: 'POST',
        realSuccess: function(data) {
            var cfg = data.config;
            var d = data.data;
            that.setData({
              isActive: cfg.active,
              isAllowVote: cfg.allowVote,
              hasVoted: d.hasVoted,
              votedId: d.hasVoted ? d.votedOptionId : '',
              title: d.title,
              description: d.description,
              checkFnName: cfg.active  && !d.hasVoted ? 'onCheck' : ''
            });
            that.renderVote(d.options);
            wx.hideLoading();
        },
        loginCallback: this.getVoteModule,
        realFail: function(msg, errCode) {
          wx.hideLoading();
          wx.showToast({
            title: msg
          });
        }
      }, true, this);
  },

  renderVote: function(options) {
    var that = this;
    this.totalVote = this.getTotalVote(options);
    options = options.map(function(o, i) {
      if (o.optionId == that.data.votedId) {
        o.isChecked = true;
      }
      o.percent = +o.count / that.totalVote * 100;
      o.percent = o.percent.toFixed(1);
      switch (i % 4) {
        case 0:
          o.progressColor = '#ea4e64';
          break;
        case 1:
          o.progressColor = '#ef8c36';
          break;
        case 2:
          o.progressColor = '#50bfe4';
          break;
        case 3:
          o.progressColor = '#866dc4';
          break;
      }
      return o;
    });
    that.setData({
      options: options
    });
  },

  getTotalVote: function(options) {
    var tt = 0;
    for(var i in options) {
      var o = options[i];
      tt += o.count;
    }
    return tt;
  },

  onCheck: function(e) {
    var checkedId = e.target.dataset.optionid;
    var options = this.data.options;
    options = options.map(function(o) {
      if (o.optionId == checkedId) {
        o.isChecked = true;
      } else {
        o.isChecked = false;
      }
      return o;
    });
    this.setData({
      options: options,
      votedId: checkedId
    });
  },

  onSubmitVote: function() {
    if (!this.data.votedId) {
      wx.showToast({
        title: '请勾选选项！'
      });
      return;
    }

    var that = this;
    wx.showLoading({
      mask: true,
      title: '数据提交中'
    });
    request({
      url: APIS.ADD_VOTE,
      data: {
        moduleId: this.data.moduleId,
        optionId: this.data.votedId,
        sid: wx.getStorageSync('sid')
      },
      method: 'POST',
      realSuccess: function(data) {
        that.setData({
          hasVoted: true,
          checkFnName: ''
        });

        that.totalVote++;
        var options = that.data.options.map(function(o) {
          if (o.optionId == that.data.votedId) {
            o.count += 1;
          }
          o.percent = +o.count / that.totalVote * 100;
          o.percent = o.percent.toFixed(1);
          return o;
        });

        that.setData({
          options: options
        });
        wx.hideLoading();
      },
      loginCallback: this.onSubmitVote,
      realFail: function(msg) {
        wx.hideLoading();
        wx.showToast({
          title: msg
        });
      }
    }, true, this);
  }
})