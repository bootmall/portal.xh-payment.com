<template>
    <div class="components-container">
        <div class="filter-container">
            <el-select class="filter-item" v-model="listQuery.channelAccountId" placeholder="选择通道" filterable>
                <el-option
                        v-for="(item,key) in channelList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
            <el-date-picker class="filter-item"
                            v-model="listQuery.dateStart"
                            align="right"
                            type="date"
                            placeholder="开始日期"
                            value-format="yyyy-MM-dd"
                            style="width: 200px"
                            :picker-options="pickerOptions">
            </el-date-picker>
            <el-date-picker class="filter-item"
                            v-model="listQuery.dateEnd"
                            align="right"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="结束日期"
                            style="width: 200px"
                            :picker-options="pickerOptions">
            </el-date-picker>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </div>

        <el-table :row-class-name="tableRowClassName" :key='tableKey' :data="list" v-loading="listLoading"
                  element-loading-text="数据加载中，请稍候..." border fit highlight-current-row style="width: 100%">
            <el-table-column label="日期">
                <template slot-scope="scope">
                    <span>{{scope.row.date}}</span>
                </template>
            </el-table-column>

            <el-table-column label="通道">
                <template slot-scope="scope">
                    <span>{{scope.row.channel_account_name}}</span>
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
            <el-table-column label="渠道日结余">
                <template slot-scope="scope">
                    <span>{{scope.row.channel_sum}}</span>
                </template>
            </el-table-column>
            <el-table-column label="平台日结余">
                <template slot-scope="scope">
                    <span>{{scope.row.plat_sum}}</span>
                </template>
            </el-table-column>
            <el-table-column label="通道起始余额时间">
                <template slot-scope="scope">
                    <span>{{scope.row.channel_balance_begin_ts|parseTime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="通道结束余额时间">
                <template slot-scope="scope">
                    <span>{{scope.row.channel_balance_end_ts|parseTime}}</span>
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
    import axios from '@/utils/http'
    import common from '@/utils/common'

    export default {
        name: 'vue_channel_daily_reconciliations',
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
                listQuery: {
                    page: 1,
                    limit: 20,
                    channelAccountId: '',
                    sort: '',
                  dateStart: new Date(new Date((new Date()).getTime() - 86400000*3).setHours(0, 0, 0, 0)),
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
            this.getChannelList()
            this.getInitData()
        },
        methods: {
            tableRowClassName({row, rowIndex}) {
                // console.log(JSON.stringify(row))
                if (row.channel_sum != row.plat_sum) {
                    return 'warning-row'

                } else {
                    return 'success-row'
                }
                return ''
            },
            getInitData() {
                var self = this
                self.listLoading = true
                axios.post('/admin/report/channel-daily-reconciliations', self.listQuery).then(
                    res => {
                        self.listLoading = false
                        if (res.code == 0) {
                            self.list = res.data.data
                            self.total = res.data.pagination.total
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
        }
    }
</script>

<style>
    .el-table .warning-row {
        background: oldlace;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }
</style>


