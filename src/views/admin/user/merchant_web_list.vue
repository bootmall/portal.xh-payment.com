<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input class="filter-item select-class" placeholder="商户号" v-model="listQuery.merchant_id" clearable></el-input>
            <el-input class="filter-item select-class" placeholder="商户帐号" v-model="listQuery.merchant_name" clearable></el-input>
            <el-input class="filter-item select-class" placeholder="父帐号" v-model="listQuery.parent_name" clearable></el-input>
            <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </div>
        <el-table stripe :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="数据加载中，请稍候..." border fit highlight-current-row style="width: 100%" >
            <el-table-column prop="merchant_id" align="center" label="商户编号"></el-table-column>
            <el-table-column prop="merchant_name" align="center" label="商户账户"></el-table-column>
            <el-table-column prop="login_username" align="center" label="用户名"></el-table-column>
            <el-table-column prop="login_password" align="center" label="登陆密码"></el-table-column>
            <el-table-column prop="url" align="center" label="商户平台网址"></el-table-column>
            <el-table-column prop="created_at" align="center" label="创建时间"></el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button class="filter-item" size="mini" type="primary" @click="handleEdit(scope.row)" v-waves>编辑</el-button>
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
        <el-dialog
                title="编辑商户风控账号"
                :visible.sync="editMerchantWebVisible"
                width="600px"
                @close="close"
                :close-on-click-modal="false">
            <el-form v-model="editFrom">
                <template>
                    <el-form-item label="商户编号：" label-width="180px" style="margin-top: 20px;width: 400px">
                        {{merchantId}}
                    </el-form-item>
                    <el-form-item label="商户名称：" label-width="180px" style="margin-top: 20px;width: 400px">
                        {{merchantName}}
                    </el-form-item>
                    <el-form-item label="商户平台地址：" label-width="180px" style="margin-top: 20px;width: 400px">
                        <el-input size="small" v-model="editFrom.url" style="width: 300px"></el-input>
                    </el-form-item>
                    <el-form-item label="登陆名称：" label-width="180px" style="margin-top: 20px;width: 400px">
                        <el-input size="small" v-model="editFrom.login_username" style="width: 300px"></el-input>
                    </el-form-item>
                    <el-form-item label="登陆密码：" label-width="180px" style="margin-top: 20px;width: 400px">
                        <el-input size="small" v-model="editFrom.login_password" style="width: 300px"></el-input>
                    </el-form-item>
                </template>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="handleEdit">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
    import waves from '@/directive/waves/index.js' // 水波纹指令
    import {parseTime} from '@/utils'
    import common from '@/utils/common'
    import axios from '@/utils/http'
    import {mapGetters} from 'vuex'
    export default {
        name: "vue_user_black_list",
        directives: {
            waves
        },
        data() {
            return {
                rules: {},
                list: null,
                total: null,
                listLoading: true,
                tableKey:0,
                typeOptions: null,
                listQuery: {
                    page: 1,
                    limit: 10,
                    merchant_id: null,
                    merchant_name: null,
                    parent_name:null
                },
                editMerchantWebVisible:false,
                editFrom:{
                    merchant_id:null,
                    merchant_name:null,
                    login_username:null,
                    login_password:null,
                    url:null
                },
            }
        },
        created() {
            this.getList()
        },
        methods: {
            getList() {
                var self = this
                self.listLoading = true
                axios.post('/admin/user/merchant-web', self.listQuery).then(
                    res => {
                        self.listLoading = false

                        if (res.code != 0) {
                            self.$message.error({message: res.message})
                        } else {
                            self.list = res.data.list
                            self.total = res.data.total
                            self.typeOptions = (res.data.typeOptions)
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
            handleEdit(){
                let self = this
                axios.post('/admin/user/add_merchant_web', self.editFrom).then(
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
                this.editMerchantWebVisible = false
                this.editFrom = {
                    merchant_id:null,
                    merchant_name:null,
                    login_username:null,
                    login_password:null,
                    url:null
                }
            }
        }
    }
</script>

<style scoped>

</style>