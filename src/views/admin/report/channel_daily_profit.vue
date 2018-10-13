<template>
    <div class="components-container">
        <div class="filter-container">
            <!--<el-select class="filter-item" v-model="listQuery.channelAccountId" placeholder="选择通道" filterable>-->
                <!--<el-option-->
                        <!--v-for="(item,key) in channelList"-->
                        <!--:key="item.id"-->
                        <!--:label="item.name"-->
                        <!--:value="item.id">-->
                <!--</el-option>-->
            <!--</el-select>-->
            <el-select class="filter-item" v-model="listQuery.month" placeholder="月份" filterable>
                <el-option
                        v-for="(item,key) in monthOptions"
                        :key="key"
                        :label="item"
                        :value="key">
                </el-option>
            </el-select>

            <!--<el-date-picker class="filter-item"-->
                            <!--v-model="listQuery.dateStart"-->
                            <!--align="right"-->
                            <!--type="date"-->
                            <!--placeholder="开始日期"-->
                            <!--value-format="yyyy-MM-dd"-->
                            <!--style="width: 200px"-->
                            <!--:picker-options="pickerOptions">-->
            <!--</el-date-picker>-->
            <!--<el-date-picker class="filter-item"-->
                            <!--v-model="listQuery.dateEnd"-->
                            <!--align="right"-->
                            <!--type="date"-->
                            <!--value-format="yyyy-MM-dd"-->
                            <!--placeholder="结束日期"-->
                            <!--style="width: 200px"-->
                            <!--:picker-options="pickerOptions">-->
            <!--</el-date-picker>-->
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </div>

        <el-table
                :key='tableKey'
                :data="list"
                v-loading="listLoading"
                element-loading-text="数据加载中，请稍候..."
                border
                fit
                highlight-current-row
                @row-click="clickTable"
                ref="refTable"
                style="width: 100%">

            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-row :gutter="20" class="demo-row" v-for="(item,key) in scope.row.list" :key="key">
                        <el-col >
                            <span class="demo-span">通道：{{item.channel_account_name}}</span>
                            <span class="demo-span">收款笔数：{{item.recharge_count}}</span>
                            <span class="demo-span">收款总额：{{item.recharge_total}}</span>
                            <span class="demo-span">收款利润：{{item.recharge_plat_fee_profit}}</span>
                            <span class="demo-span">结算笔数：{{item.remit_count}}</span>
                            <span class="demo-span">结算总额：{{item.remit_total}}</span>
                            <span class="demo-span">结算利润：{{item.remit_plat_fee_profit}}</span>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column label="日期">
                <template slot-scope="scope">
                    <span>{{scope.row.date}}</span>
                </template>
            </el-table-column>
            <el-table-column label="收款笔数">
                <template slot-scope="scope">
                    <span>{{scope.row.recharge_count}}</span>
                </template>
            </el-table-column>
            <el-table-column label="收款总额">
                <template slot-scope="scope">
                    <span>{{scope.row.recharge_total}}</span>
                </template>
            </el-table-column>
            <el-table-column label="收款利润">
                <template slot-scope="scope">
                    <span>{{scope.row.recharge_plat_fee_profit}}</span>
                </template>
            </el-table-column>
            <el-table-column label="结算笔数">
                <template slot-scope="scope">
                    <span>{{scope.row.remit_count}}</span>
                </template>
            </el-table-column>
            <el-table-column label="结算总额">
                <template slot-scope="scope">
                    <span>{{scope.row.remit_total}}</span>
                </template>
            </el-table-column>
            <el-table-column label="结算利润">
                <template slot-scope="scope">
                    <span>{{scope.row.remit_plat_fee_profit}}</span>
                </template>
            </el-table-column>
            <el-table-column label="总利润">
                <template slot-scope="scope">
                    <span>{{scope.row.total_profit}}</span>
                </template>
            </el-table-column>
        </el-table>
        <!--<div v-show="!listLoading" class="pagination-container">-->
            <!--<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"-->
                           <!--:page-sizes="[10,20,30, 50,100]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">-->
            <!--</el-pagination>-->
        <!--</div>-->
    </div>
</template>

<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime} from '@/utils'
  import axios from '@/utils/http'
  import common from '@/utils/common'
  import math from 'mathjs'

  export default {
    name: 'vue_channel_account_trade_profit',
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
        channelList: [],
        summary: {},
        listQuery: {
          page: 1,
          limit: 20,
          channelAccountId: '',
          sort: '',
          dateStart: new Date(new Date((new Date()).getTime() - 86400000*1).setHours(0, 0, 0, 0)),
          dateEnd: null,
            month:new Date().getMonth(),
        },
          monthOptions:['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],

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
      this.getChannelList()
    },
    methods: {
      getInitData() {
        var self = this
        self.listLoading = true
        axios.post('/admin/report/channel-daily-profit', self.listQuery).then(
        res => {
          self.listLoading = false
          if (res.code == 0) {
            self.list= res.data
            // self.total = res.data.pagination.total
            // self.summary = res.data.summary
          }
        }
        )
      },
        getChannelList() {
            self = this
            self.isLoading = true
            axios.post('/admin/channel/get-account-list').then(
                res => {
                    if (res.code != 0) {
                        self.$message.error({message: res.message})
                    } else {
                        res.data.unshift({id:'__ALL__',name:'所有'})
                        self.channelList = res.data
                    }
                    self.isLoading = false
                },
                res => {
                    self.$message.error({message: res.message})
                    self.isLoading = false
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
        clickTable(row,index,e){
            this.$refs.refTable.toggleRowExpansion(row)
        }
    }
  }
</script>

<style scoped>
    .editor-content {
        margin-top: 20px;
    }
    .demo-row {
        width: 100%;
        margin: 10px 50px;
    }
    .demo-span {
        margin: 10px 10px;
        width: 13%;
    }
</style>


