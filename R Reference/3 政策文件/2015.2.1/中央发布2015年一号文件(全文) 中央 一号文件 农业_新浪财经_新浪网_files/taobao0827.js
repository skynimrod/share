;(function(b, c) {
    function g() {
        var a = b.getElementById("cont-tanx-a-" + h);
        if (5 < i && ("undefined" === typeof c.tanxssp_show)) {
            try {
                a.removeChild(b.getElementById("tanx-a-" + h))
            } catch (d) {}
            a.innerHTML = j
        } else "undefined" !== typeof c.tanxssp_show || (i++, setTimeout(g, 100))
    }
    var a = b.createElement("script"),
        d = b.getElementsByTagName("head")[0],
        j = "\x3Ca href\x3D\x27http\x3A\x2F\x2Fredirect.simba.taobao.com\x2Frd\x3Fc\x3Dun\x26w\x3Dchannel\x26f\x3Dhttp\x253A\x252F\x252Fqin.taobao.com\x252F\x253Frefpid\x253Dmm\x5F15890324\x5F2192376\x5F9022374\x2526unid\x253D\x26k\x3D42fb32372ced8135\x26p\x3Dmm\x5F15890324\x5F2192376\x5F9022374\x27 target\x3D\x5Fblank\x3E\x3Cimg src\x3D\x27http\x3A\x2F\x2Fd1.sina.com.cn\x2F201312\x2F26\x2F530814.jpg\x27 border\x3D0 \x2F\x3E\x3C\x2Fa\x3E",
        i = 0,
        h = "mm_15890324_2192376_9022374";
    b.write("<span id='cont-tanx-a-" + h + "'><a style='display:none;' id='tanx-a-" + h + "'></a></span>");
    (a.src = "http://p.tanx.com/ex?i=" + h, d.insertBefore(a, d.firstChild));
    setTimeout(g, 3E3)
})(document, window);
