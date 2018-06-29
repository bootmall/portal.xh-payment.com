<template xmlns="http://www.w3.org/1999/html">
    <div class="dashboard-container">
        <el-form class="el-form" ref="commonForm" :model="commonForm" label-width="180px">
            <h4 class="title"></h4>
            <el-row :gutter="20">
                <el-col :span="22" :offset="1">
                    <div class="grid-content bg-purple">
                        <el-form-item label="金额" prop="amount" class="el-form-item-input">
                            <el-input v-model="commonForm.amount"></el-input>
                        </el-form-item>
                        <el-form-item label="支付类型" prop="amount" class="el-form-item-input">
                            <el-select class="filter-item" v-model="commonForm.method" label="支付类型" placeholder="支付类型">
                                <el-option
                                        v-for="(item,key) in methodOptions"
                                        :key="item.method_id"
                                        :label="item.method_name"
                                        :value="item.method_id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="22" :offset="1">
                    <div class="grid-content">
                        <el-form-item>
                            <el-button style="margin: 0 auto;" type="primary" @click="onSubmit" :disabled="submitBtnDisableStatus">充值</el-button>
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
    data() {
      return {
        commonForm:{
          amount:'',
          method:'',
        },
        dialogAvatarVisible: false,
        submitBtnDisableStatus: false,
        methodOptions:[],
        isIndeterminate: true,
        isNewRecord: true,
        isLoading: false,
      }
    },
    computed:{
    },
    methods: {
      getFormOptions(){
        self = this

        axios.post('/account/my-recharge-method-list',{all:0}).then(
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
        self.submitBtnDisableStatus = true
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

              axios.post('/order/add', formData).then((res) => {
                  if (res.code == 0 && typeof res.data.cashier_url != 'undefined' && res.data.cashier_url!='') {
                    window.open(res.data.cashier_url);
                    self.submitBtnDisableStatus = false
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
    }
  }
</script>

<style>
    .grid-content{
        width: 100%;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .bg-purple {
        /*background: #eef1f6;*/
    }

    .input-tips{
        font-size: 12px;
        color: #5e6d82;
        line-height: 1.5em;
        padding-top: 8px;
        padding-left: 10px;
    }

    .el-form-item-input{
        width: 50%;
    }

    .pay_type_radio .el-radio--small.is-bordered {
        margin-top: 5px;
    }
</style>