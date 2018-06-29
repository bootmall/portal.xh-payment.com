<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-date-picker  class="filter-item"
                             v-model="listQuery.dateStart"
                             align="right"
                             type="date"
                             placeholder="开始日期"
                             :picker-options="pickerOptions">
            </el-date-picker>
            <el-date-picker  class="filter-item"
                             v-model="listQuery.dateEnd"
                             align="right"
                             type="date"
                             placeholder="结束日期"
                             :picker-options="pickerOptions">
            </el-date-picker>
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="订单号" v-model="listQuery.orderNo"></el-input>
            <el-select class="filter-item" v-model="listQuery.eventType" placeholder="订单类型">
                <el-option
                        v-for="item in typeOptions"
                        :key="item.key"
                        :label="item.value"
                        :value="item.key">
                </el-option>
            </el-select>
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="商户号" v-model="listQuery.uid"></el-input>

            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="商户账号" v-model="listQuery.username"></el-input>

            <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
        </div>

        <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="数据加载中，请稍候..." border fit highlight-current-row style="width: 100%" >

            <el-table-column label="订单号" width="180">
                <template slot-scope="scope">
                    <span>{{scope.row.event_id}}</span>
                </template>
            </el-table-column>

            <el-table-column label="商户号" width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.uid}}</span>
                </template>
            </el-table-column>

            <el-table-column label="商户账号" width="180" >
                <template slot-scope="scope">
                    <span >{{scope.row.username}}</span>
                </template>
            </el-table-column>
            <el-table-column label="项目类型" width="180">
                <template slot-scope="scope">
                    <span >{{scope.row.event_type_str}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="变动前余额" width="160">
                <template slot-scope="scope">
                    <span>{{scope.row.balance_before}}</span>
                </template>
            </el-table-column>
            <el-table-column label="金额" width="100">
                <template slot-scope="scope">
                    <span >{{scope.row.amount}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="当前余额" width="160">
                <template slot-scope="scope">
                    <span>{{scope.row.balance}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="时间" width="180">
                <template slot-scope="scope">
                    <span >{{scope.row.created_at}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="备注" class="action-btns">
                <template slot-scope="scope">
                    <span class="link-type" @click="showNotifyRet(scope.row)">{{scope.row.bak}}</span>
                </template>
            </el-table-column>

        </el-table>

    </div>
</template>

<script>
    import waves from '@/directive/waves/index.js' // 水波纹指令
    import {parseTime} from '@/utils'
    import common from '@/utils/common'
    import axios from '@/utils/http'
    import { mapGetters } from 'vuex'

    export default {
        name: 'vue_sub_account_financial',
        directives: {
            waves
        },
        components: {},
        data() {
            return {
                rules: {
                },
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 15,
                    importance: undefined,
                    dateStart: null,
                    dateEnd: null,
                    orderNo: null,
                    merchantOrderNo: null,
                    status: null,
                    notifyStatus: null,
                    sort: ''
                },
                tableKey: 0,
                constFalse: false,
                constTrue: true,
                typeOptions:[
                    {key:'0',value:'全部'},
                    {key:'10',value:'充值订单'},
                    {key:'11',value:'充值订单-手续费'},
                    {key:'12',value:'充值订单-分润'},
                    {key:'20',value:'代付订单'},
                    {key:'21',value:'代付订单-手续费'},
                    {key:'22',value:'代付订单-分润'},
                    {key:'23',value:'代付失败-退款'},
                    {key:'24',value:'代付失败-手续费返还'},
                    {key:'25',value:'代付失败-分润返还'},
                    {key:'30',value:'系统加款'},
                    {key:'31',value:'系统扣款'},
                ],
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
        },
        created() {
            this.getList()
        },
        mounted(){
        },
        updated(){

        },
        computed: {
            ...mapGetters([
                'roles','uid','user'
            ])
        },
        methods: {
            getList() {
                var self = this

                self.listLoading = true
                axios.post('/account/account-financial', self.listQuery).then(
                    res => {
                        self.listLoading = false

                        if (res.code != 0) {
                            self.$message.error({message: res.message})
                        } else {
                            self.list = res.data.data
                            self.summery = res.data.summery
                            self.total = res.data.pagination.total
                        }

                    },
                    res => {
                        self.listLoading = false
                        self.$message.error({message: res.message})
                    }
                )
            },

            //:span-method="objectSpanMethod"
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0) {
                    if (rowIndex == this.data.data.length) {
                        return {
                            rowspan: 1,
                            colspan: 4
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
        }
    }
</script>

<style>
    .action-btns a {
        margin-left: 5px;
    }
    .pagination-container{
        margin-top: 10px;
    }
    .el-tag {
        margin-top: 10px;
        margin-left: 10px;
    }
    .el-table td, .el-table th {
        padding: 5px 0 !important;
    }
</style>