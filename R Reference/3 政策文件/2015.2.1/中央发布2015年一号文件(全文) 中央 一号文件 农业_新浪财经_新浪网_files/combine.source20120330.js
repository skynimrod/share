/**
 * @author tongye
 */
( function( $ ){
	function List( config ){
		$.extend( this, config);
		return this.init();
	};
	
	List.prototype = {
		el		: null,
		overCls : false,
		zebra	: false,
		zebraCls: "",
		//defaults: {},
		//codes  : [],
		combine	: false, //由HQ得到的是一个数组
		combineVar : "", //数组名
		combineLen : 0,  //数组长度
		
		//param : [ {}, {}, {} ]
		init	: function(){
			this.el = $( this.el );
			this.items	 = [];
			this.params	 = this.params || [];
			this.defaults = this.defaults || {};
			this.codes = [];
					
			var n = this.combineLen || this.params.length;		
			for (var i=0; i< n; i++) {
				this.items.push( 
					new ListItem( $.extend( { index : i, list : this, bgCls : this.zebra && i % this.zebra == 0 ? this.zebraCls : false }, this.defaults, this.params[i] ) ) 
				);
				if ( this.params[i] && this.params[i].code )
					this.codes.push( this.params[i].code );
			}
			
			return this;
		},		
		setData	: function( arr ){
			this.arr = arr;
			var body = $("<tbody>");
			var n = this.combineLen || arr.length;		
			for (var i=0; i<n; i++) {
				body.append( this.items[i].setData( arr[i] ).create() );
			}
			//this.el.find("tbody").remove();
			//this.el.append( body );
			this.el.find("tbody").replaceWith( body );
		},
		loadData: function(){}
	};
	
	var ListItem = function( config ){
		$.extend( this, config || {});
		return this.init();
	};
	
	ListItem.prototype = {
		code	: null,
		link	: false,
		china	: true,	//红涨绿跌
		title	: "",
		titleIndex	: null, //股票名称所在位置
		current	: 3, 	//当前价
		rate	: null, //涨跌幅
		compare : null, //昨收价
		digi	: 2, 	//小数位
		bgCls	: false,
		priceCls: "blue",
		colCls	: "cor_blue",
		upCls	: "red",
		downCls : "green",
		rsymbol : "@code@",   //待替换的标识符
		rvar	: "code",     //待替换的变量名
		target  : "_self",
		unit	: "%",
		pre		: "+",		//上涨时添加
		index	: 0, 	//数组中的位置
		list	: null, //List对象
		
		init	: function(){
			this.data = [];
			return this;
		},
		create	: function(){
			var tr = $("<tr>");
			//背景cls
			if ( this.bgCls && this.bgCls != "" )
				tr.addClass( this.bgCls );
			var r = this.getRate(), cls = "";
			if (r > 0) {
				cls = this.china ? this.upCls : this.downCls;
				if ( this.pre )
					r = "+" + r;	
			}else if ( r < 0 )
				cls = this.china ? this.downCls : this.upCls;	
							
			$("<td>").addClass("lft").html( this.link === false ? this.getTitle() : ("<a target='" + this.target + "' href='" + this.getLink() + "'>" + this.getTitle() + "</a>") ).appendTo( tr );
			$("<td>").html( this.getPrice() ).addClass( this.priceCls || cls ).appendTo( tr );
			$("<td>").html( r + this.unit ).addClass( cls ).appendTo( tr );
			
			return tr;
		},
		
		setData	: function( data ){
			this.data = data;
			return this;
		},
		
		getLink	: function( i ){
			if ( this.rsymbol && (this[ this.rvar ] || this.data[ this.rvar ] ) )
				return this.link.replace( this.rsymbol , this[ this.rvar ] || this.data[ this.rvar ] );
			else
				return this.link;	
		},
		getTitle: function(){
//			if ( !this.title && this.titleIndex != null )
				this.title = this.data[ this.titleIndex ];
				
			return this.title;
		},
		getPrice: function(){
			var p = parseFloat(this.data[ this.current ]);
			if ( isNaN(p) || p == 0 )
				p = "--";	
			else
				p = p.toFixed( this.digi );			
			return p;
		},
		getRate	: function(){
			var r;
			if ( this.rate )
				r = parseFloat( this.data[ this.rate ] );
			else
				r = 100 * (parseFloat(this.data[ this.current ]) - parseFloat(this.data[ this.compare ])) / parseFloat(this.data[ this.compare ]);
			
			if ( isNaN(r) )
				r = "--";
			else
				r = r.toFixed( this.digi );		
			return r;	
		}		
	};

	$.HQList = List;
	
	$.HQListMgr = function( config ){
		$.extend( this, config || {});
		return this.init();
	};
	
	$.HQListMgr.prototype = {
		inter	: 1000 * 30,
		timer	: null,
		suspend	: false,
		
		init	: function(){
			this.items = [];
			
			return this;
		},	
		
		push		: function( list ){
			this.items.push( list );
			return this;
		},
		
		remove	: function( list ){
			var i = $.inArray(list, this.items);
			if ( i > -1 )  
				this.items.splice( i, 1);
			return this;
		},
		
		start	: function(){
			this.suspend = false;
			if ( this.timer )
				clearInterval( this.timer );
				
			var codes = [];
			for (var i=0; i<this.items.length; i++) {
				codes = codes.concat( this.items[i].combineVar || this.items[i].codes );
			}
			//开始循环
			var _self = this;
			var loop = function(){
				if (codes.length > 0) {
					$.getScript("http://hq.sinajs.cn/_=" + (+new Date()) + "&list=" + codes.join(","), function(){
						if (!_self.suspend) {
							for (var i = 0; i < _self.items.length; i++) {
								var l = _self.items[i], arr = [];
								if (l.combine) {
									arr = eval(eval("hq_str_" + l.combineVar));
								}
								else {
									for (var j = 0; j < l.codes.length; j++) {
										arr.push(eval("hq_str_" + l.codes[j] + ".split(',')"));
									}
								}
								l.setData(arr);
							}
						}
					});
				}
			};
			this.timer = setInterval( loop, this.inter );
			loop();		
			
			return this;		
		},
		
		stop	: function(){
			if ( this.timer )
				clearInterval( this.timer );
			this.suspend = true;
			
			return this;	
		}
	};
	
} )( jQuery );

/**
 * sina flash class
 * @version 1.1.4.2
 * @author [sina ui]zhangping1@
 * @update 2008-7-7 
 */
 
if(typeof(sina)!="object"){var sina={}}
sina.$=function(i){if(!i){return null}
return document.getElementById(i)};var sinaFlash=function(V,x,X,Z,v,z,i,c,I,l,o){var w=this;if(!document.createElement||!document.getElementById){return}
w.id=x?x:'';var O=function(I,i){for(var l=0;l<I.length;l++){if(I[l]==i){return l}}
return-1},C='8.0.42.0';if(O(['eladies.sina.com.cn','ent.sina.com.cn'],document.domain)>-1){w.ver=C}else{w.ver=v?v:C}
w.ver=w.ver.replace(/\./g,',');w.__classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000";w.__codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version="+w.ver;w.width=X;w.height=Z;w.movie=V;w.src=w.movie;w.bgcolor=z?z:'';w.quality=c?c:"high";w.__pluginspage="http://www.macromedia.com/go/getflashplayer";w.__type="application/x-shockwave-flash";w.useExpressInstall=(typeof(i)=="boolean")?i:false;w.xir=I?I:window.location;w.redirectUrl=l?l:window.location;w.detectKey=(typeof(o)=="boolean")?o:true;w.escapeIs=false;w.__objAttrs={};w.__params={};w.__embedAttrs={};w.__flashVars=[];w.__flashVarsStr="";w.__forSetAttribute("id",w.id);w.__objAttrs["classid"]=w.__classid;w.__forSetAttribute("codebase",w.__codebase);w.__forSetAttribute("width",w.width);w.__forSetAttribute("height",w.height);w.__forSetAttribute("movie",w.movie);w.__forSetAttribute("quality",w.quality);w.__forSetAttribute("pluginspage",w.__pluginspage);w.__forSetAttribute("type",w.__type);w.__forSetAttribute("bgcolor",w.bgcolor)}
sinaFlash.prototype={getFlashHtml:function(){var I=this,i='<object ';for(var l in I.__objAttrs){i+=l+'="'+I.__objAttrs[l]+'"'+' '}
i+='>\n';for(var l in I.__params){i+='	<param name="'+l+'" value="'+I.__params[l]+'" \/>\n'}
if(I.__flashVarsStr!=""){i+='	<param name="flashvars" value="'+I.__flashVarsStr+'" \/>\n'}
i+='	<embed ';for(var l in I.__embedAttrs){i+=l+'="'+I.__embedAttrs[l]+'"'+' '}
i+='><\/embed>\n<\/object>';return i},__forSetAttribute:function(I,i){var l=this;if(typeof(I)=="undefined"||I==''||typeof(i)=="undefined"||i==''){return}
I=I.toLowerCase();switch(I){case "classid":break;case "pluginspage":l.__embedAttrs[I]=i;break;case "onafterupdate":case "onbeforeupdate":case "onblur":case "oncellchange":case "onclick":case "ondblClick":case "ondrag":case "ondragend":case "ondragenter":case "ondragleave":case "ondragover":case "ondrop":case "onfinish":case "onfocus":case "onhelp":case "onmousedown":case "onmouseup":case "onmouseover":case "onmousemove":case "onmouseout":case "onkeypress":case "onkeydown":case "onkeyup":case "onload":case "onlosecapture":case "onpropertychange":case "onreadystatechange":case "onrowsdelete":case "onrowenter":case "onrowexit":case "onrowsinserted":case "onstart":case "onscroll":case "onbeforeeditfocus":case "onactivate":case "onbeforedeactivate":case "ondeactivate":case "codebase":l.__objAttrs[I]=i;break;case "src":case "movie":l.__embedAttrs["src"]=i;l.__params["movie"]=i;break;case "width":case "height":case "align":case "vspace":case "hspace":case "title":case "class":case "name":case "id":case "accesskey":case "tabindex":case "type":l.__objAttrs[I]=l.__embedAttrs[I]=i;break;default:l.__params[I]=l.__embedAttrs[I]=i}},__forGetAttribute:function(i){var I=this;i=i.toLowerCase();if(typeof I.__objAttrs[i]!="undefined"){return I.__objAttrs[i]}else if(typeof I.__params[i]!="undefined"){return I.__params[i]}else if(typeof I.__embedAttrs[i]!="undefined"){return I.__embedAttrs[i]}else{return null}},setAttribute:function(I,i){this.__forSetAttribute(I,i)},getAttribute:function(i){return this.__forGetAttribute(i)},addVariable:function(I,i){var l=this;if(l.escapeIs){I=escape(I);i=escape(i)}
if(l.__flashVarsStr==""){l.__flashVarsStr=I+"="+i}else{l.__flashVarsStr+="&"+I+"="+i}
l.__embedAttrs["FlashVars"]=l.__flashVarsStr},getVariable:function(I){var o=this,i=o.__flashVarsStr;if(o.escapeIs){I=escape(I)}
var l=new RegExp(I+"=([^\\&]*)(\\&?)","i").exec(i);if(o.escapeIs){return unescape(RegExp.$1)}
return RegExp.$1},addParam:function(I,i){this.__forSetAttribute(I,i)},getParam:function(i){return this.__forGetAttribute(i)},write:function(i){var I=this;if(typeof i=="string"){document.getElementById(i).innerHTML=I.getFlashHtml()}else if(typeof i=="object"){i.innerHTML=I.getFlashHtml()}}}



