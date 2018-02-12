jsLoader(ARTICLE_JSS.jq,function(){
  (function($){
    var lcsWrap = $('#lcs_wrap');
      function creatList(data){
        var strObj = [];
        var domStr = '';
        var itemStr='';
        len = data.length>3?3:data.length
        for(var i = 0;i<len;i++){
          var item = data[i];
          var isLast = i==len-1?' last':'';
          itemStr = "<div class='lem-item clearfix"+isLast+"'>"+
                    "<div class='lem-pic'><a href=' http://licaishi.sina.com.cn/web/plannerInfo?p_uid="+item.p_uid+"&fr=f_news' target='_blank'><img src='"+item.p_image+"' width='35'></a></div>"+
                    "<div class='lem-txt'>"+
                    "<h4><span class='lem-name'><a href=' http://licaishi.sina.com.cn/web/plannerInfo?p_uid="+item.p_uid+"&fr=f_news' target='_blank'>"+item.p_name+"</a></span><span class='lem-company'>"+item.p_company_name+"</span><span class='lem-position'>"+item.p_position_name+"</span></h4>"+
                    "<p><strong>【"+item['title']+'】</strong>'+item['summary']+"<a href='http://licaishi.sina.com.cn/web/viewInfo?v_id="+item.v_id+"&fr=f_news' target='_blank'>阅读全文></a></p>"+
                  "</div>"+
                "</div>";
          strObj.push(itemStr);
        }
        domStr = strObj.join('');
        return domStr;
      }
      $.ajax({
        url: 'http://licaishi.sina.com.cn/api/finance',
        dataType: 'jsonp',
        data: {
            f_url:lcsWrap.attr('data-furl'),
            format:'json'
        },
        success: function(data){
          var result,lcs_array;
          if(data.code==0){
            result = data.data;
            if(result.total!='0'){
              lcs_array = result.data;
              lcsWrap.html("<div class='lcs-entrance-wrap'><div class='lcs-entrance-title clearfix'><div class='title-left lcs_link_bottom'></div><div class='title-right'><a href='http://licaishi.sina.com.cn/?fr=f_news' class='lcs-logo-detail'>找新浪认证理财师帮你发现赚钱机会>></a></div></div><div class='lcs-entrance-main'></div></div>");
              var $lcs_link_top = $('.lcs_link_top');
              $lcs_link_top.html("<a href='http://licaishi.sina.com.cn/web/searchUrl?f_url="+lcsWrap.attr('data-furl')+"&fr=f_news' target='_blank'>理财师("+result.total+")</a>");
              $('body').append('<span class="lcs_link_top_tip">点击查看理财师对本文的解释</span>');
              $lcs_link_top.on('mouseover',function(){
                $('.lcs_link_top_tip').css({'top':$lcs_link_top.offset().top+20,'left':$lcs_link_top.offset().left+10});
                $('.lcs_link_top_tip').show();
              });
              $lcs_link_top.on('mouseout',function(){                 
                $('.lcs_link_top_tip').hide();
              });
              $('.lcs_link_bottom').html("<a href='http://licaishi.sina.com.cn/web/searchUrl?f_url="+lcsWrap.attr('data-furl')+"&fr=f_news'><span>理财师对本文的解读</span><em>"+result.total+"</em></a>")
              $('.lcs-entrance-main').html(creatList(lcs_array));
              if(lcs_array.length>3){
                $('.lcs-entrance-main').after("<div class='lcs-entrance-more'><a href='http://licaishi.sina.com.cn/web/searchUrl?f_url="+lcsWrap.attr('data-furl')+"&fr=f_news' target='_blank'>查看更多</a></div>")
              }
            }else{
              lcsWrap.html("<div class='lcs-entrance-empty-wrap'><div class='lcs-entrance-empty clearfix'><a href='http://licaishi.sina.com.cn/?fr=f_news' target='_blank'><img src='http://i0.sinaimg.cn/cj/deco/2014/0703/img/lcs_logo_b.jpg'><span>新浪理财师&nbsp;&nbsp;让天下没有难理的财！</span></a><a class='wcf' href='http://www.weicaifu.com/?utm_source=sinacj&utm_medium=free&utm_term=lcslogo&utm_campaign=logo6024' target='_blank' suda-uatrack='key=licaishi&value=news_goto_weicaifu'><img src='http://finance.sina.com.cn/images/wcf_logo.jpg'><span>新浪微财富全民理财平台！</span></a></div></div>");
            }
          }
        },
        error: function(){

        }
    })
  })(jQuery);
})