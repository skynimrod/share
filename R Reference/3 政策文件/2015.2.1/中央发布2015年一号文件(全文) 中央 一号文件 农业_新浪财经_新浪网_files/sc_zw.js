jsLoader(ARTICLE_JSS.jq,function(){
				var coverLayer={divObj:null,_coverTime:null,_coverRe:function(){if(document.body.offsetHeight<document.documentElement.clientHeight){this.divObj.style.width=document.body.clientWidth+"px";this.divObj.style.height=document.documentElement.clientHeight+"px";}else{this.divObj.style.width=document.body.clientWidth+"px";this.divObj.style.height=document.body.clientHeight+"px";}},isIE:navigator.appVersion.indexOf("MSIE")!=-1?true:false,on:function(noSave){if(this.divObj==null){this.divObj=document.createElement("div");this.divObj.style.zIndex=10000;this.divObj.style.left='0px';;this.divObj.style.top='0px';;this.divObj.style.position="absolute";this.divObj.style.backgroundColor="#000";if(this.isIE){var tempFrame=document.createElement("iframe");tempFrame.style.filter="Alpha(Opacity=0)";tempFrame.frameBorder=0;tempFrame.scrolling="no";tempFrame.style.width="100%";tempFrame.style.height="100%";this.divObj.appendChild(tempFrame);this.divObj.style.filter="Alpha(Opacity=70)";}else{this.divObj.style.opacity=0.7};document.body.appendChild(this.divObj);};if(document.body.offsetHeight<document.documentElement.clientHeight){this.divObj.style.width=document.body.clientWidth+"px";this.divObj.style.height=document.documentElement.clientHeight+"px";}else{this.divObj.style.width=document.body.clientWidth+"px";this.divObj.style.height=document.body.clientHeight+"px";};this.divObj.style.display="block";clearInterval(this._coverTime);this._coverTime=setInterval("coverLayer._coverRe()",50);},off:function(noSave){if(this.divObj){this.divObj.style.display="none"};clearInterval(this._coverTime);}};	
				(function(w,doc){w.jsonp=function(obj){var cbName=obj.jsonp||'callback';var cbFunc=obj.jsonpcallback||ranTime('jsonpcallback');var params=cbName+'='+cbFunc;var isEncode=obj.encode===undefined?true:obj.encode;var timer;window.clearTimeout(timer);timer=window.setTimeout(function(){if(isFunction(obj.ontimeout)){obj.ontimeout();}},5000);window[cbFunc]=function(data){window.clearTimeout(timer);if(isFunction(obj.onsuccess)){obj.onsuccess(data);}};var tag=obj.url.indexOf('?')>0?'&':'?';if(obj.data){var dataURL=isEncode?encodeFormData(obj.data):changeToURL(obj.data);getScript(obj.url+tag+dataURL+'&'+params,obj.charset);}else{getScript(obj.url+tag+params,obj.charset);}};var READY_STATE_RE=/^(?:loaded|complete|undefined)/;var head=doc.getElementsByTagName('head')[0]||doc.documentElement;var baseElement=head.getElementsByTagName('base')[0];var scriptOnLoad=function(node,callback){node.onload=node.onreadystatechange=function(){if(READY_STATE_RE.test(node.readyState)){node.onload=node.onreadystatechange=null;head.removeChild(node);node=null;}};};function getScript(url,charset){var node=doc.createElement('script');node.src=url;if(charset){node.charset=charset;};node.async=true;scriptOnLoad(node);baseElement?head.insertBefore(node,baseElement):head.appendChild(node);return node;};function encodeFormData(data){var pairs=[],regexp=/%20/g,value;for(var key in data){value=data[key].toString();pairs.push(w.encodeURIComponent(key).replace(regexp,'+')+'='+w.encodeURIComponent(value).replace(regexp,'+'));};return pairs.join('&');};function changeToURL(data){var pairs=[];for(var key in data){pairs.push(key+'='+data[key]);};return pairs.join('&');};function getType(data){var t=Object.prototype.toString.call(data).slice(8,-1).toLowerCase();return(t==='number'&&isNaN(t))?'NaN':t;};function isFunction(obj){return getType(obj)==='function';};function isNumber(obj){return getType(obj)==='number';};function ranTime(str){var ran=(new Date()).getTime()+Math.floor(Math.random()*100000);return str?str+''+ran:ran;};})(window,document);
				(function($){var a=$("body");var c=navigator.appVersion.indexOf("MSIE 6")!=-1?true:false;a.delegate(".sd_share","click",function(i){var g=window.location.href;var f=$(this).attr("s_img");var j=$(this).attr("s_name");j+="";var h="1618051664";var d="http://service.t.sina.com.cn/share/share.php?url="+encodeURIComponent(g)+"&title="+encodeURIComponent(j)+"&ralateUid="+h;if(typeof f!="undefined"){d+="&pic="+encodeURIComponent(f)};window.open(d,"_blank","width=615,height=505")});a.delegate(".sd_toTop","click",function(d){try{document.documentElement.scrollTop=0}catch(e){};$("html, body").animate({scrollTop:0},500)});window.onscroll=window.onload=function(){var e=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop;var d=document.documentElement.clientHeight;var $o=$(".sc_success_alert");if(c){$o.css("top",e+d/2-$o.height()/4);}}})(jQuery);
				//alert($('#sc_txt,#sc_txt2').length);

				var login_flag = false;	//次状态，用来连贯登录和收藏操作使用
				var sc_click_btn = null;

				//正常登陆
				$('#J_Login_Btn_A').click(function(){
					//set_login_tit(true);
				})

				//点击收藏操作
				$('#sc_txt,#sc_txt2').click(function(){

					sc_click_btn = $(this).attr('id');
					var loginLayer = window.SINA_OUTLOGIN_LAYER;
					var cookie = loginLayer && loginLayer.getSinaCookie();
					if(cookie){							//1.1 登录
						var str = $(this).html(); 
						if(str.indexOf('已收藏')!=-1){	//1.1.1 已收藏
							//fn_sc_ch_del();
							//提示布码
							SUDA._S_uaTrack('content_collect','title_myfav_click');
						}else{							//1.1.2 未收藏
							//已登录布码
							if(sc_click_btn == 'sc_txt'){
								SUDA._S_uaTrack('content_collect','click_islogin');
								SUDA._S_uaTrack('content_collect','click_total');
							}else{
								SUDA._S_uaTrack('content_collect','below_click_islogin');
								SUDA._S_uaTrack('content_collect','below_click_total');
							}

							//fn_sc_ch_check(2);
							fn_sc_ch_add();

						}
					}else{								//1.2 未登录
						//总点击布码
						if(this.id == 'sc_txt'){
							SUDA._S_uaTrack('content_collect','click_total');
						}else{
							SUDA._S_uaTrack('content_collect','below_click_total');
						}

						login_flag = true;	//是未登录时点击的收藏
						if (loginLayer) {
							loginLayer.STK.core.dom.position
							loginLayer.set("plugin",{
								position:"center"
							});
							loginLayer.show();
							//set_login_tit(false);
							setTimeout(function(){
								loginLayer.set('styles', {
									'marginTop' : '30px',
									'marginLeft' : '7px',
									'zIndex':'10001'
								}).set('plugin', {
									position : 'top,right',                
									relatedNode : document.getElementById('J_Login_Btn_A')	//设置定位元素
								});
							}, 0);
						}
					}
				});

				// var  sc_i = 2;
				// if(window.SINA_OUTLOGIN_LAYER.getSinaCookie()){
					// sc_i = 0;
				// }

				//监控登录状态
				if(window.SINA_OUTLOGIN_LAYER){
					window.SINA_OUTLOGIN_LAYER.register('login_success', function(){
						if(login_flag){
							fn_sc_ch_check(3);	//未登录时点击收藏 则检测后
							login_flag = false;
						}else{
							fn_sc_ch_check();	//正常登录成功 检测
						}
						fn_sc_ch_bindLongout();
						set_login_toolTip(true);
					});
				}

				function fn_sc_ch_bindLongout(){
					var sabs = SAB;
					var cusEvt = sabs.evt.custEvent;
					cusEvt.add(sabs,'ce_logout',sc_logout);
					function sc_logout(){
						//alert(sc_i);
						//if(sc_i > 1){
							fn_sc_ch_status(false);
							//console.log('logout');
							set_login_toolTip(false);
							cusEvt.remove($,'ce_logout',sc_logout);
						//}else{
						//	sc_i++
						//}
					}
				}

				//处理收藏状态
				function fn_sc_ch_status(flag){
					var os = $('#sc_txt,#sc_txt2');
					if(flag){
						os.html('已收藏');
						os.attr('href','http://my.sina.com.cn/#location=fav');
						os.attr('target','_blank');
						//os.addClass('sc_txt_bc');
					}else{
						$('#sc_txt').html('收藏本文');
						$('#sc_txt2').html('收藏');
						//os.removeClass('sc_txt_bc');
						os.attr('href','javascript:;');
						os.attr('target','_self');
					}
				}

				//检查是否收藏
				function fn_sc_ch_check(f){
					var action = 'http://fav.mix.sina.com.cn/api/fav/check?callback=';
					if(f == '2'){
						action += 'scCheckCallback2';
					}else if(f == '3'){
						action += 'scCheckCallback3';
					}else{
						action += 'scCheckCallback';
					}
					var scDocid = $('#sc_txt').attr('data-docid');
					fn_sc_ch_createForm(action,scDocid);
				}

				//添加收藏
				function fn_sc_ch_add(){
					var action = 'http://fav.mix.sina.com.cn/api/fav/add?callback=scAddCallback';
					var scDocid = $('#sc_txt').attr('data-docid');
					fn_sc_ch_createForm(action,scDocid);
				}

				//取得数据
				function fn_sc_ch_query(fn){
					jsonp({
						url:'http://fav.mix.sina.com.cn/api/fav/get_user_list', 
						onsuccess: function(ret){
							fn(ret);
						}
					});
				}

				//window.sc_ch_total = 0;

				//添加收藏 回调
				window.scAddCallback = function(ret){
					//console.log(ret);
					var flag = false;
					var rs = ret.result;
					if(rs.status.code=='0'){
						$('#sc_ch_form_id').val(ret.result.data.id);
						//cookie
						var is_first = getCookie('sina_sc_is_first');
						if(!is_first){
							setCookie('sina_sc_is_first','1');
							fn_sc_ch_tit();
						}else{
							sc_success_tit(sc_click_btn);
						}
						flag = true;
					}else{
						if(rs.status.msg=='be saved'){
							$('#sc_ch_form_id').val(ret.result.data.id);
							sc_success_tit(sc_click_btn);
							flag = true;
						}else{
							alert('收藏失败！');
						}
					}
					fn_sc_ch_status(flag);
				}

				//检测是否已收藏 回调
				window.scCheckCallback = function(ret){
					//console.log(ret);
					var flag = false;
					if(ret.result.status.code=='12'){
						$('#sc_ch_form_id').val(ret.result.data.id);
						flag = true;
					}
					fn_sc_ch_status(flag);
					set_login_toolTip(true);
				}

				//检测后添加收藏 回调
				window.scCheckCallback2 = function(ret){
					//console.log(ret);
					var flag = false;
					var code = ret.result.status.code;
					if(code=='12'){
						flag = true;
						$('#sc_ch_form_id').val(ret.result.data.id);
						sc_success_tit(sc_click_btn);
					}else if(code=='13'){
						fn_sc_ch_add();	
					}else{
						alert('收藏失败！');
					}
					fn_sc_ch_status(flag);
				}

				//未登录点击收藏 登录成功后 回调
				window.scCheckCallback3 = function(ret){
					//console.log(ret);
					var flag = false;
					var code = ret.result.status.code;
					if(code=='12'){
						flag = true;
						$('#sc_ch_form_id').val(ret.result.data.id);
						sc_success_tit(sc_click_btn);
					}else if(code=='13'){
						fn_sc_ch_add();	
					}else{
						alert('收藏失败！');
					}
					fn_sc_ch_status(flag);
				}

				//操作动态FORM传递POST数据
				function fn_sc_ch_createForm(action,scDocid){
					if(action && scDocid){
						$('#sc_ch_form').attr('action',action);
						$('#scdocid').val(scDocid);
						//console.log(action);
						$('#sc_ch_form').submit();
						//console.log($('#scdocid').val());
					}
				}

				//第一次收藏提示打开
				function fn_sc_ch_tit(){
					coverLayer.on();
					$('.sc_success_alert').css('display','block');
				}

				//第一次收藏遮罩提示关闭
				$('.sc_success_alert .close,.sc_success_alert .sure').click(function(){
					$('.sc_success_alert').css('display','none');
					coverLayer.off();
				});

				//设置cookie
				function getCookie(key) {
					var arrTemp = document.cookie.split('; ');
					for (var i=0; i<arrTemp.length; i++) {
						var arr = arrTemp[i].split('=');
						if (arr[0] == encodeURI(key)) {
							return decodeURI(arr[1]);
						}
					}
				}

				function setCookie(key, value, day) {
					var oDate = new Date();
					var day = day || 3650;
					oDate.setDate(oDate.getDate() + day);
					document.cookie = encodeURI(key) + '=' + encodeURI(value) + ';expires=' + oDate.toUTCString() + ';path=/;domain=sina.com.cn';
				}

				function removeCookie(name){
					setCookie(name, '1', -1);
				}

				//收藏成功提示
				function sc_success_tit(id){
					//提示布码
					SUDA._S_uaTrack('content_collect','title_myfav_show');

					var top = 27;
					var left = -46;

					left = (id == 'sc_txt2' ? (left-10) : left);
					top = (id == 'sc_txt2' ? (top-5) : top);
					var offs = $('#'+id).offset(); 
					var otit = $('.sc_success_tit');
					var otitd = otit[0];
					otit.css({
						'top': ((offs && offs.top) || 0) + top + 'px',
						'left': ((offs && offs.left) || 0) + left + 'px',
						'display':'block'
					});
					clearTimeout(otitd.timmer);
					otitd.timmer = setTimeout(function(){
						otit.css('display','none');
					},10000);
				}

				//取消收藏 删除收藏操作
				function fn_sc_ch_del(){
					var action = 'http://fav.mix.sina.com.cn/api/fav/delete?callback=scDelCallback';
					fn_sc_ch_createForm(action,'0');
				}

				//删除收藏操作 回调
				window.scDelCallback = function(ret){
					if(ret.result.status.code == '0'){
						fn_sc_ch_status(false);
					}else{
						alert('取消收藏失败！');
					}
				}

				//登陆窗内文字提示
				function set_login_tit(f){
					if(f){//正常登陆
						$('.layerbox_left .titletips').html('新浪微博、博客、邮箱帐号，请直接登录！')
						$('.layerbox_left .titletips').css('color','#434242');
					}else{
						$('.layerbox_left .titletips').html('登陆成功后方可收藏！')
						$('.layerbox_left .titletips').css('color','#e66100');
					}

				}

				//登录成功后toolTip处理
				function set_login_toolTip(f){
					var os = $('#sc_txt,#sc_txt2');
					f ? os.attr('title','') : os.attr('title','登录后收藏 稍后阅读');
				}

			});