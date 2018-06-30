<template>
    <div class="components-container">
        <div class="filter-container">
            商户账号 <el-input style="width: 100px;" class="filter-item" v-model="listQuery.merchant_name"></el-input>
            商户ID <el-input style="width: 200px;" class="filter-item" v-model="listQuery.merchant_id"></el-input>
            开始时间：
            <el-date-picker class="filter-item"
                            v-model="listQuery.dateStart"
                            align="right"
                            type="datetime"
                            placeholder="开始日期"
                            style="width: 150px;"
                            :picker-options="pickerOptions">
            </el-date-picker>
            结束时间
            <el-date-picker class="filter-item"
                            v-model="listQuery.dateEnd"
                            align="right"
                            type="datetime"
                            placeholder="结束日期"
                            style="width: 150px;"
                            :picker-options="pickerOptions">
            </el-date-picker>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </div>

        <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="数据加载中，请稍候..." border fit highlight-current-row style="width: 100%">
            <el-table-column
                    type="selection"
                    width="30">
            </el-table-column>

            <el-table-column label="商户ID">
                <template slot-scope="scope">
                    <span class="link-type">{{scope.row.merchant_id}}</span>
                </template>
            </el-table-column>
            <el-table-column label="商户名">
                <template slot-scope="scope">
                    <span class="link-type">{{scope.row.merchant_account}}</span>
                </template>
            </el-table-column>
            <el-table-column label="收款总额">
                <template slot-scope="scope">
                    <span class="link-type">{{scope.row.amount}}</span>
                </template>
            </el-table-column>
            <el-table-column label="收款笔数">
                <template slot-scope="scope">
                    <span class="link-type">{{scope.row.num}}</span>
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
  import Tinymce from '@/components/Assembly/Tinymce'
  import {parseTime} from '@/utils'
  import axios from '@/utils/http'

  export default {
    name: 'vue_agent_trade_statistic',
    components: {waves},
    directives: {
      waves
    },
    data() {
      return {
        editVisible: false,
        viewModel: {},
        viewModelTableData: [],
        list: null,
        tableKey: 0,
        total: null,
        listLoading: true,
        eventTypeOptions: [],
        listQuery: {
          page: 1,
          limit: 10,
          importance: undefined,
          event_type: '',
          event_id: '',
          merchant_name: '',
          sort: '',
          dateStart: null,
          dateEnd: null,
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
        axios.post('/account/recharge-sum-statistic', self.listQuery).then(
          res => {
            self.listLoading = false
            if (res.code == 0) {
              self.list = res.data.data
              self.total = res.data.pagination.total
            }
          }
        )
      },
      showDetailDialog(row) {
        this.viewModel = row;
        for (let k in this.viewModel) {
          console.log(k);
          this.viewModelTableData.push({k: k, v: this.viewModel[k]})
        }

        this.editVisible = true;
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