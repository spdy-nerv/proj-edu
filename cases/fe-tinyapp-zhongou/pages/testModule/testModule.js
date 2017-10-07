var { APIS } = require('../../const');
var util = require('../../utils/util');
var user = require('../../libs/user');
var { request } = require('../../libs/request');

Page({
  data:{
    // TMP
    moduleId: '',
    isActive: true,
    isAllowTest: true,
    hasTested: false,
    title: '问卷标题',
    description: '问卷描述',
    questions: [
        {
            questionId: '1',
            content: '问题一问题一',
            type: 2,
            options: [
                {
                    optionId: '11',
                    optionName: '选项1'
                }, {
                    optionId: '12',
                    optionName: '选项2'
                }, {
                    optionId: '13',
                    optionName: '选项3'
                }, {
                    optionId: '14',
                    optionName: '选项4'
                }
            ]
        }, {
            questionId: '2',
            content: '问题二',
            type: 2,
            options: [
                {
                    optionId: '21',
                    optionName: '选项1'
                }, {
                    optionId: '22',
                    optionName: '选项2'
                }, {
                    optionId: '23',
                    optionName: '选项3'
                }, {
                    optionId: '24',
                    optionName: '选项4'
                }
            ]
        }, {
            questionId: '3',
            content: '评论',
            type: 3
        }
    ],
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
              isAllowTest: cfg.allowTest,
              hasTested: d.hasTested,
              title: d.title,
              description: d.description,
              tapRadioFnName: cfg.active && !d.hasTested ? 'onRadioCheck' : '',
              tapCheckboxFnName: cfg.active && !d.hasTested ? 'onCheckboxCheck' : '',
              onInputFnName: cfg.active && !d.hasTested ? 'onInput' : '',
              isInputDisabled: cfg.active && !d.hasTested ? false : true
            });
            that.renderTest(d.questions);
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
    var qi = e.target.dataset.questionindex;
    var optionId = e.target.dataset.optionid;
    var question = this.data.questions[qi];
    var options = question.options;
    options = options.map(function(o) {
        if (o.optionId == optionId) {
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
    var qi = e.target.dataset.questionindex;
    var optionId = e.target.dataset.optionid;
    var question = this.data.questions[qi];
    var options = question.options;
    var answer = '';
    options = options.map(function(o) {
        if (o.optionId == optionId) {
            o.isChecked = !o.isChecked;
        }
        if (o.isChecked) {
            answer += o.optionId + ',';
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
        var qId = q.questionId;
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
      data: {
        moduleId: this.data.moduleId,
        answers: answers,
        sid: wx.getStorageSync('sid')
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