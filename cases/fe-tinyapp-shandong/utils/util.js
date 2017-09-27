function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatDate(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()


  return [year, month, day].map(formatNumber).join('-')
}

function formatClock(date) {
  var hour = date.getHours()
  var minute = date.getMinutes()

  return [hour, minute].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

var dateCountArr = {
  '1': 31, '2': 28, '3': 31, '4': 30, '5': 31,
  '6': 30, '7': 31, '8': 31, '9': 30, '10': 31,
  '11': 30, '12': 31
};

var dayArr = ['日', '一', '二', '三', '四', '五', '六'];

function getDateCountInMonth(year, month) {
  var dateCount = 0;
  if (month == 2 && year % 4 == 0) {
    dateCount = 29;
  } else {
    dateCount = dateCountArr[month];
  }
  return dateCount;
}

function getCalByDate(year, month, date) {
  var firstDay = new Date(year, month - 1, 1).getDay();
  var dateCountInMonth = getDateCountInMonth(year, month);
  var lastDay = new Date(year, month - 1, dateCountInMonth).getDay();
  var lastMonth = month - 1 <= 0 ? 12 : (month - 1);
  var lastYear = lastMonth == 12 ? (year - 1) : year;
  var dateCountInLastMonth = getDateCountInMonth(lastYear, lastMonth);

  var cal = [];
  // 补全上个月
  for (var i = dateCountInLastMonth - firstDay + 1; i <= dateCountInLastMonth; i++) {
    cal.push({
      date: i,
      mode: 'last'
    });
  }
  // 当前月份
  for (var i = 1, j = dateCountInMonth; i <= j; i++) {
    cal.push({
      date: i,
      mode: 'current'
    });
  }
  // 补全下个月
  for (var i = 1, j = 6 - lastDay; i <= j; i++) {
    cal.push({
      date: i,
      mode: 'next'
    });
  }

  cal = cal.map(function (d, i) {
    var day = i % 7;
    d.daySimpleName = dayArr[day];
    return d;
  });

  return cal;
}

function inArray(data, arr) {
  for (var i in arr) {
    if (arr[i] == data) {
      return true;
    }
  }
  return false;
}

function substitute(
		/*String*/		template,
		/*Object|Array*/map,
    /*Object?*/		thisObject,
		/*Function?*/	transform) {

  // summary:
  //		Performs parameterized substitutions on a string. Throws an
  //		exception if any parameter is unmatched.
  // template:
  //		a string with expressions in the form `${key}` to be replaced or
  //		`${key:format}` which specifies a format function. keys are case-sensitive.
  // map:
  //		hash to search for substitutions
  // transform:
  //		a function to process all parameters before substitution takes
  //		place, e.g. mylib.encodeXML
  // thisObject:
  //		where to look for optional format function; default to the global
  //		namespace

  thisObject = thisObject || window;
  transform = transform || function (v) { return v; };

  return template.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g, function (match, key, format) {
    var value = map[key] || ("undefined" === typeof map[key] ? match : map[key]);
    format && (value = thisObject[format](value, key));
    return transform(value, key).toString();
  }); // String
}

module.exports = {
  substitute: substitute,
  formatTime: formatTime,
  formatDate: formatDate,
  formatClock: formatClock,
  getCalByDate: getCalByDate,
  inArray: inArray
}
