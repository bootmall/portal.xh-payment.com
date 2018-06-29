<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-button class="filter-item" size="small" @click="dialogVisible = true" type="primary" plain>添加子账号</el-button>
        </div>
        <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="数据加载中，请稍候..." border fit highlight-current-row
                  style="width: 100%;font-size: 12px" stripe>
            <!--<el-table-column align="center" fixed type="selection" width="55" ></el-table-column>-->
            <el-table-column align="center" prop="id" label="编号" width="120"></el-table-column>
            <el-table-column align="center" prop="username" label="用户名" width="120"></el-table-column>
            <el-table-column align="center" prop="nickname" label="昵称" width="120"></el-table-column>
            <el-table-column align="center" prop="is_key_2fa" label="是否设置安全令牌" width="160"></el-table-column>
            <el-table-column align="center" prop="is_financial" label="是否设置资金密码" width="160"></el-table-column>
            <el-table-column align="center" prop="last_login_ip" label="上次登陆IP" width="180"></el-table-column>
            <el-table-column align="center" prop="last_login_time" label="上次登陆时间" width="180"></el-table-column>
            <el-table-column align="center" prop="status_name" label="状态" width="80"></el-table-column>
            <el-table-column align="center" prop="created_at" label="创建时间" width="180"></el-table-column>
            <el-table-column align="center" label="操作" class="action-btns">
                <template slot-scope="scope">
                    <el-button class="filter-item" v-if="scope.row.key_2fa" size="mini" type="primary" @click="handleclear(scope.row,1)" v-waves>清空安全令牌</el-button>
                    <el-button class="filter-item" v-if="scope.row.financial_password_hash" size="mini" type="primary" @click="handleclear(scope.row,2)" v-waves>清空资金密码</el-button>
                    <el-button class="filter-item" size="mini" type="primary" @click="handleclear(scope.row,3)" v-waves>重置登录密码</el-button>
                    <el-button class="filter-item" size="mini" type="primary" @click="handlePermission(scope.row)" v-waves>授权</el-button>
                    <el-button class="filter-item" size="mini" type="primary" @click="handleStatus(scope.row)" v-waves>状态</el-button>
                    <!--<a class="link-type" @click=showDetail(scope.row)>详情</a>-->
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
                title="添加子账号"
                :visible.sync="dialogVisible"
                width="40%">
            <template>
                <el-form :model="addForm">
                    <dd style="color: red;">提示：用户名 6到16位（字母，数字，下划线，减号）</dd>
                    <el-form-item label="用户名：" label-width="120px">
                        <el-input size="small" v-model="addForm.username" style="width: 200px"></el-input>
                    </el-form-item>
                    <el-form-item label="昵称：" label-width="120px">
                        <el-input size="small" v-model="addForm.nickname" style="width: 200px"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱：" label-width="120px">
                        <el-input size="small" type="email" v-model="addForm.email" style="width: 200px"></el-input>
                    </el-form-item>
                    <el-form-item label="状态：" label-width="120px">
                        <el-radio size="small" v-for="(item,key) in statusOptions" v-model="addForm.status" :label="key" :key="key">{{item}}</el-radio>
                    </el-form-item>
                </el-form>
            </template>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addHandle">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="修改状态"
                :visible.sync="statusVisible"
                width="40%">
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
                width="60%">
            <template>
                <el-checkbox-group v-model="userRole" size="small">
                    <el-checkbox border :label="v.name" v-for="(v,k) in allRoles" :key="k">{{v.description}}</el-checkbox>
                </el-checkbox-group>
                <!--<el-radio-group v-model="userRole" size="small">-->
                    <!--<el-radio border :label="v.name" v-for="(v,k) in allRoles" :key="k">{{v.description}}</el-radio>-->
                <!--</el-radio-group>-->
            </template>
            <span slot="footer" class="dialog-footer">
                <el-button @click="permissionVisible = false">取 消</el-button>
                <el-button type="primary" @click="updatePermission">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime} from '@/utils'
  import common from '@/utils/common'
  import axios from '@/utils/http'

  export default {
    name: "vue_account_index",
    directives: {
      waves
    },
    data() {
      return {
        list: null,
        listLoading: false,
        dialogVisible: false,
        statusVisible: false,
        statusOptions: null,
        tableKey: 0,
        addForm: {
          username: null,
          nickname: null,
          email: null,
          status: '0',
        },
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
      }
    },
    created() {
      this.getList()
    },
    methods: {
      updatePermission() {
        var self = this

        self.listLoading = true
        axios.post('/account/update-user-permission', {uid:self.currentAccount.id,roles:self.userRole}).then(
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
        axios.post('/account/user-permission-list', {uid: row.id}).then(
          res => {
            self.listLoading = false

            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.permissionVisible = true
              self.role = res.data.role
              // self.currentRoleDesc = self.role.name+' '+self.role.description+': 权限列表'
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
        axios.post('/user/child-list', self.listQuery).then(
          res => {
            self.listLoading = false
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.list = res.data.list;
              self.statusOptions = res.data.statusOptions;
            }
          },
        )
      },
      addHandle() {
        let self = this;
        let reg = /^[a-zA-Z0-9_-]{6,16}$/;
        if (!reg.test(self.addForm.username)) {
          self.$message.error({message: '用户名格式不正确'})
          return;
        }
        let regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;

        if (self.addForm.email != null && !regEmail.test(self.addForm.email)) {
          self.$message.error({message: '邮箱格式错误'})
          return false;
        }
        let data = {
            username: self.addForm.username,
            nickname: self.addForm.nickname,
            email: self.addForm.email
        };
        axios.post('/user/add-child', data).then(
          res => {
            if (res.code == 0) {
              self.$message.success({message: '添加成功'});
              self.addForm.username = null;
              self.addForm.nickname = null;
              self.addForm.email = null;
              self.getList();
              self.dialogVisible = false;
            } else {
              self.$message.error({message: res.message});
            }
          }
        );
      },
      handleStatus(row) {
        this.statusForm.id = row.id;
        this.statusForm.status = row.status;
        this.statusVisible = true;
      },
      handlePermission(row) {
        let self = this
        self.getPermissionList(row);
        // this.$router.push({name: 'vue_account_permission', query: {merchantId: row.id}});
      },
      updateStatus() {
          let self = this
        let data = {
          childId: self.statusForm.id,
          status: self.statusForm.status,
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
        handleclear(row,type){
          let self = this
          let data = {
              childId:row.id,
              type:type
          }
            axios.post('/user/clear-child-pass-key', data).then(
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
        }
    }
  }
</script>

<style scoped>
    .el-dialog__header{
        padding-top: 10px !important;
    }
    .el-dialog__body{
        padding-top: 10px !important;
    }
    .permission_group_title{
        display: block;
        color: #3a8ee6;
        font-size: 16px;
    }
</style>