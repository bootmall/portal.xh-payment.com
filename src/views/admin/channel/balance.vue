<template>
    <div class="components-container" v-loading="listLoading">
        <el-alert v-if="balaneUpdateMsg!=''"
                :title="balaneUpdateMsg"
                type="warning">
        </el-alert>
        <ul class="list">
            <li v-for="item in list" :key="item.id">
                <span class="c-name">{{item.channel_name}}</span>:
                <span class="c-num">{{item.balance|toFixed}}/{{item.frozen_balance|toFixed}}</span>
            </li>
        </ul>
        <el-row :gutter="20">
            <el-col :span="4" :offset="16"><div class="grid-content grid-content-label bg-purple">渠道总余额:</div></el-col>
            <el-col :span="4"><div class="grid-content grid-content-value bg-purple">{{channel_total_balance}}</div></el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="4" :offset="16"><div class="grid-content grid-content-label bg-purple">商户总余额:</div></el-col>
            <el-col :span="4"><div class="grid-content grid-content-value bg-purple">{{merchant_total_balance}}</div></el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="4" :offset="16"><div class="grid-content grid-content-label bg-purple">结余:</div></el-col>
            <el-col :span="4"><div class="grid-content grid-content-value bg-purple">{{total_profit}}</div></el-col>
        </el-row>
    </div>
</template>

<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime} from '@/utils'
  import axios from '@/utils/http'

  export default {
    name: 'vue_channel_balance',
    components: {waves},
    directives: {
      waves
    },
    filters: {
      toFixed(num) {
        return parseFloat(num).toFixed(2)
      }
    },
    data() {
      return {
        list: null,
        total_balance: null,
        tableKey: 0,
        channel_total_balance: 0,
        merchant_total_balance: 0,
        total_profit: 0,
        total: null,
        listLoading: true,
        balaneUpdateMsg: '',
      }
    },
    created() {
      this.getInitData()
    },
    methods: {
      getInitData() {
        var self = this
        self.listLoading = true
        axios.post('/admin/channel/balance-list').then(
          res => {
            self.listLoading = false
            if (res.code == 0) {
              self.list = res.data.list
              self.channel_total_balance = parseFloat(res.data.channel_total_balance).toFixed(2)
              self.merchant_total_balance = parseFloat(res.data.merchant_total_balance.balance).toFixed(2)
              self.total_profit = (self.channel_total_balance-self.merchant_total_balance).toFixed(2)
            }
            // self.$message.error({message: res.message})
            self.balaneUpdateMsg = res.message
          }
        )
      },
    }
  }
</script>

<style scoped>
    .list li {
        list-style:none;
        float:left;
        padding: 5px 10px;
        border: 1px solid #eee;
        width: 25%;
        line-height: 30px;
    }
    .grid-content{
        line-height: 30px;
       
    }
    .grid-content-label{
        text-align: right;
        padding-right: 2px;
    }
    .grid-content-value{
        text-align: left;
        text-align: 2px;
        color: #f56c6c;
        font-weight: bolder;
    }
    .c-name{
        color: #e6a23c;
    }
    .c-num{
        color: #f56c6c;
    }
</style>