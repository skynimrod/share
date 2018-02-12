var SinaFinancePlatform = function () {
	this._bind = function (__functionBind, __argumentsBind) {
		var __this = this;
		return function () {
			var __arguments = null;
			if (typeof __argumentsBind != "undefined") {
				for (var i = 0; i < arguments.length; i++) {
					__argumentsBind.push(arguments[i]);
				}
				__arguments = __argumentsBind;
			}
			else {
				__arguments = arguments;
			}
			return __functionBind.apply(__this, __arguments);
		};
	};
	this._copy = function (__object) {
		switch (typeof __object) {
			case "number":
			case "string":
			case "undefined":
			case "boolean":
				return __object;
				break;
			case "object":
			case "function":
			default:
				if (__object === null) {
					return null;
				}
				if (__object.constructor === Array) {
					var __result = [];
					for (var i in __object) {
						__result.push(arguments.callee(__object[i]));
					}
					return __result;
				}
				var __result = {};
				for (var i in __object) {
					__result[i] = arguments.callee(__object[i]);
				}
				return __result;
				break;
		}
	};
	this._changeTimezone = function (__date, __numbetTimezoneOriginal, __numbetTimezoneNew) {
		var __dateTemp = new Date();
		__dateTemp.setTime(__date.getTime() - (__numbetTimezoneOriginal - __numbetTimezoneNew) * 60 * 60 * 1000);
		return __dateTemp;
	};
	this._exclude = function (__arrayTarget, __arrayBase) {
		var __objectBase = {};
		for (var i in __arrayBase) {
			__objectBase[__arrayBase[i]] = true;
		}
		var __arrayResult = [];
		for (var i in __arrayTarget) {
			if (!(__arrayTarget[i] in __objectBase)) {
				__arrayResult.push(__arrayTarget[i]);
			}
		}
		return __arrayResult;
	};
	this._getTimeUTC = function (__date) {
		return __date.getTime() + __date.getTimezoneOffset() * 60 * 1000;
	};
	this._random = function () {
		return (new Date()).getTime() + Math.random().toString().replace("0.", "");
	};
	this._serialize = function (__object) {
		switch (typeof __object) {
			case "number":
				return __object.toString();
				break;
			case "string":
				return "\"" + __object + "\"";
				break;
			case "boolean":
				return __object ? "true" : "false";
				break;
			case "object":
				if (__object === null) {
					return "null";
				}
				var __arrayObject = [];
				if (__object.constructor === Array) {
					for (var i in __object) {
						__arrayObject.push(arguments.callee(__object[i]));
					}
					return "[" + __arrayObject.join(", ") + "]";
				}
				else {
					for (var i in __object) {
						__arrayObject.push(i + ": " + arguments.callee(__object[i]));
					}
					return "{" + __arrayObject.join(", ") + "}";
				}
				break;
			case "undefined":
				return "undefined";
				break;
			case "function":
				return "function () {}";
				break;
		}
	};
	this._subString = function (__stringTarget, __intLength) {
		var __stringTargetTransformed = __stringTarget.replace(/[xy]/g, "z").replace(/[^\x00-\xff]/g,"xy");
		if (__stringTargetTransformed.length > __intLength) {
			__stringTargetTransformed = __stringTargetTransformed.substr(0, __intLength);
			if (__stringTargetTransformed.substr(__intLength - 1, 1) == "x") {
				return __stringTarget.substr(0, __intLength - 1 - __stringTargetTransformed.match(/xy/g).length);
			}
			else {
				return __stringTarget.substr(0, __intLength - __stringTargetTransformed.match(/xy/g).length);
			}
		}
		else {
			return __stringTarget;
		}
	};
	this._value = function (__object, __defaultValue) {
		return typeof __object == "undefined" ? (typeof __defaultValue == "undefined" ? undefined : __defaultValue) : __object;
	};
	this._variable = function () {
		var __stringContainer = "";
		do {
			__stringContainer = "VARIABLE_" + (new Date()).getTime() + Math.random().toString().replace("0.", "");
		} while (__stringContainer in window);
		window[__stringContainer] = {};
		return __stringContainer;
	};
	this._get = function (__stringId) {
		return typeof __stringId == "string" ? document.getElementById(__stringId) : __stringId;
	};
	this._set = function (__objectTarget, __stringProperty, __objectValue) {
		if (__objectTarget[__stringProperty] != __objectValue) {
			__objectTarget[__stringProperty] = __objectValue;
		}
	};
	this._getCookie = function (__stringKey) {
		var __arrayResult = document.cookie.match(new RegExp(__stringKey + "=([^;]*)"));
		return __arrayResult != null ? decodeURI(__arrayResult[1]) : null;
	};
	this._setCookie = function (__stringKey, __stringValue, __intExpireDay) {
		if (__intExpireDay) {
			var __dateExpire = new Date();
			__dateExpire.setTime(__dateExpire.getTime() + __intExpireDay * 24 * 3600 * 1000);
			document.cookie = __stringKey + "=" + encodeURI(__stringValue) + "; expires=" + __dateExpire.toGMTString();
		}
		else {
			document.cookie = __stringKey + "=" + encodeURI(__stringValue) + ";";
		}
	};
	this._aevent = function (__elementTarget, __stringType, __functionEvent) {
		if (window.addEventListener) {
			__elementTarget.addEventListener(__stringType, __functionEvent, false);
		} else if (window.attachEvent) {
			__elementTarget.attachEvent("on" + __stringType, __functionEvent);
		}
	};
	this._revent = function (__elementTarget, __stringType, __functionEvent) {
		if (window.removeEventListener) {
			__elementTarget.removeEventListener(__stringType, __functionEvent, false);
		} else if (window.attachEvent) {
			__elementTarget.detachEvent("on" + __stringType, __functionEvent);
		}
	};
	this._load = function (__stringUrl, __functionCallback, __stringCharset) {
		var __elementScript = document.createElement("script");
		__elementScript.type = "text/javascript";
		if (typeof __stringCharset != "undefined") {
			__elementScript.charset = __stringCharset;
		}
		__elementScript._functionCallback = typeof __functionCallback != "undefined" ?  __functionCallback : new Function();
		__elementScript[document.all ? "onreadystatechange" : "onload"] = function () {
			if (document.all && this.readyState != "loaded" && this.readyState != "complete") {return;}
			this._functionCallback(this);
			this._functionCallback = null;
			this[document.all ? "onreadystatechange" : "onload"] = null;
			this.parentNode.removeChild(this);
		};
		__elementScript.src = __stringUrl;
		document.getElementsByTagName("head")[0].appendChild(__elementScript);
	};
	this._fill = function (__element, __stringValue, __stringAttribute) {
		__stringAttribute = typeof __stringAttribute == "undefined" ? "innerHTML" : __stringAttribute;
		if (__element[__stringAttribute] != __stringValue) {
			__element[__stringAttribute] = __stringValue;
		}
	};
	this._create = function (__stringTag, __stringStyle, __arrayChild, __objectProperty) {
		var __element = document.createElement(__stringTag);
		if (typeof __stringStyle != "undefined" && __stringStyle != null) {
			if (__stringStyle.indexOf(":") != -1) {
				__element.style.cssText = __stringStyle;
			}
			else {
				__element.className = __stringStyle;
			}
		}
		if (typeof __arrayChild != "undefined" && __arrayChild != null) {
			for (var i in __arrayChild) {
				if (typeof __arrayChild[i] == "string") {
					__element.appendChild(document.createTextNode(__arrayChild[i]));
				}
				else {
					__element.appendChild(__arrayChild[i]);
				}
			}
		}
		if (typeof __objectProperty != "undefined" && __objectProperty != null) {
			for (var i in __objectProperty) {
				__element[i] = __objectProperty[i];
			}
		}
		return __element;
	};
	this._replace = function (__stringHtmlTemplate, __objectData, __objectConfigurationCustom) {
		var __random = function () {
			return (new Date()).getTime() + Math.random().toString().replace("0.", "");
		};
		var __objectConfiguration = {
			"name": "SINAHTMLTEMPLATEENGINE",
			"begin": "<" + "!-- %",
			"end": "% --" + ">",
			"tag": /\$([^\$]+)\$/g,
			"prefix": [/(\s)\$\$([\w]+=)/g, "$1$2"],
			"object": {},
			"print": "print",
			"data": "data"
		};
		if (typeof __objectConfigurationCustom != "undefined" && __objectConfigurationCustom != null) {
			for (var i in __objectConfigurationCustom) {
				__objectConfiguration[i] = __objectConfigurationCustom[i];
			}
		}
		try {
			var __stringContainerId = __objectConfiguration["name"];
			if (!(__stringContainerId in window)) {
				window[__stringContainerId] = {};
			}
			var __stringContainerName = 'window["' + __stringContainerId + '"]';
			var __objectContainer = window[__stringContainerId];
			var __stringHtmlId = "HTML_" + __random();
			__objectContainer[__stringHtmlId] = [];
			var __stringDataId = "DATA_" + __random();
			__objectContainer[__stringDataId] = __objectData;
			var __stringObjectId = "OBJECT_" + __random();
			__objectContainer[__stringObjectId] = __objectConfiguration["object"];
			
			var __stringBegin = __objectConfiguration["begin"];
			var __stringEnd = __objectConfiguration["end"];
			var __stringPrint = __objectConfiguration["print"];
			var __arrayCommand = [__stringEnd, __stringHtmlTemplate.replace(new RegExp(__stringBegin.replace(/\s+/g, "\\s*"), "gm"), __stringBegin).replace(new RegExp(__stringEnd.replace(/\s+/g, "\\s*"), "gm"), __stringEnd), __stringBegin].join("").split(__stringEnd);
			for (var i in __arrayCommand) {
				var __arraySplit = __arrayCommand[i].split(__stringBegin);
				__arrayCommand[i] = __stringPrint + '("' + __arraySplit[0].replace(/"/g, '\\"').replace(/[\r\n]/g, '\\\n').replace(__objectConfiguration["prefix"][0], __objectConfiguration["prefix"][1]).replace(__objectConfiguration["tag"], '" + $1 + "') + '");' + (1 in __arraySplit ? __arraySplit[1] : "");
			}
			eval('(function (' + __objectConfiguration["data"] + ') {' + __arrayCommand.join("").replace(new RegExp("\\b" + __stringPrint + "\\b", "g"), __stringContainerName + '["' + __stringHtmlId + '"].push') + '}).call(' + __stringContainerName + '["' + __stringObjectId + '"], ' + __stringContainerName + '["' + __stringDataId + '"]);');
			var __stringHtmlEval = window[__stringContainerId][__stringHtmlId].join("");
			window[__stringContainerId][__stringHtmlId] = null;
			delete window[__stringContainerId][__stringHtmlId];
			window[__stringContainerId][__stringDataId] = null;
			delete window[__stringContainerId][__stringDataId];
			return __stringHtmlEval;
		}
		catch (e) {
			return "";
		}
	};
	this._getChildren = function (__objectTarget) {
		var __elementParent = typeof __objectTarget == "string" ? document.getElementById(__objectTarget) : __objectTarget;
		var __arrayChildren = [];
		for (var i = 0; i < __elementParent.childNodes.length; i++){
			if (__elementParent.childNodes[i].nodeType == 1) {
				__arrayChildren.push(__elementParent.childNodes[i]);
			}
		}
		return __arrayChildren;
	};
	this._getFlashMovieObject = function (__stringMovieName) {
		if (__stringMovieName in window) {
			return window[__stringMovieName];
		}
		else if (__stringMovieName in window.document){
			return window.document[__stringMovieName];
		}
		else if (navigator.appName.indexOf("Microsoft Internet") == -1) {
			if (document.embeds && __stringMovieName in document.embeds) {
				return document.embeds[__stringMovieName]; 
			}
		}
		else {
			return document.getElementById(__stringMovieName);
		}
	};
	this._cancelBubble = function () {
		(arguments[0] || window.event).cancelBubble = true;
	};
	this._query = function () {
		var __stringSearch = window.location.search;
		var __arrayMatched = __stringSearch.match(/[?&]([^=]+)=([^&]+)(?=&|$)/g);
		var __objectHash = {};
		if (__arrayMatched != null) {
			for (var i = 0; i < __arrayMatched.length; i++) {
				var __arraySub = __arrayMatched[i].replace(/^[?&]/, "").split("=");
				__objectHash[__arraySub[0]] = __arraySub[1];
			}
		}
		return __objectHash;
	};
	this._checkBrowser = function () {
		var __stringUserAgent = navigator.userAgent;
		//~  Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; InfoPath.1; .NET CLR 1.1.4322; .NET CLR 2.0.50727; IE7Pro)
		//~  Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; InfoPath.1; .NET CLR 1.1.4322; .NET CLR 2.0.50727; IE7Pro)
		//~  Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/525.19 (KHTML, like Gecko) Chrome/1.0.154.36 Safari/525.19
		//~  Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN) AppleWebKit/525.27.1 (KHTML, like Gecko) Version/3.2.1 Safari/525.27.1
		//~  Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN; rv:1.9.0.5) Gecko/2008120122 Firefox/3.0.5
		//~  Opera/9.63 (Windows NT 5.1; U; Edition IBIS; zh-cn) Presto/2.1.1
		if (/^Opera.*/.test(__stringUserAgent) == true) {
			return "opera";
		}
		else if (/^Mozilla\/4\.0.*/.test(__stringUserAgent) == true) {
			if (__stringUserAgent.indexOf("MSIE 7.0") != -1) {
				return "ie7";
			}
			else if (__stringUserAgent.indexOf("MSIE 6.0") != -1) {
				return "ie6";
			}
			else if (__stringUserAgent.indexOf("MSIE") != -1) {
				return "ie";
			}
			else {
				return "mozilla4";
			}
		}
		else if (/^Mozilla\/5\.0.*/.test(__stringUserAgent) == true) {
			if (__stringUserAgent.indexOf("Chrome") != -1) {
				return "chrome";
			}
			else if (__stringUserAgent.indexOf("Safari") != -1) {
				return "safari";
			}
			else if (__stringUserAgent.indexOf("Firefox") != -1) {
				return "firefox";
			}
			else {
				return "mozilla5";
			}
		}
		else {
			return "unknown"
		}
		return "unknown"
	};
	this._ajax = function (__stringUrl, __stringContent, __functionCallback) {
		var __xmlhttp = (function () {
			try {
				return new XMLHttpRequest();
			}
			catch (e) {
			}
			try {
				return new ActiveXObject('Msxml2.XMLHTTP');
			}
			catch (e) {
			}
			try {
				return new ActiveXObject('Microsoft.XMLHTTP');
			}
			catch (e) {
			}
			return null;
		})();
		if (__xmlhttp != null) {
			__xmlhttp.open("post", __stringUrl, true);
			__xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			__xmlhttp.setRequestHeader("Content-Type","text/xml");
			__xmlhttp.setRequestHeader("Content-Type","gb2312");
			__xmlhttp.onreadystatechange = function () {
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					var __stringResponseText = __xmlhttp.responseText;
					__xmlhttp.abort();
					__xmlhttp = null;
					__stringContent(__stringResponseText);
				}
			};
			__xmlhttp.send(typeof __stringContent == "undefined" ? null : __stringContent);
		}
	};
	this._image = function (__objectTarget, __stringSrc, __functionCallback) {
		var __imageTarget = typeof __objectTarget == "string" ? document.getElementById(__objectTarget) : __objectTarget;
		var __elementImage = __imageTarget.cloneNode(true);
		__elementImage._imageTarget = __imageTarget;
		__elementImage._functionCallback = typeof __functionCallback != "undefined" ?  __functionCallback : new Function();
		__elementImage[document.all ? "onreadystatechange" : "onload"] = function () {
			if (document.all && this.readyState != "loaded" && this.readyState != "complete") {
				return;
			}
			this._imageTarget.parentNode.replaceChild(this, this._imageTarget);
			__elementImage._functionCallback(this);
			__elementImage._functionCallback = null;
			this._imageTarget = null;
			this[document.all ? "onreadystatechange" : "onload"] = null;
		};
		__elementImage.src = __stringSrc;
	};
	this._getNext = function (__elementSelf) {
		var __elementTarget = __elementSelf.nextSibling;
		while (__elementTarget && __elementTarget.nodeType != 1){
			__elementTarget = __elementTarget.nextSibling;
		}
		return __elementTarget;
	};
	this._getPrevious = function (__elementSelf) {
		var __elementTarget = __elementSelf.previousSibling;
		while (__elementTarget && __elementTarget.nodeType != 1){
			__elementTarget = __elementTarget.previousSibling;
		}
		return __elementTarget;
	};
	this._show = function (__objectTarget) {
		if (__objectTarget.style.display != "") {
			__objectTarget.style.display = "";
		}
	};
	this._hide = function (__objectTarget) {
		if (__objectTarget.style.display != "none") {
			__objectTarget.style.display = "none";
		}
	};
	this._rcall = function (__stringServicePath, __stringMethod, __functionCallback, __objectArgument) {
		var __stringArgument = __objectArgument ? __objectArgument : "";
		var __stringCallbackId = "CALLBACK_" + (new Date()).getTime() + Math.random().toString().replace("0.", "");
		var __stringCallbackObject = "SINAREMOTECALLCALLBACK";
		if (!(__stringCallbackObject in window)) {
			window[__stringCallbackObject] = {};
		}
		window[__stringCallbackObject][__stringCallbackId] = typeof __functionCallback == "undefined" ? (function () {}) : __functionCallback;
		switch (typeof __objectArgument) {
			case "object":
				var __arrayArgument = [];
				for (var i in __objectArgument) {
					__arrayArgument.push(i + "=" + __objectArgument[i]);
				}
				__stringArgument = __arrayArgument.length == 0 ? "" : "?" + __arrayArgument.join("&");
				break;
			case "string":
				__stringArgument = "?" + __objectArgument;
				break;
			default:
				break;
		}
		var __elementScript = document.createElement("script");
		__elementScript.type = "text/javascript";
		__elementScript[document.all ? "onreadystatechange" : "onload"] = function () {
			if (document.all && this.readyState != "loaded" && this.readyState != "complete") {return;}
			delete window[__stringCallbackObject][__stringCallbackId];
			this[document.all ? "onreadystatechange" : "onload"] = null;
			this.parentNode.removeChild(this);
		};
		__elementScript.src = __stringServicePath + "/" + __stringCallbackObject + "." + __stringCallbackId + "/" + __stringMethod + __stringArgument;
		document.getElementsByTagName("head")[0].appendChild(__elementScript);
	};
	this._initialize = function () {
	};
	this._initialize.apply(this, arguments);
};
