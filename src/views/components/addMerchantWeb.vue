<template>
    <el-dialog
            title="添加商户风控账号"
            :visible.sync="addMerchantWebVisible"
            width="600px"
            @close="close"
            :close-on-click-modal="false">
        <el-form v-model="addFrom">
            <template>
                <el-form-item label="商户编号：" label-width="180px" style="margin-top: 20px;width: 400px">
                    {{merchantId}}
                </el-form-item>
                <el-form-item label="商户名称：" label-width="180px" style="margin-top: 20px;width: 400px">
                    {{merchantName}}
                </el-form-item>
                <el-form-item label="商户平台地址：" label-width="180px" style="margin-top: 20px;width: 400px">
                    <el-input size="small" v-model="addFrom.url" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="登陆名称：" label-width="180px" style="margin-top: 20px;width: 400px">
                    <el-input size="small" v-model="addFrom.login_username" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="登陆密码：" label-width="180px" style="margin-top: 20px;width: 400px">
                    <el-input size="small" v-model="addFrom.login_password" style="width: 300px"></el-input>
                </el-form-item>
            </template>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="handleAdd">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import waves from '@/directive/waves/index.js' // 水波纹指令
    import {parseTime} from '@/utils'
    import axios from '@/utils/http'
    export default {
        name: "vue_add_merchant_web",
        directives: {
            waves
        },
        props: {
            merchantId: {
                type: String,
                default: ''
            },
            merchantName:{
                type:String,
                default:''
            }
        },
        watch: {
            merchantId: function (val, oldVal) {
                if(val == null) return
                this.addFrom.merchant_id = val
                this.addFrom.merchant_name = this.merchantName
                this.addMerchantWebVisible = true
            },
        },
        data() {
            return {
                addMerchantWebVisible: false,
                addFrom:{
                    merchant_id:null,
                    merchant_name:null,
                    login_username:null,
                    login_password:null,
                    url:null
                },
            }
        },
        methods:{
            handleAdd(){
                let self = this
                axios.post('/admin/user/add_merchant_web', self.addFrom).then(
                    res => {
                        self.close()
                        if (res.code == 0) {
                            self.$message.success({message: '操作成功'});
                        } else {
                            self.$message.error({message: res.message});
                        }
                    }
                );
            },
            close(){
                this.addMerchantWebVisible = false
                this.addFrom = {
                    merchant_id:null,
                    merchant_name:null,
                    login_username:null,
                    login_password:null,
                    url:null
                }
                this.$emit('initMerchantIdEvent')
            }
        }
    }
</script>

<style scoped>

</style>