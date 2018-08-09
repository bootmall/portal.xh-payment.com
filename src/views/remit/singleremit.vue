<template>
  <div class="app-container calendar-list-container">
    <div v-show="formVisible">
      <h4 style="color: red" align="center">逐笔提款一次最多300条</h4>
      <el-alert
          :title="remitNoticeStr"
          v-if="!canRemit"
          style="margin-bottom:10px;"
          type="error">
      </el-alert>
      <div v-for="(item,key) in remitForm" :key="key">
        银行：
        <el-select v-model="item.bank_code" filterable clearable placeholder="请选择">
          <el-option
              v-for="(value,index) in bankOptions"
              :key="index"
              :label="value"
              :value="index">
          </el-option>
        </el-select>
        <!--<el-input v-model="item.bank" style="width: 180px;margin-bottom: 10px"></el-input>-->
        卡号：
        <el-input v-model="item.bank_number" style="width: 180px;margin-bottom: 10px"></el-input>
        姓名：
        <el-input v-model="item.real_name" style="width: 180px;margin-bottom: 10px"></el-input>
        金额：
        <el-input v-model="item.amount" style="width: 180px;margin-bottom: 10px"></el-input>
        <el-button class="filter-item" @click="handleDel" v-waves :disabled="!canRemit">删除</el-button>
      </div>
      <div align="center">
        <el-button class="filter-item" @click="handleNext" v-waves :disabled="!canRemit">下一步</el-button>
        <el-button class="filter-item" @click="handleAppend" v-waves :disabled="!canRemit">增加</el-button>
      </div>
    </div>
    <div v-show="confirmVisible" align="center">
      <h4>确认提款信息</h4>
      <el-table :data="remitForm" align="center" border fit highlight-current-row style="width: 70%;font-size: 12px;"
                stripe>
        <el-table-column prop="bank_name" label="银行" align="center"></el-table-column>
        <el-table-column prop="bank_number" label="卡号" align="center"></el-table-column>
        <el-table-column prop="real_name" label="姓名" align="center"></el-table-column>
        <el-table-column prop="amount" label="金额" align="center"></el-table-column>
      </el-table>
      <div class="filter-container">
        <span>资金密码：<el-input type="password" v-model="financial_password_hash" style="width: 280px;"></el-input></span>
        <span>安全令牌：<el-input style="width: 280px;" v-model="key_2fa"></el-input></span>
        <span>
                    <el-button class="filter-item" style="margin-top: 6px" @click="handleLast" v-waves :disabled="!canRemit">上一步</el-button>
                    <el-button class="filter-item" style="margin-top: 6px" @click="batchSubmit"
                               v-waves :disabled="!canRemit">确认并提交</el-button>
                </span>
      </div>
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
    name: "vue_add_remit_single",
    directives: {
      waves
    },
    data() {
      return {
        remitForm: [
          {bank_code: null, bank_name: null, bank_number: null, real_name: null, amount: null, status: 0},
        ],
        formVisible: true,
        confirmVisible: false,
        bankOptions: {},
        financial_password_hash: null,
        key_2fa: null,
        balance: null,
        remit_quota_pertime: null,
        channel_account_remit_quota_pertime: null,
        canRemit: true,
        remitNoticeStr: '',
      }
    },
    created() {
      checkCanRemit().then(res => {
        if (res.code != 0) {
          // this.$alert(res.message, '系统提示', {type: 'error'})
          this.canRemit = false
          this.remitNoticeStr = res.message
        }
      }).catch(error => {
        // this.$alert(error, '系统提示11', {type: 'error'})
        this.canRemit = false
        this.remitNoticeStr = error
      })

      this.getBankList()
    },
    methods: {
      getBankList() {
        axios.post('/remit/get-bank-list').then(
          res => {
            if (res.code == 0) {
              this.bankOptions = res.data.bankOptions;
              this.balance = res.data.balance;
              this.remit_quota_pertime = res.data.remit_quota_pertime;
              this.channel_account_remit_quota_pertime = res.data.channel_account_remit_quota_pertime;
            } else {
              this.$message.error({message: res.message});
            }
          }
        );
      },
      luhmCheck(value) {
        var lastNum = value.substr(value.length - 1, 1);//取出最后一位（与luhm进行比较）
        var first15Num = value.substr(0, value.length - 1);//前15或18位
        var newArr = new Array();
        for (var i = first15Num.length - 1; i > -1; i--) {    //前15或18位倒序存进数组
          newArr.push(first15Num.substr(i, 1));
        }
        var arrJiShu = new Array();  //奇数位*2的积 <9
        var arrJiShu2 = new Array(); //奇数位*2的积 >9

        var arrOuShu = new Array();  //偶数位数组
        for (var j = 0; j < newArr.length; j++) {
          if ((j + 1) % 2 == 1) {//奇数位
            if (parseInt(newArr[j]) * 2 < 9)
              arrJiShu.push(parseInt(newArr[j]) * 2);
            else
              arrJiShu2.push(parseInt(newArr[j]) * 2);
          }
          else //偶数位
            arrOuShu.push(newArr[j]);
        }

        var jishu_child1 = new Array();//奇数位*2 >9 的分割之后的数组个位数
        var jishu_child2 = new Array();//奇数位*2 >9 的分割之后的数组十位数
        for (var h = 0; h < arrJiShu2.length; h++) {
          jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
          jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
        }

        var sumJiShu = 0; //奇数位*2 < 9 的数组之和
        var sumOuShu = 0; //偶数位数组之和
        var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
        var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
        var sumTotal = 0;
        for (var m = 0; m < arrJiShu.length; m++) {
          sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
        }

        for (var n = 0; n < arrOuShu.length; n++) {
          sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
        }

        for (var p = 0; p < jishu_child1.length; p++) {
          sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
          sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
        }
        //计算总和
        sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

        //计算Luhm值
        var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
        var luhm = 10 - k;

        if (lastNum != luhm) {
          return false
        }
        return true
      },
      checkNumber: function (value) {
        // console.log(this.listQuery.minMoney);
        let reg = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
        if (!reg.test(value)) {
          return false
        }
        return true
      },
      handleNext() {
        var status = 1;
        this.remitForm.forEach((item, index) => {
          if (item.bank_code == null) {
            this.$message.error({message: '第' + (index + 1) + '条；请选择银行'})
            return status = 0
          }
          item.bank_name = this.bankOptions[item.bank_code];
          if (item.bank_number == null || item.bank_number.length < 16 || item.bank_number.length > 19) {
            this.$message.error({message: '第' + (index + 1) + '条；银行卡长度必须是16-19位之间'})
            return status = 0
          }

          if (item.real_name == null) {
            this.$message.error({message: '第' + (index + 1) + '条；请填写正确的开户名'})
            return status = 0
          }
          if (!this.checkNumber(item.amount)) {
            this.$message.error({message: '第' + (index + 1) + '条；提款金额不正确'})
            return status = 0
          }
          if (item.amount > this.balance) {
            this.$message.error({message: '第' + (index + 1) + '条；提款金额大于商户余额'})
            return status = 0
          }
          if (this.remit_quota_pertime > 0 && item.amount > this.remit_quota_pertime) {
            this.$message.error({message: '第' + (index + 1) + '条；提款金额大于商户单次提款限额'})
            return status = 0
          }
          if (this.channel_account_remit_quota_pertime > 0 && item.amount > this.channel_account_remit_quota_pertime) {
            this.$message.error({message: '第' + (index + 1) + '条；提款金额大于出款渠道单次提款限额'})
            return status = 0
          }
        });
        if (status == 1) {
          this.formVisible = false;
          this.confirmVisible = true;
        }

      },
      handleLast() {
        this.formVisible = true;
        this.confirmVisible = false;
      },
      handleAppend() {
        this.remitForm.push({bank_code: null, bank_name: null, bank_number: null, real_name: null, amount: null})
      },
      handleDel(index) {
        this.remitForm.splice(index, 1)
      },
      batchSubmit() {
        let regPass = /^.*(?=.{6,16})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/;
        if (!regPass.test(this.financial_password_hash)) {
          this.$message.error({message: '资金密码格式不正确'})
          return
        }
        let regKey = /^[0-9]{6}$/;
        if (!regKey.test(this.key_2fa)) {
          this.$message.error({message: '安全令牌格式不正确'})
          return
        }
        if (this.remitForm.length > 300) {
          this.$message.error({message: '提款条数超过300条'})
          return
        }
        let data = {
          financial_password_hash: this.financial_password_hash,
          key_2fa: this.key_2fa,
          remitData: this.remitForm
        }
        axios.post('/remit/single-batch-remit', data).then(
          res => {
            if (res.code == 0) {
              this.$message.success({message: '操作成功'})
            } else {
              this.$message.error({message: res.message})
            }
          }
        );
      },
    }
  }
</script>

<style scoped>

</style>