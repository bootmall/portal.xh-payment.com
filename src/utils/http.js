/**
 * http配置
 */

import axios from 'axios'
import common from './common'
import router from '../router'
import store from '../store'

// axios 配置
axios.defaults.timeout = 20000;
axios.defaults.baseURL = (typeof process.env.API_BASE_URL!= 'undefined' && process.env.API_BASE_URL) ? process.env.API_BASE_URL: 'http://www.payment.com/api/v1';
var loginUrl = common.pageMap.login;
// http request 拦截器
axios.interceptors.request.use(
    config => {
        let accessToken = common.getToken();
        if (accessToken && accessToken.length>0) {
            config.headers.common['Authorization'] = "Bearer "+accessToken;
        }

      let clientId = common.getStorage('x-client-id');
      if (typeof clientId != 'undefined' && clientId && clientId.length>0) {
        config.headers.common['x-client-id'] = clientId;
      }

        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

// http response 拦截器
axios.interceptors.response.use(
    response => {
      var errMsg = ''

      if(response.status==401){
        // alert('系统需要登录，即将前往登录页面:2');
        errMsg = '系统需要登录，即将前往登录页面:401-1'
        router.replace({path: '/login'})
        if(window.location.href.indexOf(loginUrl)==-1){
          alert(errMsg);

          window.location.href = loginUrl
        }
      }
      else if(response.status != 200){
        errMsg = '服务器错误: http-'+response.status
      }
      else{
          if(typeof response.data.code == 'undefined'){
              // alert('请求失败，找不到业务响应代码！code');
            errMsg = '请求失败，找不到业务响应代码！code'
          }

          if(response.data.code == 401 || response.data.code == 20000){
              // alert('系统需要登录，即将前往登录页面:1');
            errMsg = '系统权限验证失败'
            if(response.data.message) errMsg+=':'+response.data.message
            errMsg+='(401-2)'

            store.dispatch('LogOut').then(function () {
              if(window.location.href.indexOf(loginUrl)==-1){
                alert(errMsg);

                window.location.href = loginUrl
              }
            })
          }
      }

      //自动刷新登录token
      if(typeof response.data.data['__token__'] != "undefined" && response.data.data['__token__'].length>12){
        common.setToken(response.data.data['__token__'])
      }

      if(errMsg==''){
        return response.data;
      }else{
        return {'code':1,'message':errMsg};
      }

    },
    error => {
        var errMsg = ''
        var code =-1
        if (error.response) {
            switch (error.response.status) {
                case 401:

                  errMsg = '系统需要登录，即将前往登录页面:3'
                  store.dispatch('LogOut').then(function () {
                    if(window.location.href.indexOf(loginUrl)==-1){
                      alert(errMsg);

                      window.location.href = loginUrl
                    }
                  })
                  break;
                default:
                  errMsg = '网络错误，请重试: err.http.status'
                  break;
            }

            if(typeof error.response.data.code != 'undefined' && error.response.data.code!=0){
              code = error.response.data.code
            }
            if(typeof error.response.data.message != 'undefined'){
              errMsg = error.response.data.message
            }
        }else{
          errMsg = '网络错误，请重试: err.http.no.response'
        }

        if(errMsg=='') errMsg = JSON.stringify(error)
        return {'code':code,'message':errMsg}
    }
);

export default axios