Function.prototype.Bind=function(){var D=this,B=arguments[0],A=new Array();for(var C=1;C<arguments.length;C++){A.push(arguments[C])}return function(){return D.apply(B,A)}};var isIE=false;var userAgent=navigator.userAgent.toLowerCase();if((userAgent.indexOf("msie")!=-1)&&(userAgent.indexOf("opera")==-1)){isIE=true}if(typeof IO=="undefined"){IO={}}IO.Script=function(){this.Init.apply(this,arguments)};IO.Script.prototype={_scriptCharset:"gb2312",_oScript:null,Init:function(A){this._setOptions(A)},_setOptions:function(A){if(typeof A!="undefined"){if(A.script_charset){this._scriptCharset=A.script_charset}}},_clearScriptObj:function(){if(this._oScript){try{this._oScript.onload=null;if(this._oScript.onreadystatechange){this._oScript.onreadystatechange=null}this._oScript.parentNode.removeChild(this._oScript)}catch(A){}}},_callbackWrapper:function(B){if(this._oScript.onreadystatechange){if(this._oScript.readyState!="loaded"&&this._oScript.readyState!="complete"){return }}if(typeof B!="undefined"){if(typeof B=="object"){for(var A in B){if(!B[A].sc_pause){B[A]()}}}else{B()}}this._clearScriptObj()},load:function(A,B){this._oScript=document.createElement("SCRIPT");this._oScript.type="text/javascript";if(isIE){this._oScript.onreadystatechange=this._callbackWrapper.Bind(this,B)}else{this._oScript.onload=this._callbackWrapper.Bind(this,B)}this._oScript.charset=this._scriptCharset;this._oScript.src=A;document.getElementById("for_loader").appendChild(this._oScript)}};var ScriptCtrl={_urlHq:"http://hq.sinajs.cn/?rn=@RN@&list=",_urlTextHq:"http://hq.sinajs.cn/?rn=@RN@&format=text&list=",_oCallbacks:{},_oUrls:{},_oCodes:{},_oThreads:{},_sId:0,load:function(B,E,A){var D="_"+A;var C=this._start(B,E,A,D,false);return C},loadText:function(B,E,A){var D="_text"+A;var C=this._start(B,E,A,D,true);return C},_start:function(C,F,B,D,E){if(B){if(!this._oCodes[D]){this._oCodes[D]={};this._oCallbacks[D]={}}var A="thd_"+this._sId;this._oCodes[D][A]=C;this._oCallbacks[D][A]=F;this._oUrls[D]=this._sort(this._oCodes[D]);if(this._oThreads[D]){window.clearInterval(this._oThreads[D])}this._oThreads[D]=window.setInterval(this._getScript.Bind(this,this._oUrls[D],this._oCallbacks[D],E),B);this._sId++}this._getScript(C,F,E);return[B,A,D,E]},_getScript:function(A,E,D){var C=new IO.Script();var B=D?this._urlTextHq.replace("@RN@",(new Date()).getTime())+A:this._urlHq.replace("@RN@",(new Date()).getTime())+A;C.load(B,E)},_sort:function(A){var C=[];for(var B in A){if(!A[B].sc_pause){C=C.concat(A[B])}}return this._removeDpl(C)},_removeDpl:function(A){var B=A.sort();var D=[];for(var C=0;C<B.length-1;C++){if(B[C]!=B[C+1]){D.push(B[C])}}D.push(B[B.length-1]);return D},pause:function(A){var B=A[2];if(this._oCallbacks[B][A[1]].sc_pause){return }this._oCallbacks[B][A[1]].sc_pause=true;this._oCodes[B][A[1]].sc_pause=true;this._oUrls[B]=this._sort(this._oCodes[B])},resume:function(A){var C=A[2];if(!this._oCallbacks[C][A[1]].sc_pause){return }this._oCallbacks[C][A[1]].sc_pause=false;this._oCodes[C][A[1]].sc_pause=false;this._oUrls[C]=this._sort(this._oCodes[C]);window.clearInterval(this._oThreads[C]);for(var B in this._oCodes[C]){this._oThreads[C]=window.setInterval(this._getScript.Bind(this,this._oUrls[C],this._oCallbacks[C],A[3]),A[0]);break}},stop:function(A){var C=A[2];delete this._oCodes[C][A[1]];delete this._oCallbacks[C][A[1]];this._oUrls[C]=this._sort(this._oCodes[C]);window.clearInterval(this._oThreads[C]);for(var B in this._oCodes[C]){this._oThreads[C]=window.setInterval(this._getScript.Bind(this,this._oUrls[C],this._oCallbacks[C],A[3]),A[0]);break}}};


//ADD 2010 
( function($){
	$.extend({
		getJSONP : function( url, service, data, callback ){
			
			var fnName = "SINAFINANCE" + (+new Date()) + ( parseInt( Math.random() *1000 ) );
			window[fnName] = function(){
				callback.apply(this, arguments);
				try {
					delete window[fnName];
				} 
				catch (e) {
				}
			};
			var urlP = url + "/" + fnName + "/" + service;
			$.ajax({
				url: urlP,
				data: data,
				dataType: "script"
			});
		}
	});
} )(jQuery);

//if( typeof $ == 'undefined' )$ = function(t){return document.getElementById(t)};
$ = function(t){
	return document.getElementById(t)
};

if( typeof $C == 'undefined' )$C = function(t){return document.createElement(t)};

function oEvent(evt){ 
	var evt = evt ? evt : (window.event ? window.event : null);
	var objSrc = (evt.target) ? evt.target : evt.srcElement;
	return(objSrc);
}

function getEvent(){
	var evt = window.event ? window.event : getEvent.caller.arguments[0];
	return(evt);
}

Function.prototype.Bind = function() { 
	var __m = this, object = arguments[0], args = new Array(); 
	for(var i = 1; i < arguments.length; i++){
		args.push(arguments[i]);
	}
	
	return function() {
		return __m.apply(object, args);
	}
};

Function.prototype.BindForEvent = function() { 
	var __m = this, object = arguments[0], args = new Array();
	for(var i = 1; i < arguments.length; i++){
		args.push(arguments[i]);
	}
	
	return function(event) {
		return __m.apply(object, [( event || window.event)].concat(args));
	}
}

function addEvent(oTarget, sEventType, fnHandler) {
	if (oTarget.addEventListener) {
		oTarget.addEventListener(sEventType, fnHandler, false);
	}
	else if (oTarget.attachEvent) {
		oTarget.attachEvent("on" + sEventType, fnHandler);
	}
	else {
		oTarget["on" + sEventType] = fnHandler;
	}
}

//------------------------------------------------------------------------------
//tab switch
//------------------------------------------------------------------------------

var TabSwitch = function(){
	this.Init.apply(this, arguments);
};
TabSwitch.prototype = {
	Init: function(tabs, targets, callbackObjArr, evtType){
		this.tabs = [];
		this.targets = [];
		var tempTabs = tabs.childNodes, tempTargets = targets.childNodes;
		for (var i = 0; i < tempTabs.length; i++){
			if (tempTabs[i].nodeType == 1){
				this.tabs.push(tempTabs[i]);
			}
		};
		for (var j = 0; j < tempTargets.length; j++){
			if (tempTargets[j].nodeType == 1){
				this.targets.push(tempTargets[j]);
			}
		};

		if (evtType != "mouseover") {
			if (callbackObjArr) {
				for (var k = 0; k <  this.tabs.length; k++ ){
					this.tabs[k].onclick = this.showTab.Bind(this,k,callbackObjArr[k]);
				}
			}
			else {
				for (var k = 0; k <  this.tabs.length; k++ ){
					this.tabs[k].onclick = this.showTab.Bind(this,k);
				}
			}
		}
		else if (evtType == "mouseover") {
			if (callbackObjArr) {
				for (var k = 0; k <  this.tabs.length; k++ ){
					this.tabs[k].onmouseover = this.tabOver.Bind(this,k,callbackObjArr[k]);
					this.tabs[k].onmouseout = this.tabOut.Bind(this,k,callbackObjArr[k]);
				}
			}
			else {
				for (var k = 0; k <  this.tabs.length; k++ ){
					this.tabs[k].onmouseover = this.tabOver.Bind(this,k);
					this.tabs[k].onmouseout = this.tabOut.Bind(this,k);
				}
			}
		}

		this.activeTab = this.tabs[0];
		this.activeTarget = this.targets[0];
	},
	showTab: function(_index,callback){
		if (this.tabs[_index] == this.activeTab){
			return;
		}
		if (this.activeTab){
			this.activeTab.className = "";
		}
		this.activeTab = this.tabs[_index];
		this.activeTab.className = "active";

		if (this.activeTarget){
			this.activeTarget.style.display = "none";
		}
		this.activeTarget = this.targets[_index];
		this.activeTarget.style.display = "";

		if (callback) {
			callback();
		}
	},
	tabOver: function (_index, callback) {
		if (this.timeOut) {
			window.clearTimeout(this.timeOut);
		}
		if (this.tabs[_index].className != "active") {
			this.tabs[_index].className = "over";
		}
		this.overTab = this.tabs[_index];
		this.timeOut = window.setTimeout(this.showTab.Bind(this, _index, callback), 300);
	},
	tabOut: function (_index) {
		window.clearTimeout(this.timeOut);
		if (this.overTab.className != "active") {
			this.overTab.className = "";
		}
	}
}

//------------------------------------------------------------------------------
//select ctrl
//------------------------------------------------------------------------------
var SelectCtrl = function(){
	this.Init.apply(this, arguments);
};
SelectCtrl.prototype = {
	Init: function(aConfig, target, config){
		this.targets = [];
		this.oSelect = $C("SELECT");
		this._wrapSelect(this.oSelect, target, config);

		for (var i = 0; i < aConfig.length; i++) {
			var _op = $C("OPTION");
			_op.innerHTML = aConfig[i].option;
			this.oSelect.appendChild(_op);

			var _div = $C("DIV");
			if (i != 0) {
				_div.style.display = "none";
			}
			_div.innerHTML = '<div class="loading_n">读取中，请稍候...</div>';
			target.appendChild(_div);
			this.targets.push(_div);
			
			//ADD 2010  增加更多链接
/*
			if ( aConfig[i].urlMore )
				$(target).find(".more2").show().find("a").attr("href", aConfig[i].urlMore);
*/
		};

		this.oSelect.onchange = this._start.Bind(this);

		this.activeIndex = 0;

		this.loaded = true;
	},

	_wrapSelect: function (obj, target, config) {
		var _wrap = $C("DIV");
		_wrap.className = "cTitle_06";
		var _h2 = $C("H2");
		_h2.style.fontWeight = "normal";
		_h2.innerHTML = "请选择指标：";
		var _span = $C("SPAN");
		_span.appendChild(obj);
		_wrap.appendChild(_h2);
		
		//add 更多链接
		if ( config.urlMore && config.urlMore[0] )
			_wrap.innerHTML += '<span class="more2"><a href="' + config.urlMore[0] + '" target="_blank" class="cfnoL">更多&gt;&gt;</a></span>'; 
		else
			_wrap.innerHTML += '<span style="visibility:hidden;" class="more2"><a href="#" target="_blank" class="cfnoL">更多&gt;&gt;</a></span>';	
		
		_wrap.appendChild(_span);
		target.innerHTML = "";
		target.appendChild(_wrap);
	},

	_start: function(obj,_index,callback){
		if (this.oSelect.selectedIndex == this.activeIndex){
			return;
		}

		if (this.targets[this.activeIndex]){
			this.targets[this.activeIndex].style.display = "none";
		}

		this.activeIndex = this.oSelect.selectedIndex;
		this.targets[this.activeIndex].style.display = "";
	}
}


