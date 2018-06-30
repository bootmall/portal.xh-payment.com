<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            开始时间：
            <el-date-picker  class="filter-item"
                             v-model="listQuery.dateStart"
                             align="right"
                             type="datetime"
                             placeholder="开始日期"
                             :picker-options="pickerOptions">
            </el-date-picker>
            结束时间
            <el-date-picker  class="filter-item"
                             v-model="listQuery.dateEnd"
                             align="right"
                             type="datetime"
                             placeholder="结束日期"
                             :picker-options="pickerOptions">
            </el-date-picker>

            收款订单号：
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="收款订单号" v-model="listQuery.orderNo"></el-input>
            商户订单号：
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="商户订单号" v-model="listQuery.merchantOrderNo"></el-input>
            商户账号：
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="商户账号" v-model="listQuery.merchantUserName"></el-input>
            订单状态：
            <el-select class="filter-item" v-model="listQuery.status" placeholder="订单状态" >
                <el-option
                        v-for="(item,key) in statusOptions"
                        :key="key"
                        :label="item"
                        :value="key">
                </el-option>
            </el-select>
            通知状态：
            <el-select class="filter-item" v-model="listQuery.notifyStatus" placeholder="通知状态">
                <el-option
                        v-for="(item,key) in notifyStatusOptions"
                        :key="key"
                        :label="item"
                        :value="key">
                </el-option>
            </el-select>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </div>

        <el-table  stripe :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="数据加载中，请稍候..." border fit highlight-current-row style="width: 100%" >

            <el-table-column fixed="left" align="center" label="商户编号">
                <template slot-scope="scope">
                    <span>{{scope.row.merchant_id}}</span>
                </template>
            </el-table-column>

            <el-table-column   align="center" label="商户账号">
                <template slot-scope="scope">
                    <span>{{scope.row.merchant_account}}</span>
                </template>
            </el-table-column>

            <el-table-column  label="收款订单号" width="180">
                <template slot-scope="scope">
                    <span  >{{scope.row.order_no}}</span>
                </template>
            </el-table-column>
            <el-table-column  label="商户订单号" width="180">
                <template slot-scope="scope">
                    <span  >{{scope.row.merchant_order_no}}</span>
                </template>
            </el-table-column>

            <el-table-column  label="金额">
                <template slot-scope="scope">
                    <span>￥{{scope.row.amount}}</span>
                </template>
            </el-table-column>

            <el-table-column label="通道号" width="180">
                <template slot-scope="scope">
                    <span  >{{scope.row.channel_account_name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="类型">
                <template slot-scope="scope">
                    <span  >{{scope.row.pay_method_code_str}}</span>
                </template>
            </el-table-column>

            <el-table-column label="银行码">
                <template slot-scope="scope">
                    <span >{{scope.row.bank_code}}</span>
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
            <!--<el-table-column fixed="right" width="200" align="center" label="操作" class="action-btns">-->
                <!--<template slot-scope="scope">-->
                    <!--<el-popover-->
                            <!--placement="top"-->
                            <!--width="400"-->
                            <!--trigger="click">-->
                        <!--<p><span>通知地址：</span><span v-text="notify_url"></span></p>-->
                        <!--<p><span>通知次数：</span><span v-text="notify_times"></span></p>-->
                        <!--<p><span>通知结果：</span><span v-text="notify_ret"></span></p>-->

                        <!--<el-button class="filter-item" slot="reference" size="mini" type="primary" @click="showDetail(scope.row)" icon="el-icon-document" v-waves>详情</el-button>-->
                    <!--</el-popover>-->
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
    import Tinymce from '@/components/Tinymce'

    export default {
        name: 'vue_sub_account_orders',
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
                trackOptions: [],
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
                    notifyStatus: null,
                    sort: ''
                },
                notify_url:null,
                notify_times:null,
                notify_ret:null,
                tableKey: 0,
                constFalse: false,
                constTrue: true,
                statusOptions:[],
                notifyStatusOptions:[],
                methodOptions:[],
                channelAccountOptions:[],
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
                axios.post('/account/account-order', self.listQuery).then(
                    res => {
                        self.listLoading = false

                        if (res.code != 0) {
                            self.$message.error({message: res.message})
                        } else {
                            self.list = res.data.data
                            self.total = res.data.pagination.total
                            self.statusOptions = (res.data.condition.statusOptions)
                            self.notifyStatusOptions = (res.data.condition.notifyStatusOptions)
                            self.channelAccountOptions = (res.data.condition.channelAccountOptions)
                            self.methodOptions = (res.data.condition.methodOptions)
                            self.trackOptions = (res.data.trackOptions)
                        }

                    },
                    res => {
                        self.listLoading = false
                        self.$message.error({message: res.message})
                    }
                )
            },
            showDetail(row) {
                let self = this
                axios.post('/order/detail',{id:row.id}).then(
                    res => {
                        if (res.code != 0) {
                            self.$message.error({message: res.message})
                        } else {
                            self.notify_url = res.data.notify_url;
                            self.notify_times = res.data.notify_times;
                            self.notify_ret = res.data.notify_ret;
                        }
                    },
                )
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
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
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

            handleUpload(response,file,fileList) {
                this.trackForm.upload.push(response.data.filepath);
                this.trackForm.upload_url.push(response.data.host+response.data.filepath);
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