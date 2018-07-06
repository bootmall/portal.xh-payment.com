<template xmlns="http://www.w3.org/1999/html">
    <div class="dashboard-container">
        <el-form class="el-form" :rules="rules" ref="commonForm" :model="commonForm" label-width="180px">
            <h4 class="title"></h4>
            <el-row :gutter="20">
                <el-col :span="22" :offset="1">
                    <div class="grid-content">
                        <!--<el-form-item label="账户类型" prop="group_id" class="el-form-item-input">-->
                        <!--<el-input v-model="commonForm.group_id"></el-input>-->
                        <!--</el-form-item>-->
                        <el-form-item label="账户类型" prop="group_id">
                            <el-radio-group v-model="commonForm.group_id" size="small">
                                <el-radio
                                        v-for="(item,key) in typeOptions"
                                        :key="key"
                                        :label="key"
                                        :value="key"
                                        border
                                >{{item}}
                                </el-radio>
                            </el-radio-group>
                            <div class="el_item_tips">账户类型为商户时必须指定上级代理</div>
                        </el-form-item>
                        <el-form-item label="上级商户帐号" prop="parentMerchantAccount" class="el-form-item-input">
                            <el-input v-model="commonForm.parentMerchantAccount"></el-input>
                        </el-form-item>

                        <el-form-item label="登录名" prop="username" class="el-form-item-input">
                            <el-input v-model="commonForm.username"></el-input>
                        </el-form-item>

                        <el-form-item label="账户状态" prop="status">
                            <el-radio-group v-model="commonForm.status" size="small">
                                <el-radio
                                        v-for="(item,key) in statusOptions"
                                        :key="key"
                                        :label="key"
                                        :value="key"
                                        border
                                >{{item}}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="结算手续费(元/笔)" prop="remit_fee" class="el-form-item-input">
                            <el-input v-model="commonForm.remit_fee"></el-input>
                        </el-form-item>
                        <el-row class="bg-purple">
                            <el-col :span="24">
                                <el-form-item label="昵称" prop="nickname" class="el-form-item-input el_item_2col">
                                    <el-input v-model="commonForm.nickname"></el-input>
                                </el-form-item>
                                <el-form-item label="邮件地址" prop="email" class="el-form-item-input el_item_2col">
                                    <el-input v-model="commonForm.email"></el-input>
                                </el-form-item>
                                <el-form-item label="收款单笔限额" prop="remit_quota_pertime" class="el_item_2col el-form-item-input">
                                    <el-input placeholder="0或不填表示以渠道为准" v-model="commonForm.remit_quota_pertime"></el-input>
                                </el-form-item>

                                <el-form-item label="结算单笔限额" prop="recharge_quota_pertime" class="el_item_2col el-form-item-input">
                                    <el-input placeholder="0或不填表示以渠道为准" v-model="commonForm.recharge_quota_pertime"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row class="bg-purple el-row-rate">
                            <el-col :span="24">
                                <el-form-item label-width="100px" class="el_item_2col" :label="item" v-for="(item,key) in payTypeOptions" :key="key">
                                    <el-input style="width: 100px" prop="pay_method" v-model="commonForm.recharge_rate[key]" placeholder="请输入手续费率" @change="onRechargeRateChange(key)"></el-input>
                                    <el-switch style="margin-left: 20px"
                                               v-model="methodStatus[key]"
                                               active-text="启用"
                                               inactive-text="停用"
                                               active-color="#13ce66"
                                               inactive-color="#ff4949"
                                               active-value="1"
                                               inactive-value="0"
                                    >
                                    </el-switch>
                                    <el-select v-model="settlementType[key]" placeholder="到账" size="mini">
                                        <el-option
                                                v-for="(item,key) in settlementTypeOptions"
                                                :key="item"
                                                :label="item"
                                                :value="item">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row class="bg-purple">
                            <el-col :span="24">
                                <el-form-item class="el_item_2col" label="允许接口收款" prop="allow_api_recharge">
                                    <el-switch style="margin-left: 20px"
                                               v-model="commonForm.allow_api_recharge"
                                               active-text="允许"
                                               inactive-text="不允许"
                                               active-color="#13ce66"
                                               inactive-color="#ff4949"
                                               active-value="1"
                                               inactive-value="0"
                                    ></el-switch>
                                </el-form-item>
                                <el-form-item class="el_item_2col" label="允许接口结算" prop="allow_api_remit">
                                    <el-switch style="margin-left: 20px"
                                               v-model="commonForm.allow_api_remit"
                                               active-text="允许"
                                               inactive-text="不允许"
                                               active-color="#13ce66"
                                               inactive-color="#ff4949"
                                               active-value="1"
                                               inactive-value="0"
                                    ></el-switch>
                                </el-form-item>
                                <el-form-item class="el_item_2col" label="允许后台手工充值" prop="allow_manual_recharge">
                                    <el-switch style="margin-left: 20px"
                                               v-model="commonForm.allow_manual_recharge"
                                               active-text="允许"
                                               inactive-text="不允许"
                                               active-color="#13ce66"
                                               inactive-color="#ff4949"
                                               active-value="1"
                                               inactive-value="0"
                                    ></el-switch>
                                </el-form-item>
                                <el-form-item class="el_item_2col" label="允许后台手工出款" prop="allow_manual_remit">
                                    <el-switch style="margin-left: 20px"
                                               v-model="commonForm.allow_manual_remit"
                                               active-text="允许"
                                               inactive-text="不允许"
                                               active-color="#13ce66"
                                               inactive-color="#ff4949"
                                               active-value="1"
                                               inactive-value="0"
                                    ></el-switch>
                                </el-form-item>
                                <el-form-item label="接口结算不需审核" prop="allow_api_fast_remit">
                                    <el-switch style="margin-left: 20px"
                                               v-model="commonForm.allow_api_fast_remit"
                                               active-text="允许"
                                               inactive-text="不允许"
                                               active-color="#13ce66"
                                               inactive-color="#ff4949"
                                               active-value="1"
                                               inactive-value="0"
                                    ></el-switch>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="22" :offset="1">
                    <div class="grid-content">
                        <el-form-item>
                            <el-button style="margin: 0 auto;" type="primary" @click="onSubmit" :disabled="submitBtnDisableStatus">{{saveBtnTitle}}</el-button>
                        </el-form-item>
                    </div>
                </el-col>
            </el-row>
        </el-form>

    </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import axios from '@/utils/http'
  import common from '@/utils/common'
  import {isvalidUsername} from '@/utils/validate'
  import _ from 'lodash'

  export default {
    name: 'vue_merchant_add',
    components: {},
    data() {
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码不能小于6位'))
        } else {
          callback()
        }
      }
      return {
        commonForm: {
          id: 0,
          username: '',
          nickname: '',
          email: '',
          // password: '',
          status: '10',
          group_id: '20',
          recharge_rate: {},
          remit_fee: '',
          parentMerchantAccount: '',
          recharge_quota_pertime: '',
          remit_quota_pertime: '',
          channel: '',
          remit_channel: '',
          pay_method: [],
          allow_api_recharge: '1',
          allow_manual_recharge: '1',
          allow_api_remit: '1',
          allow_manual_remit: '1',
          allow_api_fast_remit: '1',
        },
        rules: {
          username: [{required: true, trigger: 'blur', validator: isvalidUsername}],
          // password: [{ required: true, trigger: 'blur', message: '请输入密码'}],
          status: [{required: true, trigger: 'blur', message: '请选择账户状态'}],
          // group_id: [{ required: true, trigger: 'blur', message: '请选择账户类型'}],
          // channel: [{ required: true, trigger: 'blur', message: '请选择收款通道'}],
          // remit_channel: [{ required: true, trigger: 'blur', message: '请选择结算通道'}],
          remit_fee: [{required: true, trigger: 'blur', message: '请输入结算手续费'}],
          recharge_rate: [{required: true, trigger: 'blur', message: '请输入收款手续费率'}],
          pay_method: [{required: true, trigger: 'blur', message: '请输入结算手续费'}],
          // recharge_quota_pertime: [{ required: true, trigger: 'blur', message: '请输入收款单笔限额'}],
          // remit_quota_pertime: [{ required: true, trigger: 'blur', message: '请输入结算单笔限额'}],
          // parentMerchantAccount: [{ required: true, trigger: 'blur', message: '请输入上级账户'}],
        },
        saveBtnTitle: '',
        dialogAvatarVisible: false,
        submitBtnDisableStatus: false,
        checkAll: false,
        channelList: [],
        statusOptions: [],
        typeOptions: [],
        methodStatus: {},
        payTypeOptions: [],
        payMethods: [],
        payMethodNames: [],
        isIndeterminate: true,
        isNewRecord: true,
        isLoading: false,
        remitMaxFee: 5,
        rechargeMaxRate: 0.3,
        settlementType: {},
        settlementTypeOptions: [],
      }
    },
    computed: {},
    methods: {
      handleCheckAllMethodChange(val) {
        this.commonForm.pay_method = val ? this.payMethodNames : [];
        this.isIndeterminate = false;
      },
      handleCheckedMethodChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.payMethods.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.payMethods.length;
      },
      onRechargeRateChange(key) {
        this.methodStatus[key] = "0"
        if (this.commonForm.recharge_rate[key] > 0) {
          if (this.commonForm.recharge_rate[key] > this.rechargeMaxRate) {
            this.$message.error({message: '收款费率不能大于系统设置最大费率:' + this.rechargeMaxRate})
          } else {
            this.methodStatus[key] = "1"
          }
        }
      },
      selectRemit(remit) {

      },
      selectPayType(channels) {
        var self = this
        self.getChannelList();
      },
      selectChannel(channels) {

        //绑定唯一充值方式，不再根据渠道账户选择
        return;
        var self = this
        let idx = _.findIndex(self.channelList, function (o) {
          return o.id == self.commonForm.channel;
        });

        this.payMethods = this.channelList[idx].methods
        self.payMethodNames = []
        for (let i = 0; i < this.payMethods.length; i++) {
          self.payMethodNames.push(this.payMethods[i].name)
          self.commonForm.recharge_rate.push(this.payMethods[i].rate)
        }
        //默认全选
        this.commonForm.pay_method = this.payMethodNames
      },
      getAccountDetail(id) {
        self = this
        axios.post('/user/detail', {id: id}).then(
          res => {
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {

              var commonForm = {};
              for (var x in res.data) {
                commonForm[x] = res.data[x]
              }
              var checkedPrivs = [];

              for (var k in self.privsListInit) {
                if (commonForm.privs.indexOf(self.privsListInit[k].id) >= 0) {
                  var newPriv = self.privsListInit[k]
                  newPriv.checked = true
                  self.privsList.push(newPriv)
                } else {
                  self.privsList.push(self.privsListInit[k])
                }
              }

              commonForm.privs = checkedPrivs
              commonForm.status = commonForm.status + ""
              self.commonForm = commonForm

              console.log(self.commonForm.status)
            }
          },
          res => {
            self.$message.error({message: res.message})
          }
        )
      },
      getFormOptions() {
        self = this

        axios.post('/admin/user/form-option-list', {all: 0}).then(
          res => {
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.statusOptions = res.data.user_status
              self.typeOptions = res.data.user_type

              //初始化费率状态及到账类型
              let methodStatus = {}
              let settlement_type = {}
              for (let i in res.data.pay_method) {
                methodStatus[i] = "0"
                self.commonForm.recharge_rate[i] = 0
                settlement_type[i] = res.data.settlementType[0]
              }
              self.methodStatus = methodStatus
              self.settlementType = settlement_type

              self.payTypeOptions = res.data.pay_method
              self.remitMaxFee = res.data.remitMaxFee
              self.rechargeMaxRate = res.data.rechargeMaxRate
              self.settlementTypeOptions = res.data.settlementType

            }
          },
          res => {
            self.$message.error({message: res.message})
          }
        )
      },
      getChannelList() {
        self = this
        self.isLoading = true
        axios.post('/admin/channel/get-account-list', {pay_type: self.commonForm.pay_method}).then(
          res => {
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {

              self.channelList = res.data
            }
            self.isLoading = false
          },
          res => {
            self.$message.error({message: res.message})
            self.isLoading = false
          }
        )
      },

      onSubmit() {
        self = this

        this.$refs['commonForm'].validate((valid) => {
          if (valid) {
            var formData = self.commonForm
            let payMethods = []
            for (let i in formData.recharge_rate) {
              let rate = formData.recharge_rate[i]
              payMethods.push({id: i, rate: rate, status: self.methodStatus[i],settlement_type:self.settlementType[i]})
            }
            if (payMethods.length == 0) {
              self.$message.error('请填写收款费率！');
              return;
            }
            if (formData.group_id == 30 && formData.parentMerchantAccount == '') {
              self.$message.error('商户帐号必须指定上级代理！');
              return;
            }
            if (formData.remit_fee > self.remitMaxFee) {
              this.$message.error({message: '结算手续费不能大于系统设置最大结算手续费:' + self.remitMaxFee})
              return;
            }

            formData.pay_method = payMethods
            self.submitBtnDisableStatus = true
            axios.post('/admin/user/edit', formData).then((res) => {
              if (res.code == 0) {
                self.$message.success(self.saveBtnTitle + '成功！')
                this.$router.push({name: 'vue_merchant_list'})
              } else {
                self.$message.error(self.saveBtnTitle + '失败:' + res.message);
                self.submitBtnDisableStatus = false
              }
            })
          } else {
            self.$message.error('信息填写错误！');
            self.submitBtnDisableStatus = false
            return false;
          }
        });
      }
    },
    created() {
      this.getFormOptions();
      this.getChannelList()

      if (typeof this.$route.params.id !== 'undefined') {
        this.commonForm.id = this.$route.params.id
      }

      if (typeof this.$route.query.id !== 'undefined' && !this.commonForm.id) {
        this.commonForm.id = this.$route.query.id
      }

      if (this.commonForm.id > 0) {
        this.isNewRecord = false
        this.saveBtnTitle = '编辑帐号'
// console.log(this.commonForm)
        this.getAccountDetail(this.commonForm.id)
      } else {
        this.isNewRecord = true
        this.saveBtnTitle = '添加帐号'
      }

    }
  }
</script>

<style>
    .grid-content {
        width: 100%;
        padding-top: 20px;
        padding-bottom: 20px;
    }

    .bg-purple {
        border-radius: 6px;
        min-height: 36px;
        background: #F8F8FF;
        padding: 15px 0;
        margin-top: 10px;
    }

    .input-tips {
        font-size: 12px;
        color: #5e6d82;
        line-height: 1.5em;
        padding-top: 8px;
        padding-left: 10px;
    }

    .el-form-item-input {
        width: 50%;
    }

    .pay_type_radio .el-radio--small.is-bordered {
        margin-top: 5px;
    }

    .el_item_2col {
        width: 45%;
        display: inline-block;
    }

    .el_item_tips {
        display: inline-block;
        margin-left: 20px;
        color: #909399;
        font-size: 12px;
    }

    .el-form-item__content {
        margin-bottom: 5px;
    }

    .el-row-rate .el-select{
        width:80px;
        margin-left: 10px;
    }
</style>