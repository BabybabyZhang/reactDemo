
	//时间转换
	
let BaseJs  = {
	fixZero: (num, length) => {
		var str = "" + num;
		var len = str.length; var s = "";
		for (var i = length; i-- > len;) {
			s += "0";
		}
		return s + str;
	},
	formatDate: (now) => {
		var now = new Date(now);
		var year = now.getFullYear();
		var month = now.getMonth() + 1;
		var date = now.getDate();
		var hour = now.getHours();
		var minute = now.getMinutes();
		var second = now.getSeconds();
		return year + "-" + BaseJs.fixZero(month, 2) + "-" + BaseJs.fixZero(date, 2) + " " + BaseJs.fixZero(hour, 2) + ":" + BaseJs.fixZero(minute, 2) + ":" + BaseJs.fixZero(second, 2);
	},
	formatDates: (now) => {
		var now = new Date(now);
		var year = now.getFullYear();
		var month = now.getMonth() + 1;
		var date = now.getDate();
		return year + "-" + BaseJs.fixZero(month, 2) + "-" + BaseJs.fixZero(date, 2);
	},
	//时间如果为单位数补0 
	getUrlParam : (name) => {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
		var r = window.location.search.substr(1).match(reg);  //匹配目标参数
		if (r != null) return unescape(r[2]); return null; //返回参数值
	}
	
}

export default  BaseJs;