//tab列表控制
var MassListCtrl = function(){
	this.Init.apply(this, arguments);
};
MassListCtrl.prototype = {
	_config: [],
	_sUrl: '<a href="http://finance.sina.com.cn/realstock/company/@CODE@/nc.shtml" target="_blank">@TEXT@</a>',
	_sJlUrl: 'http://biz.finance.sina.com.cn/hq/sinaIndustryHq.php',
	_sSjUrl: 'http://biz.finance.sina.com.cn/asset_flow/get_asset_flow.php?type=@TYPE@',
	_sJSONP: 'http://vip.stock.finance.sina.com.cn/quotes_service/api/jsonp.php',
//	_sGmUrl: 'http://finance.sina.com.cn/stockhead/@TYPE@.js',
//	这个接口是盖振做的，下面那个是光明做的，有点问题
	_sGmUrl: 'http://vip.stock.finance.sina.com.cn/corp/view/stock_index_basic.php?item_name=@TYPE@@DATE@&number=14&date_method=fix',
	_sTitle: '<div class="cTitle_06">\
				<h2>@MAK@</h2>@MORE@\
			</div>',
	_sMore: '<span><a href="@LINK@" target="_blank" class="cfnoL">更多>></a></span>',
	_sClear: '<div class="csp_h7"></div><div class="csp_h8"></div>',
	_selects: [],

	Init: function (config) {
		if (config) {
			this._config = config;
		}
	},

	start: function (tabs, targets) {
		this._tabCtrl = new TabSwitch(tabs, targets);
		this._oTabs = this._tabCtrl.tabs;
		this._oTargets = this._tabCtrl.targets;

		for (var i = 0; i < this._oTabs.length; i++) {
			addEvent(this._oTabs[i], "click", this._trigger.Bind(this, this._config, this._oTargets, i));
		};

		this._1stCallback(this._config, this._oTargets, 0);
	},

	_1stCallback: function (config, targets) {
		if (config[0]) {
			this._trigger(config, targets, 0);
		}
	},

	_trigger: function (config, targets, index) {
		var _index = typeof index == "number" ? index : index.selectedIndex;
//		if (this.thread) {
//			ScriptCtrl.change(this.thread, config[index].code, this._show.Bind(this, config, targets, index));
//		}
//console.log(config[index].thread);
//		if (this.activeIndex && config[_index].thread) {
//			ScriptCtrl.pause(config[this.activeIndex].thread);
//			this.activeIndex = _index;
////			ScriptCtrl.resume(config[index].thread);
//		}
		if (config[_index].hasSubs) {
			if (config[_index].selectCtrl && config[_index].selectCtrl.loaded) {
				return ;
			}
			config[_index].selectCtrl = new SelectCtrl(config[_index].hasSubs, targets[_index], config[_index]);
			addEvent(config[_index].selectCtrl.oSelect, "change", this._trigger.Bind(this, config[_index].hasSubs, config[_index].selectCtrl.targets, config[_index].selectCtrl.oSelect));
			this._1stCallback(config[_index].hasSubs, config[_index].selectCtrl.targets, 0);
			return ;
		}
		else if (!config[_index] || config[_index].loaded) {
			if (this.activeIndex && config[_index].thread) {
				ScriptCtrl.pause(config[this.activeIndex].thread);
				this.activeIndex = _index;
				ScriptCtrl.resume(config[index].thread);
			}
			return ;
		}

		this._getData(config, targets, _index);
	},

	_getData: function (config, targets, index) {
		switch (config[index].type) {
		case "hqtext":
			if (this.activeIndex) {
				ScriptCtrl.pause(config[this.activeIndex].thread);
			}
			this.activeIndex = index;
			config[index].thread = ScriptCtrl.loadText(config[index].code, this._show.Bind(this, config, targets, index), 10000);
			break;
		case "junliang":
			var loader = new IO.Script();
			loader.load(this._sJlUrl, this._show.Bind(this, config, targets, index));
			break;
		case "shaojin":
			var loader = new IO.Script();
			loader.load(this._sSjUrl.replace("@TYPE@", config[index].code[0]), this._show.Bind(this, config, targets, index));
			break;
		case "guangming":
			var loader = new IO.Script();
			loader.load(this._sGmUrl.replace("@TYPE@", config[index].code[0]).replace("@DATE@", config[index].date), this._show.Bind(this, config, targets, index));
			break;
		case "flow":
		case "datacenter":
			var _self = this;
			jQuery.getJSONP( this._sJSONP, config[index].service, config[index].param, function( obj ){
				_self._show(config, targets, index, obj );	
			} );
			break;			
		}
	},

	_show: function (config, targets, index, obj ) {
		//每次都刷新 2010-12-13
		//config[index].loaded = true;
		var _aCode = config[index].code;
		var _aData = [];

		if (_aCode && _aCode.length > 1) {
			var _aTitle = config[index].name ? config[index].name : ["上海", "深圳"];
			targets[index].innerHTML = this._createTitle(_aTitle[0], 0, config, index);
			var hq = window[_aCode[0]];
			if ( !hq || hq.length == 0 ){
				hq = [];
				for (var i=0; i<config[index].amount; i++) {
					hq.push( [] );
				}	
			}
			targets[index].appendChild(this._getTable( hq, config, index));
			targets[index].innerHTML += this._sClear;
			targets[index].innerHTML += this._createTitle(_aTitle[1], 1, config, index);
			var hq = window[_aCode[1]];
			if ( !hq || hq.length == 0 ){
				hq = [];
				for (var i=0; i<config[index].amount; i++) {
					hq.push( [] );
				}	
			}			
			targets[index].appendChild(this._getTable( hq, config, index));
		}
		else {
			targets[index].innerHTML = "";
			switch (config[index].type) {
			case "shaojin":
				targets[index].appendChild(this._getTable(window["asset_flow_" + _aCode[0]], config, index));
				break;
			case "guangming":
				targets[index].appendChild(this._getTable(window[_aCode[0]], config, index));
				break;
			case "hqtext":
				targets[index].appendChild(this._getTable(window[_aCode[0]], config, index));
				break;
			case "flow":
				
				for (var i=0; i<obj.length; i++) {
					//百分数数值乘以100
					if ( obj[ i ].avg_changeratio )
						obj[ i ].avg_changeratio = obj[ i ].avg_changeratio * 100;
					if ( obj[ i ].changeratio )
						obj[ i ].changeratio = obj[ i ].changeratio * 100;	
					
					//流入/流出取绝对值
					if ( config[index].service == "MoneyFlow.ssl_bkzj_lxjlr" )	{
						obj[ i ].cnt_r0x_ratio = Math.abs( obj[ i ].cnt_r0x_ratio );
						//obj[ i ].netamount = Math.abs( obj[ i ].netamount );
					}
					
					//流入值以万元为单元
					if ( obj[ i ].netamount )	{
						obj[ i ].netamount = parseFloat(obj[ i ].netamount / 10000).toFixed(2);
					}
					if ( obj[ i ].outamount )	{
						obj[ i ].outamount = parseFloat(obj[ i ].outamount / 10000).toFixed(2);
					}
					if ( obj[ i ].r0_net )	{
						obj[ i ].r0_net = parseFloat(obj[ i ].r0_net / 10000).toFixed(2);
					}
					if ( obj[ i ].r0_out )	{
						obj[ i ].r0_out = parseFloat(obj[ i ].r0_out / 10000).toFixed(2);
					}
				}
				
				
				targets[index].appendChild(this._getTable( obj, config, index));
				break;	
			case "datacenter":
				for (var i=0; i<obj.length; i++) {
					//收盘价 最高价 取两位小数
					if ( obj[ i ].close )	{
						obj[ i ].close = parseFloat(obj[ i ].close).toFixed(2);
					}
					if ( obj[ i ].high ){
						obj[ i ].high = parseFloat(obj[ i ].high).toFixed(2);
					}
					if ( obj[ i ].low ){
						obj[ i ].low = parseFloat(obj[ i ].low).toFixed(2);
					}
					//百分数数值乘以100
					if ( obj[ i ].changes_con )
						obj[ i ].changes_con = obj[ i ].changes_con * 100;
					if ( obj[ i ].changes_volume_per )
						obj[ i ].changes_volume_per = obj[ i ].changes_volume_per * 100;		
					if ( obj[ i ].changes )
						obj[ i ].changes = obj[ i ].changes * 100;		
					if ( obj[ i ]._changes )
						obj[ i ]._changes = obj[ i ]._changes * 100;		
					if ( obj[ i ]._turnover )
						obj[ i ]._turnover = obj[ i ]._turnover * 100;					
				}				
				targets[index].appendChild(this._getTable( obj, config, index));
				break;	
			}
		}
	},

	_createTitle: function (market, urlId, config, index) {
		var _html = this._sTitle.replace("@MAK@", market);
		if (config[index].urlMore) {
			return _html.replace("@MORE@", this._sMore.replace("@LINK@", config[index].urlMore[urlId]));
		}
		else {
			return  _html.replace("@MORE@", "");
		}
	},

	_getTable: function (aData, config, index) {
		var _table = $C("TABLE");
		_table.className = "ctbl04";
		var _tbody = $C("TBODY");
		_table.appendChild(_tbody);

		var _nLength = config[index].amount > aData.length ? aData.length : config[index].amount;
		for (var i = -1; i < _nLength; i++) {
			if (i != -1) {
				var _code = aData[i][config[index].codeId];
				var _change = config[index].changeId ? aData[i][config[index].changeId] : 0;
			}

			var _tr = _tbody.insertRow(-1);
			for (var j in config[index].title) {
				if (i != -1) {
					var _td = _tr.insertCell(-1);
					var _title = config[index].title[j];
					if (_title.id != -1) {
						if ( aData[i][_title.id] == undefined ){
							_td.innerHTML = "--";
							continue;
						}
						if (_title.deci) {
							aData[i][_title.id] = (aData[i][_title.id] * 1).toFixed( _title.deci );
						}
						if (_title.link && _code) {
							_td.innerHTML = this._getLink(aData[i][_title.id], _code, config[index].url );
							continue;
						}
						var tmp = aData[i][_title.id];
						if (_title.rate ) {
							tmp = (tmp * 1).toFixed(2) + "%";
						}
						if (_title.color) {
							tmp = this._colorize(tmp, _change);
						}
						_td.innerHTML = tmp;
					}
					else {
						_td.innerHTML = i + 1;
					}
				}
				else {
					var _th = $C("TH");
					_th.innerHTML = j;
					_tr.appendChild(_th);
				}
			};
		};

		return _table;
	},

	_nodata: function () {
		alert("");
	},

	_colorize: function (text, value) {
		if (value > 0) {
			return '<span style="color:#f00;">' + text + '</span>';
		}
		else if (value < 0) {
			return '<span style="color:#008000;">' + text + '</span>';
		}
		return text;
	},

	_getLink: function (text, code, url) {
		return (url || this._sUrl).replace("@CODE@", code).replace("@TEXT@", text);
	}
}


var MassList_1 = new MassListCtrl([
	{type: "hqtext", code: ["new_all_turnoverrate"], amount: 14, title: {"排名": {id: -1}, "股票": {id: 1, link: true}, "最新价": {id: 2, color: true}, "换手率": {id: 3, rate: true, color:true}}, changeId: 2, codeId: 0},

	{ type: "hqtext",code: ["stock_all_up_5min_d"],amount: 14,title: { "排名": { id: -1 },"股票": { id: 1,link: true },"最新价": { id: 2,deci: 2,color: true },"涨幅": { id: 4,rate: true,color: true} },changeId: 4,codeId: 0 },
	{ type: "hqtext",code: ["stock_hs_down_5min_20"],amount: 14,title: { "排名": { id: -1 },"股票": { id: "name",link: true },"最新价": { id: "trade",deci: 2,color: true },"跌幅": { id: "percent",rate: true,color: true} },changeId: "percent",codeId: "symbol" },
	
	{type: "hqtext", code: ["stock_all_amount_d_15"], amount: 14, title: {"排名": {id: -1}, "股票": {id: 1, link: true}, "成交量": {id: 2}, "最新价": {id: 3}}, codeId: 0},
	{ type: "hqtext",code: ["stock_all_range_d_15"],amount: 14,title: { "排名": { id: -1 },"股票": { id: 1,link: true },"振幅": { id: 2,rate: true,color: true },"最新价": { id: 3} },codeId: 0 },
	{ type: "hqtext",code: ["weibi_all"],amount: 14,title: { "排名": { id: -1 },"股票": { id: 1,link: true },"委比": { id: 2,rate: true,color: true },"最新价": { id: 3} },codeId: 0 },
	{ type: "hqtext",code: ["liangbi_all"],amount: 14,title: { "排名": { id: -1 },"股票": { id: 1,link: true },"量比": { id: 2 },"最新价": { id: 3} },codeId: 0 },
	{type: "hqtext", code: ["warrant_up_d_10","warrant_down_d_10"], amount: 1, title: {"排名": {id: -1}, "名称": {id: 1, link: true}, "涨跌": {id: 2, rate: true, color:true}, "最新价": {id: 3}}, codeId: 0, name: ["涨幅排行", "跌幅排行"]}
]);


