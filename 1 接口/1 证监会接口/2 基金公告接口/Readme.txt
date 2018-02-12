.  http://fund.csrc.gov.cn/web/list_page.upload_info_console?1=1&reportTypeCode=FB030&limit=20&start=40

   start 参数是当前起始的记录编号,  limit =20 是一次检索出的记录数, 这个数据修改没有作用。
 
   可以从起始 20个记录一处理， 直到碰到 已经处理过的记录中最新的记录(即上次处理的第一条记录)

. 解析上面的源码， 检索出 XBRL 内容。 

  http://fund.csrc.gov.cn/web/html_view.instance?instanceid=ff8080814ca25803014cdb99de0232f2

  注意： Http://found.csrc.gov.cn 是需要单独添加上去的


   http://fund.csrc.gov.cn/web/html_view.instance?instanceid=ff8080814ca25803014cdb6b371031af     解析出来的原始地址

   http://fund.csrc.gov.cn/web/html_view.instance?instanceid=ff8080814ca25803014cdb6b371031af   正确

   然后再解析这个 xbrl 文件源码，就可以得到基金的季报，年报公告内容。 


.  http://fund.csrc.gov.cn/css/home.css


. 基金管理公司一览表

  http://www.cninfo.com.cn/information/fund/fmlist.html

  在巨潮网上也有相关性信息

.  http://www.cninfo.com.cn/information/statistics.html

   http://www.cninfo.com.cn/unit/cninfo.html?s=finalpage%2F2015-04-22%2Fcninfo1200882437.js    深圳主板

  相关交易信息， 主要是交易金额， 指数数据， 所有股票的 O，H,L,C数据，跌幅， 成交量， 笔数， 金额，PEI, PEII


  http://www.cninfo.com.cn/unit/cninfo.html?s=finalpage%2F2015-04-22%2Fcninfo1200882448.js  深证中小板

. http://www.cninfo.com.cn/disclosure/fund.html

  基金的公告
  