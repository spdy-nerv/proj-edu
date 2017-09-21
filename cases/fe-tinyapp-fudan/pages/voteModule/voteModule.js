var { APIS } = require('../../const.js');
var { request } = require('../../libs/request');
var user = require('../../libs/user');

var app = getApp();
var theme = app.getTheme();
Page({
  data:{
    // TMP
    moduleId: '',
    isActive: true,
    isAllowVote: true,
    hasVoted: false,
    votedId: '',
    /*
    title: '你是否对腾讯进入校园招聘感兴趣',
    description: '',
    options: [
          {
            optionId: '11',
            optionName: '我觉得不错'
          },
          {
            optionId: '12',
            optionName: '挺感兴趣'
          },
          {
            optionId: '13',
            optionName: '很好，使得企业和校园更紧密'
          },
        ],
        */
    checkFnName: 'onCheck'
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    app.setBarColor();
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
        header: {
          auth: wx.getStorageSync('token')
        },
        data: {
            moduleId: this.data.moduleId
        },
        method: 'POST',
        realSuccess: function(data) {
            var cfg = data.config;
            var d = data.data;
            var q = d[0];
            that.setData({
              //isActive: cfg.active,
              isAllowVote: cfg.isAllow,
              hasVoted: data.isTest,
              question: q,
              options: q.options,
              votedId: data.isTest ? q.selectValue : '',
              title: data.title,
              description: q.questionCotent,
              checkFnName: !data.isTest ? 'onCheck' : ''
            });
            that.renderVote(q.options);
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
      if (o.id == that.data.votedId) {
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
      if (o.id == checkedId) {
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
      header: {
        auth: wx.getStorageSync('token')
      },
      data: {
        moduleId: this.data.moduleId,
        answers: [
          {
            questionId: this.data.question.questioId,
            optionValue: this.data.votedId
          }
        ]
      },
      method: 'POST',
      realSuccess: function(data) {
        that.setData({
          hasVoted: true,
          checkFnName: ''
        });

        that.totalVote++;
        var options = that.data.options.map(function(o) {
          if (o.id == that.data.votedId) {
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