var MassList_2 = new MassListCtrl([
	{type: "flow", service : "MoneyFlow.ssl_bkzj_ssggzj", param : "page=1&num=20&sort=netamount&asc=0&bankuai=&shichang=", amount: 15, title: {"排名": {id: -1}, "名称": {id: "name", link: true}, "涨跌幅": {id: "changeratio", rate: true ,  color : true}, "净流入(万元)": {id: "netamount"}}, codeId: "symbol", changeId: "changeratio" },
	{type: "flow", service : "MoneyFlow.ssl_bkzj_ssggzj", param : "page=1&num=20&sort=netamount&asc=1&bankuai=&shichang=", amount: 15, title: {"排名": {id: -1}, "名称": {id: "name", link: true}, "涨跌幅": {id: "changeratio", rate: true,  color : true}, "净流出(万元)": {id: "netamount"}}, codeId: "symbol", changeId: "changeratio" },
	
	{type: "flow", service : "MoneyFlow.ssl_bkzj_ssggzj", param : "page=1&num=20&sort=r0_net&asc=0&bankuai=&shichang=", amount: 15, title: {"排名": {id: -1}, "名称": {id: "name", link: true}, "涨跌幅": {id: "changeratio", rate: true,  color : true}, "主力净流入(万元)": {id: "r0_net"}}, codeId: "symbol", changeId: "changeratio" },
	{type: "flow", service : "MoneyFlow.ssl_bkzj_ssggzj", param : "page=1&num=20&sort=r0_net&asc=1&bankuai=&shichang=", amount: 15, title: {"排名": {id: -1}, "名称": {id: "name", link: true}, "涨跌幅": {id: "changeratio", rate: true,  color : true}, "主力净流出(万元)": {id: "r0_net"}}, codeId: "symbol", changeId: "changeratio" },
	
	{type: "flow", service : "MoneyFlow.ssl_bkzj_lxjlr", param : "page=1&num=20&sort=cnt_r0x_ratio&asc=0&bankuai=", amount: 15, title: {"排名": {id: -1}, "名称": {id: "name", link: true}, "天数": {id: "cnt_r0x_ratio"}, "净流入(万元)": {id: "netamount"}}, codeId: "symbol" },
	{type: "flow", service : "MoneyFlow.ssl_bkzj_lxjlr", param : "page=1&num=20&sort=cnt_r0x_ratio&asc=1&bankuai=", amount: 15, title: {"排名": {id: -1}, "名称": {id: "name", link: true}, "天数": {id: "cnt_r0x_ratio"}, "净流出(万元)": {id: "netamount"}}, codeId: "symbol" },

	{type: "flow", service : "MoneyFlow.ssl_bkzj_bk", param : "page=1&num=20&sort=netamount&asc=0&fenlei=0", amount: 15, title: {"排名": {id: -1}, "名称": {id: "name", link: true}, "涨跌幅": {id: "avg_changeratio", rate: true, color : true }, "净流入(万元)": {id: "netamount"}}, codeId: "category", changeId: "avg_changeratio", url :  '<a href="http://vip.stock.finance.sina.com.cn/moneyflow/#@CODE@" target="_blank">@TEXT@</a>' }	
]);

//	{hasSubs: [
//	{option: "主营业务利润增长率", type: "guangming", code: ["zylrzzl"], date: "&date_1=20080930&date_2=20080630", amount: 14, title: {"排名": {id: -1}, "股票": {id: 1, link: true}, "08一季报": {id: 2}, "07年报": {id: 3}}, codeId: 0},
//	{option: "主营业务收入增长率", type: "guangming", code: ["zysrzzl"], date: "&date_1=20080930&date_2=20080630", amount: 14, title: {"排名": {id: -1}, "股票": {id: 1, link: true}, "08一季报": {id: 2}, "07年报": {id: 3}}, codeId: 0},
//	{option: "净利润增长率", type: "guangming", code: ["jlrzzl"], date: "&date_1=20080930&date_2=20080630", amount: 14, title: {"排名": {id: -1}, "股票": {id: 1, link: true}, "08一季报": {id: 2}, "07年报": {id: 3}}, codeId: 0}
//	]},

//	{hasSubs: [
//	{option: "每股未分配利润", type: "guangming", code: ["wfplr"], date: "&date_1=20080930&date_2=20080630", amount: 14, title: {"排名": {id: -1}, "股票": {id: 1, link: true}, "08一季报": {id: 2}, "07年报": {id: 3}}, codeId: 0}
//	]}

var MassList_3 = new MassListCtrl([
	{hasSubs: [
	{option: "2日涨跌统计", type: "datacenter", service : "StatisticsService.getShortList", param : "page=1&num=20&sort=_changes&asc=0&type=2", amount: 14, title: {"排名": {id: -1}, "名称": {id: "name", link: true}, "涨跌幅": {id: "_changes", rate : true, color : true}, "换手率": {id: "_turnover", rate:true}}, changeId : "_changes", codeId: "symbol", urlMore : "ddddd"},
	{option: "3日涨跌统计", type: "datacenter", service : "StatisticsService.getShortList", param : "page=1&num=20&sort=_changes&asc=0&type=3", amount: 14, title: {"排名": {id: -1}, "名称": {id: "name", link: true}, "涨跌幅": {id: "_changes", rate : true, color : true}, "换手率": {id: "_turnover", rate:true}}, changeId : "_changes", codeId: "symbol", urlMore : "ddddd"},
	{option: "4日涨跌统计", type: "datacenter", service : "StatisticsService.getShortList", param : "page=1&num=20&sort=_changes&asc=0&type=4", amount: 14, title: {"排名": {id: -1}, "名称": {id: "name", link: true}, "涨跌幅": {id: "_changes", rate : true, color : true}, "换手率": {id: "_turnover", rate:true}}, changeId : "_changes", codeId: "symbol", urlMore : "ddddd"},
	{option: "5日涨跌统计", type: "datacenter", service : "StatisticsService.getShortList", param : "page=1&num=20&sort=_changes&asc=0&type=5", amount: 14, title: {"排名": {id: -1}, "名称": {id: "name", link: true}, "涨跌幅": {id: "_changes", rate : true, color : true}, "换手率": {id: "_turnover", rate:true}}, changeId : "_changes", codeId: "symbol", urlMore : "ddddd"},
	
	{option: "10日涨跌统计", type: "datacenter", service : "StatisticsService.getLongList", param : "page=1&num=20&sort=_changes&asc=0&type=10", amount: 14, title: {"排名": {id: -1}, "名称": {id: "name", link: true}, "涨跌幅": {id: "_changes", rate : true, color : true}, "换手率": {id: "_turnover", rate:true}}, changeId : "_changes", codeId: "symbol", urlMore : "ddddd60"},
	{option: "20日涨跌统计", type: "datacenter", service : "StatisticsService.getLongList", param : "page=1&num=20&sort=_changes&asc=0&type=20", amount: 14, title: {"排名": {id: -1}, "名称": {id: "name", link: true}, "涨跌幅": {id: "_changes", rate : true, color : true}, "换手率": {id: "_turnover", rate:true}}, changeId : "_changes", codeId: "symbol", urlMore : "ddddd60"},
	{option: "30日涨跌统计", type: "datacenter", service : "StatisticsService.getLongList", param : "page=1&num=20&sort=_changes&asc=0&type=30", amount: 14, title: {"排名": {id: -1}, "名称": {id: "name", link: true}, "涨跌幅": {id: "_changes", rate : true, color : true}, "换手率": {id: "_turnover", rate:true}}, changeId : "_changes", codeId: "symbol", urlMore : "ddddd60"},
	{option: "60日涨跌统计", type: "datacenter", service : "StatisticsService.getLongList", param : "page=1&num=20&sort=_changes&asc=0&type=60", amount: 14, title: {"排名": {id: -1}, "名称": {id: "name", link: true}, "涨跌幅": {id: "_changes", rate : true, color : true}, "换手率": {id: "_turnover", rate:true}}, changeId : "_changes", codeId: "symbol", urlMore : "ddddd60"}
	], urlMore : ["http://vip.stock.finance.sina.com.cn/datacenter/hqstat.html"]},
		
	{type: "datacenter", service : "StatisticsService.getNewHighList", param : "page=1&sort=symbol&asc=1&node=adr_hk&num=20", amount: 15, title: {"排名": {id: -1}, "名称": {id: "name", link: true}, "收盘价": {id: "close"}, "最高价": {id: "high"}}, codeId: "symbol" , urlMore : [] },
	{type: "datacenter", service : "StatisticsService.getNewLowList", param : "page=1&sort=symbol&asc=1&node=adr_hk&num=20", amount: 15, title: {"排名": {id: -1}, "名称": {id: "name", link: true}, "收盘价": {id: "close"}, "最低价": {id: "low"}}, codeId: "symbol" , urlMore : [] },
	{type: "datacenter", service : "StatisticsService.getVolumeRiseList", param : "page=1&num=20&sort=changes_volume_per&asc=0&node=adr_hk", amount: 15, title: {"排名": {id: -1}, "名称": {id: "name", link: true}, "成交增幅": {id: "changes_volume_per", rate : true}, "涨跌幅": {id: "changes", rate : true , color:true }}, codeId: "symbol" , changeId: "changes", urlMore : [] },
	{type: "datacenter", service : "StatisticsService.getVolumeReduceList", param : "page=1&num=20&sort=changes_volume_per&asc=1&node=adr_hk", amount: 15, title: {"排名": {id: -1}, "名称": {id: "name", link: true}, "成交减幅": {id: "changes_volume_per", rate : true}, "涨跌幅": {id: "changes", rate : true , color:true}}, codeId: "symbol" , changeId: "changes", urlMore : [] },
	{type: "datacenter", service : "StatisticsService.getVolumeRiseConList", param : "page=1&num=20&sort=day_con&asc=0&node=adr_hk", amount: 15, title: {"排名": {id: -1}, "名称": {id: "name", link: true}, "放量天数": {id: "day_con"}, "阶段涨跌": {id: "changes_con", rate:true, color:true }}, codeId: "symbol" , changeId: "changes_con", urlMore : [] },
	{type: "datacenter", service : "StatisticsService.getVolumeReduceConList", param : "page=1&num=20&sort=day_con&asc=0&node=adr_hk", amount: 15, title: {"排名": {id: -1}, "名称": {id: "name", link: true}, "缩量天数": {id: "day_con"}, "阶段涨跌": {id: "changes_con", rate:true, color:true }}, codeId: "symbol" , changeId: "changes_con", urlMore : [] },

	{type: "datacenter", service : "StatisticsService.getStockRiseConList",   param : "page=1&num=20&sort=day_con&asc=0&node=adr_hk", amount: 15, title: {"排名": {id: -1}, "名称": {id: "name", link: true}, "上涨天数": {id: "day_con"}, "阶段涨跌": {id: "changes_con", rate:true, color:true }}, codeId: "symbol" , changeId: "changes_con", urlMore : [] },
	{type: "datacenter", service : "StatisticsService.getStockReduceConList", param : "page=1&num=20&sort=day_con&asc=0&node=adr_hk", amount: 15, title: {"排名": {id: -1}, "名称": {id: "name", link: true}, "下跌天数": {id: "day_con"}, "阶段涨跌": {id: "changes_con", rate:true, color:true }}, codeId: "symbol" , changeId: "changes_con", urlMore : [] }
	
]);


