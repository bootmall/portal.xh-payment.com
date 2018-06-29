<template>
    <div class="login-container">
        <h1></h1>
        <el-form class="card-box login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
            <h3 class="title">{{siteInfo.siteName}}系统登录</h3>

            <el-form-item prop="username">
                <span class="svg-container svg-container_login">
                  <svg-icon icon-class="user"/>
                </span>
                <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="用户名"/>
            </el-form-item>

            <el-form-item prop="password">
                <span class="svg-container">
                  <svg-icon icon-class="password"/>
                </span>
                <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
                          placeholder="密码"/>
                <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye"/></span>
            </el-form-item>
            <el-form-item class="item-captcha" prop="captchaCode">
                <span class="svg-container">
                  <svg-icon icon-class="documentation"/>
                </span>
                <el-input class="el-captcha" label="图片验证码" v-model="loginForm.captchaCode"></el-input>
                <img @click="refreshCaptcha" v-if="captchaBase64" :src="captchaBase64" style="margin-top: 2px;margin-left: 10px;" />

                <a v-if="captchaBase64" @click="refreshCaptcha">刷新</a>
            </el-form-item>
            <el-row :gutter="20">
                <el-col :span="12" :offset="6">
                    <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
                </el-col>
            </el-row>
        </el-form>
        <el-dialog title="安全令牌" :visible.sync="keyVisible" width="30%">
            令牌码：
            <el-input style="border: 1px solid #5a5e66;height: 26px;" class="key_2fa" v-model="key_2fa"></el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="keyVisible = false">取 消</el-button>
                <el-button type="primary" :loading="loadingKey" @click="handleKey">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import {isvalidUsername} from '@/utils/validate'
  import common from '@/utils/common'
  import axios from '@/utils/http'

  export default {
    components: {},
    name: 'login',
    data() {
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码不能小于6位'))
        } else {
          callback()
        }
      }
      const validateCaptchaCode = (rule, value, callback) => {
        if (!/^(\w){4,6}$/.test(value)) {
          callback(new Error('验证码错误:1'))
        } else {
          this.validateRet.captchaCode = 1;
          callback()
        }
      }
      return {
        loginForm: {
          username: '',
          password: '',
          captchaCode: '',
          captchaSid: ''
        },
        key_2fa: null,
        userId: null,
        loginRules: {
          username: [{required: true, trigger: 'blur', validator: isvalidUsername}],
          password: [{required: true, trigger: 'blur', validator: validatePassword}],
          captchaCode: [{required: true, trigger: 'blur', validator: validateCaptchaCode}],//this.validateCaptchaCode
        },
        pwdType: 'password',
        captchaBase64: '',
        validateRet: {},
        loading: false,
        loadingKey: false,
        showDialog: false,
        keyVisible: false,
        siteInfo:{
          siteName: '',
        }
      }
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      refreshCaptcha: function () {
        var self = this
        var captchaUrl = '/captcha/index';
        axios.post(captchaUrl).then((res) => {
          if (res.code == 0) {
            self.captchaBase64 = res.data.base64Img
            self.loginForm.captchaSid = res.data.sid
            console.log('self.loginForm.captchaSid', self.loginForm.captchaSid);
          } else {
            self.$message.error('图片验证码获取失败');
          }
        })
      },
      validateCaptchaCode(rule, value, callback, valueObj) {
        var self = this
        if (value.length < 4) {
          callback(new Error('验证码不能小于4位'))
          return
        }

        axios.post('/captcha/verify', {'captchaCode': value, 'captchaSid': this.loginForm.captchaSid}).then((res) => {
          if (res.code == 0) {
            self.validateRet.captchaCode = 1;
            callback()
          } else {
            self.refreshCaptcha()
            callback(new Error('验证码错误或已过期'))
          }
        })
      },
      getSiteInfo() {
        axios.post('/util/site-info').then((res) => {
          if (res.code == 0) {
            common.setStorage('siteInfo',res.data)
            if(typeof res.data.siteName != 'undefined'){
                document.title =  res.data.siteName
                this.siteInfo.siteName = res.data.siteName
            }
          }
        })
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('LoginByUsername', this.loginForm).then(
              response => {

                if (typeof response.data.key_2fa != 'undefined' && response.data.key_2fa.length > 0) {
                  this.keyVisible = true;
                } else {
                  this.$message.success({message: response.message})
                  this.loading = false
                  // this.$router.push({ path: '/' })
                  //强制跳转修复菜单问题
                  // console.log(window.location.host+common.pageMap.basePath+"?nonce="+Math.random())
                  setTimeout(function () {
                    // window.location.href = window.location.host+common.pageMap.basePath+"?nonce="+Math.random()
                    window.location.reload()
                  }, 50)
                }
              },
              response => {
                console.log('axios post err.', response);
                this.$message.error({message: response.message})
                this.loading = false
              }
            ).catch((error) => {
              this.loading = false
              this.$message.error({message: '信息填写错误1，请检查'})
            })
          } else {
            this.$message.error({message: '信息填写错误2，请检查'})
            return false
          }
        })
      },
      handleKey() {
        this.loadingKey = true;
        if (this.key_2fa.length != 6) {
          this.$message.error({message: '请填写6位安全码'})
          return;
        }
        let data = {
          key_2fa: this.key_2fa,
        }
        axios.post('/user/verify-key', data).then(
          res => {
            if (res.code == 0) {
              this.keyVisible = false
              this.$message.success({message: res.message})
              setTimeout(function () {
                window.location.reload()
              }, 50)
            } else {
              this.$message.error({message: res.message})
              this.loadingKey = false;
            }
          },
        );
      },
    },
    created() {
      common.setDeviceClientId()
      this.getSiteInfo()
      this.refreshCaptcha()
      // window.addEventListener('hashchange', this.afterQRScan)
    },
    destroyed() {
      // window.removeEventListener('hashchange', this.afterQRScan)
    },
  }
