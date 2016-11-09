 var JAVA_URL = 'http://testmanage.aiganyisheng.net/',
        PHP_URL = 'http://testapi.aiganyisheng.net/',
        WAP_URL = 'http://testwap.aiganyisheng.net/',
        WX_URL = 'http://testwx.aiganyisheng.net/',
        APP_ID = 'wxd121dd5024977916',
        RY_KEY = '8luwapkvufjzl';
/*    var JAVA_URL = 'http://newmanage.aiganyisheng.cn/',
        PHP_URL = 'http://api.aiganyisheng.cn/',
        WAP_URL = 'http://wap.aiganyisheng.cn/';
        WX_URL = 'http://wx.aiganyisheng.cn/',
        APP_ID = 'wxe53e0da58a661bac',
        RY_KEY = 'pkfcgjstfqim8';*/

function getQueryStringArgs () {
	// 获取查询字符串参数，去除该字符串问号开关符号
	var qs=location.search.length>0?location.search.substring(1):"",
	args={},//存放所有查询字符串参数对
	items=qs.split("&"),
	len=items.length,
	name=null,
	value=null;
	if(qs.length==0) {
		return;
	};
	for(var i=0;i<len;i++){
		item=items[i].split("=");
		name=decodeURIComponent(item[0]);
		value=decodeURIComponent(item[1]);
		args[name]=value;
	}
	return args;
}