//相关市场模块



var RelatedMarket = {
	_aType: ["fut_cn", "fut_glb", "idx_glb", "forex"],
//	_aType: ["fut_cn", "fut_glb", "idx_glb", "forex"],
	_aTitle: ["名称", "最新价", "涨跌"],
	_aCodes_fut_cn: ["cu0003", "al0003", "zn0003", "au0006", "SR009"],
//	_aCodes_fut_glb: ["hf_CL", "hf_CAD", "hf_AHD", "hf_ZSD", "hf_GC", "hf_SI", "hf_S", "hf_C", "hf_SB"],
//	_aNames_fut_glb: ["NYMEX原油", "LME3月铜", "LME3月铝", "LME3月锌", "CBOT黄金", "CBOT白银", "CBOT黄豆", "CBOT玉米", "NYBOT-11糖"],
	_aCodes_fut_glb: ["hf_CL", "hf_CAD", "hf_AHD", "hf_ZSD", "hf_GC", "hf_SI", "hf_SB"],
	_aNames_fut_glb: ["NYMEX原油", "LME3月铜", "LME3月铝", "LME3月锌", "CBOT黄金", "CBOT白银", "NYBOT-11糖"],
	_aCodes_idx_glb: ["int_hangseng", "int_nikkei", "b_INDU", "b_CCMP", "b_UKX", "b_DAX"],
	_aNames_idx_glb: ["恒生指数", "日经指数", "道琼斯", "纳斯达克", "英金融时报", "德国DAX指数"],
	_aCodes_forex: ["USDCNY", "DINI"],
	_aNames_forex: ["美元兑人民币", "美元指数"],
	_sLink: '<a href="@LINK@" target="_blank">@TEXT@</a>',
	_oLinks: {
		fut_cn: "http://finance.sina.com.cn/money/future/quote.html?@CODE@",
		fut_glb:　'http://finance.sina.com.cn/money/future/quote_hf.html?@CODE@',
		idx_glb: ['http://finance.sina.com.cn/stock/hkstock/quote.html?code=HSI', null, "http://finance.sina.com.cn/stock/usstock/US100_DJI.shtml", "http://finance.sina.com.cn/stock/usstock/US100_IXIC.shtml"],
		forex: ['http://finance.sina.com.cn/forex/RMB/quote.shtml', 'http://finance.sina.com.cn/money/forex/hq/DINI.shtml']
	},

	Init: function () {
		for (var i = 0; i < this._aType.length; i++) {
			ScriptCtrl.load(this["_aCodes_" + this._aType[i]], this._show.Bind(this, this._aType[i]));
//			this._show(this._aType[i]);
		};
	},

	_show: function (type) {
		var _table = this._createTable(type);
		var _div = $("rm_" + type);
		_div.innerHTML = "";
		_div.appendChild(_table);
	},

	_parseData: function (type, sIdx) {
		var _arr = [];
		var _code = this["_aCodes_" + type][sIdx];
		var _aQuote = window["hq_str_" + _code].split(",");
		switch (type) {
		case "fut_cn":
			_arr = this._getArr(_aQuote[0], this._oLinks.fut_cn.replace("@CODE@", _code), _aQuote[8], _aQuote[10], 2);
			break;
		case "fut_glb":
			_arr = this._getArr(this._aNames_fut_glb[sIdx], this._oLinks.fut_glb.replace("@CODE@", _code.replace("hf_", "")), _aQuote[0], _aQuote[7], 3);
			break;
		case "idx_glb":
			_arr = this._getArr(this._aNames_idx_glb[sIdx], this._oLinks.idx_glb[sIdx], _aQuote[1], null, null, _aQuote[3]);
			break;
		case "forex":
			_arr = this._getArr(this._aNames_forex[sIdx], this._oLinks.forex[sIdx], _aQuote[8], _aQuote[3], 4);
			break;
		}
		return _arr;
	},

	_getArr: function (name, link, price, prev, nfix, change) {
		var _arr = [];
		if (change) {
			var _change = change;
		}
		else {
			var _change = prev != 0 ? ((price - prev) / prev * 100).toFixed(nfix) : 0;
		}
		
		var _color = getColorCode(_change);
		if (link) {
			_arr.push(this._sLink.replace("@LINK@", link).replace("@TEXT@", name));
		}
		else {
			_arr.push(name);
		}
		_arr.push(colorRender(price, _color));
		_arr.push(colorRender(_change + "%", _color));
		return _arr;
	},

	_createTable: function (type) {
		var _aCodes = this["_aCodes_" + type];

		var _table = $C("TABLE");
		var _tbody = $C("TBODY");
		_table.appendChild(_tbody);

		for (var i = 0; i < _aCodes.length; i++) {
			var _tr = _tbody.insertRow(-1);
			var _aData = i != -1 ? this._parseData(type, i) : this._aTitle;

			for (var j = 0; j < 3; j++) {
				if (j == 0) {
					var _th = $C("TH");
					_th.innerHTML = _aData[0];
					_tr.appendChild(_th);
				}
				else {
					var _td = $C("TD");
					_td.innerHTML = _aData[j];
					_tr.appendChild(_td);
				}
			};
		};

		return _table;
	}
}

//数据说话模块
/*
var TellData = {
	aCode: ["fund_net_buy_ten", "fund_net_sell_ten", "add_hold_ten", "reduce_hold_ten"],
	sUrl: 'http://biz.finance.sina.com.cn/data_talk/get_data_talk.php?type=fund_net_buy_ten,fund_net_sell_ten,reduce_hold_ten,add_hold_ten',
	stockUrl: '<a href="http://finance.sina.com.cn/realstock/company/@CODE@/nc.shtml" target="_blank">@TEXT@</a>',
	aTitle: ["净买额(万元)", "净卖额(万元)", "券基增仓(%)", "券基减仓(%)"],

	Init: function () {
		var sLoader = new IO.Script();
		sLoader.load(this.sUrl, this._show.Bind(this));
	},

	_show: function () {
		$("tellData_date").innerHTML = "更新日期：" + window["data_date"];
		for (var i = 0; i < this.aCode.length; i++) {
			var _table = this._getTable(this.aCode[i], this.aTitle[i]);
			$("tellData_" + i).innerHTML = "";
			$("tellData_" + i).appendChild(_table);
		};
	},

	_getTable: function (sName, sTitle) {
		var _aData = window[sName];

		var _table = $C("TABLE");
//		_table.className = "ctbl04";
		var _thead = $C("THEAD");
		var _tbody = $C("TBODY");
		_table.appendChild(_thead);
		_table.appendChild(_tbody);

		var _tr = _thead.insertRow(-1);
		var _th = $C("TH");
		_th.innerHTML = "名称";
		_tr.appendChild(_th);
		var _td = $C("TD");
		_td.innerHTML = sTitle;
		_tr.appendChild(_td);

		for (var i = 0; i < 5; i++) {
			var _tr = _tbody.insertRow(-1);
			var _th = $C("TH");
			_th.innerHTML = this.stockUrl.replace("@CODE@", _aData[i][0]).replace("@TEXT@", _aData[i][1]);
			_tr.appendChild(_th);
			var _td = $C("TD");
			_td.innerHTML = _aData[i][2];
			_tr.appendChild(_td);
		};

		return _table;
	}
}
*/

//市盈率图片切换模块

var PeratioImg = {
	imgSrc: [
		"http://image.sinajs.cn/newchart/v5/peratio/sha.gif",
		"http://image.sinajs.cn/newchart/v5/peratio/shb.gif",
		"http://image.sinajs.cn/newchart/v5/peratio/szzxb.gif"
		],
	Init: function () {
		var _tabs = new TabSwitch($("tabs_pt"), $("content_pt"));
		this.targets = _tabs.targets;

		ImgLoader.loadMultImg(this.imgSrc, this.targets);
	}
}


var ImgLoader = {
	loadMultImg: function (aSrc, aObj) {
		for (var i = 0; i < aSrc.length; i++) {
			this.loadImg(aSrc[i], aObj[i]);
		};
	},

	loadImg: function (imgSrc, obj) {
		var _img = new Image();
		_img.src = imgSrc + "?" + (new Date()).getTime();
		if (isIE) {
			_img.onreadystatechange = this._insertBc.Bind(this, obj, _img);
		}
		else {
			_img.onload = this._insertBc.Bind(this, obj, _img);
		}
	},

	_insertBc: function (_container, _img) {
		if (_img.onreadystatechange) {
			if (_img.readyState != 'loaded' && _img.readyState != 'complete') {
				return;
			}
		}

		_container.innerHTML = "";
		_container.appendChild(_img);
	}
}

//理财模块

//------------------------------------------------------------------------------
//list create
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
// Color configuration
//------------------------------------------------------------------------------
var __UP_COLOR = '#F00';
var __DOWN_COLOR = '#008000';
var __STABLE_COLOR = '#000';

function getColorCode(value)
{
	value = parseFloat(value);
	if (value > 0) {
		return __UP_COLOR;
	} else if (value < 0) {
		return __DOWN_COLOR;
	} else {
		return __STABLE_COLOR;
	}
};

function colorRender(targetText,color)
{
	return '<span style="color:' + color + ';">' + targetText + '</span>';
}



/*------------------------
	Project:
	Author:
	Date:
--------------------------*/

var sina = {
	$ : function(objName){if(document.getElementById){return eval('document.getElementById("'+objName+'")')}else{return eval('document.all.'+objName)}},
	isIE : navigator.appVersion.indexOf("MSIE")!=-1?true:false,
	
	//Event
	addEvent : function(obj,eventType,func){if(obj.attachEvent){obj.attachEvent("on" + eventType,func);}else{obj.addEventListener(eventType,func,false)}},
	delEvent : function(obj,eventType,func){
		if(obj.detachEvent){obj.detachEvent("on" + eventType,func)}else{obj.removeEventListener(eventType,func,false)}
	},
	//Cookie
	readCookie : function(l){var i="",I=l+"=";if(document.cookie.length>0){var offset=document.cookie.indexOf(I);if(offset!=-1){offset+=I.length;var end=document.cookie.indexOf(";",offset);if(end==-1)end=document.cookie.length;i=unescape(document.cookie.substring(offset,end))}};return i},
	
	writeCookie : function(O,o,l,I){var i="",c="";if(l!=null){i=new Date((new Date).getTime()+l*3600000);i="; expires="+i.toGMTString()};if(I!=null){c=";domain="+I};document.cookie=O+"="+escape(o)+i+c},
	//Style
	readStyle:function(i,I){if(i.style[I]){return i.style[I]}else if(i.currentStyle){return i.currentStyle[I]}else if(document.defaultView&&document.defaultView.getComputedStyle){var l=document.defaultView.getComputedStyle(i,null);return l.getPropertyValue(I)}else{return null}}
};

