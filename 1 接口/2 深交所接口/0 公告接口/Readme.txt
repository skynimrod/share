. 深圳公告接口:

      http://www.cninfo.com.cn/disclosure/fulltext/plate/szselatest_24h.js

      罗列的是 24小时内(一般是当日0点发布的) 公告内容.  这个只是深圳主板的公告。

      中小板:


  下面是午间公告:(有可能所有公告都是这个接口， 不过显示了相应的时间段)
     
  深证主板: 

       http://disclosure.szse.cn/m/szmb/drgg.htm

       http://www.cninfo.com.cn/disclosure/fulltext/plate/szselatest_24h.js      有实际数据, 按时间顺序

  深圳中小板:

      http://disclosure.szse.cn/m/sme/drgg.htm  

      http://www.cninfo.com.cn/disclosure/fulltext/plate/smelatest_24h.js    有实际数据, 按时间顺序

  深证创业板:

     http://disclosure.szse.cn/m/chinext/drgg.htm

    http://www.cninfo.com.cn/disclosure/fulltext/plate/cyblatest_24h.js  有实际数据, 按时间顺序

    从上面的url 解析出下面的创业板公告数据

     http://disclosure.szse.cn/m/unit/drgglist.html?s=%2Fdisclosure%2Ffulltext%2Fplate%2Fcyblatest_24h.js

RemoteLoader()  来获取数据. 

var loader=new RemoteLoader(); 
if(s==""){alert("没有传入数据文件路径，不能显示公告列表。");}
else{
	loader.loadFiles([s],showTxtList,null);
}

	if(s.indexOf("szselatest_24h.js")>-1 || s.indexOf("cnsmelatest_24h.js")>-1 || s.indexOf("cyblatest_24h.js")>-1){

应该分别对应的是主板， 中小板， 创业板

http://disclosure.szse.cn/m/js/cninfo.core.js   这个是分页显示的

http://disclosure.szse.cn/m/js/remoteLoad.js    这个是加载数据的
这个js 中包含 数据获取的函数. 
