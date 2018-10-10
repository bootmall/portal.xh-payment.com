<template>
    <el-dialog title="商户详情" :visible.sync="merchantDetailVisible" width="60%" @close="close">
        <div class="app-container calendar-list-container">
            <div class="filter-container">
                <el-input class="filter-item" size="small" style="width: 200px;" v-model="detailQuery.merchantId" placeholder="商户编号"></el-input>
                <el-input class="filter-item" size="small" style="width: 200px;" v-model="detailQuery.merchant_username" placeholder="商户账户"></el-input>
                <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
            </div>
            <el-tabs v-model="tabs_name" type="card">
                <el-tab-pane label="基本信息" name="merchantInfo">
                    <div v-if="userInfo.agent">
                        <el-row :gutter="20"><el-col :span="24" ><span>商户层级：</span><span>{{userInfo.agent}}</span></el-col></el-row>
                    </div>
                    <div class="user-attr">
                        <el-row :gutter="20">
                            <el-col :span="7">
                                <div class="grid-content"><span>商户号：</span><span>{{userInfo.id}}</span></div>
                            </el-col>
                            <el-col :span="7">
                                <div class="grid-content"><span>商户名：</span><span>{{userInfo.username}}</span></div>
                            </el-col>
                            <el-col :span="10">
                                <div class="grid-content"><span>商户类型：</span><span>{{userInfo.group_name}}</span></div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="7">
                                <div class="grid-content"><span>状态：</span><span>{{userInfo.status_name}}</span></div>
                            </el-col>
                            <el-col :span="7">
                                <div class="grid-content"><span>创建时间：</span><span>{{userInfo.created_at}}</span></div>
                            </el-col>
                            <el-col :span="10">
                                <div class="grid-content"><span>转账手续费(-1使用系统设置,0免费)：</span><span>{{userInfo.account_transfer_fee | numberFormat}}</span></div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="7">
                                <div class="grid-content"><span>支持API下发：</span><span>{{userInfo.allow_api_remit_str}}</span></div>
                            </el-col>
                            <el-col :span="7">
                                <div class="grid-content"><span>支持后台下发：</span><span>{{userInfo.allow_manual_remit_str}}</span></div>
                            </el-col>
                            <el-col :span="10">
                                <div class="grid-content"><span>出款费率(元/笔)：</span><span>{{userInfo.remit_fee | numberFormat}}</span></div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="7">
                                <div class="grid-content"><span>总资产：</span><span>{{userInfo.asset | numberFormat}}</span></div>
                            </el-col>
                            <el-col :span="7">
                                <div class="grid-content"><span>冻结资产：</span><span>{{userInfo.frozen_balance | numberFormat}}</span></div>
                            </el-col>
                            <el-col :span="10">
                                <div class="grid-content"><span>可用余额：</span><span>{{userInfo.balance | numberFormat}}</span></div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" v-if="accountOpenAmount > 0">
                            <el-col :span="7">
                                <div class="grid-content"><span>开户费：</span><span>{{accountOpenAmount}}</span></div>
                            </el-col>
                            <el-col :span="7">
                                <div class="grid-content"><span>开户费订单：</span><span>{{accountOpenInfo.order_no}}</span></div>
                            </el-col>
                            <el-col :span="10">
                                <div class="grid-content" :class="{ error: accountOpenInfo.status==0 }"><span>开户费状态：</span><span>{{accountOpenInfo.status_str}}</span></div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="7">
                                <div class="grid-content"><span>资金密码设置：</span><span>{{userInfo.is_financial}}</span></div>
                            </el-col>
                            <el-col :span="7">
                                <div class="grid-content"><span>安全令牌绑定：</span><span>{{userInfo.is_key_2fa}}</span></div>
                            </el-col>
                        </el-row>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="收款费率" name="methodsInfo">
                    <div>
                        <span><h4>上级支付类型--费率</h4></span>
                        <div class="rate-list">
                            <el-button :type="methods.status_name[key]=='停用'?'warning':'success'" v-for="(item,key) in parentMethods" :key="key" align="center" class="rate-button" >
                                <span class="rate-list-name">{{methods.name[key]}}</span>:{{item | numberFormat}}
                            </el-button>
                        </div>
                    </div>
                    <span><h4>支付类型--费率</h4></span>
                    <div class="rate-list">
                        <el-button :type="methods.status_name[key]=='停用'?'warning':'success'" v-for="(item,key) in methods.rate" :key="key" align="center" class="rate-button" >
                            <span class="rate-list-name">{{methods.name[key]}}</span>:{{item | numberFormat}}
                        </el-button>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <el-button type="primary" @click="handleResetLoginPass">重置登录密码</el-button>
            <el-button type="primary" @click="handleClearPass">清除资金密码</el-button>
            <el-button type="primary" @click="handleUnbind">解绑安全令牌</el-button>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">关 闭</el-button>
        </div>
    </el-dialog>