//滚动图片构造函数
//UI&UE Dept. mengjia
//滚动图片构造函数
//UI&UE Dept. mengjia
function ScrollPic(scrollContId,arrLeftId,arrRightId,dotListId,listType){
	
	this.scrollContId = scrollContId; //内容容器ID
	this.arrLeftId = arrLeftId; //左箭头ID
	this.arrRightId = arrRightId; //右箭头ID
	this.dotListId = dotListId; //点列表ID
	this.listType = listType; //列表类型

	this.dotClassName   = "dotItem";//点className
	this.dotOnClassName   = "dotItemOn";//当前点className
	this.dotObjArr = [];
	this.listEvent = "onclick";
	this.circularly = true; //循环滚动（无缝循环）
	
	this.pageWidth = 0; //翻页宽度
	this.frameWidth = 0; //显示框宽度
	this.speed = 10; //移动速度(单位毫秒，越小越快)
	this.space = 10; //每次移动像素(单位px，越大越快)
	
	this.upright = false; //垂直的滚动
	
	this.pageIndex = 0;
	
	this.autoPlay = true;
	this.autoPlayTime = 5; //秒
	
	this._autoTimeObj;
	this._scrollTimeObj;
	this._state = "ready"; // ready | floating | stoping
	
	
	this.stripDiv = document.createElement("DIV");
	
	
	this.lDiv01 = document.createElement("DIV");
	this.lDiv02 = document.createElement("DIV");
};
ScrollPic.prototype = {
	version : "1.40",
	author : "mengjia",
	pageLength : 0,
	onPageTo	: function(){},
	
	initialize : function(){ //初始化
		var thisTemp = this;
		if(!this.scrollContId){
			throw new Error("必须指定scrollContId.");
			return;
		};
		this.scDiv = sina.$(this.scrollContId);
		if(!this.scDiv){
			throw new Error("scrollContId不是正确的对象.(scrollContId = \""+ this.scrollContId +"\")");
			return;
		};
		
		this.scDiv.style[this.upright?'height':'width'] = this.frameWidth + "px";
		this.scDiv.style.overflow = "hidden";
		
		//HTML
		this.lDiv01.innerHTML = this.scDiv.innerHTML;
		this.scDiv.innerHTML = "";
		this.scDiv.appendChild(this.stripDiv);
		this.stripDiv.appendChild(this.lDiv01);
		if(this.circularly){//无缝循环
			this.stripDiv.appendChild(this.lDiv02);
			this.lDiv02.innerHTML = this.lDiv01.innerHTML
		};
		
		
		this.stripDiv.style.overflow = "hidden";
		this.stripDiv.style.zoom = "1";
		this.stripDiv.style[this.upright?'height':'width'] = "32766px";
		
		if(!this.upright){	
			this.lDiv01.style.cssFloat = "left";
			this.lDiv01.style.styleFloat = "left";
			this.lDiv01.style.overflow = "hidden";
		};
		this.lDiv01.style.zoom = "1";
		if(this.circularly && !this.upright){ //无缝循环设置CSS
			this.lDiv02.style.cssFloat = "left";
			this.lDiv02.style.styleFloat = "left";
			this.lDiv02.style.overflow = "hidden";
		};
		this.lDiv02.style.zoom = "1";
		
		sina.addEvent(this.scDiv,"mouseover",function(){thisTemp.stop()});
		sina.addEvent(this.scDiv,"mouseout",function(){thisTemp.play()});
		
		//Arrowhead event
		//left
		if(this.arrLeftId){
			this.alObj = sina.$(this.arrLeftId);
			if(this.alObj){
				sina.addEvent(this.alObj,"mousedown",function(){thisTemp.rightMouseDown()});
				sina.addEvent(this.alObj,"mouseup",function(){thisTemp.rightEnd()});
				sina.addEvent(this.alObj,"mouseout",function(){thisTemp.rightEnd()});
			};
		};
		//right
		if(this.arrRightId){
			this.arObj = sina.$(this.arrRightId);
			if(this.arObj){
				sina.addEvent(this.arObj,"mousedown",function(){thisTemp.leftMouseDown()});
				sina.addEvent(this.arObj,"mouseup",function(){thisTemp.leftEnd()});
				sina.addEvent(this.arObj,"mouseout",function(){thisTemp.leftEnd()});
			};
		};
		
		var pages = Math.ceil(this.lDiv01[this.upright?'offsetHeight':'offsetWidth'] / this.frameWidth),i,tempObj;
		this.pageLength = pages;
				
		//dot
		if(this.dotListId){
			this.dotListObj = sina.$(this.dotListId);
			this.dotListObj.innerHTML = "";
			if(this.dotListObj){
				
				for(i=0;i<pages;i++){
					tempObj = document.createElement("span");
					this.dotListObj.appendChild(tempObj);
					this.dotObjArr.push(tempObj);
					
					if(i==this.pageIndex){
						tempObj.className = this.dotOnClassName;
					}else{
						tempObj.className = this.dotClassName;
					};
					if(this.listType == 'number'){
						tempObj.innerHTML = i+1;
					}else if(this.listType){
						tempObj.innerHTML = this.listType;
					};
					tempObj.title = "第" + (i+1) + "页";
					tempObj.num = i;
					tempObj[this.listEvent] = function(){thisTemp.pageTo(this.num)};
				};
			};
		};
		this.scDiv[this.upright?'scrollTop':'scrollLeft'] = 0;
		//autoPlay
		if(this.autoPlay){this.play()};
		
		this._scroll = this.upright?'scrollTop':'scrollLeft';
		this._sWidth = this.upright?'scrollHeight':'scrollWidth';
		
		if(typeof(this.onpagechange) === 'function'){
			this.onpagechange();
		};
		
		this.iPad();
	},
	leftMouseDown : function(){
		if(this._state != "ready"){return};
		var thisTemp = this;
		this._state = "floating";
		this._scrollTimeObj = setInterval(function(){thisTemp.moveLeft()},this.speed);
	},
	rightMouseDown : function(){
		if(this._state != "ready"){return};
		var thisTemp = this;
		this._state = "floating";
		this._scrollTimeObj = setInterval(function(){thisTemp.moveRight()},this.speed);
	},
	moveLeft : function(){
		if(this.circularly){ //无缝循环
			if(this.scDiv[this._scroll] + this.space >= this.lDiv01[this._sWidth]){
				this.scDiv[this._scroll] = this.scDiv[this._scroll] + this.space - this.lDiv01[this._sWidth];
			}else{
				this.scDiv[this._scroll] += this.space;
			};
		}else{
			if(this.scDiv[this._scroll] + this.space >= this.lDiv01[this._sWidth] - this.frameWidth){
				this.scDiv[this._scroll] = this.lDiv01[this._sWidth] - this.frameWidth;
				//停
				this.leftEnd();
			}else{
				this.scDiv[this._scroll] += this.space;
			};
		};
		this.accountPageIndex();
	},
	moveRight : function(){
		if(this.circularly){ //无缝循环
			if(this.scDiv[this._scroll] - this.space <= 0){
				
				this.scDiv[this._scroll] = this.lDiv01[this._sWidth] + this.scDiv[this._scroll] - this.space;
			}else{
				this.scDiv[this._scroll] -= this.space;
			};
		}else{
			if(this.scDiv[this._scroll] - this.space <= 0){
				this.scDiv[this._scroll] = 0;
				//停
				this.rightEnd();
			}else{
				this.scDiv[this._scroll] -= this.space;
			};
		};
		this.accountPageIndex();
	},
	leftEnd : function(){
		if(this._state != "floating"){return};
		this._state = "stoping";
		clearInterval(this._scrollTimeObj);
		
		var fill = this.pageWidth - this.scDiv[this._scroll] % this.pageWidth;
		
		this.move(fill);
	},
	rightEnd : function(){
		if(this._state != "floating"){return};
		this._state = "stoping";
		clearInterval(this._scrollTimeObj);
		
		var fill = - this.scDiv[this._scroll] % this.pageWidth;
		
		this.move(fill);
	},
	move : function(num,quick){
		var thisTemp = this;
		var thisMove = num/5;
		if(!quick){
			if(thisMove > this.space){thisMove = this.space};
			if(thisMove < -this.space){thisMove = -this.space};
		};
		
		if(Math.abs(thisMove)<1 && thisMove!=0){
			thisMove = thisMove>=0?1:-1;
		}else{
			thisMove = Math.round(thisMove);
		};
		
		var temp = this.scDiv[this._scroll] + thisMove;
		
		if(thisMove>0){
			if(this.circularly){ //无缝循环
				if(this.scDiv[this._scroll] + thisMove >= this.lDiv01[this._sWidth]){
					this.scDiv[this._scroll] = this.scDiv[this._scroll] + thisMove - this.lDiv01[this._sWidth];
				}else{
					this.scDiv[this._scroll] += thisMove;
				};
			}else{
				if(this.scDiv[this._scroll] + thisMove >= this.lDiv01[this._sWidth] - this.frameWidth){
					this.scDiv[this._scroll] = this.lDiv01[this._sWidth] - this.frameWidth;
					this._state = "ready";
					return;
				}else{
					this.scDiv[this._scroll] += thisMove;
				};
			};
		}else{
			if(this.circularly){ //无缝循环
				if(this.scDiv[this._scroll] + thisMove < 0){
					this.scDiv[this._scroll] = this.lDiv01[this._sWidth] + this.scDiv[this._scroll] + thisMove;
				}else{
					this.scDiv[this._scroll] += thisMove;
				};
			}else{
				if(this.scDiv[this._scroll] - thisMove < 0){
					this.scDiv[this._scroll] = 0;
					this._state = "ready";
					return;
				}else{
					this.scDiv[this._scroll] += thisMove;
				};
			};
		};
		
		num -= thisMove;
		if(Math.abs(num) == 0){
			this._state = "ready";
			if(this.autoPlay){this.play()};
			this.accountPageIndex();
			return;
		}else{
			this.accountPageIndex();
			this._scrollTimeObj = setTimeout(function(){thisTemp.move(num,quick)},this.speed)
		};
		
	},
	pre : function(){
		if(this._state != "ready"){return};
		this._state = "stoping";
		this.pageTo(this.pageIndex - 1);
	},
	next : function(reStar){
		if(this._state != "ready"){return};
		this._state = "stoping";
		if(this.circularly){
			this.pageTo(this.pageIndex + 1);
		}else{
			if(this.scDiv[this._scroll] >= this.lDiv01[this._sWidth] - this.frameWidth){
				this._state = "ready";
				if(reStar){this.pageTo(0)};
			}else{
				this.pageTo(this.pageIndex + 1);
			};
		};
	},
	play : function(){
		var thisTemp = this;
		if(!this.autoPlay){return};
		clearInterval(this._autoTimeObj);
		this._autoTimeObj = setInterval(function(){thisTemp.next(true)},this.autoPlayTime * 1000);
	},
	stop : function(){
		clearInterval(this._autoTimeObj);
	},
	pageTo : function(num){
		if(this.pageIndex == num){return};
		if(num < 0){num = this.pageLength - 1};
		clearTimeout(this._scrollTimeObj);
		this._state = "stoping";
		var fill = num * this.frameWidth - this.scDiv[this._scroll];
		this.onPageTo( num );
		this.move(fill,true);
	},
	accountPageIndex : function(){
		var pageIndex = Math.floor(this.scDiv[this._scroll] / this.frameWidth);
		if(pageIndex == this.pageIndex){return};
		this.pageIndex = pageIndex;
		
		if(this.pageIndex > Math.floor(this.lDiv01[this.upright?'offsetHeight':'offsetWidth'] / this.frameWidth )){this.pageIndex = 0};
		var i;
		for(i=0;i<this.dotObjArr.length;i++){
			if(i==this.pageIndex){
				this.dotObjArr[i].className = this.dotOnClassName;
			}else{
				this.dotObjArr[i].className = this.dotClassName;
			};
		};

		if(typeof(this.onpagechange) === 'function'){
			this.onpagechange();
		};
	},
	
	iPadX : 0,
	iPadLastX : 0,
	iPadStatus : 'ok',
	iPad : function(){
		if(typeof(window.ontouchstart) === 'undefined'){ //不支持触屏
			return;	
		};
		
		var tempThis = this;
		sina.addEvent(this.scDiv,'touchstart',function(e){tempThis._touchstart(e)});
		sina.addEvent(this.scDiv,'touchmove',function(e){tempThis._touchmove(e)});
		sina.addEvent(this.scDiv,'touchend',function(e){tempThis._touchend(e)});
	},
	_touchstart : function(e){
		//if(this._state != "ready"){return};
		//this._state = 'touch';
		this.stop();
		this.iPadX = e.touches[0].pageX;
		this.iPadScrollX = window.pageXOffset;
		this.iPadScrollY = window.pageYOffset; //用于判断页面是否滚动
		this.scDivScrollLeft = this.scDiv[this._scroll];
	},
	_touchmove : function(e){
		//if(this._state != "touch"){return};
		
		
		if(e.touches.length > 1){ //多点触摸
			this.iPadStatus = 'ok';
			return;
		};
		this.iPadLastX = e.touches[0].pageX;
		var cX = this.iPadX - this.iPadLastX;
		
			/*if(this.circularly == false){
				return;
			};*/
		
		if(this.iPadStatus == 'ok'){
			if(this.iPadScrollY == window.pageYOffset && this.iPadScrollX == window.pageXOffset && Math.abs(cX)>50){ //横向触摸
				this.iPadStatus = 'touch';
			}else{
				return;
			};
		};
		this._state = 'touch';
		var scrollNum = this.scDivScrollLeft + cX;
		
		if(scrollNum >= this.lDiv01[this._sWidth]){
			scrollNum = scrollNum - this.lDiv01[this._sWidth];
		};
		if(scrollNum < 0){
			scrollNum = scrollNum + this.lDiv01[this._sWidth];
		};
		this.scDiv[this._scroll] = scrollNum;
		e.preventDefault();
	},
	_touchend : function(e){
		
		if(this.iPadStatus != 'touch'){return};
		this.iPadStatus = 'ok';
		this._state = 'ready';
		var cX = this.iPadX - this.iPadLastX;
		if(cX<0){
			this.pre();
		}else{
			this.next();
		};
		this.play();
	}
};




