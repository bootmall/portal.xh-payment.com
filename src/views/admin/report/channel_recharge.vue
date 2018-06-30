<template>
    <div class="components-container">
        <div class="filter-container">
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
        </div>

        <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="数据加载中，请稍候..." border fit highlight-current-row style="width: 100%">


            <el-table-column label="渠道">
            <template slot-scope="scope">
                <span>{{scope.row.channel_name}}</span>
            </template>
        </el-table-column>
            <el-table-column align="center" :label="p" v-for="(p,pk) in payTypeFields" :key="pk">
                <template slot-scope="scope">
                    <em>{{scope.row.methods |
                        filterMerchantPayMethod(pk)}}</em>
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
  import common from '@/utils/common'
  import {parseTime} from '@/utils'
  import axios from '@/utils/http'

  export default {
    name: 'vue_channel_account_trade_statistic',
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
        payTypeFields: [],
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
    filters: {
      filterMerchantPayMethod(methods, methodId) {
        if (!methods || !methodId) return
        let val = ''
        if (typeof methods[methodId] !== 'undefined') {
          val = methods[methodId].amount
        }
        return val
      }
    },
    created() {
      this.getInitData()
    },
    methods: {
      getInitData() {
        var self = this
        self.listLoading = true
        axios.post('/admin/report/channel-recharge', self.listQuery).then(
          res => {
            self.listLoading = false
            if (res.code == 0) {
              self.list = res.data.data
              self.payTypeFields = res.data.pay_methods
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


