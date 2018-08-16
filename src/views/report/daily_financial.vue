<template>
    <div class="components-container">
        <div class="filter-container">
            商户ID：
            <el-input style="width: 100px;" class="filter-item" v-model="listQuery.user_id"></el-input>
            商户名
            <el-input style="width: 200px;" class="filter-item" v-model="listQuery.username"></el-input>
            开始时间：
            <el-date-picker class="filter-item"
                            v-model="listQuery.dateStart"
                            align="right"
                            type="date"
                            placeholder="开始日期"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptions">
            </el-date-picker>
            结束时间
            <el-date-picker class="filter-item"
                            v-model="listQuery.dateEnd"
                            align="right"
                            type="date"
                            placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptions">
            </el-date-picker>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
            <!--<el-button class="filter-item" type="primary" @click="editVisible = true">添加配置</el-button>-->
        </div>

        <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="数据加载中，请稍候..." border fit highlight-current-row style="width: 100%">


            <el-table-column label="商户ID">
                <template slot-scope="scope">
                    <span>{{scope.row.user_id}}</span>
                </template>
            </el-table-column>

            <el-table-column label="商户名">
            <template slot-scope="scope">
                <span>{{scope.row.username}}</span>
            </template>
        </el-table-column>
            <el-table-column label="收款总额">
                <template slot-scope="scope">
                    <span>{{scope.row.recharge}}</span>
                </template>
            </el-table-column>
            <el-table-column label="结算总额">
                <template slot-scope="scope">
                    <span>{{scope.row.remit}}</span>
                </template>
            </el-table-column>
            <el-table-column label="结算总额">
                <template slot-scope="scope">
                    <span>{{scope.row.bonus}}</span>
                </template>
            </el-table-column>
            <el-table-column label="增金总额">
                <template slot-scope="scope">
                    <span>{{scope.row.total_income}}</span>
                </template>
            </el-table-column>
            <el-table-column label="减金总额">
                <template slot-scope="scope">
                    <span>{{scope.row.total_cost}}</span>
                </template>
            </el-table-column>
            <el-table-column label="收款手续费">
                <template slot-scope="scope">
                    <span>{{scope.row.recharge_fee}}</span>
                </template>
            </el-table-column>
            <el-table-column label="结算手续费总额">
                <template slot-scope="scope">
                    <span>{{scope.row.remit_fee}}</span>
                </template>
            </el-table-column>
            <el-table-column label="转账手续费总额">
                <template slot-scope="scope">
                    <span>{{scope.row.transfer_fee}}</span>
                </template>
            </el-table-column>
            <el-table-column label="失败返还总额">
                <template slot-scope="scope">
                    <span>{{scope.row.remit_refund}}</span>
                </template>
            </el-table-column>
            <el-table-column label="失败返还手续费总额">
                <template slot-scope="scope">
                    <span>{{scope.row.remit_fee_refund}}</span>
                </template>
            </el-table-column>
            <el-table-column label="平台转入总额">
                <template slot-scope="scope">
                    <span>{{scope.row.transfer_in}}</span>
                </template>
            </el-table-column>
            <el-table-column label="平台转出总额">
                <template slot-scope="scope">
                    <span>{{scope.row.transfer_out}}</span>
                </template>
            </el-table-column>
            <el-table-column label="今日余额">
                <template slot-scope="scope">
                    <span>{{scope.row.balance}}</span>
                </template>
            </el-table-column>
            <el-table-column label="日期">
                <template slot-scope="scope">
                    <span>{{scope.row.date}}</span>
                </template>
            </el-table-column>
            <el-table-column label="统计时间">
                <template slot-scope="scope">
                    <span>{{scope.row.created_at}}</span>
                </template>
            </el-table-column>

        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                           :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime} from '@/utils'
  import axios from '@/utils/http'
  import common from '@/utils/common'

  export default {
    name: 'vue_trade_statistic_finacial',
    components: {waves},
    directives: {
      waves
    },
    data() {
      return {
        list: null,
        tableKey: 0,
        total: null,
        listLoading: true,
        statusOptions: [],
        listQuery: {
          page: 1,
          limit: 10,
          user_id: '',
          username: '',
          sort: '',
          dateStart: null,//.getDateStr(-1),
          dateEnd: null,//.getDateStr(-1),
        },
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
    created() {
      this.getInitData()
    },
    methods: {
      getInitData() {
        var self = this
        self.listLoading = true
        axios.post('/admin/report/daily-financial', self.listQuery).then(
          res => {
            self.listLoading = false
            if (res.code == 0) {
              self.list = res.data.data
              self.total = res.data.pagination.total
            }
          }
        )
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getInitData()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getInitData()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getInitData()
      },
    }
  }
</script>

<style scoped>
    .editor-content {
        margin-top: 20px;
    }
</style>


