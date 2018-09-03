<template>
  <div class="app-container calendar-list-container">
    <div v-show="formVisible">
      <h4 style="color: red" align="center">请仔细核对转入账户名,防止出现意外</h4>
      <el-form class="el-form" ref="commonForm" :rules="rules" :model="commonForm" label-width="180px" v-loading="isLoading">
        <h4 class="title"></h4>
        <el-row :gutter="20">
          <el-col :span="22" :offset="1">
            <div class="grid-content bg-purple">
              <el-form-item label="转入账户名" prop="transferIn" class="el-form-item-input" >
                <el-input v-model="commonForm.transferIn"></el-input>
              </el-form-item>
              <el-form-item label="金额" prop="amount" class="el-form-item-input">
                <el-input v-model="commonForm.amount"></el-input>
              </el-form-item>
              <el-form-item label="资金密码" prop="financial_password_hash" class="el-form-item-input">
                <el-input type="password" v-model="commonForm.financial_password_hash"></el-input>
              </el-form-item>
              <el-form-item label="安全令牌" prop="key_2fa" class="el-form-item-input">
                <el-input v-model="commonForm.key_2fa"></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="bak" class="el-form-item-input">
                <el-input type="textarea" v-model="commonForm.bak"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="22" :offset="1">
            <div class="grid-content">
              <el-form-item>
                <el-button style="margin: 0 auto;" type="primary" @click="onSubmit" :disabled="submitBtnDisableStatus">
                  确认转账
                </el-button>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime} from '@/utils'
  import common from '@/utils/common'
  import axios from '@/utils/http'
  import {checkCanRemit} from '@/api/user'

  export default {
    name: "vue_transfer",
    directives: {
      waves
    },
    data() {
      return {
        commonForm: {transferIn: null, amount: null, financial_password_hash: null, key_2fa: null, bak: null},
        formVisible: true,
        confirmVisible: false,
        bankOptions: {},
        financial_password_hash: null,
        key_2fa: null,
        isLoading:false,
        submitBtnDisableStatus:false,

        rules: {
          transferIn: [
            { required: true, message: '请输入转入账户名', trigger: 'blur' },
            { min: 6, max: 21, message: '用户名不合法', trigger: 'blur' }
          ],
          amount: [
            { required: true,message: '请输入金额', trigger: 'change' }
          ],
          financial_password_hash: [
            {required: true, message: '请输入资金密码', trigger: 'change' }
          ],
          key_2fa: [
            { required: true, message: '请输入令牌', trigger: 'change' }
          ]
        }
      }
    },
    created() {
    },
    methods: {
      onSubmit() {
        self = this
        self.submitBtnDisableStatus = true
        this.$refs['commonForm'].validate((valid) => {
          if (valid) {
            var formData = self.commonForm


            self.$confirm('确认转账'+formData.amount+'元给'+formData.transferIn+'?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              self.isLoading = true
              axios.post('/user/transfer', formData).then((res) => {
                self.isLoading = false
                self.commonForm.key_2fa = ''
                if (res.code == 0) {
                  self.$message.success(res.message);
                  this.$router.push({name:'vue_financial_my_list'});
                } else {
                  self.$message.error('失败:' + res.message);
                  self.submitBtnDisableStatus = false
                }
              })
              self.submitBtnDisableStatus = false

            })

          } else {
            self.$message.error('信息填写错误！');
            self.submitBtnDisableStatus = false
            return false;
          }
        });
      }
    }
  }
</script>

<style scoped>
  .el-form-item {
    width: 40%;
    margin-left: 30%;
    margin-bottom: 20px !important;
  }
</style>