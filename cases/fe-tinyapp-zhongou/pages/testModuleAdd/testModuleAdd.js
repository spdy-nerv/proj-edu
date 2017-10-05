// pages/testModuleAdd/testModuleAdd.js
var { APIS } = require('../../const');
var user = require('../../libs/user');
var { uploadPic } = require('../../libs/upload');
var { request } = require('../../libs/request');

Page({
  data:{
    eventId: '',
    moduleId: '',
    startTime: '',
    endTime: '',
    title: '',
    description: '',
    allowRoleIds: [],
    questions: [/*
      {
        content: '一加一等于多少？',
        questionType: 1,
        options: ['1', '2', '11', '不知道']
      }, {
        content: '一加一等于多少？',
        questionType: 2,
        options: ['1', '2', '11', '不知道']
      }, {
        content: '一加一等于多少？',
        questionType: 3
      }*/
    ],
    isPanelOpen: false,
    questionPanelAnim: {},
    editContent: '',
    editOptions: [
      '', '', ''
    ],
    questionTypeList: [
      {
        typeId: 1,
        typeName: '单选题'
      }, {
        typeId: 2,
        typeName: '多选题'
      }, {
        typeId: 3,
        typeName: '填空题',
      }
    ],
    questionTypeIndex: 0,
    editingQuestionIndex: -1,
    isHideTextarea: false
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      eventId: options.eventId,
      moduleId: options.moduleId,
      //startTime: options.startTime,
      //endTime: options.endTime,
      //allowRoleIds: options.allowViewId ? options.allowViewId.split(',') : []
    });

    if (this.data.moduleId) {
      user.login(this.renderTest, this, true);
    }

    this.createAnim();
  },

  renderTest: function() {
      var that = this;
      wx.showLoading({
        mask: true,
        title: '获取问卷模块中'
      });
      request({
          url: APIS.GET_TEST_MODULE,
          method: 'POST',
          data: {
              moduleId: this.data.moduleId,
              sid: wx.getStorageSync('sid')
          },
          realSuccess: function(data) {
              var questions = data.data.questions;
              var simpleQuestions = [];
              for (var i in questions) {
                var q = {
                  content: questions[i].content,
                  questionType: +questions[i].type
                };
                var simpleOptions = [];
                for (var j in questions[i].options) {
                  simpleOptions.push(questions[i].options[j].optionName);
                }
                q.options = simpleOptions
                simpleQuestions.push(q);
              }
              that.setData({
                title: data.data.title,
                description: data.data.description,
                questions: simpleQuestions
              });
              wx.hideLoading();
          },
          loginCallback: this.renderTest,
          realFail: function(msg) {
            //wx.hideLoading();
            wx.showToast({
                title: msg
            });
          }
      }, true, this);
  },

  onDeleteQuestion: function(e) {
    var index = +e.target.dataset.index;
    var questions = this.data.questions;
    questions.splice(index, 1);
    this.setData({
      questions: questions
    });
  },

  onAddQuestion: function() {
    this.setData({
      editContent: '',
      editOptions: ['', '', ''],
      questionTypeIndex: 0,
      editingQuestionIndex: -1
    });
    this.openQuestionPanel();
  },

  onEditQuestion: function(e) {
    var index = +e.target.dataset.index;
    var q = this.data.questions[index];
    this.setData({
      editContent: q.content,
      editOptions: q.options,
      questionTypeIndex: +q.questionType - 1,
      editingQuestionIndex: index
    });

    this.openQuestionPanel();
  },

  createAnim: function() {
    var that = this;
    this.questionPanelAnim = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease'
    })
  },

  // 点击更多筛选条件
  openQuestionPanel: function() {
    this.questionPanelAnim.right(0).step();
    this.setData({
      questionPanelAnim: this.questionPanelAnim.export(),
      isHideTextarea: true
    });
  },

  // 关闭更多筛选面板
  closeQuestionrPanel: function() {
    this.questionPanelAnim.right('-100%').step();
    this.setData({
      questionPanelAnim: this.questionPanelAnim.export(),
      isHideTextarea: false
    });
  },

  onChangeQuestionType: function(e) {
    this.setData({
      questionTypeIndex: +e.detail.value
    });
    
    var i = this.data.questionTypeIndex;
    // 单选or多选
    if (i == 0 || i == 1) {
      this.setData({
        editOptions: [
          '', '', ''
        ]
      });
    // 填空
    } else if (i == 2) {
      this.setData({
        editOptions: []
      });
    }
  },

  onQpDeleteOption: function(e) {
    var index = e.target.dataset.index;
    var options = this.data.editOptions;
    options.splice(index, 1);
    this.setData({
      editOptions: options
    });
  },

  onQpAddOption: function() {
      if (this.data.editOptions.length >= 5) {
      wx.showToast({
        title: '最多只能添加5个选项！'
      });
      return;
    }
    var options = this.data.editOptions;
    options.push('');
    this.setData({
      editOptions: options
    });
  },

  onInputTitle: function(e) {
    this.setData({
      title: e.detail.value
    });
  },

  onInputDescription: function(e) {
    this.setData({
      description: e.detail.value
    }); 
  },

  onQpInputContent: function(e) {
    this.setData({
      editContent: e.detail.value
    });
  },

  onQpInputOption: function(e) {
    var index = +e.target.dataset.index;
    var options = this.data.editOptions;
    options[index] = e.detail.value;
    this.setData({
      editOptions: options
    });
  },

  onCancelQuestion: function() {
    this.closeQuestionrPanel();
  },

  onConfirmQuestion: function() {
    if (this.data.editContent == '') {
      wx.showToast({
        title: '题目标题不能为空！'
      });
      return;
    }
    for (var i in this.data.editOptions) {
      if (this.data.editOptions[i] == '') {
        wx.showToast({
          title: '选项不能为空！'
        });
        return;
      }
    }

    var question = {
      content: this.data.editContent,
      questionType: (this.data.questionTypeIndex+1) + '',
      options: this.data.editOptions
    };

    var qs = this.data.questions;

    if (this.data.editingQuestionIndex != -1) {
      qs[this.data.editingQuestionIndex] = question;
    } else {
      qs.push(question);
    }
    this.setData({
      questions: qs
    });

    this.closeQuestionrPanel();
  },

  onTapPublish: function() {
    if (this.data.title == '') {
      wx.showToast({
        title: '问卷标题不能为空！'
      });
      return;
    }
    if (this.data.description == '') {
      wx.showToast({
        title: '问卷描述不能为空！'
      });
      return;
    }
    if (this.data.questions.length == 0) {
      wx.showToast({
        title: '请先添加题目！'
      });
      return;
    }

    var d = {
      eventId: this.data.eventId,
      moduleType: 5,
      sid: wx.getStorageSync('sid'),
      questions: this.data.questions
    };
    var config = {
      isActive: true,
      startTime: '2017-01-01 00:00:00',
      endTime: '2099-01-01 23:59:59',
      //startTime: this.data.startTime,
      //endTime: this.data.endTime,
      //allowRoleIds: this.data.allowRoleIds,
      title: this.data.title,
      description: this.data.description
    };
    d.config = config;
    if (this.data.moduleId) {
      d.moduleId = this.data.moduleId
    }
    request({
      url: APIS.ADD_TEST_CONFIG,
      method: 'POST',
      data: d,
      realSuccess: function(data) {
        // TODO
        // 成功后返回上一页
        wx.navigateBack();
        //wx.hideLoading();
        wx.showToast({
          title: '成功'
        });
      },
      loginCallback: this.onTapPublish,
      realFail: function(msg, errCode) {
        //wx.hideLoading();
        wx.showToast({
          title: msg
        });
      }
    }, true, this);
  }
})