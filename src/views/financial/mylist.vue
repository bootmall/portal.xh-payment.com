<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-date-picker  class="filter-item" style="width: 200px;"
                             v-model="listQuery.dateStart"
                             align="right"
                             type="datetime"
                             format="yyyy-MM-dd"
                             placeholder="开始日期"
                             :picker-options="pickerOptions">
            </el-date-picker>
            <el-date-picker  class="filter-item" style="width: 200px;"
                             v-model="listQuery.dateEnd"
                             align="right"
                             type="datetime"
                             format="yyyy-MM-dd"
                             placeholder="结束日期"
                             :picker-options="pickerOptions">
            </el-date-picker>
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="订单号" v-model="listQuery.orderNo" clearable></el-input>
            <el-select class="filter-item" v-model="listQuery.eventType" placeholder="订单类型">
                <el-option
                        v-for="item in typeOptions"
                        :key="item.id"
                        :label="item.val"
                        :value="item.id">
                </el-option>
            </el-select>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="exportResult('csv')">导出CSV</el-button>
        </div>

        <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="数据加载中，请稍候..." border fit highlight-current-row style="width: 100%" :summary-method="getSummaries">

            <el-table-column label="订单号">
                <template slot-scope="scope">
                    <span>{{scope.row.event_id}}</span>
                </template>
            </el-table-column>

            <el-table-column label="商户号">
                <template slot-scope="scope">
                    <span>{{scope.row.uid}}</span>
                </template>
            </el-table-column>

            <el-table-column label="商户账号" >
                <template slot-scope="scope">
                    <span >{{scope.row.username}}</span>
                </template>
            </el-table-column>
            <el-table-column label="项目类型">
                <template slot-scope="scope">
                    <span >{{scope.row.event_type_str}}</span>
                </template>
            </el-table-column>
            <!--<el-table-column align="center" label="状态" width="160">-->
                <!--<template slot-scope="scope">-->
                    <!--<span>{{scope.row.status_str}}</span>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column align="center" label="变动前余额">
                <template slot-scope="scope">
                    <span>{{scope.row.balance_before}}</span>
                </template>
            </el-table-column>
            <el-table-column label="金额">
                <template slot-scope="scope">
                    <span >{{scope.row.amount}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="当前余额">
                <template slot-scope="scope">
                    <span>{{scope.row.balance}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="对方账户">
                <template slot-scope="scope">
                    <span>{{scope.row.to_username}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="备注">
                <template slot-scope="scope">
                    <span>{{scope.row.bak}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="时间">
                <template slot-scope="scope">
                    <span >{{scope.row.created_at}}</span>
                </template>
            </el-table-column>
        </el-table>
        <el-row>
            <el-tag type="warning" v-for="(v,k) in summery" :key="v.event_id">{{v.event_type_str}}:{{v.amount}}</el-tag>
        </el-row>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                           :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

    </div>
</template>

<script>
    import waves from '@/directive/waves/index.js' // 水波纹指令
    import {parseTime} from '@/utils'
    import common from '@/utils/common'
    import axios from '@/utils/http'
    import { mapGetters } from 'vuex'

    export default {
        name: 'vue_financial_my_list',
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
                    limit: 20,
                    importance: null,
                    dateStart: new Date(new Date().setHours(0, 0, 0, 0)),
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
                typeOptions:[],
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
            // console.log('mounted',this.$route.path)
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

                axios.post('/financial/my-list', self.listQuery).then(
                    res => {
                        self.listLoading = false

                        if (res.code != 0) {
                            self.$message.error({message: res.message})
                        } else {
                            self.list = res.data.data
                            self.summery = res.data.summery
                            self.total = res.data.pagination.total
                            self.typeOptions = res.data.options.typeOptions;
                        }

                    },
                    res => {
                        self.listLoading = false
                        self.$message.error({message: res.message})
                    }
                )
            },
          exportResult(type){
            self = this

            self.listQuery.export = 1
            self.listQuery.exportType = type
            let url = common.pageMap.baseDomain+'/financial/my-list?access-token='+common.getToken()

            let params = JSON.parse(JSON.stringify(self.listQuery))
            common.downloadFile(url,params)
            self.$message.success({message: '文件已导出'})
            self.listQuery.export = 0
            self.listQuery.exportType = ''
          },
            sendNotify(row){
                self = this
                axios.post('/order/send-notify',{id:row.id}).then(
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
            showNotifyRet(row){
                // self.$message.error({message: res.message})
                this.$alert(row.notify_ret, '商户服务器响应内容', {
                    confirmButtonText: '确定',
                    callback: action => {

                    }
                });
            },
            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '当前查询条件总计';
                        return;
                    }
                    sums[index] = 'N/A';
                });
                sums[2] = this.summery.amount+'元'
                return sums;
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