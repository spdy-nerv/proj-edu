var monthFormatList = [
  { arabic: 1, eng: 'January', simpleEng: 'Jan' },
  { arabic: 2, eng: 'February', simpleEng: 'Feb' },
  { arabic: 3, eng: 'March', simpleEng: 'Mar' },
  { arabic: 4, eng: 'April', simpleEng: 'Apr' },
  { arabic: 5, eng: 'May', simpleEng: 'May' },
  { arabic: 6, eng: 'June', simpleEng: 'Jun' },
  { arabic: 7, eng: 'July', simpleEng: 'Jul' },
  { arabic: 8, eng: 'August', simpleEng: 'Aug' },
  { arabic: 9, eng: 'September', simpleEng: 'Sep' },
  { arabic: 10, eng: 'October', simpleEng: 'Oct' },
  { arabic: 11, eng: 'November', simpleEng: 'Nov' },
  { arabic: 12, eng: 'December', simpleEng: 'Dec' },
];

var dayFormatList = [
  { chi: '星期天', eng: 'Sunday', simpleEng: 'Sun' },
  { chi: '星期一', eng: 'Monday', simpleEng: 'Mon' },
  { chi: '星期二', eng: 'Tuesday', simpleEng: 'Tues' },
  { chi: '星期三', eng: 'Wednesday', simpleEng: 'Wed' },
  { chi: '星期四', eng: 'Thursday', simpleEng: 'Thur' },
  { chi: '星期五', eng: 'Friday', simpleEng: 'Fri' },
  { chi: '星期六', eng: 'Saturday', simpleEng: 'Sat' }
];

var reqHost = 'https://www.leiy.club/peking';
var baseUrl = 'https://scc.pku.edu.cn';  //http://47.94.133.195   https://scc.pku.edu.cn

var APIS = {
  GET_IS_BLINDING:            baseUrl+'/wechat!isBinding',
  GET_TAKE_PART_IN:           baseUrl+'/wechat-student-jobs!cancelInterest',
  GET_CAREER_TALK:            baseUrl+'/wechat-student-jobs!interest', //参加宣讲会
  GET_NEW_GONGGAOLISTDETAIL:  baseUrl+'/wechat-home!detail',//获取公告列表详情
  GET_NEW_GONGGAOLIST:        baseUrl +'/wechat-home!loadStudentNews',
  GET_NEW_EVENTLIST:          baseUrl +'/wechat-student-jobs!fairs',//宣讲会列表
  GET_NEW_EVENTLISTDETAIL:    baseUrl +'/wechat-student-jobs!bigFairDetail', //宣讲会详情列表
  GET_EVENT_NOU:						 reqHost +'/getAnnouncementList',//公告数据
  GET_ROLE_LIST: 						reqHost + '/getRoleList',
  GET_EVENT_TYPE_LIST: 			reqHost + '/getEventTypeList',
  LOGIN: 										reqHost + '/wx/login',
  CHECK_SESSION: 						reqHost + '/wx/checkSession',
  GET_EVENTS_LIST_BY_MONTH: reqHost + '/getEventsListByMonth',
  
	GET_EVENT_BASE: 					reqHost + '/getEventBase', //事件详情页
	GET_COMMENT_MODULE: 			reqHost + '/getCommentModule',//获取评论模块
	ADD_STAR:									reqHost + '/addStar',//点赞接口
	FOLLOW_EVENT: 						reqHost + '/followEvent',//关注事件
	UN_FOLLOW_EVENT:					reqHost + '/unfollowEvent',//取消关注
	GET_DESCRIPTION_MODULE:		reqHost + '/getDescriptionModule', //获取事件详情模块
	GET_ENROLL_MODULE: 				reqHost +'/getEnrollModule',//获取报名模块
	ADD_ENROLL: 							reqHost +'/addEnroll', //报名
	
	MY_CENTER: 						 		reqHost +'/myCenter', //个人中心
	MY_CARD: 									reqHost +'/myCard', //我的名片
	MY_SCHEDULE:              baseUrl+'/wechat-student-calendar!loadCaledarEvent',//求职日程
	MY_DELSCHEDULE:           baseUrl+'/wechat-student-calendar!deleteBusiness',//删除日程
	MY_EDIT:                  baseUrl+'/wechat-student-calendar!loadBusiness',//单条日程获取
	MY_REMOVESCHEDULE:        baseUrl+'/wechat-student-calendar!interest',//修改日程
	MY_CALEND:                baseUrl+'/wechat-student-calendar!interest',//添加日程
	CERTIFICATION: 						reqHost +'/certification', //认证
	SEND_SMS: 							 	reqHost +'/sendSms', //短信认证
	EDIT_CARD: 							 	reqHost +'/editCard',// 编辑我的名片
	MY_FOLLOWS:								baseUrl +'/wechat-student-calendar!findTimeline',//我的关注
	MY_PUBLISHED:							reqHost +'/myPublished',//我的发布
	TOGGLEEVENT:      reqHost +'/toggleEvent',
	UNBIND: reqHost +'/unBind', //解绑
  // 获取投票模块
  GET_VOTE_MODULE: reqHost +'/getVoteModule',
  // 提交投票结果 
  ADD_VOTE: reqHost +'/addVote',

  // 获取问卷模块
  GET_TEST_MODULE: reqHost + '/getTestModule',
  // 提交问卷
  SUBMIT_QUESTION: reqHost + '/submitQuestion',

  // 上传图片
  FILE_UPLOAD: reqHost + '/fileUpload',

  // 提交评论
  ADD_COMMENT: reqHost + '/addComment',

  // 发布事件
  ADD_EVENT_BASE: reqHost + '/addEventBase',

  // 添加事件详情
  ADD_EVENT_DETAILED: reqHost + '/addEventdetailed',

  // 添加投票模块
  ADD_VOTE_CONFIG: reqHost + '/addVotoConfig',

  // 添加问卷模块
  ADD_TEST_CONFIG: reqHost + '/addTestConfig',

  // 添加报名模块
  ADD_ENROLL_CONFIG: reqHost + '/addEnrolModulConfig',

  // 添加评论模块
  ADD_COMMENT_CONFIG: reqHost + '/addCommentConfig',

  // 添加评价模块
  ADD_EVALUATION_CONFIG: reqHost + '/addEvaluationConfig',

  // 删除模块关联
  REMOVE_MODULE: reqHost + '/removeModule',

  // 获取事件首页图片
  GET_EVENT_POSTER: reqHost + '/getEventPoster',
  //公司列表
  
  GET_COMPANY_LIST:reqHost + '/getCompanyList',
   
  //公司详情
  GET_COMPANY_DETAILS:reqHost + '/getCompanyDetails'
	
};

var QQ_MAP_KEY = 'PLWBZ-AGPWS-LWBOA-6BJYO-ZUYYZ-O7FKK';

module.exports = {
    monthFormatList: monthFormatList,
    dayFormatList: dayFormatList,
    APIS: APIS,
    QQ_MAP_KEY: QQ_MAP_KEY
};
