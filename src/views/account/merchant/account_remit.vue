<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container" >
            <el-date-picker  class="filter-item" size="small"
                             v-model="listQuery.dateStart"
                             align="right"
                             type="datetime"
                             placeholder="开始日期"
                             :picker-options="pickerOptions">
            </el-date-picker>
            <el-date-picker  class="filter-item" size="small"
                             v-model="listQuery.dateEnd"
                             align="right"
                             type="datetime"
                             placeholder="结束日期"
                             :picker-options="pickerOptions">
            </el-date-picker>

            <el-input class="filter-item" size="small" style="width: 200px;" v-model="listQuery.merchantNo" placeholder="商户编号"></el-input>
            <el-input class="filter-item" size="small" style="width: 200px;" v-model="listQuery.merchantAccount" placeholder="商户账号"></el-input>
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" size="small" class="filter-item" placeholder="结算订单号" v-model="listQuery.orderNo"></el-input>
            <el-input @keyup.enter.native="handleFilter" size="small" style="width: 200px;" class="filter-item" placeholder="商户订单号" v-model="listQuery.merchantOrderNo"></el-input>

            <el-select class="filter-item" v-model="listQuery.status" size="small" placeholder="状态" >
                <el-option
                        v-for="(item,key) in statusOptions"
                        :key="key"
                        :label="item"
                        :value="key">
                </el-option>
            </el-select>
            <el-button class="filter-item" size="small" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
        </div>

        <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="数据加载中，请稍候..." border fit highlight-current-row style="width: 100%;font-size: 12px"  stripe>
            <!--<el-table-column align="center" fixed type="selection" width="55" @selection-change="handleSelectionChange"></el-table-column>-->
            <el-table-column prop="merchant_id" label="商户编号"></el-table-column>
            <el-table-column prop="merchant_account" label="商户账号"></el-table-column>
            <el-table-column prop="order_no" label="结算订单号" ></el-table-column>
            <el-table-column prop="merchant_order_no" label="商户订单号"></el-table-column>
            <el-table-column prop="bank_account" label="持卡人" ></el-table-column>
            <el-table-column prop="bank_no" label="卡号" ></el-table-column>
            <el-table-column prop="amount" label="金额（元）" ></el-table-column>
            <el-table-column prop="bank_name" label="银行" ></el-table-column>
            <el-table-column prop="status_str" label="订单状态" ></el-table-column>
            <el-table-column prop="created_at" label="建立时间" ></el-table-column>

            <!--<el-table-column align="center" label="操作" class="action-btns" fixed="right" width="250px">-->
                <!--<template slot-scope="scope" >-->
                    <!--<el-button class="filter-item" icon="el-icon-refresh" size="mini" v-if="[30].indexOf(scope.row.status) !== -1" v-waves>同步</el-button>-->
                    <!--&lt;!&ndash;<a class="link-type" @click=showDetail(scope.row)>详情</a>&ndash;&gt;-->
                <!--</template>-->
            <!--</el-table-column>-->

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
        name: 'vue_sub_account_remits',
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
                uploadUrl: common.pageMap.baseDomain+'/upload/upload',
                listQuery: {
                    page: 1,
                    limit: 10,
                    importance: undefined,
                    dateStart: null,
                    dateEnd: null,
                    orderNo: null,
                    merchantOrderNo: null,
                    status: null,
                    bankAccount: null,
                    bankNo: null,
                    minMoney: null,
                    maxMoney: null,
                    merchantNo: null,
                    merchantAccount: null,
                    channelAccount: null,
                    sort: ''
                },
                summery: {
                    'amount':0,
                },
                trackVisible:false,
                trackForm:{
                    id:undefined,
                    type:'2',
                    upload:[],
                    note:'',
                    upload_url:[],
                },
                tableKey: 0,
                constFalse: false,
                constTrue: true,
                channelAccountOptions:[],
                statusOptions:[
                    // {key:'10',value:'未支付'},{key:'10',value:'已支付'}
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

                axios.post('/account/account-remit', self.listQuery).then(
                    res => {
                        self.listLoading = false

                        if (res.code != 0) {
                            self.$message.error({message: res.message})
                        } else {
                            self.list = res.data.data
                            self.total = res.data.pagination.total
                            self.statusOptions = res.data.condition.statusOptions
                        }

                    },
                    res => {
                        self.listLoading = false
                        self.$message.error({message: res.message})
                    }
                )
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
                this.multipleSelection = val;
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
</style>