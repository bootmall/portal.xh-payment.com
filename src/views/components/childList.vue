<template>
    <div>
        <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="数据加载中，请稍候..." border fit highlight-current-row style="width: 100%;font-size: 12px" stripe>
            <el-table-column align="center" prop="id" label="编号"></el-table-column>
            <el-table-column align="center" prop="username" label="用户名"></el-table-column>
            <el-table-column align="center" prop="nickname" label="昵称" ></el-table-column>
            <el-table-column align="center" prop="is_key_2fa" label="安全令牌"></el-table-column>
            <el-table-column align="center" prop="is_financial" label="资金密码"></el-table-column>
            <el-table-column align="center" prop="last_login_ip" label="上次登陆IP"></el-table-column>
            <el-table-column align="center" prop="last_login_time" label="上次登陆时间"></el-table-column>
            <el-table-column align="center" prop="status_name" label="状态"></el-table-column>
            <el-table-column align="center" prop="created_at" label="创建时间"></el-table-column>
            <el-table-column align="center" label="操作" class="action-btns" class-name="op-column" width="220px" fixed="right">
                <template slot-scope="scope">
                    <el-button class="filter-item" size="mini" type="primary" @click="handlePermission(scope.row)" v-waves>授权</el-button>
                    <el-dropdown size="mini">
                        <el-button type="primary" size="mini">更多操作<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                        <el-dropdown-menu slot="dropdown" size="mini">
                            <el-dropdown-item >
                                <el-button v-if="scope.row.key_2fa" size="mini" type="primary" @click="handleclear(scope.row,1)" v-waves>
                                    清空安全令牌
                                </el-button>
                            </el-dropdown-item>
                            <!--<el-dropdown-item >-->
                                <!--<el-button v-if="scope.row.financial_password_hash" size="mini" type="primary" @click="handleclear(scope.row,2)" v-waves>-->
                                    <!--清空资金密码-->
                                <!--</el-button>-->
                            <!--</el-dropdown-item>-->
                            <el-dropdown-item >
                                <el-button size="mini" type="primary" @click="handleclear(scope.row,3)" v-waves>
                                    重置登录密码
                                </el-button>
                            </el-dropdown-item>
                            <el-dropdown-item >
                                <el-button size="mini" type="primary" @click="handleStatus(scope.row)" v-waves>
                                    状态
                                </el-button>
                            </el-dropdown-item>
                            <el-dropdown-item >
                                <el-button size="mini" type="primary" @click="handleclear(scope.row,4)" v-waves>
                                    清空登陆IP
                                </el-button>
                            </el-dropdown-item>
                            <el-dropdown-item >
                                <el-button size="mini" type="primary" @click="handleBindLoginIp(scope.row,4)" v-waves>
                                    编辑登陆IP
                                </el-button>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
                title="修改状态"
                :visible.sync="statusVisible"
                width="40%"
                append-to-body>
            <template>
                <el-form :model="statusForm">
                    <el-form-item label="状态：" label-width="120px">
                        <el-radio size="small" v-for="(item,key) in statusOptions" v-model="statusForm.status" :label="key" :key="key">{{item}}</el-radio>
                    </el-form-item>
                </el-form>
            </template>
            <span slot="footer" class="dialog-footer">
                <el-button @click="statusVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateStatus">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                :title="'子账户授权-'+currentAccount.username"
                :visible.sync="permissionVisible"
                width="60%"
                append-to-body>
            <template>
                <el-checkbox-group v-model="userRole" size="small" class="permission-list">
                    <el-checkbox border :label="v.name" v-for="(v,k) in allRoles" :key="k">{{v.description}}</el-checkbox>
                </el-checkbox-group>
            </template>
            <span slot="footer" class="dialog-footer">
                <el-button @click="permissionVisible = false">取 消</el-button>
                <el-button type="primary" @click="updatePermission">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="添加/编辑子账户登录IP"
                :visible.sync="loginIpFormVisible"
                width="40%"
                append-to-body>
            <template>
                <el-form>
                    <p style="color: red;padding-left: 180px;">提示：IP有多个 以英文符号分号(;) 分隔</p>
                    <el-form-item label="登录IP地址：" label-width="180px">
                        <el-input size="small" type="textarea" :rows="3" v-model="bind_login_ip" style="width: 300px"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <span slot="footer" class="dialog-footer">
                <el-button @click="loginIpFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleclear(loginRow,loginType)">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import waves from '@/directive/waves/index.js' // 水波纹指令
    import {parseTime} from '@/utils'
    import axios from '@/utils/http'
    export default {
        name: "vue_child_list",
        directives: {
            waves
        },
        props: {
            merchantId: {
                type: Number,
                default: 1
            }
        },
        watch: {
            merchantId: function (val, oldVal) {
                if(val == null) return
                this.getList()
            },
        },
        data() {
            return {
                list: null,
                listLoading: false,
                listQuery:{
                    merchant_id:null
                },
                dialogVisible: false,
                statusVisible: false,
                statusOptions: null,
                tableKey: 0,
                statusForm: {
                    id: null,
                    status: null
                },
                currentAccount: {
                    username:''
                },
                permissionVisible: false,
                userRole: [],
                allRoles: [],
                loginIpFormVisible:false,
                bind_login_ip:null,
                loginRow:null,
                loginType:null,
            }
        },
        created() {
            this.getList()
        },
        methods: {
            updatePermission() {
                var self = this
                self.listLoading = true
                let data = {
                    uid:self.currentAccount.id,
                    roles:self.userRole,
                    master_merchant_id:self.merchantId
                }
                axios.post('/account/update-user-permission', data).then(
                    res => {
                        self.listLoading = false
                        if (res.code != 0) {
                            self.$message.error({message: res.message})
                        } else {
                            self.$message.success({message: res.message})
                            self.permissionVisible = false;
                        }
                    },
                    res => {
                        self.listLoading = false
                        self.$message.error({message: res.message})
                    }
                )
            },
            getPermissionList(row) {
                var self = this
                self.currentAccount = row
                self.listLoading = true
                let data = {
                    uid: row.id,
                    master_merchant_id:self.merchantId
                }
                axios.post('/account/user-permission-list', data).then(
                    res => {
                        self.listLoading = false

                        if (res.code != 0) {
                            self.$message.error({message: res.message})
                        } else {
                            self.permissionVisible = true
                            self.role = res.data.role
                            self.userRole = res.data.userRoles
                            self.allRoles = res.data.allRoles
                        }

                    },
                    res => {
                        self.listLoading = false
                        self.$message.error({message: res.message})
                    }
                )
            },
            getList() {
                var self = this
                self.listLoading = true
                if(self.merchantId != 1) self.listQuery.merchant_id = self.merchantId
                axios.post('/user/child-list', self.listQuery).then(
                    res => {
                        self.listLoading = false
                        if (res.code != 0) {
                            self.$message.error({message: res.message})
                        } else {
                            self.list = res.data.list;
                            self.statusOptions = res.data.statusOptions;
                            self.$emit('initMerchantIdEvent')
                        }
                    },
                )
            },
            handleStatus(row) {
                this.statusForm.id = row.id;
                this.statusForm.status = row.status;
                this.statusVisible = true;
            },
            handlePermission(row) {
                let self = this
                self.getPermissionList(row);
            },
            updateStatus() {
                let self = this
                let data = {
                    childId: self.statusForm.id,
                    status: self.statusForm.status,
                    master_merchant_id:self.merchantId
                }
                axios.post('/user/edit-child-status', data).then(
                    res => {
                        if (res.code == 0) {
                            self.$message.success({message: '操作成功'});
                            self.getList();
                            self.statusVisible = false;
                        } else {
                            self.$message.error({message: res.message});
                        }
                    }
                );
            },
            handleBindLoginIp(row,type) {
                this.loginIpFormVisible = true;
                this.loginRow = row
                this.loginType = type
                this.bind_login_ip = row.bind_login_ip == '' || row.bind_login_ip == null ? '' : JSON.parse(row.bind_login_ip).join(";")
            },
            handleclear(row,type){
                let self = this
                self.loginIpFormVisible = false;
                let tmpIp = []
                if (type == 4 && self.bind_login_ip != null && self.bind_login_ip.length > 0) {
                    tmpIp = self.bind_login_ip.split(';');
                    let regIp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                    for (let i = 0; i < tmpIp.length; i++) {
                        if (!regIp.test(tmpIp[i])) {
                            self.$message.error({message: tmpIp[i]+' IP地址格式不正确，请检查'});
                            return false;
                        }
                    }
                }
                let data = {
                    childId:row.id,
                    type:type,
                    ip: tmpIp.length > 0 ? tmpIp : '',
                    master_merchant_id:self.merchantId
                }
                self.bind_login_ip = null
                axios.post('/user/clear-child-pass-key', data).then(
                    res => {
                        if (res.code == 0) {
                            let msg = '操作成功'
                            if(type == 3){
                                msg = '操作成功，默认密码：' + res.data
                            }
                            self.$message.success({message: msg});
                            self.getList();
                            self.statusVisible = false;
                        } else {
                            self.$message.error({message: res.message});
                        }
                    }
                );
            }
        }
    }
</script>

<style scoped>
    .action-btns a {
        margin-left: 5px;
    }
    .permission-list .el-checkbox{
        margin: 5px;
    }
    .op-column .el-button {
        margin: 5px;
    }

    .op-column .cell {
        padding-left: 0;
        text-align: left;
    }
    .el-dropdown-menu--mini .el-dropdown-menu__item {
        line-height: 36px !important;
        font-size: 14px !important;
    }
</style>