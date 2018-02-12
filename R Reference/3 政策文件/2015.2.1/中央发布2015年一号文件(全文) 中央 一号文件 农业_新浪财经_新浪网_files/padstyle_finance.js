/* 1,1009,3 2014-07-03 11:14:44 */

(function(){

var arr = ["ipad", "mi-pad"],
	android = 'Android',
	len = arr.length,
	userAgent = navigator.userAgent.toLowerCase(),
	valid = false;

	for(var i=0;i<len;i++){
		var txt = (arr[i] + "").toLowerCase(),
		reg = new RegExp(txt,"i"),
		reg_android = new RegExp(android,"i");
		valid = (userAgent.match(reg) == txt && (txt == 'ipad' ? true : userAgent.match(reg_android) == android.toLowerCase()));
		if(valid === true){
			break;
		}
	};

	var _doc = document;
	var cssAddress = 'http://finance.sina.com.cn/css/462/2013/0705/ipadstyle_finance.css';
	if(valid){
		_doc.write('<link rel="stylesheet" href="' + cssAddress + '">');
	}
})();