</script>

<style rel="stylesheet/scss" lang="scss">
    @import "src/styles/mixin.scss";

    $bg: #2d3a4b;
    $dark_gray: #889aa4;
    $light_gray: #eee;

    .login-container {
        @include relative;
        background:url(../../assets/imgs/login-bg.jpg)no-repeat;
        width:100%;
        height:100%;
        background-size:100% 100%;
        position:absolute;
        filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../../assets/imgs/login-bg.jpg',sizingMethod='scale');
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus
        input:-webkit-autofill,
        textarea:-webkit-autofill,
        textarea:-webkit-autofill:hover
        textarea:-webkit-autofill:focus,
        select:-webkit-autofill,
        select:-webkit-autofill:hover,
        select:-webkit-autofill:focus {
            -webkit-text-fill-color: $dark_gray;
            -webkit-box-shadow: 0 0 0px 1000px #FFFAFA inset;
            transition: background-color 5000s ease-in-out 0s;
        }
        .el-input__inner {
            border: solid 1px #eee;
        }
        input {
            background-color:rgba(0, 0, 0, 0.1);
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: $bg;
            height: 47px;

        }

        .el-input {
            display: inline-block;
            height: 47px;
            width: 85%;
        }
        .tips {
            font-size: 14px;
            color: #fff;
            margin-bottom: 10px;
        }
        .svg-container {
            padding: 6px 5px 6px 15px;
            color: $dark_gray;
            vertical-align: middle;
            width: 30px;
            display: inline-block;
            &_login {
                font-size: 20px;
            }
        }
        .title {
            font-size: 26px;
            font-weight: 400;
            color: #1e70bf;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }
        .login-form {
            position: absolute;
            left: 0;
            right: 0;
            width: 400px;
            padding: 35px 35px 15px 35px;
            margin: 120px auto;
        }
        .el-form-item {
            border: 1px solid rgba(255, 255, 255, 0.1);
            /*background: rgba(0, 0, 0, 0.1);*/
            border-radius: 5px;
            color: #454545;
        }
        .show-pwd {
            position: absolute;
            right: 10px;
            top: 7px;
            font-size: 16px;
            color: $dark_gray;
            cursor: pointer;
            user-select: none;
            right: 20px !important;
        }
        .el-form-ul {
            list-style: none;
            margin: 0;
            padding: 0;
        }

        .item-captcha a{

            margin-left: 10px;
            display: inline-block;
            color: orange;

        }
        .item-captcha img{
            vertical-align: middle;
            display: inline-block;
            margin-top: -2px !important;
            margin-left: 10px !important;
        }
        .item-captcha .el-captcha{
            width: 45% !important;
        }
        .reg-btns {
            border: none;
            background-color: transparent;
            text-align: center;
            margin-left: 20px;
        }
        .reg-btns:first-child {
            margin-left: 0px;
        }
        .key_2fa input {
            height: 24px;
            color: #000000;
        }

    }
</style>