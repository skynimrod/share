. 上交所 公告 接口:

   http://www.sse.com.cn/disclosure/listedinfo/announcement/index_csrc.shtml

       当日 上交所上市公司 所有的公告list.  这个估计也是0点发布. 下午不知道几点发布...

  http://www.sse.com.cn/disclosure/listedinfo/announcement/

  2个接口数据都是一致的， 但是， 最上面的接口是上交所提交给证监会的借口, 是按照代码顺序的，不容易处理。 下面的接口是按照时间顺序的， 容易处理。(主要是效率高， 不用重复处理)

  使用下面的接口. 

  问题是 提交给证监会的接口， 直接可以看到数据.  下面的接口， 似乎是调用巨潮的接口？ 看不到直接的数据。 仍然是带分页的。。。

  算了， 暂时用第一个接口吧， 虽然处理效率低一点儿， 但是数据是可以直接得到的， 而且也不用实时处理， 只需要在指定的时间点处理即可。

================用下面的××××××××=======

http://www.cninfo.com.cn/disclosure/fulltext/plate/shmblatest_24h.js  有数据， 按照时间按顺序

访问目标公告的时候， 只需要添加 http://www.cninfo.com.cn/公告url， 如下:

 http://www.cninfo.com.cn/finalpage/2015-07-09/1201259947.PDF

. 注意  沪市 代码特点：   6 或 2 开头. 6 开头的是主板， 2 开头的是 沪市 B股.