</template>

<script>
    import waves from '@/directive/waves/index.js' // 水波纹指令
    import {parseTime} from '@/utils'
    import axios from '@/utils/http'
    export default {
        name: "vue_merchant_detail",
        directives: {
            waves
        },
        props: {
            merchantId: {
                type: Number,
                default: 1
            }
        },
        filters: {
            numberFormat: function (value) {
                if (!value) value = 0
                value = Number(value).toFixed(6);
                return value;
            }
        },
        watch: {
            merchantId: function (val, oldVal) {
                if(val == null) return
                this.detailQuery.merchantId = val
                this.getInitData()
            },
        },
        data() {
            return {
                userInfo: {},
                methods: {},
                parentMethods: {},
                listLoading:false,
                accountOpenPaid:null,
                accountOpenAmount:null,
                accountOpenInfo:null,
                merchantDetailVisible:false,
                detailQuery:{
                    merchantId:null,
                    merchant_username:null
                },
                tabs_name:'merchantInfo',
            }
        },
        methods:{
            getInitData() {
                var self = this
                self.listLoading = true
                axios.post('/admin/user/detail', self.detailQuery).then(
                    res => {
                        self.listLoading = false
                        if (res.code != 0) {
                            self.$message.error({message: res.message})
                        } else {
                            self.merchantDetailVisible = true
                            self.userInfo = res.data.userInfo
                            self.methods = res.data.methods
                            self.parentMethods = res.data.parentMethods
                            self.accountOpenPaid = res.data.accountOpenPaid
                            self.accountOpenAmount = res.data.accountOpenAmount
                            self.accountOpenInfo = res.data.accountOpenInfo
                        }
                    },
                )
            },
            handleFilter() {
                this.getInitData()
            },
            close(){
                this.merchantDetailVisible = false
                this.detailQuery = {
                    merchantId:null,
                    merchant_username:null
                }
                this.$emit('initMerchantIdEvent')
            },
            handleResetLoginPass() {
                let self = this
                self.$confirm('此操作将重置用户密码, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    let data = {
                        merchantId: this.userInfo.id,
                        type: 5
                    };
                    axios.post('/admin/user/clear-unbind-update', data).then(
                        res => {
                            if (res.code == 0) {
                                self.$message.success({message: '登录密码重置成功'});
                            } else {
                                self.$message.error({message: res.message});
                                self.getInitData()
                            }
                        }
                    )

                }).catch(() => {
                    self.$message({
                        type: 'warning',
                        message: '已取消操作'
                    });
                });

            },
            handleClearPass() {
                if (this.userInfo.financial_password_hash_len <= 0) {
                    this.$message.error({message: '该商户还没有设置资金密码'});
                    return;
                }

                let self = this
                self.$confirm('此操作将清除资金密码, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    let data = {
                        merchantId: this.userInfo.id,
                        type: 1
                    };
                    axios.post('/admin/user/clear-unbind-update', data).then(
                        res => {
                            if (res.code == 0) {
                                self.$message.success({message: '资金密码已清除'});
                            } else {
                                self.$message.error({message: res.message});
                                self.getInitData()
                            }
                        }
                    )

                }).catch(() => {
                    self.$message({
                        type: 'warning',
                        message: '已取消操作'
                    });
                });
            },
            handleUnbind() {
                if (this.userInfo.key_2fa_len <= 0) {
                    this.$message.error({message: '该商户还没有绑定安全令牌'});
                    return;
                }

                let self = this
                self.$confirm('此操作将清解绑安全令牌, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    let data = {
                        merchantId: self.userInfo.id,
                        type: 2
                    };
                    axios.post('/admin/user/clear-unbind-update', data).then(
                        res => {
                            if (res.code == 0) {
                                self.$message.success({message: '安全令牌已解绑'});
                            } else {
                                self.$message.error({message: res.message});
                                self.getInitData()
                            }
                        }
                    )

                }).catch(() => {
                    self.$message({
                        type: 'warning',
                        message: '已取消操作'
                    });
                });

            },
        }
    }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
    .rate-list {
        text-align: center;
        .el-alert__title {
            font-size: 18px !important;
        }
        .el-button--medium {
            padding: 5px 5px;
            color: #ccc;
            margin-bottom: 10px;
            margin-left: 20px;
            width: 16%;
        }
        .rate-list-name {
            color: #ffffff;
        }
    }
</style>