<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-button  class="filter-item" @click="addhandle()" type="primary" plain>添加渠道号</el-button>
        </div>

        <el-table  stripe :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="数据加载中，请稍候..." border fit stripe highlight-current-row
                   style="width: 100%;font-size: 12px;" >
            <el-table-column align="center" label="渠道号ID">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="渠道">
                <template slot-scope="scope">
                    <span>{{scope.row.parent_name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="渠道号名称">
                <template slot-scope="scope">
                    <span>{{scope.row.channel_name}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="渠道号状态">
                <template slot-scope="scope">
                    <span v-bind:class="{ 'red': scope.row.statusName!='正常' }">{{scope.row.statusName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="商户编号" >
                <template slot-scope="scope">
                    <span  >{{scope.row.merchant_id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="出款费率" >
                <template slot-scope="scope">
                    <span  >{{scope.row.remit_fee}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" :label="item" v-for="(item,key) in methodsOptions" :key="key" >
                <template slot-scope="scope">
                    <span  >{{scope.row.pay_methods | filterMerchantPayMethod(key)}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="下发单笔上限">
                <template slot-scope="scope">
                    <span  >{{scope.row.remit_quota_pertime}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="收款单笔上限">
                <template slot-scope="scope">
                    <span  >{{scope.row.recharge_quota_pertime}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间">
                <template slot-scope="scope">
                    <span>{{scope.row.created_at}}</span>
                </template>
            </el-table-column>
            <el-table-column  width="200" align="center" label="操作" class="action-btns" fixed="right">
                <template slot-scope="scope">
                    <el-button class="filter-item" size="mini"  icon="el-icon-document" v-waves @click="editHandle(scope.row)">修改</el-button>
                    <el-button class="filter-item" size="mini"  icon="el-icon-edit" v-waves @click="showDialog(scope.row)">状态</el-button>

                </template>
            </el-table-column>

        </el-table>
        <el-dialog
                title="修改状态"
                :visible.sync="dialogVisible"
                width="50%"
                >
            <template>

                <el-radio v-for="(item,key) in channelAccountStatusOptions" :key="key" v-model="statusForm.newStatus" :label="key">{{item}}</el-radio>
            </template>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="confimStatus">确 定</el-button>
                </span>
        </el-dialog>
        <el-dialog title="渠道号编辑" :visible.sync="editVisible" width="40%" >
            <el-form :model="editForm">
                <el-form-item label="名称：" label-width="160px">
                    <el-input size="small" v-model="editForm.channel_name" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="渠道：" label-width="160px" >
                    <el-select v-model="editForm.channel_id" placeholder="请选择" @change="changeChannelInAddForm">
                        <el-option
                                v-for="(item,key) in channelOptions"
                                :key="key"
                                :label="item"
                                :value="key"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="'渠道配置-'+item" label-width="160px"  v-for="(item,key) in app_secrets_template" :key="key">
                    <el-input size="small" type="textarea" :rows="3" v-model="editForm.app_secrets[key]" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="渠道商户ID：" label-width="160px">
                    <el-input size="small" v-model="editForm.merchant_id" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="渠道APP_ID：" label-width="160px">
                    <el-input size="small" v-model="editForm.app_id" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="渠道商户账户：" label-width="160px">
                    <el-input size="small" v-model="editForm.merchant_account" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="出款费率：" label-width="160px">
                    <el-input size="small" v-model="editForm.remit_fee" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label-width="160px" v-for="(item,key) in methodsOptions" :key="key" :label="item+'：'">
                    <el-input size="small" style="width: 300px" v-model="editForm.pay_methods[key]"></el-input>
                    <!--<el-radio v-for="(value,index) in channelAccountStatusOptions" :key="index" v-model="methodStatus[key]" :label="index">{{value}}</el-radio>-->
                </el-form-item>

                <el-form-item label="单日提款限额：" label-width="160px">
                    <el-input size="small" v-model="editForm.remit_quota_perday" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="单日充值限额：" label-width="160px">
                    <el-input size="small" v-model="editForm.recharge_quota_perday" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="单次提款限额：" label-width="160px">
                    <el-input size="small" v-model="editForm.remit_quota_pertime" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="单次充值限额：" label-width="160px">
                    <el-input size="small" v-model="editForm.recharge_quota_pertime" style="width: 300px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="editVisible = false">取 消</el-button>
                <el-button size="small" type="primary" :disabled="submitBtnDisableStatus" @click="editChannelAccount">提交</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import waves from '@/directive/waves/index.js' // 水波纹指令
    import {parseTime} from '@/utils'
    import common from '@/utils/common'
    import axios from '@/utils/http'
    import { mapGetters } from 'vuex'

    export default {
        name: 'vue_channel_account',
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
                dialogVisible:false,
                editVisible:false,
                channelAccountStatusOptions:[],
                submitBtnDisableStatus:false,
                channelOptions:[],
                methodsOptions:[],
                methodStatus:[],
                statusForm:{
                    id:null,
                    oldStatus:null,
                    newStatus:null
                },
                app_secrets_template: {},
                editForm:{
                    id:null,
                    channel_name:null,//渠道名称
                    channel_id:null,//三方渠道ID
                    merchant_account:null,//三方渠道对应的商户账户
                    merchant_id:null,//三方渠道对应的商户ID
                    app_id:null,//三方渠道对应的APPID
                    app_secrets:{},//三方渠道对应的配置
                    methods:null,//支持的支付方式,json
                    remit_fee:null,//提现费率
                    pay_methods:[],
                    remit_quota_perday:null,//单日提款限额
                    recharge_quota_perday:null,//单日充值限额
                    recharge_quota_pertime:null,//单次充值限额
                    remit_quota_pertime:null,//单次提款限额
                },
                tableKey: 0,
                constFalse: false,
                constTrue: true,
            }
        },
        filters: {
            filterMerchantPayMethod:function (data,key) {
                let value = 0;
                for(let i in data){
                    if(data[i]['id'] == key){
                        value = data[i]['rate']
                    }
                }
                if(value==0){
                    return '-'
                }else{
                  return Number(value).toFixed(6);
                }

            }
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
          changeChannelInAddForm(channelId){
            let template = JSON.parse(this.channelSecretTemplates[channelId])
            this.app_secrets_template = JSON.parse(JSON.stringify(template))
            this.editForm.app_secrets = template
          },
            getList() {
                var self = this

                self.listLoading = true

                axios.post('/admin/channel/account-list', self.listQuery).then(
                    res => {
                        self.listLoading = false

                        if (res.code != 0) {
                            self.$message.error({message: res.message})
                        } else {
                            self.list = res.data.list
                            self.channelAccountStatusOptions = res.data.channelAccountStatusOptions
                            self.channelOptions = res.data.channelOptions
                            self.methodsOptions = res.data.methodsOptions
                            self.channelSecretTemplates = res.data.channelSecretTemplates
                        }

                    },
                    res => {
                        self.listLoading = false
                        self.$message.error({message: res.message})
                    }
                )
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
            showDialog(row){

                this.dialogVisible = true
                this.statusForm.oldStatus = this.statusForm.newStatus = row.status.toString()
                this.statusForm.id = row.id;
            },
            closeDialog(){
              this.dialogVisible = false;
            },
            confimStatus(){
                var self = this;
                if(self.statusForm.newStatus == self.statusForm.oldStatus){
                    return self.closeDialog();
                }
                let data = {
                    status:self.statusForm.newStatus,
                    id:self.statusForm.id
                }
                axios.post('/admin/channel/account-status', data).then(
                    res => {
                        self.listLoading = false

                        if (res.code != 0) {
                            self.$message.error({message: res.message})
                        } else {
                            self.getList();
                            self.$message.success('修改状态成功');
                        }
                    },
                    res => {
                        self.listLoading = false
                        self.$message.error({message: res.message})
                    }
                )
                this.closeDialog();
            },
            editHandle(row){
                this.editVisible = true;
                this.editForm.id = row.id;
                this.editForm.channel_name = row.channel_name;
                this.editForm.channel_id = row.channel_id;
                this.editForm.merchant_id = row.merchant_id;
                this.editForm.merchant_account = row.merchant_account;
                this.editForm.app_secrets = row.app_secrets;
                this.app_secrets_template = row.app_secrets_template;

                this.editForm.remit_fee = row.remit_fee;
                for (let i in row.pay_methods) {
                    this.editForm.pay_methods[row.pay_methods[i].id] = row.pay_methods[i].rate;
                    // this.methodStatus[row.pay_methods[i].id] = row.pay_methods[i].status.toString()
                }
                this.editForm.remit_quota_perday = row.remit_quota_perday;
                this.editForm.recharge_quota_perday = row.recharge_quota_perday;
                this.editForm.recharge_quota_pertime = row.recharge_quota_pertime;
                this.editForm.remit_quota_pertime = row.remit_quota_pertime;
            },
            editChannelAccount(){
                let self = this
                self.submitBtnDisableStatus = true
                let payMethods = []
                for (let i in self.editForm.pay_methods) {
                    payMethods.push({id: i, rate: self.editForm.pay_methods[i]})
                }
                let data = {
                    id:self.editForm.id,
                    channelId:self.editForm.channel_id,
                    channelName:self.editForm.channel_name,
                    merchantId:self.editForm.merchant_id,
                    merchantAccount:self.editForm.merchant_account,
                    appSecrets:self.editForm.app_secrets,
                    remitFee:self.editForm.remit_fee,
                    pay_methods:payMethods,
                    remitQuotaPerday:self.editForm.remit_quota_perday,
                    rechargeQuotaPerday:self.editForm.recharge_quota_perday,
                    rechargeQuotaPertime:self.editForm.recharge_quota_pertime,
                    remitQuotaPertime:self.editForm.remit_quota_pertime
                };
                axios.post('/admin/channel/account-edit', data).then(
                    res => {
                        self.listLoading = false
                        if (res.code != 0) {
                            self.$message.error({message: res.message})
                            self.submitBtnDisableStatus = false
                        } else {
                            self.getList();
                            self.$message.success('编辑成功');
                            self.editVisible = false;
                            self.submitBtnDisableStatus = false
                        }
                    },
                )
            },
            addhandle(){
                this.editForm={
                    id:null,
                    channel_name:null,//渠道名称
                    channel_id:null,//三方渠道ID
                    merchant_account:null,//三方渠道对应的商户账户
                    merchant_id:null,//三方渠道对应的商户ID
                    app_id:null,//三方渠道对应的APPID
                    app_secrets:null,//三方渠道对应的APPID
                    remit_fee:null,//三方渠道对应的APPID
                    pay_methods:[],
                    remit_quota_perday:null,//单日提款限额
                    recharge_quota_perday:null,//单日充值限额
                    recharge_quota_pertime:null,//单次充值限额
                    remit_quota_pertime:null,//单次提款限额
                };
                this.methodStatus = []
                this.editVisible = true;
            }
        }
    }
</script>

<style>
    .red {color: #F56C6C}
    .action-btns a {
        margin-left: 5px;
    }
    .el-table td, .el-table th {
        padding: 5px 0 !important;
    }
    .el-form-item {
        margin-bottom: 5px;
    }
</style>