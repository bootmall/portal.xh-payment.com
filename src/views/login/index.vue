<template>
    <div class="login-container">

        <el-dialog title="安全令牌" :visible.sync="keyVisible" width="30%">
            令牌码：
            <el-input style="border: 1px solid #5a5e66;height: 26px;" class="key_2fa" v-model="key_2fa"></el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="keyVisible = false">取 消</el-button>
                <el-button type="primary" :loading="loadingKey" @click="handleKey">确 定</el-button>
            </div>
        </el-dialog>

        <el-container>
            <el-header class="head-logo"><img src="../../assets/imgs/logo.png"/></el-header>
            <el-main>
                <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
                    <h3 class="title">会员登录</h3>

                    <el-form-item prop="username">
                        <el-input prefix-icon="el-icon-goods" name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="请输入用户名"/>
                    </el-form-item>

                    <el-form-item prop="password">
                        <el-input prefix-icon="el-icon-setting" name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
                                  placeholder="请输入密码"/>
                        <!--<span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye"/></span>-->
                    </el-form-item>
                    <el-form-item class="item-captcha" prop="captchaCode">
                        <el-input prefix-icon="el-icon-tickets" class="el-captcha" placeholder="请输入图片验证码" v-model="loginForm.captchaCode"></el-input>
                        <img @click="refreshCaptcha" v-if="captchaBase64" :src="captchaBase64"/>

                        <a v-if="captchaBase64" @click="refreshCaptcha">刷新</a>
                    </el-form-item>
                    <el-row :gutter="20">
                        <el-col :span="12" :offset="6">
                            <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
                        </el-col>
                    </el-row>
                </el-form>

            </el-main>
            <el-footer>
            </el-footer>
        </el-container>

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
        background-color:#eeeeee;
        width:100%;
        height:100%;

        .el-input__inner {
            border: solid 1px #eee;
        }
        input {
            /*background-color:rgba(0, 0, 0, 0.4);*/
            border: 0px;
            -webkit-appearance: none;
            border-radius: 5px;
            padding: 12px 5px 12px 15px;
            color: $bg;
            height: 47px;

        }

        .el-input {
            /*display: inline-block;*/
            /*height: 47px;*/
            width: 85%;
            border-radius: 2px;
            margin-left: 30px;
        }
        .tips {
            font-size: 14px;
            color: #fff;
            margin-bottom: 20px;
        }
        .svg-container {
            padding: 6px 5px 5px 5px;
            color: #fff;
            vertical-align: middle;
            width: 30px;
            display: inline-block;
            font-size: 20px;
            &_login {
                font-size: 25px;
            }
        }
        .login-form .title {
            font-size: 30px;
            font-weight: 400;
            color: #dddeee;
            margin: 20px auto 20px auto;
            text-align: center;
            font-weight: bold;
            height: 50px;
            line-height: 50px;
        }
        .login-form {
            width: 400px;
            height: 350px;
            margin-top: 50px;
            margin-bottom: 50px;
            float: right;
            margin-right: 200px;
            background-color:#000000;/* IE6和部分IE7内核的浏览器(如QQ浏览器)下颜色被覆盖 */
            background-color:rgba(0,0,0,0.2); /* IE6和部分IE7内核的浏览器(如QQ浏览器)会读懂，但解析为透明 */
            border-radius:10px;
            -moz-border-radius:10px;
        }

        .el-form-item {
            border-radius: 5px;
            color: #454545;
            margin-bottom: 20px !important;
        }
        .show-pwd {
            position: absolute;
            margin-right: 15px;
            top: 7px;
            font-size: 16px;
            color: $dark_gray;
            cursor: pointer;
            user-select: none;
            right: 20px !important;
        }

        .item-captcha a{

            margin-left: 10px;
            display: inline-block;
            color: orange;

        }
        .item-captcha img{
            vertical-align: middle;
            display: inline-block;
            margin-top: -2px;
            margin-left: 10px;
            border-radius: 5px;
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
        .head-logo{
            height: 114px !important;
            margin: 0;
            width: 100%;
        }
        .head-logo{
            margin: 0;
        }
        .head-logo img{
            /*height: 114px;*/
            /*width: 242px;*/
            float: left;
            margin-left: 150px;
        }
        .el-main{
            background:url(../../assets/imgs/login-main-bg.png)no-repeat;
            background-size:100% 100%;
            margin: 0;
            min-height: 500px;
        }
        .el-footer{
            background:url(../../assets/imgs/login-banks.png) center center no-repeat;
            height: 120px !important;
        }

        .el-form-item__error{
            padding-left: 40px;
            font-weight: bolder;
            color: #F56C6C;
        }
    }
</style>