/* 
 * Author 杜大鹏
 * Copyright (c) 2010, SINA Corporation. All rights reserved. 
 */ 
var sinaSSOConfig;
!function($)
{
/*start*/
if(!Function.prototype.ddpBind)
{
    Function.prototype.ddpBind = function(argObj,args)
    {
        var _fn = this;
        return function()
        {
            _fn.apply(argObj || this,args || arguments);
        }
    };
}
if(!Function.prototype.bindArg)
{
    Function.prototype.bindArg = function()
    {
        return this.ddpBind(null,arguments);
    };
}
/*正则替换//@、##、url为链接*/
function regText(argText)
{
    argText = argText.replace(/\/\/@(.*?):/g,function(arg$,arg$1)
    {
        return '//<a href="http://t.sina.com.cn/n/' + arg$1 + '" target="_blank">@' + arg$1 + '</a>';
    });
    argText = argText.replace(/#(.*?)#/g,function(arg$,arg$1)
    {
        return '<a href="http://t.sina.com.cn/k/' + arg$1 + '" target="_blank">' + arg$ + '</a>';
    });
    argText = argText.replace(/http:\/\/sinaurl.cn\/[0-9a-zA-Z]{1,}/g,function($1)
    {
        return '<a href="' + $1 + '" target="_blank">' + $1 + '</a>';
    });
    
    return argText;
}
/*创建单个博文节点*/
/*专家微博和网友微博通用*/
function _makeT(_data)
{
    if(hasSend.indexOf('|' + _data.post_id + '|') != -1)
    {
        return;
    }
    var _divPerson,_divClearfix,_divName,_aPerson,_divAgreen,_divClearfix2,_divName2,_divOther,_divRight,_a,_dateArr,_dateArr2;
    _divPerson = $('<div>').addClass('person');
    _divClearfix = $('<div>').addClass('clearfix').appendTo(_divPerson);
    _divName = $('<div>').addClass(_data.user_verified == '1' ? 'name vip' : 'name').appendTo(_divClearfix);
    _aPerson = $('<a>').attr('href','http://t.sina.com.cn/' + _data.user_id).attr('target','_blank').html(_data.user_name).appendTo(_divName);
    _divClearfix.append($('<span>').html('：' + regText(_data.post_text)));
    
    _divOther = $('<div>').addClass('other clearfix');
    _divRight = $('<div>').addClass('right').appendTo(_divOther);
    _a = $('<a>').attr('href','http://api.t.sina.com.cn/' + _data.user_id + '/statuses/' + _data.post_id).attr('target','_blank').html('转发(' + (_data.post_rt || '0') + ')').appendTo(_divRight);
    _divRight.append($('<span>').html('&nbsp;|&nbsp;'));
    _a = _a.clone().html('收藏').appendTo(_divRight);
    _divRight.append($('<span>').html('&nbsp;|&nbsp;'));
    _a = _a.clone().html('评论(' + (_data.post_comments || '0') + ')').appendTo(_divRight);
    _dateArr = _data.post_time.split(' ')[0].split('-');
    _dateArr2 = _data.post_time.split(' ')[1].split(':');
    _divOther.append($('<span>').html(_dateArr[1] + '月' + _dateArr[2] + '日 ' + _dateArr2[0] + '：' + _dateArr2[1] + ' 来自'));
    _divOther.append($(_data.post_source));
    
    if(_data.post_retweeted)
    {
        _data = _data.post_retweeted;
        _divAgreen = $('<div>').addClass('agreen').appendTo(_divPerson);
        _divClearfix2 = $('<div>').addClass('clearfix cont').appendTo(_divAgreen);
        
        _divName2 = $('<div>').addClass(_data.user_verified == '1' ? 'name vip' : 'name').appendTo(_divClearfix2);
        _aPerson = $('<a>').attr('href','http://t.sina.com.cn/' + _data.user_id).attr('target','_blank').html(_data.user_name).appendTo(_divName2);
        _divClearfix2.append($('<span>').html('：' + regText(_data.post_text)));
        
        _divOther.appendTo(_divAgreen);
    }
    else
    {
        _divOther.appendTo(_divPerson);
    }
    
    return _divPerson;
}
/*专家微博*/
var expectT = new function()
{
    var _url = 'http://vip.stock.finance.sina.com.cn/q/api/jsonp.php/var expectTs=/Weibo_Service.getPostByUser?';
    var _uids = '';
    var _freq = 120;
    var _max_id = '0';
    var _order = '0';
    var _num = 40;
    var _timer;
    var _timerOut;
    /*开始刷新*/
    this.start = function()
    {
        this.read();
        _timer = setInterval(this.read.ddpBind(this),_freq * 1000);
    };
    /*手动刷新*/
    this.stop = function()
    {
        clearInterval(_timer);
        _timer = null;
    }
    /*请求数据*/
    this.read = function()
    {
        clearTimeout(_timerOut);
        $.getScript(_url + 'uids=' + _uids + '&order=' + _order + '&max_id=' + _max_id + '&num=' + _num + '&dpc=1',this.draw.ddpBind(this));
    };
    /*加载数据*/
    this.draw = function()
    {
        if(!window.expectTs || !expectTs.result)
        {
            return;
        }
        var _data;
        var _divExpectTs = $('#divWebTs');
        
        /*如果_max_id == 0 则为 请求全部*/
        if(_max_id == 0)
        {
            _divExpectTs.empty();
            var _expectTs = expectTs;
            var i = 0;
            function _timer()
            {
                var _callee = arguments.callee;
                _timerOut = setTimeout(function()
                {
                    _divExpectTs.append(_makeT(_expectTs.result[i]));
                    i++;
                    if(i < _expectTs.result.length)
                    {
                        _callee();
                    }
                },20);
            }
            _timer();
        }
        /*否则根据排序决定按那种顺序把节点插入到哪里*/
        else
        {
            if(_order == 1)
            {
                for(var i = 0;i < expectTs.result.length;i++)
                {
                    _divExpectTs.append(_makeT(expectTs.result[i]));
                }
            }
            else
            {
                for(var i = expectTs.result.length - 1;i >= 0;i--)
                {
                    _divExpectTs.prepend(_makeT(expectTs.result[i]));
                }
            }
        }
        /*取得_max_id*/
        if(_order == 1)
        {
            _max_id = expectTs.result[expectTs.result.length - 1].post_id;
        }
        else
        {
            _max_id = expectTs.result[0].post_id;
        }
        expectTs = null;
    };
    /*更改列表*/
    this.changeUids = function()
    {
        _max_id = '0';
        _uids = '';
        var _boxs = $('input[name=s]');
        for(var i = 0;i < _boxs.length / 2;i++)
        {
            if(_boxs[i].checked)
            {
                _uids += ',' + _boxs[i].value;
            }
        }
        _uids = _uids.substring(1);
        this.read();
    };
    /*更改排序，同时重新请求*/
    this.changeOrder = function(argOrder)
    {
        _order = argOrder;
        _max_id = '0';
        this.read();
    };
    /*更改频率*/
    this.changeFreq = function()
    {
        var _select = $('#selectFreq');
        var _value = _select.val();
        if(_value)
        {
            _freq = _value;
            clearInterval(_timer);
            this.start();
            $('#btnRefresh').hide();
        }
        else
        {
            this.stop();
            $('#btnRefresh').show();
        }
    };
    /*初始化*/
    this.init = function()
    {
//        $('#radioOrder1').click(this.changeOrder.ddpBind(this,[1]));
//        $('#radioOrder0').click(this.changeOrder.ddpBind(this,[0]));
//        
//        $('#btnChangeExpect').click(this.changeUids.ddpBind(this));
        
//        $('#selectFreq').change(this.changeFreq.ddpBind(this));
        
//        $('#btnRefresh').click(this.read.ddpBind(this));
        
//        $('input[name=s]').click(function()
//        {
//            var _value = this.value;
//            $('input[name=s][value=' + _value + ']').attr('checked',this.checked);
//        });
        
//        this.changeUids();
        _uids = window['EXPECT_WEIBO_IDS'] || '';
        expectT.start();
    };
}();
/*网友微博聊股*/
var webT = new function()
{
    var _url = 'http://vip.stock.finance.sina.com.cn/q/api/jsonp.php/var webTs=/Weibo_Service.getPostByKeyword?from=gs&enc=utf8&q=';
    var _order = 0;
    var _num = 40;
    var _timer = null;
    var _max_id = 0;
    var _freq = 120;
    var _timerOut;
    /*请求数据*/
    this.read = function()
    {
        clearTimeout(_timerOut);
        $.getScript(_url + 'order=' + _order + '&page=1&num=' + _num + '&max_id=' + _max_id + '&dpc=1',this.draw.ddpBind(this));
    };
    /*开始定时刷新*/
    this.start = function()
    {
        _timer = setInterval(this.read.ddpBind(this),_freq * 1000);
    }
    /*显示*/
    this.draw = function()
    {
        /*没数据则不操作*/
        if(!window.webTs || !webTs.result)
        {
            return;
        }
        $('#spanTnum1').html(webTs.total);
        $('#spanTnum2').html(webTs.total);
        var _divWebTs = $('#divWebTs');
        if(_max_id == 0)
        {
            _divWebTs.empty();
            var _webTs = webTs;
            var i = 0;
            function _timer()
            {
                var _callee = arguments.callee;
                _timerOut = setTimeout(function()
                {
                    _divWebTs.append(_makeT(_webTs.result[i]));
                    i++;
                    if(i < _webTs.result.length) 
                    {
                        _callee();
                    }
                },20);
            }
            _timer();
        }
        else
        {
            for(var i = webTs.result.length -1;i >= 0;i--)
            {
                _divWebTs.prepend(_makeT(webTs.result[i]));
            }
        }
        _max_id = webTs.result[0].post_id;
        webTs = null;
    };
    this.init = function()
    {
        _url += encodeURIComponent(WEB_T_KEY) + '&';
        this.read();
        this.start();
    };
}();
var Login = new function()
{
    var _obj = this;
    var _login_bg,_loginLayer,_btnClose,_btnShowLogin2;
    
    /*显示登陆框*/
    function _showLogin()
    {
        var _height = $('body').height();
        _login_bg.height(_height).show();
        _loginLayer.show();
        _loginLayer.css('top',_loginLayer.offset().top + (document.body.scrollTop || document.documentElement.scrollTop) + 'px');
        _loginLayer.css('marginTop','0px');
    }
    /*隐藏登录框*/
    function _hideLogin()
    {
        _login_bg.hide();
        _loginLayer.css('top','').css('marginTop','');
        _loginLayer.hide();
    }
    this.init = function()
    {
        _login_bg = $('#login_bg');
        _loginLayer = $('#loginLayer');
        _btnClose = $('#btnClose');
        _btnShowLogin2 = $('#btnShowLogin2');
        
        _btnShowLogin2.click(_showLogin);
        _btnClose.click(_hideLogin);
        function _login()
        {
            var _name = $('#inputUser').val();
            var _pwd = $('#inputPwd').val();
            var _save = $('#checkSaveLogin').attr('checked');
            if(!_name)
            {
                $('#loginStatus').html('请输入用户名');
                return;
            }
            if(!_pwd)
            {
                $('#loginStatus').html('请输入密码');
                return;
            }
            sinaSSOController.login(_name,_pwd,_save ? '30' : null);
        }
        $('#loginBtn').click(_login);
        $('#inputUser,#inputPwd').keyup(function(ev)
        {
            ev = ev || event;
            if(ev.keyCode == 13)
            {
                _login();
            }
        });
        $('#btnLogout').click(function()
        {
            sinaSSOController.logout();
        });
        sinaSSOController.autoLogin(_autoLogin);
        setInterval(function()
        {
            if(!sinaSSOController.getSinaCookie())
            {
                _logoutOK();
            }
            else
            {
                sinaSSOController.autoLogin(_autoLogin);
            }
        },1000);
    }
    /*已登录，切换显示*/
    function _hasLogin()
    {
        _hideLogin();
        $('#webTNLogin').hide();
        $('#webTLogined').show();
    }
    /*未登录，切换显示*/
    function _hasNotLogin()
    {
        $('#webTNLogin').show();
        $('#webTLogined').hide();
    }
    function _autoLogin(argResult)
    {
        if(!argResult)
        {
            return;
        }
        $('#spanUserName2').html(argResult.nick);
        _hasLogin();
        $('#linkMyT,#linkMyT2').attr('href','http://t.sina.com.cn/' + argResult.uid);
        $('#imgUserHead').attr('src','http://tp1.sinaimg.cn/' + argResult.uid + '/30/0');
    }
    function _loginOK(argResult)
    {
        var _cookie = $.cookie('SUP');
        if(_cookie)
        {
            var _arr = _cookie.split('&');
        }
        var _arr2;
        _cookie = {}
        for(var i = 0;i < _arr.length;i++)
        {
            _arr2 = _arr[i].split('=');
            _cookie[_arr2[0]] = _arr2[1];
        }
        $('#spanUserName2').html(decodeURIComponent(_cookie.nick));
        _hasLogin();
        $('#linkMyT,#linkMyT2').attr('href','http://t.sina.com.cn/' + _cookie.uid);
        $('#imgUserHead').attr('src','http://tp1.sinaimg.cn/' + _cookie.uid + '/30/0');
    }
    function _logoutOK(argResult)
    {
        _hasNotLogin();
//        readStock.clearProtfolio();
    }
    /*登录设置*/
    sinaSSOConfig = new function()
    {
        this.setDomain = true;
        this.customLoginCallBack = function(argRusult)
        {
            if(!argRusult)
            {
                return;
            }
            if(argRusult.result)
            {
                _hideLogin();
                _hasLogin();
                _loginOK(argRusult);
            }
            else
            {
                $('#loginStatus').html(argRusult.reason);
            }
        };
        this.customLogoutCallBack = function(argResult)
        {
            if(!argResult)
            {
                return;
            }
            if(argResult.result)
            {
                _logoutOK(argResult);
            }
        }
    }();
}();
var hasSend = '|';
var submitT = new function()
{
    var _url = 'http://money.finance.sina.com.cn/q/api/jsonp.php/var submitTresponse=/Weibo_Service.addPost?from=gs&enc=utf8&q=$1&content=';
    var _sending = false;
    
    this.init = function()
    {
        _url = _url.replace('$1',encodeURIComponent(WEB_T_KEY));
        $('#submitT').click(this.send.ddpBind(this));
    };
    this.send = function(ev)
    {
        if(_sending)
        {
            alert('发送中，请稍候');
            return;
        }
        var _value = $('#inputT').val();
        var _length = _value.replace(/[^\00-\ff]/g,'**').length;
        if(_length == 0)
        {
            return;
        }
        if(_length > 280)
        {
            alert('输入超过了140字');
        }
        else
        {
            $.getScript(_url + encodeURIComponent(_value) + '&rn=' + Math.random(),this.sendCallBack.ddpBind(this));
        }
        _sending = true;
    };
    this.sendCallBack = function()
    {
        _sending = false;
        var _data = window.submitTresponse;
        if(!_data || _data.error)
        {
            if(_data.error)
            {
                alert(_data.error);
            }
        }
        else
        {
            $('#inputT').val('');
            $('#divWebTs').prepend(_makeT(_data));
            hasSend += _data.post_id + '|';
        }
    };
}();
function getScript(argUrl,argCallback)
{
    var _script = document.createElement('script');
    _script.type = 'text/javascript';
    _script.src = argUrl;
    var _head = $('head')[0];
    var _done = false;
    _script.onload = _script.onreadystatechange = function()
    {
        if(!_done &&(!this.readyState || this.readyState === "loaded" || this.readyState === "complete"))
        {
            _done = true;
            argCallback();
            _script.onload = _script.onreadystatechange = null;
            setTimeout(function()
            {
                _head.removeChild(_script);
            },1);
        }
    };
    _head.appendChild(_script);
}
$(function()
{
//    Login.init();
    expectT.init();
//    webT.init();
    /*发微博*/
//    submitT.init();
});
/*end*/
}(jQuery);


