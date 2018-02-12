jsLoader(ARTICLE_JSS.jq, function(){
	function _renderPopup($){
      if($.popUp) return;
      $.popUp=function(a){var b=$.extend({},$.popUp.defaults,a);$.popUp.opts=b};$.popUp.open=function(a){var b=$(window),c=$(document.body),d=$(this),e,f;var g=a;if(!this.states.enabled)return;this._init();e=$.popUp.mask;f=$.popUp.popUp;if(g.innerHTML){f.html(g.innerHTML)}else if(g.htmlWrap){f.html($(g.htmlWrap).html())};e.css({'width':$(window).width()+"px",'height':Math.max($(document.body).height(),$(window).height())+"px"});e.css({'height':$(document.body).height()+'px'});if(!g.autoSize){f.css({'width':g.width+'px','height':g.height+'px','top':Math.max(document.body.scrollTop,document.documentElement.scrollTop)+$(window).height()/ 2 - g.height /2+'px','left':document.body.clientWidth/ 2 - g.width /2+'px'})};if(g.onClose){f.onCloseOnce=g.onClose};e.show();f.fadeIn(300);e.get(0).onclick=function(h){if(!$.popUp.states.loading&&g.maskClickClose){$.popUp.close()}};this.states.showing=true;g&&g.callBack&&g.callBack()};$.popUp.close=function(a){var b=$('#popup_mask'),c=$('#popup');b.stop().delay(300).hide();c.stop().fadeOut(300);this.states.showing=false;if(c.onCloseOnce){c.onCloseOnce();c.onCloseOnce=null};a&&a.callBack&&a.callBack()};$.popUp.showLoading=function(){var a,b;this._init();a=$.popUp.loading;b=$.popUp.mask;b.css({'height':$(document.body).height()+'px'});a.css({'width':'50px','height':'24px','top':Math.max(document.body.scrollTop,document.documentElement.scrollTop)+$(window).outerHeight()/ 2 - 24 /2+'px','left':document.body.clientWidth/ 2 - 50 /2+'px'});b.show();a.show();this.states.loading=false};$.popUp.hideLoading=function(){var a=this.loading;var b=this.mask;b.hide();a.hide();this.states.loading=false};$.popUp.modifyCont=function(a){var b=$('#popup');b.html(a)};$.popUp.enable=function(a){this.states.enabled=a?true:false};$.popUp._init=function(){var a;if(this.states.inited){return}else{a=$(document.body);this.mask=$('<div id="popup_mask" style="display : none;"></div>').appendTo(a);this.loading=$('<div id="popup_loading" style="display : none;"></div>').appendTo(a);this.popUp=$('<div id="popup" style="display : none;"></div>').appendTo(a);this.states.inited=true}};$.popUp.states={inited:false,showing:false,loading:false,enabled:true};$.popUp.defaults={trigger:'click',maskClickClose:true,autoSize:false,width:500,height:300,innerHTML:'提示'};
  }

	var html5Cont = $('meta[http-equiv="mobile-agent"]').eq(0).attr('content');
	var mbUrl = html5Cont.substring(html5Cont.indexOf('url=') + 4);
	var codeImgSrc = 'http://comet.blog.sina.com.cn/qr?' + decodeURIComponent(mbUrl);
  if(codeImgSrc.indexOf('?') > 0){
    codeImgSrc = codeImgSrc + '&wm=';
  }
  else{
    codeImgSrc = codeImgSrc + '?wm=';
  }
	jQuery('#share_weimi').click(function(){
    _renderPopup(jQuery);
		$.popUp.open({
		    trigger: 'click',
		    maskClickClose: false,
		    autoSize: false,
		    width: 560,
		    height: 560,
		    innerHTML: '\
				<div class="popup_share">\
					<span class="popup_share_close" onclick="$.popUp.close()" suda-uatrack="key=menhu_weimi_share&value=weimi_layer_close"></span>\
					<div class="popup_share_tt">\
						<h4>微米分享</h4>\
						<p>请前往<a href="http://www.weimi.me/" target="_blank" suda-uatrack="key=menhu_weimi_share&value=weimi_layer_url">www.weimi.me</a>下载微米客户端</p>\
					</div>\
					<div class="popup_share_c">\
              <div class="popup_share_bg">\
                  <img src="' + codeImgSrc + '3174_0001' + '" alt="">\
              </div>\
          </div>\
				</div>'
		});
	});
  jQuery('#share_laiwang').click(function(){
    _renderPopup(jQuery);
    $.popUp.open({
        trigger: 'click',
        maskClickClose: false,
        autoSize: false,
        width: 560,
        height: 560,
        innerHTML: '\
		<iframe style="width:560px;height:560px;position:absolute;left:0;filter:Alpha(opacity=0);opacity:0;border:none"></iframe>\
        <div class="popup_share" style="width:560px;height:560px;position:absolute;left:0">\
          <span class="popup_share_close" onclick="$.popUp.close()" suda-uatrack="key=menhu_laiwang_share&value=laiwang_layer_close"></span>\
          <div class="popup_share_tt">\
            <h4>来往分享</h4>\
            <p>请前往<a href="http://www.laiwang.com/" target="_blank" suda-uatrack="key=menhu_laiwang_share&value=laiwang_layer_url">www.laiwang.com</a>下载来往客户端</p>\
          </div>\
          <div class="popup_share_c">\
              <div class="popup_share_bg popup_share_lw_bg">\
                  <img src="' + codeImgSrc + '3175_0001' + '" alt="">\
              </div>\
          </div>\
        </div>'
    });
  });
  jQuery('#share_weixin').click(function(){
    var tpl_tip_wx = '<div class="tip_weixin"><img src="' + codeImgSrc + '3173_0001' + '" alt="" class="weixin_qr" /><span class="tip_weixin_close" suda-uatrack="key=menhu_weixin_share&value=weixin_layer_close"></span><p class="weixin_qr_intro">用微信扫描二维码<br />分享至好友和朋友圈</p></div>';
    var wxWrap = $(this).parent();
    var $tip_wx = wxWrap.find('.tip_weixin');
    $tip_wx = $tip_wx.length ? $tip_wx : $(tpl_tip_wx).appendTo(wxWrap);
    if($tip_wx.hasClass('weixinPullUp')){
      $tip_wx.hide(0);
      $tip_wx.removeClass('weixinPullUp');
    }
    else{
      $tip_wx.show(0);
      $tip_wx.addClass('weixinPullUp');
    }
  });
  jQuery('#share_weixin_w').click(function (e) {
    if(e.target.className == 'tip_weixin_close'){
      var $tip_wx = $(this).find('.tip_weixin');
      $tip_wx.hide(0);
      $tip_wx.removeClass('weixinPullUp');
    }
  });
});