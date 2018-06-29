import cookie from 'js-cookie'

var pageMap = {
    baseDomain: process.env.API_BASE_URL,
    basePath: process.env.BASE_PATH,
    env: process.env.ENV_CONFIG,
    home: '/',
    login: process.env.BASE_PATH+'#/login',
}
//顶部沉浸模式
var fixStatusBar = function(selector) {
    var el = document.querySelector(selector);
    if (!el) {
        console.warn('$api.fixStatusBar Function need el param, el param must be DOM Element');
        return;
    }
    var padingtopnum=0;
    var sysType = api.systemType;
    if (sysType == 'ios') {
        var strSV = api.systemVersion;
        var numSV = parseInt(strSV, 10);
        var fullScreen = api.fullScreen;
        var iOS7StatusBarAppearance = api.iOS7StatusBarAppearance;
        if (numSV >= 7 && !fullScreen && iOS7StatusBarAppearance) {
            el.style.paddingTop = '20px';
            padingtopnum=20;
        }
    } else if (sysType == 'android') {
        var ver = api.systemVersion;
        ver = parseFloat(ver);
        if (ver >= 4.4) {
            el.style.paddingTop = '24px';
            padingtopnum=24;
        }
    }
    if(el.classList.contains('mui-bar')){
    	el.style.height=44+padingtopnum+'px';
    	var muibody=document.querySelector('.mui-content');
    	if(muibody){
    		muibody.style.paddingTop=44+padingtopnum+'px';
    	}
    }
    return el.offsetHeight
}

function isInWechat(){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
        return true;
    } else {
        return false;
    }
}

var apiBmapGetLocation = function(cb){
  apiBMap.getLocation({
       accuracy: '100m',
       autoStop: true,
       filter: 1
   }, function(ret, err) {
       if (ret.status) {
           cb(ret, err);
       } else {
           cb(ret, err);
       }
   });
}

var getRelativePath = function(from, to) {
    function trim(arr) {
      var start = 0;
      for (; start < arr.length; start++) {
        if (arr[start] !== '') break;
      }

      var end = arr.length - 1;
      for (; end >= 0; end--) {
        if (arr[end] !== '') break;
      }

      if (start > end) return [];
      return arr.slice(start, end - start + 1);
    }

    var fromParts = trim(from.split('/'));
    var toParts = trim(to.split('/'));

    var length = Math.min(fromParts.length, toParts.length);
    var samePartsLength = length;
    for (var i = 0; i < length; i++) {
      if (fromParts[i] !== toParts[i]) {
        samePartsLength = i;
        break;
      }
    }

    var outputParts = [];
    for (var i = samePartsLength; i < fromParts.length; i++) {
      outputParts.push('..');
    }
    outputParts = outputParts.concat(toParts.slice(samePartsLength));
    if(!outputParts){
      return '.';
    }
    var rpath = outputParts.join('/');
    if(rpath=='..'){
      rpath='../';
    }else if(rpath=='.' || !rpath){
      rpath='./';
    }else{
      rpath='./'+rpath+'/';
    }

    rpath = rpath+to.split('/').pop()
    return rpath;
}

var log = function(obj){
  console.log(obj);
}

/*
 * 解决微信支付路径问题添加的前缀
 *
 * 自动添加问号(?), 自动把分隔符由#!变成#, 分隔符后面，自动判断是否为斜杠(/)，没有则添加上
 */
var forceAddQuestionMarkForCurrentUrl = function () {
    let { href, protocol, host, search, hash } = window.location
    const pathname = '/webapp/v2/dist/'
    search = search || '?'
    hash = hash || '#/'
    let newHref = `${protocol}//${host}${pathname}${search}${hash}`
    if (newHref !== href) {
        window.location.replace(newHref)
    }
}