jQuery.cookie = function(name, value, options) { 
if (typeof value != 'undefined') { // name and value given, set cookie 
options = options || {}; 
if (value === null) { 
value = ''; 
options.expires = -1; 
} 
var expires = ''; 
if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) { 
var date; 
if (typeof options.expires == 'number') { 
date = new Date(); 
date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000)); 
} else { 
date = options.expires; 
} 
expires = '; expires=' + date.toUTCString(); 
} 
var path = options.path ? '; path=' + (options.path) : ''; 
var domain = options.domain ? '; domain=' + (options.domain) : ''; 
var secure = options.secure ? '; secure' : ''; 
document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join(''); 
} else { 
var cookieValue = null; 
if (document.cookie && document.cookie != '') { 
var cookies = document.cookie.split(';'); 
for (var i = 0; i < cookies.length; i++) { 
var cookie = jQuery.trim(cookies[i]); 
if (cookie.substring(0, name.length + 1) == (name + '=')) { 
cookieValue = decodeURIComponent(cookie.substring(name.length + 1)); 
break; 
} 
} 
} 
return cookieValue; 
} 
}; 


/*
舌签构造函数
SubShowClass(ID[,eventType][,defaultID][,openClassName][,closeClassName])
*/
function SubShowClass(ID,eventType,defaultID,openClassName,closeClassName){this.version="1.0";this.author="mengjia";this.parentObj=SubShowClass.$(ID);if(this.parentObj==null){throw new Error("SubShowClass(ID)参数错误:ID 对像存在!")};if(!SubShowClass.childs){SubShowClass.childs=[]};this.ID=SubShowClass.childs.length;SubShowClass.childs.push(this);this.lock=false;this.label=[];this.defaultID=defaultID==null?0:defaultID;this.selectedIndex=this.defaultID;this.openClassName=openClassName==null?"selected":openClassName;this.closeClassName=closeClassName==null?"":closeClassName;this.mouseIn=false;var mouseInFunc=Function("SubShowClass.childs["+this.ID+"].mouseIn = true"),mouseOutFunc=Function("SubShowClass.childs["+this.ID+"].mouseIn = false");if(this.parentObj.attachEvent){this.parentObj.attachEvent("onmouseover",mouseInFunc)}else{this.parentObj.addEventListener("mouseover",mouseInFunc,false)};if(this.parentObj.attachEvent){this.parentObj.attachEvent("onmouseout",mouseOutFunc)}else{this.parentObj.addEventListener("mouseout",mouseOutFunc,false)};if(typeof(eventType)!="string"){eventType="onmousedown"};eventType=eventType.toLowerCase();switch(eventType){case "onmouseover":this.eventType="mouseover";break;case "onmouseout":this.eventType="mouseout";break;case "onclick":this.eventType="click";break;case "onmouseup":this.eventType="mouseup";break;default:this.eventType="mousedown"};this.addLabel=function(labelID,contID,parentBg,springEvent,blurEvent){if(SubShowClass.$(labelID)==null){throw new Error("addLabel(labelID)参数错误:labelID 对像存在!")};var TempID=this.label.length;if(parentBg==""){parentBg=null};this.label.push([labelID,contID,parentBg,springEvent,blurEvent]);var tempFunc=Function('SubShowClass.childs['+this.ID+'].select('+TempID+')');if(SubShowClass.$(labelID).attachEvent){SubShowClass.$(labelID).attachEvent("on"+this.eventType,tempFunc)}else{SubShowClass.$(labelID).addEventListener(this.eventType,tempFunc,false)};if(TempID==this.defaultID){SubShowClass.$(labelID).className=this.openClassName;if(SubShowClass.$(contID)){SubShowClass.$(contID).style.display=""};if(parentBg!=null){this.parentObj.style.background=parentBg};if(springEvent!=null){eval(springEvent)}}else{SubShowClass.$(labelID).className=this.closeClassName;if(SubShowClass.$(contID)){SubShowClass.$(contID).style.display="none"}};if(SubShowClass.$(contID)){if(SubShowClass.$(contID).attachEvent){SubShowClass.$(contID).attachEvent("onmouseover",mouseInFunc)}else{SubShowClass.$(contID).addEventListener("mouseover",mouseInFunc,false)};if(SubShowClass.$(contID).attachEvent){SubShowClass.$(contID).attachEvent("onmouseout",mouseOutFunc)}else{SubShowClass.$(contID).addEventListener("mouseout",mouseOutFunc,false)}}};this.select=function(num,force){if(typeof(num)!="number"){throw new Error("select(num)参数错误:num 不是 number 类型!")};if(force!=true&&this.selectedIndex==num){return};var i;for(i=0;i<this.label.length;i++){if(i==num){SubShowClass.$(this.label[i][0]).className=this.openClassName;if(SubShowClass.$(this.label[i][1])){SubShowClass.$(this.label[i][1]).style.display=""};if(this.label[i][2]!=null){this.parentObj.style.background=this.label[i][2]};if(this.label[i][3]!=null){eval(this.label[i][3])}}else if(this.selectedIndex==i||force==true){SubShowClass.$(this.label[i][0]).className=this.closeClassName;if(SubShowClass.$(this.label[i][1])){SubShowClass.$(this.label[i][1]).style.display="none"};if(this.label[i][4]!=null){eval(this.label[i][4])}}};this.selectedIndex=num};this.random=function(){if(arguments.length!=this.label.length){throw new Error("random()参数错误:参数数量与标签数量不符!")};var sum=0,i;for(i=0;i<arguments.length;i++){sum+=arguments[i]};var randomNum=Math.random(),percent=0;for(i=0;i<arguments.length;i++){percent+=arguments[i]/sum;if(randomNum<percent){this.select(i);break}}};this.autoPlay=false;var autoPlayTimeObj=null;this.spaceTime=5000;this.play=function(spTime){if(typeof(spTime)=="number"){this.spaceTime=spTime};clearInterval(autoPlayTimeObj);autoPlayTimeObj=setInterval("SubShowClass.childs["+this.ID+"].nextLabel()",this.spaceTime);this.autoPlay=true};this.nextLabel=function(){if(this.autoPlay==false||this.mouseIn==true){return};var index=this.selectedIndex;index++;if(index>=this.label.length){index=0};this.select(index)};this.stop=function(){clearInterval(autoPlayTimeObj);this.autoPlay=false}};SubShowClass.$=function(objName){if(document.getElementById){return eval('document.getElementById("'+objName+'")')}else{return eval('document.all.'+objName)}}

