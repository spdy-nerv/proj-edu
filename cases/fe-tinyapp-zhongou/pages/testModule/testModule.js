var { APIS } = require('../../const.js');
var { request } = require('../../libs/request');
var user = require('../../libs/user');

var app = getApp();

Page({
  data:{
    // TMP
    moduleId: '',
    isActive: true,
    isAllowTest: true,
    hasTested: false,
    /*
    title: '2017广东外语外贸大学招聘问卷',
    description: '很感谢各位同学抽出宝贵时间填写本次的问卷，希望通过您真实的回答，让我们找到共同的兴趣和爱好，彼此更加了解！非常感谢您的回答！',
    questions: [
        {
            questionId: '1',
            content: '您对本次的招聘会感觉怎么样？',
            type: 1,
            options: [
                {
                    optionId: '11',
                    optionName: '很好，使用了小程序，很方便了解招聘信息'
                }, {
                    optionId: '12',
                    optionName: '感觉比往年新颖'
                }, {
                    optionId: '13',
                    optionName: '小程序很好的一个切入场景，方便，快捷捕捉有用信息'
                }, {
                    optionId: '14',
                    optionName: '选项4'
                }
            ]
        }, {
            questionId: '2',
            content: '您对本次招聘会期待的岗位？',
            type: 2,
            options: [
                {
                    optionId: '21',
                    optionName: 'T工程师'
                }, {
                    optionId: '22',
                    optionName: '电商运营'
                }, {
                    optionId: '23',
                    optionName: '人力资源'
                }, {
                    optionId: '24',
                    optionName: '选项4'
                }
            ]
        }, {
            questionId: '3',
            content: '问题三，填空',
            type: 3
        }
    ],
    */
    tapRadioFnName: 'onRadioCheck',
    tapCheckboxFnName: 'onCheckboxCheck',
    onInputFnName: 'onInput',
    isInputDisabled: false
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
      this.getTestModule();
  },

  getTestModule: function() {
      var that = this;
      request({
        url: APIS.GET_TEST_MODULE,
        header: {
          auth: wx.getStorageSync('token')
        },
        data: {
            moduleId: this.data.moduleId,
            pageNo:'1',
            pageSize:'999'
        },
        method: 'POST',
        realSuccess: function(data) {
            console.log(data);
            var cfg = data.data.config;
            var d = data.data.data;
            var data = data.data;
            //console.log(data.isTest)
            that.setData({
              //isActive: cfg.active,
              isAllowTest: cfg.isAllow,
              hasTested: data.isTest,
              title: data.title,
              description: d.description,
              tapRadioFnName: !data.isTest ? 'onRadioCheck' : '',
              tapCheckboxFnName: !data.isTest ? 'onCheckboxCheck' : '',
              onInputFnName: !data.isTest ? 'onInput' : '',
              isInputDisabled: !data.isTest ? false : true
            });
            console.log(d);
            that.renderTest(d);
            wx.hideLoading();
        },
        loginCallback: this.getTestModule,
        realFail: function(msg, errCode) {
          wx.hideLoading();
          wx.showToast({
            title: msg
          });
        }
      }, true, this);
  },

  renderTest: function(questions) {
    this.setData({
        questions: questions
    });
  },

  onRadioCheck: function(e) {
      console.log('我是单选框');
    var qi = e.target.dataset.questionindex;
    var optionId = e.target.dataset.optionid;
    var question = this.data.questions[qi];
    var options = question.options;
    options = options.map(function(o) {
        if (o.id == optionId) {
            o.isChecked = true;
        } else {
            o.isChecked = false;
        }
        return o;
    });
    question.options = options;
    question.answer = optionId;
    var qs = this.data.questions;
    qs[qi] = question;
    this.setData({
        questions: qs
    });
  },

  onCheckboxCheck: function(e) {
      console.log('我是复选框')
    var qi = e.target.dataset.questionindex;
    var optionId = e.target.dataset.optionid;
    var question = this.data.questions[qi];
    var options = question.options;
    var answer = '';
    options = options.map(function(o) {
        if (o.id == optionId) {
            o.isChecked = !o.isChecked;
        }
        if (o.isChecked) {
            answer += o.id + ',';
        }
        return o;
    });
    question.options = options;
    question.answer = answer.trim(',');
    var qs = this.data.questions;
    qs[qi] = question;
    this.setData({
        questions: qs
    });
  },

  onInput: function(e) {
    var qi = e.target.dataset.questionindex;
    var question = this.data.questions[qi]; 
    question.answer = e.detail.value;
    var qs = this.data.questions;
    qs[qi] = question;
    this.setData({
        questions: qs
    });
  },

  onSubmitTest: function() {
    var questions = this.data.questions;
    var canSubmit = true;
    for (var i in questions) {
        // 单选或多选为必填
        var q = questions[i];
        if (( q.type == 1 || q.type == 2 ) && !q.answer) {
            canSubmit = false;
            break;
        }
    }
    if (!canSubmit) {
        wx.showToast({
            title: '单选题和多选题为必填，请填写完整后提交！'
        });
        return;
    }

    var that = this;
    var answers = [];
    for(var i in this.data.questions) {
        var q = this.data.questions[i];
        var qId = q.questioId;
        var answer = q.answer || '';
        answers.push({
            questionId: qId,
            optionValue: answer
        });
    }
    wx.showLoading({
      mask: true,
      title: '数据提交中'
    });
    request({
      url: APIS.SUBMIT_QUESTION,
      header: {
        auth: wx.getStorageSync('token')
      },
      data: {
        moduleId: this.data.moduleId,
        answers: answers
      },
      method: 'POST',
      realSuccess: function(data) {
        that.setData({
          hasTested: true,
          tapRadioFnName: '',
          tapCheckboxFnName: '',
          onInputFnName: '',
          isInputDisabled: true
        });
        wx.hideLoading();
      },
      loginCallback: this.onSubmitTest,
      realFail: function(msg) {
        wx.hideLoading();
        wx.showToast({
          title: msg
        });
      }
    }, true, this);
  }
})