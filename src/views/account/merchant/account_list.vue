<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-row>
                <el-col :span="24">
                    <el-input @keyup.enter.native="handleFilter" class="filter-item" placeholder="商户号"style="width: 150px;" v-model="listQuery.userId"></el-input>
                    <el-input @keyup.enter.native="handleFilter" class="filter-item" placeholder="商户帐号"style="width: 200px;" v-model="listQuery.username"></el-input>
                    <el-select class="filter-item" v-model="listQuery.status" placeholder="状态" style="width: 100px;">
                        <el-option
                                v-for="(item,key) in statusOptions"
                                :key="key"
                                :label="item"
                                :value="key">
                        </el-option>
                    </el-select>
                    <el-select class="filter-item" v-model="listQuery.type" placeholder="类型" style="width: 100px;">
                        <el-option
                                v-for="(item,key) in typeOptions"
                                :key="key"
                                :label="item"
                                :value="key">
                        </el-option>
                    </el-select>
                    <el-select class="filter-item" v-model="listQuery.accountOpenFeeStatus" placeholder="开户费缴纳状态" filterable >
                        <el-option
                                v-for="(item,key) in accountOpenFeeStatusOptions"
                                :key="key"
                                :label="item"
                                :value="key">
                        </el-option>
                    </el-select>
                    <!--<el-select class="filter-item" v-model="listQuery.remit" placeholder="下发通道">-->
                        <!--<el-option-->
                                <!--v-for="(item,key) in remitOptions"-->
                                <!--:key="item.id"-->
                                <!--:label="item.channel_name"-->
                                <!--:value="item.id">-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                    <el-button class="" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
                    <el-button class="" type="success" v-waves icon="search" @click="handleEditUser">开户</el-button>
                </el-col>
            </el-row>
        </div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item >
                <span @click="go()">我的下级</span>
            </el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,key) in level" :key="key">
                <span @click="go(key)" >{{item}}</span>
            </el-breadcrumb-item>
        </el-breadcrumb>

        <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="数据加载中，请稍候..." border fit highlight-current-row style="width: 100%" :summary-method="getSummaries" @selection-change="handleSelectionChange">
            <el-table-column label="商户号">
                <template slot-scope="scope">
                    <span class="link-type" @click="showDetail(scope.row)">{{scope.row.id}}</span>
                </template>
            </el-table-column>

            <el-table-column label="类型">
                <template slot-scope="scope">
                    <span class="link-type" @click="showDetail(scope.row)">{{scope.row.group_str}}</span>
                </template>
            </el-table-column>

            <el-table-column label="商户帐号">
                <template slot-scope="scope">
                    <span class="link-type" @click="showDetail(scope.row)">{{scope.row.username}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100px" align="center" v-for="(item,key) in payTypeOptions" :key="key" :label="item" v-if="key != '__ALL__'">
                <template slot-scope="scope" >
                    <em v-for="(value,index) in scope.row.pay_config" v-if="value.id == key">
                        <span v-if="value.status == 0" style="color: red">{{value.rate}}</span>
                        <span v-else>{{value.rate}}</span>
                        <span class="link-type" v-if="value.rate == 0" ><i class="el-icon-edit" @click="editChildRate(value,item,scope.row.id)"></i></span>
                    </em>
                </template>
            </el-table-column>
            <el-table-column align="center" label="可用余额">
                <template slot-scope="scope">
                    <span>{{scope.row.balance}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="冻结余额">
                <template slot-scope="scope">
                    <span>{{scope.row.blocked_balance}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="下发费率">
                <template slot-scope="scope">
                    <span>{{scope.row.remit_fee}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="状态">
                <template slot-scope="scope">
                    <span>{{scope.row.status_str}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="开户费">
                <template slot-scope="scope">
                    <span>{{scope.row.account_open_fee}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="开户费缴纳状态">
                <template slot-scope="scope">
                    <span>{{scope.row.account_open_fee_status_str}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="注册时间">
                <template slot-scope="scope">
                    <span class="link-type">{{scope.row.created_at}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" class="action-btns" width="100px" fixed="right">
                <template slot-scope="scope">
                    <el-button class="filter-item" size="mini" type="primary" icon="el-icon-document" @click="handleDetail(scope.row)" v-waves>详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :title="editRateTitle" :visible.sync="editRateVisible" width="30%">
            <el-form :model="editRateForm">
                <el-form-item :label="editRateForm.method_name" label-width="120px">
                    <el-input size="small" type="number" v-model="editRateForm.rate" style="width: 200px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="editRateVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="editRateHandle">提交</el-button>
            </div>
        </el-dialog>
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
    import Icons from "../../svg-icons/index";

    export default {
        name: 'vue_sub_account_list',
        directives: {
            waves
        },
        components: {Icons},
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
                    importance: undefined,
                    dateStart: null,//new Date(new Date().setHours(0, 0, 0, 0)),
                    dateEnd: null,
                    orderNo: null,
                    userId:null,
                    merchantId:null,
                    username:null,
                    parentUsername:'',
                    status:null,
                    accountOpenFeeStatus:null,
                    type:null,
                    remit:null,
                    sort: ''
                },
                level:[],
                summery: [],
                multipleSelection: [],
                tableKey: 0,
                constFalse: false,
                constTrue: true,
                statusOptions:[],
                accountOpenFeeStatusOptions:[],
                typeOptions:[],
                payTypeOptions:[],
                remitOptions:[],
                payChannelOptions:[],
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
                editRateForm:{
                    merchantId:null,
                    rate:null,
                    method_id:null,
                    method_name:null,
                },
                editRateVisible:false,
                editRateTitle:null
            }

        },
        filters: {
            filterMerchantPayMethod:function (data,key) {
                let value = 0;
                for(let i in data){
                    if(data[i]['id'] == key){
                        value = data[i]['rate']
                    }
                    if(data[i]['status'] != 1 ){
                        value = "<span style='color: red'>" + Number(value).toFixed(6) + "</span>"
                    }else {
                        value = "<span>" + Number(value).toFixed(6) + "</span>"
                    }
                }
                return value;
            }
        },
        created() {
            this.getFormOptions()

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
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            getList() {
                var self = this
                self.listLoading = true
                axios.post('/account/list', self.listQuery).then(
                    res => {
                        self.listLoading = false

                        if (res.code != 0) {
                            self.$message.error({message: res.message})
                        } else {
                            self.list = res.data.data
                            self.summery = res.data.summery
                            self.total = res.data.pagination.total
                            self.level = res.data.level
                        }

                    },
                    res => {
                        self.listLoading = false
                        self.$message.error({message: res.message})
                    }
                )
            },
            showDetail(row,cb) {
                return
                self = this

                axios.post('/order/detail',{id:row.id}).then(
                    res => {
                        if (res.code != 0) {
                            self.$message.error({message: res.message})
                        } else {
                            self.orderDetail = res.data
                            self.orderDetailBarCodeStr = self.orderDetail.order.order_no
                            console.log('self.orderDetailBarCodeStr',self.orderDetailBarCodeStr)
                            this.dialogOrderVisible = true
                            if(cb) cb()
                        }
                    },
                    res => {
                        self.$message.error({message: res.message})
                    }
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
            switchPayChannel(channel){
                console.log(this.multipleSelection)
            },
            switchRemitChannel(channel){
                console.log(this.multipleSelection)
            },
            switchPayType(key,val){
                this.listQuery.payType = key;
                this.getList();
                console.log(key,val)
            },
            getFormOptions(){
                self = this

                axios.post('/account/form-option-list').then(
                    res => {
                        if (res.code != 0) {
                            self.$message.error({message: res.message})
                        } else {

                            self.statusOptions=res.data.user_status
                            self.accountOpenFeeStatusOptions=res.data.account_open_fee_status
                            self.typeOptions=res.data.user_type
                            self.payTypeOptions=res.data.pay_method
                            self.remitOptions=res.data.channel
                            self.payChannelOptions=res.data.channel
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
            handleEditUser(){
                this.$router.push({name:'vue_sub_account_add'});
            },
            handleDetail(row){
                this.listQuery.merchantId = row.id;
                this.getList()
            },
            go(key=''){
                this.listQuery.merchantId = key;
                this.getList()
            },
            editChildRate(data,item,merchantId){
                this.editRateTitle = '设置 商户' + merchantId + ' ' + item + ' 收款费率'
                this.editRateVisible = true
                this.editRateForm.merchantId = merchantId
                this.editRateForm.method_id = data.id
                this.editRateForm.method_name = item
            },
            editRateHandle(){
                var self = this
                axios.post('/account/edit-child-rate',self.editRateForm).then(
                    res => {
                        // self.close()
                        if (res.code != 0) {
                            self.$message.error({message: res.message})
                        } else {
                            self.editRateVisible = false
                            self.$message.success({message: res.message})
                            self.getList();
                        }
                    },
                )
            },
            // close(){
            //
            // }
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
    .filter-container .filter-item {
        margin-bottom: 5px;
        width: 120px;
    }
    .small-padding-btn{
        padding: 12px 5px !important;
    }
    .el-button+.el-button {
        margin-left: 5px;
    }
</style>