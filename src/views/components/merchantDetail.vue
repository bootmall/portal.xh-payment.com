<template>
    <el-dialog title="商户详情" :visible.sync="merchantDetailVisible" width="50%">
        <div class="app-container calendar-list-container">
            <div class="filter-container">
                <el-input class="filter-item" size="small" style="width: 200px;" v-model="merchantId" placeholder="商户编号"></el-input>
                <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
            </div>
            <div class="user-attr">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <div class="grid-content"><span>商户类型：</span><span>{{userInfo.group_name}}</span></div>
                    </el-col>
                    <el-col :span="8">
                        <div class="grid-content"><span>状态：</span><span>{{userInfo.status_name}}</span></div>
                    </el-col>
                    <el-col :span="8">
                        <div class="grid-content"><span>转账手续费(-1使用系统设置,0免费)：</span><span>{{userInfo.account_transfer_fee | numberFormat}}</span></div>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <div class="grid-content"><span>支持API下发：</span><span>{{userInfo.allow_api_remit}}</span></div>
                    </el-col>
                    <el-col :span="8">
                        <div class="grid-content"><span>支持后台下发：</span><span>{{userInfo.allow_manual_remit}}</span></div>
                    </el-col>
                    <el-col :span="8">
                        <div class="grid-content"><span>出款费率(元/笔)：</span><span>{{userInfo.remit_fee | numberFormat}}</span></div>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <div class="grid-content"><span>总资产：</span><span>{{userInfo.asset | numberFormat}}</span></div>
                    </el-col>
                    <el-col :span="8">
                        <div class="grid-content"><span>冻结资产：</span><span>{{userInfo.frozen_balance | numberFormat}}</span></div>
                    </el-col>
                    <el-col :span="8">
                        <div class="grid-content"><span>可用余额：</span><span>{{userInfo.balance | numberFormat}}</span></div>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <div class="grid-content"><span>资金密码设置：</span><span>{{userInfo.is_financial}}</span></div>
                    </el-col>
                    <el-col :span="8">
                        <div class="grid-content"><span>安全令牌绑定：</span><span>{{userInfo.is_key_2fa}}</span></div>
                    </el-col>
                    <el-col :span="8">
                        <div class="grid-content"><span>商户key：</span><span>{{userInfo.merchant_key}}</span></div>
                    </el-col>
                </el-row>
                <el-row :gutter="20" v-if="accountOpenInfo.fee > 0">
                    <el-col :span="8">
                        <div class="grid-content"><span>开户费：</span><span>{{accountOpenInfo.fee}}</span></div>
                    </el-col>
                    <el-col :span="8">
                        <div class="grid-content"><span>开户费订单：</span><span>{{accountOpenInfo.order_no}}</span></div>
                    </el-col>
                    <el-col :span="8">
                        <div class="grid-content" :class="{ error: accountOpenInfo.status==0 }"><span>开户费状态：</span><span>{{accountOpenInfo.status_str}}</span></div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="merchantDetailVisible = false">关 闭</el-button>
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
                this.getInitData()
            },
        },
        data() {
            return {
                userInfo: {},
                methods: {},
                listLoading:false,
                accountOpenPaid:null,
                accountOpenAmount:null,
                accountOpenInfo:null,
            }
        },
        methods:{
            getInitData() {
                let self = this
                self.listLoading = true
                axios.post('/admin/user/detail', {merchantId: self.merchantId}).then(
                    res => {
                        self.listLoading = false
                        if (res.code != 0) {
                            self.$message.error({message: res.message})
                        } else {
                            self.userInfo = res.data.userInfo
                            self.methods = res.data.methods
                            self.channelOptions = res.data.channelOptions
                            self.userStatusOptions = res.data.userStatusOptions
                            self.agentOptions = res.data.agentOptions
                            self.payMethodsOptions = res.data.payMethodsOptions

                            let methodStatus = {}
                            for (let index in res.data.methods.status) {
                                methodStatus[index] = res.data.methods.status[index].toString()
                            }
                            self.methodStatus = methodStatus
                            self.settlementType = res.data.methods.settlement_type

                            self.remitMaxFee = res.data.remitMaxFee
                            self.rechargeMaxRate = res.data.rechargeMaxRate
                            self.settlementTypeOptions = res.data.settlementType
                            self.rechargeFeeCanBeZero = res.data.rechargeFeeCanBeZero
                            self.remitFeeCanBeZero = res.data.remitFeeCanBeZero
                            self.accountOpenPaid = res.data.accountOpenPaid
                            self.accountOpenAmount = res.data.accountOpenAmount
                            self.accountOpenInfo = res.data.accountOpenInfo
                        }
                    },
                )
            },
        }
    }
</script>

<style scoped>

</style>