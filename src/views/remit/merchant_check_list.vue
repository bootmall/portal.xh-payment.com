<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" size="small" style="width: 200px;" class="filter-item"
                placeholder="结算订单号" v-model="listQuery.orderNo"></el-input>
      <el-input @keyup.enter.native="handleFilter" size="small" style="width: 200px;" class="filter-item"
                placeholder="商户订单号" v-model="listQuery.merchantOrderNo"></el-input>
      <el-date-picker class="filter-item" style="width: 200px;"
                      v-model="listQuery.dateStart"
                      align="right"
                      type="date"
                      placeholder="开始日期"
                      size="small"
                      :picker-options="pickerOptions">
      </el-date-picker>
      <el-date-picker class="filter-item" style="width: 200px;"
                      v-model="listQuery.dateEnd"
                      align="right"
                      type="date"
                      placeholder="结束日期"
                      size="small"
                      :picker-options="pickerOptions">
      </el-date-picker>
      <el-input @keyup.enter.native="handleFilter" size="small" style="width: 200px;" class="filter-item"
                placeholder="卡号" v-model="listQuery.bankNo"></el-input>
      <el-select class="filter-item" size="small" v-model="listQuery.status" placeholder="状态">
        <el-option
            v-for="(item,key) in statusOptions"
            :key="key"
            :label="item"
            :value="key">
        </el-option>
      </el-select>

      <el-button class="filter-item" size="small" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" size="small" type="success" v-waves icon="search" @click="handleShowUpdateStatus(1,'')">批量审核通过</el-button>
      <el-button class="filter-item" size="small" type="danger" v-waves icon="search" @click="handleShowUpdateStatus(2,'')">批量拒绝并退款</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="数据加载中，请稍候..." border fit
              highlight-current-row style="width: 100%;font-size: 12px" :summary-method="getSummaries" show-summary
              stripe @selection-change="handleSelectionChange">

      <el-table-column align="center" fixed type="selection"
                       @selection-change="handleSelectionChange"></el-table-column>
      <!--<el-table-column prop="merchant_id" label="商户编号"></el-table-column>-->
      <!--<el-table-column prop="merchant_account" label="商户账号"></el-table-column>-->
      <el-table-column prop="order_no" label="结算订单号"></el-table-column>
      <el-table-column prop="merchant_order_no" label="商户订单号"></el-table-column>
      <el-table-column prop="bank_account" label="持卡人"></el-table-column>
      <el-table-column prop="bank_no" label="卡号"></el-table-column>
      <el-table-column prop="amount" label="金额（元"></el-table-column>
      <el-table-column prop="bank_name" label="银行" width="50"></el-table-column>
      <el-table-column prop="status_str" label="订单状态"></el-table-column>
      <el-table-column prop="created_at" label="建立时间"></el-table-column>
      <el-table-column fixed="right" width="160" align="center" label="操作" class-name="op-column">
        <template slot-scope="scope">
          <el-button class="filter-item" size="small" type="success" v-waves icon="search" @click="handleShowUpdateStatus(1,scope.row.id)">通过</el-button>
          <el-button class="filter-item" size="small" type="danger" v-waves icon="search" @click="handleShowUpdateStatus(2,scope.row.id)">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>


    <el-dialog title="结算订单审核" :visible.sync="checkVisible" width="30%">
      <el-alert
          :title=checkFormAlert
          type="warning">
      </el-alert>
      <el-form :model="checkForm" v-loading="checkLoading">
        <el-form-item label="资金密码：">
          <el-input type="password" style="width: 280px" v-model="checkForm.pwd">
          </el-input>
        </el-form-item>
      </el-form>
      <el-form :model="checkForm">
        <el-form-item label="安全令牌：">
          <el-input type="text" style="width: 280px" v-model="checkForm.t2fa">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="checkVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdateStatus">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime} from '@/utils'
  import common from '@/utils/common'
  import axios from '@/utils/http'
  import {mapGetters} from 'vuex'

  export default {
    name: 'vue_merchant_check_remit',
    directives: {
      waves
    },
    components: {},
    data() {
      return {
        rules: {},
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          importance: undefined,
          dateStart: new Date(new Date().setHours(0, 0, 0, 0)),//.getDateStr(-3),
          dateEnd: null,
          orderNo: null,
          merchantOrderNo: null,
          status: null,
          bankAccount: null,
          bankNo: null,
          merchantNo: null,
          merchantAccount: null,
          sort: '',
          selfCheck:1,
        },
        summery: {
          'amount': 0,
        },
        tableKey: 0,
        constFalse: false,
        constTrue: true,
        statusOptions: [],
        multipleSelection:[],
        checkVisible:false,
        canCheckRemitStatus:0,
        checkLoading:false,
        checkForm:{
          'status':'',
          't2fa':'',
          'pwd':'',
        },
        checkFormAlert:'',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
      }
    },
    filters: {},
    created() {
      this.getList()
    },
    mounted() {
      // console.log('mounted',this.$route.path)
    },
    updated() {

    },
    computed: {
      ...mapGetters([
        'roles', 'uid', 'user'
      ])
    },
    methods: {
      getList() {
        var self = this

        self.listLoading = true
        for (let i in self.listQuery) {
          if (self.listQuery[i] == '__ALL__') self.listQuery[i] = ''
        }
        axios.post('/remit/my-list', self.listQuery).then(
          res => {
            self.listLoading = false

            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.canCheckRemitStatus = res.data.canCheckRemitStatus
              self.list = res.data.data
              self.summery = res.data.summery
              self.total = res.data.pagination.total
              self.statusOptions = res.data.condition.statusOptions
              self.channelAccountOptions = res.data.condition.channelAccountOptions
            }

          },
          res => {
            self.listLoading = false
            self.$message.error({message: res.message})
          }
        )
      },
      handleShowUpdateStatus(status,id){
        let self = this
        self.checkForm.status = status
        self.checkForm.remitIdList =  self.multipleSelection
        if(id){
          self.checkForm.remitIdList = [id]
        }
        let msg = '通过审核'
        if(status==2){
          msg = '拒绝提交并退款'
        }
        self.checkFormAlert = "您将要把结算订单设置为: "+msg
        self.checkVisible = true
      },
      handleUpdateStatus() {
        self = this
        self.checkLoading = true
        axios.post('/remit/check', self.checkForm).then(
          res => {
            self.checkLoading = false
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.$message.success({message: res.message})
              self.checkVisible = false
              self.getList();
              self.checkForm.t2fa = ''
              self.checkForm.pwd = ''
            }
          },
          res => {
            self.$message.error({message: res.message})
          }
        )

      },
      showNotifyRet(row) {
        // self.$message.error({message: res.message})
        this.$alert(row.notify_ret, '商户服务器响应内容', {
          confirmButtonText: '确定',
          callback: action => {

          }
        });
      },
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计';
            return;
          }
          sums[index] = 'N/A';
        });
        sums[3] = this.summery.amount + '元'
        return sums;
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      timeFilter(time) {
        if (!time[0]) {
          this.listQuery.start = undefined
          this.listQuery.end = undefined
          return
        }
        this.listQuery.start = parseInt(+time[0] / 1000)
        this.listQuery.end = parseInt((+time[1] + 3600 * 1000 * 24) / 1000)
      },
      handleSelectionChange(val) {
        this.multipleSelection = []
        for(let v of val){
          this.multipleSelection.push(v.id)
        }
      },
      checkNumber: function () {
        // console.log(this.listQuery.minMoney);
        let reg = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
        if (!reg.test(this.listQuery.minMoney)) {
          this.listQuery.minMoney = '';
        }
        if (!reg.test(this.listQuery.maxMoney)) {
          this.listQuery.maxMoney = '';
        }
      }
    }

  }
</script>

<style>
  .action-btns a {
    margin-left: 5px;
  }

  .el-table td, .el-table th {
    padding: 5px 0 !important;
  }
</style>