<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input class="filter-item" placeholder="收款订单号" v-model="listQuery.orderNo" size="small" clearable></el-input>
      <el-input size="small" class="filter-item" placeholder="商户订单号" v-model="listQuery.merchantOrderNo" clearable></el-input>
      <el-date-picker class="filter-item"
                      v-model="listQuery.dateStart"
                      align="right"
                      type="datetime"
                      placeholder="开始日期"
                      size="small"
                      :picker-options="pickerOptions"
      >
      </el-date-picker>
      <el-date-picker class="filter-item"
                      v-model="listQuery.dateEnd"
                      align="right"
                      type="datetime"
                      placeholder="结束日期"
                      size="small"
                      :picker-options="pickerOptions">
      </el-date-picker>
      <el-select class="filter-item" v-model="listQuery.status" placeholder="订单状态" size="small">
        <el-option
            v-for="(item,key) in statusOptions"
            :key="key"
            :label="item"
            :value="key">
        </el-option>
      </el-select>
      通知状态：
      <el-select class="filter-item" v-model="listQuery.notifyStatus" placeholder="通知状态" size="small">
        <el-option
            v-for="(item,key) in notifyStatusOptions"
            :key="key"
            :label="item"
            :value="key">
        </el-option>
      </el-select>

      <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" size="small" type="primary" v-waves icon="search" @click="exportResult('csv')">导出CSV</el-button>
    </div>

    <el-table stripe :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="数据加载中，请稍候..." border fit
              highlight-current-row style="width: 100%" :summary-method="getSummaries" show-summary>

      <el-table-column fixed="left" align="center" label="商户编号">
        <template slot-scope="scope">
          <span>{{scope.row.merchant_id}}</span>
        </template>
      </el-table-column>

      <el-table-column fixed align="center" label="商户账号">
        <template slot-scope="scope">
          <span>{{scope.row.merchant_account}}</span>
        </template>
      </el-table-column>

      <el-table-column fixed label="收款订单号" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.order_no}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed label="商户订单号" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.merchant_order_no}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed label="金额">
        <template slot-scope="scope">
          <span>￥{{scope.row.amount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型">
        <template slot-scope="scope">
          <span>{{scope.row.pay_method_code_str}}</span>
        </template>
      </el-table-column>

      <el-table-column label="银行">
        <template slot-scope="scope">
          <span>{{scope.row.bank_code}}/{{scope.row.bank_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单状态">
        <template slot-scope="scope">
          <span>{{scope.row.status_str}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="通知状态">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light" :content="scope.row.notify_ret" placement="top">
            <span class="link-type" @click="showNotifyRet(scope.row)">{{scope.row.notify_status_str}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" width="180" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="80" align="center" label="操作" class="action-btns">
        <template slot-scope="scope">
          <el-button class="filter-item" size="mini" type="info"
                     v-if="scope.row.status == 20 || scope.row.status == 60 " @click="sendNotify(scope.row)" circle>通知
          </el-button>
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
  </div>
</template>

<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime} from '@/utils'
  import common from '@/utils/common'
  import axios from '@/utils/http'
  import {mapGetters} from 'vuex'

  export default {
    name: 'vue_my_order',
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
          notifyStatus: null,
          sort: ''
        },
        summery: [],
        tableKey: 0,
        constFalse: false,
        constTrue: true,
        statusOptions: [],
        notifyStatusOptions: [],
        methodOptions: [],
        channelAccountOptions: [],
        // {0:'全部'},
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
    },
    updated() {

    },
    computed: {
      ...mapGetters([
        'roles', 'uid', 'user'
      ])
    },
    methods: {
      exportResult(type){
        self = this
        self.listQuery.export = 1
        self.listQuery.exportType = type
        let url = common.pageMap.baseDomain+'/order/my-list?access-token='+common.getToken()

        let params = JSON.parse(JSON.stringify(self.listQuery))
        common.downloadFile(url,params)
        self.$message.success({message: '文件已导出'})
        self.listQuery.export = 0
        self.listQuery.exportType = ''
      },
      getList() {
        var self = this

        self.listLoading = true
        for (let i in self.listQuery) {
          if (self.listQuery[i] == '__ALL__') self.listQuery[i] = ''
        }
        axios.post('/order/my-list', self.listQuery).then(
          res => {
            self.listLoading = false
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.list = res.data.data
              self.summery = res.data.summery
              self.total = res.data.pagination.total
              self.statusOptions = (res.data.condition.statusOptions)
              self.notifyStatusOptions = (res.data.condition.notifyStatusOptions)
              self.channelAccountOptions = (res.data.condition.channelAccountOptions)
              self.methodOptions = (res.data.condition.methodOptions)
            }

          },
          res => {
            self.listLoading = false
            self.$message.error({message: res.message})
          }
        )
      },
      showDetail(row, cb) {
        //return
        self = this

        axios.post('/order/detail', {id: row.id}).then(
          res => {
            return
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.orderDetail = res.data
              self.orderDetailBarCodeStr = self.orderDetail.order.order_no
              console.log('self.orderDetailBarCodeStr', self.orderDetailBarCodeStr)
              this.dialogOrderVisible = true
              if (cb) cb()
            }
          },
          res => {
            self.$message.error({message: res.message})
          }
        )
      },
      sendNotify(row) {
        self = this

        axios.post('/order/send-notify', {id: row.id}).then(
          res => {
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.$message.success({message: res.message})
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
            sums[index] = '当前查询条件总计';
            return;
          }
          sums[index] = 'N/A';
        });
        sums[2] = this.summery.amount + '元'
        return sums;
      },
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 0) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
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
      checkNumber: function () {
        // console.log(this.listQuery.minMoney);
        let reg = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
        if (!reg.test(this.listQuery.minMoney)) {
          this.listQuery.minMoney = '';
        }
        if (!reg.test(this.listQuery.maxMoney)) {
          this.listQuery.maxMoney = '';
        }
      },
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
  .el-input {
    width: 13%;
  }
</style>