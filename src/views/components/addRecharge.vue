<template xmlns="http://www.w3.org/1999/html">
    <div class="dashboard-container" v-loading="isLoading">
        <el-form class="el-form" ref="commonForm" :model="commonForm" label-width="180px">
            <h4 class="title"></h4>
            <el-row :gutter="20">
                <el-col :span="22" :offset="1">
                    <div class="grid-content bg-purple">
                        <el-form-item label="金额" prop="amount" class="el-form-item-input">
                            <el-input v-model="commonForm.amount" :disabled="commonForm.amountDisabled" style="width: 200px"></el-input>
                        </el-form-item>
                        <!--<el-form-item label="请选择支付类型" prop="method" class="el-form-item-input">-->
                            <!--<el-select class="filter-item" v-model="commonForm.method" label="支付类型" placeholder="支付类型">-->
                                <!--<el-option-->
                                        <!--v-for="(item,key) in methodOptions"-->
                                        <!--:key="item.method_id"-->
                                        <!--:label="item.method_name"-->
                                        <!--:value="item.method_id">-->
                                <!--</el-option>-->
                            <!--</el-select>-->
                        <!--</el-form-item>-->
                        <el-alert v-if="showNotice"
                            title="请点击继续支付按钮,并在在弹出窗口进行支付.如果浏览器没有弹窗,请检查浏览器设置."
                            type="error"
                            center
                            show-icon>
                        </el-alert>
                    </div>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="22" :offset="1">
                    <div class="grid-content">
                        <el-form-item>
                            <el-button style="margin: 0 auto;" type="primary" @click="onSubmit" v-show="showStepOneBtn">申请充值订单</el-button>
                            <a :href="cashierUrl" target="_blank" v-show="cashierUrl!=''" style="width: 250px;"><el-button type="danger" >点击按钮进行支付</el-button></a>
                        </el-form-item>
                    </div>
                </el-col>
            </el-row>
        </el-form>

    </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import axios from '@/utils/http'
  import common from '@/utils/common'
  import { isvalidUsername } from '@/utils/validate'
  import _ from 'lodash'

  export default {
    name: 'addRecharge',
    components: { },
    props: {
      type: {
        type: Number,
        default: 1
      },
      amount: {
        // type: String,
        default: 0
      },
      amountDisabled:{
        default: 1
      }
    },
    data() {
      return {
        commonForm:{
          type:this.type,
          amount:this.amount,
          method:'WYNC',
          amountDisabled: this.amountDisabled=='1',
        },
        dialogAvatarVisible: false,
        showStepOneBtn: true,
        cashierUrl: '',
        methodOptions:[],
        isIndeterminate: true,
        isNewRecord: true,
        isLoading: false,
        showNotice: false,
      }
    },
    computed:{
    },
    methods: {
      getFormOptions(){
        self = this

        axios.post('/account/my-recharge-method-list',{all:0,type:self.type}).then(
          res => {
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.methodOptions = res.data
            }
          },
          res => {
            self.$message.error({message: res.message})
          }
        )
      },

      onSubmit() {
        self = this
        self.showStepOneBtn = true
        this.$refs['commonForm'].validate((valid) => {
          if (valid) {
            var formData = self.commonForm
              if(!formData.method){
                  self.$message.error('请选择充值方式！');
                  return;
              }
                if(!formData.method){
                  self.$message.error('请填写充值金额！');
                  return;
                }
                self.isLoading = true
              axios.post('/order/add', formData).then((res) => {
                self.isLoading = false
                  if (res.code == 0 && typeof res.data.cashier_url != 'undefined' && res.data.cashier_url!='') {
                    self.cashierUrl = res.data.cashier_url
                    self.showStepOneBtn = false
                    self.showNotice = true
                    return;
                    window.open(res.data.cashier_url);

                    self.$confirm('请在弹出窗口进行支付.如果浏览器没有弹窗,请检查浏览器设置.', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                      self.showStepOneBtn = false
                    })
                  } else {
                      self.$message.error('失败:' + res.message);
                  }
              })
          } else {
            self.$message.error('信息填写错误！');
            self.showStepOneBtn = false
            return false;
          }
        });
      }
    },
    created() {
      this.getFormOptions();
    }
  }
</script>

<style scoped>
    .grid-content{
        width: 100%;
        padding-top: 10px;
        padding-bottom: 10px;
    }
    .el-form-item-input{
        width: 50%;
    }
    .pay_type_radio .el-radio--small.is-bordered {
        margin-top: 5px;
    }
</style>