var getParameterByName = function(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var getAllUrlParams = function(qs)
{
    if(typeof qs == 'undefined' || !qs){
      var qs=location.query;
      if(!qs && location.hash && location.hash.indexOf("?") != -1) qs=location.hash.substr(location.hash.indexOf("?"))
    }

    if(!qs) return {};

    var theRequest = new Object();
    if (qs.indexOf("?") != -1) {
       var str = qs.substr(1);

       var strs = str.split("&");
       for(var i = 0; i < strs.length; i ++) {
          theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
       }
    }
    return theRequest;
}

var redirect = function(url){
    var pageMaps = {

    };
  if(!checkIsInApicloud()){
    window.location.href = url;
    return true;
  }
  else{
    var pageParam = {};
    if (url.indexOf("?") != -1) {
        var qs = url.substring(url.indexOf("?"))
        pageParam = getAllUrlParams(qs);
        url = url.substring(0,url.indexOf("?"));
    }

    var winName = url.replace(/\.\//g, '').replace(/\.html/g, '').replace(/\//g, '_');
    var appName = api.wgtRootDir.split('/').pop();
    var curPath = window.location.href.substring(window.location.href.indexOf(appName)+appName.length);
    var relativePath = getRelativePath(curPath,url);

    api.openWin({
      name: winName,
      url: relativePath,
      animation:{
        //  type:"none",
      },
      pageParam:pageParam,
      reload:true
    });
    api.closeWin();
  }
}

/*\
 |*|
 |*|  :: Translate relative paths to absolute paths ::
 |*|
 |*|  https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
 |*|  https://developer.mozilla.org/User:fusionchess
 |*|
 |*|  The following code is released under the GNU Public License, version 3 or later.
 |*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
 |*|
 \*/

function relPathToAbs (sRelPath) {
  var nUpLn, sDir = "", sPath = location.pathname.replace(/[^\/]*$/, sRelPath.replace(/(\/|^)(?:\.?\/+)+/g, "$1"));
  for (var nEnd, nStart = 0; nEnd = sPath.indexOf("/../", nStart), nEnd > -1; nStart = nEnd + nUpLn) {
    nUpLn = /^\/(?:\.\.\/)*/.exec(sPath.slice(nEnd))[0].length;
    sDir = (sDir + sPath.substring(nStart, nEnd)).replace(new RegExp("(?:\\\/+[^\\\/]*){0," + ((nUpLn - 1) / 3) + "}$"), "/");
  }
  return sDir + sPath.substr(nStart);
}

var setCookie = function(cookieName, cookieValue, seconds, path, domain, secure) {
  cookie.remove(cookieName);
  var option = { expires: seconds, path: path, domain: domain, secure:secure}
  cookie.set(cookieName,cookieValue)
}

var getCookie = function(name) {
  cookie.get(name)
}

var setStorage = function(name,val){
    val = JSON.stringify(val)
    var ret = setCookie(name, val, 86400*3,'/');
    window.localStorage.setItem(name, val);
}

var getStorage = function(name){
    //cookie优先，兼容后台读写cookie跳转
    val = getCookie(name);
    if(!val || val == 'null'){
        var val = window.localStorage.getItem(name);
    }

    try {
        if(
            typeof val=='string'
            && (
                val.substr(0,1) == '"'
                || val.substr(0,1) == '{'
                ||val.substr(0,1) == '['
            )
        ){
            val = JSON.parse(val)
        }
    } catch(e) {
        val = null
    }

    if(!val || val == 'null'){
        return null
    }

    return val;
}

var checkIsInApicloud = function() {
    var isInAppcloud = false;
    if(navigator.userAgent.indexOf('app_apicloud')>0){
        isInAppcloud = true;
    }
    return isInAppcloud;
}

var S4 = function() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};
// Generate a pseudo-GUID by concatenating random hexadecimal.
var guid = function() {
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};

var getLoginInfo = function(){
    var accessToken = getStorage('access_token');
    var uid = getStorage('uid');
    var nickname = getStorage('nickname');
    return {
        accessToken: accessToken,
        uid: uid,
        nickname: nickname,
    }
}

var getToken = function(){
  return getStorage('access_token');
}

var setToken = function(val){
  return getStorage('access_token',val);
}
var getPermissions = function(){
  return getStorage('permissions');
}

var setPermissions = function(val){
  return setStorage('permissions',val);
}

var removeToken = function(){
  setStorage('access_token','');
}

var checkLogin = function () {
    var accessToken = getStorage('access_token');
    var uid = getStorage('uid');
    var params = getAllUrlParams();

    if(!accessToken){
        var loginUrl = pageMap.login
        if(isInWechat()){
           loginUrl = pageMap.wxLogin
        }

        loginUrl += '?referer='+encodeURIComponent(window.location.href)

         setStorage('referer',window.location.href)

        window.location.href = loginUrl;
    }
}

var getYesterdayStr = function(){
  setStorage('access_token','');
}

var getDateStr = function(addDayCount) {
  var dd = new Date();
  dd.setDate(dd.getDate()+addDayCount);//获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = dd.getMonth()+1;//获取当前月份的日期
  var d = dd.getDate();
  return y+"-"+m+"-"+d;
}

var downloadFile = (url, data) => {
  // 首先创建一个name为“__iframe_downloader__”的隐藏的iframe标签，防止页面跳出
  const iframeName = "__iframe_downloader__";
  let iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.name = iframeName;
  document.body.appendChild(iframe);
  // 创建一个隐藏的form标签
  const form = document.createElement("form");
  form.style.display = "none";
  form.target = iframeName;
  form.method = "post";
  form.acceptCharset = "utf-8";
  form.action = url;
  // 通过form发送json数据请参考  https://darobin.github.io/formic/specs/json/
  const traverse = (obj, key) => {
    key = key || "";
    const result = [];
    for (let prop in obj) {
      const value = obj[prop];
      typeof value === "object" ? result.push.apply(result, traverse(value, key + "[" + prop + "]")) : result.push({ name: key ? key + "[" + prop + "]" : prop, value: value });
    }
    return result;
  };
  const inputs = document.createDocumentFragment();
  const fields = traverse(data);
  fields.forEach(field => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = field.name;
    input.value = field.value;
    inputs.appendChild(input);
  });
  form.appendChild(inputs);
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

var setDeviceClientId = function () {
  let clientId = getStorage('x-client-id')
  if (typeof clientId == 'undefined' || !clientId || clientId.length == 0) {
    function pad2(n) {
      return n < 10 ? '0' + n : n
    }

    var date = new Date();

    clientId = (date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(
      date.getMinutes()) + pad2(date.getSeconds())) + '_' + Math.ceil(Math.random() * (999999 - 100000) + 100000);
    setStorage('x-client-id', clientId)
  }

  return clientId
}

export default  {
  getStorage: getStorage,
  setStorage: setStorage,
  checkIsInApicloud: checkIsInApicloud,
  redirect: redirect,
  getAllUrlParams: getAllUrlParams,
  checkLogin: checkLogin,
  getLoginInfo: getLoginInfo,
  forceAddQuestionMarkForCurrentUrl:forceAddQuestionMarkForCurrentUrl,
  pageMap: pageMap,
  guid: guid,
  getToken: getToken,
  setToken: setToken,
  getPermissions: getPermissions,
  setPermissions: setPermissions,
  removeToken: removeToken,
  downloadFile: downloadFile,
  getDateStr: getDateStr,
  setDeviceClientId: setDeviceClientId,
  ENV: process.env,
}