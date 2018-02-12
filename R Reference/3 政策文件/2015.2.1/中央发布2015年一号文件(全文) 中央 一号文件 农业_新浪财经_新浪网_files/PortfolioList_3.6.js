//~ 登录名
//~ 密码
//~ 记住登录状态
//~ 注册
//~ 找回密码

//~ 登录名不能为空
//~ 密码不能为空

var PortfolioList = function ()
{
    SinaFinancePlatform.call(this);
    this._check = function (__object)
    {
        if(this._booleanLogining == true)
        {
            this._fill(this._elementInfo,this._stringLoginInfo);
            this._stringLoginInfo = "";
        }
        if(this._elementLoading != null)
        {
            this._hide(this._elementLoading);
        }
        sinaSSOManager.autoLogin(this._bind(function (__objectCookie)
        {
            if(__objectCookie == null)
            {
                this._stringUid = "";
                this._booleanLogin = false;
                this._hide(this._elementContainer);
                var __form = this._elementForm;
                __form["pwd"].value = '';
                this._show(this._elementLogin);
                if(this._numberThread != -1)
                {
                    clearInterval(this._numberThread);
                    this._numberThread = -1;
                }
                return false;
            }
            else
            {
                this._booleanLogin = true;
                if(this._stringUid != __objectCookie["uid"])
                {
                    this._booleanInitialized = false;
                    this._stringUid = __objectCookie["uid"];
                    this._list();
                }
                return true;
            }
        }));
    };
    this._list = function ()
    {
        this._rcall("http://vip.stock.finance.sina.com.cn/portfolio/web/api/jsonp.php","FinanceUserService.procLoginByNC",this._bind(function (__object)
        {
            this._arrayMy = __object.join("") == "" ? [] : this._objectConfigure["list"](__object);
            this._quote();
            if(this._numberThread == -1)
            {
                this._numberThread = setInterval(this._bind(this._quote),this._objectConfigure["quote"]);
            }
        }),{ "type": this._objectConfigure["my"] });
    };
    this._quote = function ()
    {
        if((this._booleanInitialized != true || this._booleanOpen == true) && this._booleanLogin == true && this._arrayMy != null)
        {
            this._booleanInitialized = true;
            var __numberMax = this._objectConfigure["max"];
            var __arrayMy = [];
            var __arrayHot = [];
            __arrayMy = this._arrayMy;
            var __numberMy = Math.max(this._arrayMy.length,1);
            if(__numberMy >= __numberMax)
            {
                __arrayMy = this._arrayMy.slice(0,__numberMax);
            }
            else if(__numberMy == __numberMax - 1)
            {
                __arrayMy = this._arrayMy;
            }
            else if(__numberMy <= __numberMax - 2)
            {
                __arrayMy = this._arrayMy;
                var __objectMy = {};
                for(var i in __arrayMy)
                {
                    __objectMy[__arrayMy[i]] = true;
                }
                __arrayHot = [];
                var __numberCount = 0;
                var __numberHot = __numberMax - __numberMy - (this._objectConfigure["split"] == true ? 1 : 0);
                for(var i in this._arrayHot)
                {
                    if(!(this._arrayHot[i] in __objectMy))
                    {
                        __arrayHot.push(this._arrayHot[i]);
                        __numberCount++;
                        if(__numberCount >= __numberHot)
                        {
                            break;
                        }
                    }
                }
            }
            var __arrayList = [].concat(__arrayMy,__arrayHot);
            this._load("http://hq.sinajs.cn/rn=" + this._random() + "&list=" + this._objectConfigure["list"](__arrayList).join(","),this._bind(function ()
            {
                var __objectData = { "my": this._process(__arrayMy),"hot": this._process(__arrayHot) };
                this._fill(this._elementContainer,this._replace(this._stringTemplate,__objectData));
                this._hide(this._elementLogin);
                this._show(this._elementContainer);
            }));
        }
    };
    this._process = function (__arrayCode)
    {
        var __arrayData = [];
        for(var i in __arrayCode)
        {
            var __stringCode = "hq_str_" + __arrayCode[i];
            if(__stringCode in window && window[__stringCode] != "")
            {
                var __arrayQuote = window[__stringCode].split(",");
                __objectData = this._objectConfigure["process"](__arrayCode[i],window[__stringCode].split(","),__arrayCode[i] in this._objectData ? this._objectData[__arrayCode[i]] : null);
                this._objectData[__arrayCode[i]] = __arrayQuote;
                __arrayData.push(__objectData);
            }
        }
        return __arrayData;
    };
    this._on = function (__objectConfigure)
    {
        if(this._booleanInit == true) { return; }
        this._booleanInit = true;
        this._elementContainer = this._get(this._objectConfigure["target"]);
        this._stringTemplate = this._elementContainer.innerHTML;
        this._elementLogin = this._get(this._objectConfigure["login"]);
        this._elementForm = this._get(this._objectConfigure["form"]);
        this._elementInfo = this._get(this._objectConfigure["info"]);
        this._elementLoading = this._get(this._objectConfigure["loading"]);
        this._aevent(this._elementForm,"submit",this._bind(function ()
        {
            var __form = this._elementForm;
            var __stringId = __form["id"].value;
            if(__stringId == "")
            {
                this._fill(this._elementInfo,"用户名不能为空");
                return false;
            }
            var __stringPassword = __form["pwd"].value;
            if(__stringPassword == "")
            {
                this._fill(this._elementInfo,"密码不能为空");
                return false;
            }
            var __stringSavestate = __form["savestate"].value;
            this._booleanLogining = true;
            this._fill(this._elementInfo,"正在登录...");

            //PATCH sinaSSOController instead of sinaSSOManager
            var _self = this;
            sinaSSOController.customLoginCallBack = function (ret)
            {
                //alert( "ret = " + ret + " reason = " + ret.reason + " info = " + _self._stringLoginInfo );
                if(ret && ret.result === true)
                {
                    _self._stringLoginInfo = "";
                }
                else
                {
                    if(ret.errno == '4049')
                    {
                        alert('您的账户存在安全问题，将会为您转到安全登陆页面。');
                        location.href = 'http://login.sina.com.cn/signup/signin.php?entry=finance&retcode=4049&r=' + location.href;
                        return;
                    }
                    _self._stringLoginInfo = ret.reason;
                }
                _self._check();
                _self._booleanLogining = false;
            };
            __stringSavestate = parseInt(__stringSavestate || 0);
            sinaSSOController.login(__stringId,__stringPassword,__stringSavestate);
            /*
            sinaSSOManager.login(this._bind(function (__object) {
            if (__object["result"] == true) {
            this._stringLoginInfo = "";
            }
            else {
            this._stringLoginInfo = __object["reason"];
            }
            this._check();
            this._booleanLogining = false;
            }), __stringId, __stringPassword, __stringSavestate);
            */

            return false;
        }));
        (new MarketTS()).bind(this._objectConfigure["type"],this._objectConfigure["market"],function () { },this._bind(function (__stringStatus)
        {
            this._booleanOpen = __stringStatus in this._objectOpen;
        }));
        sinaSSOManager["config"]["service"] = "finance";
        sinaSSOManager.regStatusChangeCallBack(this._bind(this._check));
        this._check();
        //update
        setInterval(this._bind(this._list),this._objectConfigure["load"]);
    };
    this._initialize = function (__objectConfigure)
    {
        this._objectConfigure = __objectConfigure;
        //data
        this._objectData = {};
        //target
        this._booleanLogining = false;
        this._stringLoginInfo = "";
        //market
        this._booleanInitialized = false;
        this._booleanOpen = true;
        this._objectOpen = {};
        for(var i in this._objectConfigure["open"])
        {
            this._objectOpen[this._objectConfigure["open"][i]] = true;
        }
        //hot
        this._arrayHot = this._objectConfigure["hot"];
        //my
        this._booleanLogin = null;
        this._arrayMy = null;
        this._booleanInit = false;
        if("tab" in this._objectConfigure)
        {
            this._aevent(this._get(this._objectConfigure["tab"]),this._objectConfigure["on"],this._bind(this._on,[__objectConfigure]));
        }
        else
        {
            this._on(__objectConfigure);
        }
        //quote
        this._numberThread = -1;
    };
    this._initialize.apply(this,arguments);
};
