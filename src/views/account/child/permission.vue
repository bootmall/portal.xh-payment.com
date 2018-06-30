<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-row>
                <el-col :span="24">
                    <el-input @keyup.enter.native="handleFilter" class="filter-item" placeholder="名称" v-model="listQuery.name"></el-input>

                    <el-button class="" type="primary" v-waves icon="search" @click="handleFilter">搜索角色</el-button>
                </el-col>
            </el-row>
        </div>
        <h3>
            <el-checkbox style="width: 80px !important;" label="全选" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <el-button @click="selectReverse"  size="small" type="info" plain>反选</el-button>
            <el-button type="success" size="small" plain @click="updatePermission">确认提交</el-button>
        </h3>
        <el-checkbox-group v-model="rolePermissions" >
        <div class="permission-container" v-for="(v,k) in allPermissions">
            <!--<h4>{{v}}</h4>-->
            <h4 class="permission_group_title">{{v.name}}-{{v.description}}</h4>
            <!--<el-checkbox-group >-->
                <el-checkbox @change="handleCheckedPermissionChange" v-for="p in v.children" :label="p.name" :key="p.name">{{p.description}}</el-checkbox>
            <!--</el-checkbox-group>-->
        </div>
        </el-checkbox-group>
    </div>
</template>

<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime} from '@/utils'
  import common from '@/utils/common'
  import axios from '@/utils/http'
  import { mapGetters } from 'vuex'

  export default {
    name: 'permissionAssign',
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
        listQuery: {
          page: 1,
          limit: 10,
          importance: undefined,
          description:'',
          name:'',
          sort: ''
        },
        currentRoleDesc:'',
        role:{},
        rolePermissions: [],
        allPermissions: [],
        multipleSelection: [],
        tableKey: 0,
        constFalse: false,
        constTrue: true,
        checkAll: false,
        isIndeterminate: false,
      }
    },
    filters: {
    },
    created() {
      console.log(this.$route.params.role)
      this.listQuery.name = this.$route.params.role
      this.getList()
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
      handleCheckAllChange(val) {
        this.rolePermissions = [];
        for(let i=0; i<this.allPermissions.length;i++){
          this.rolePermissions.push(this.allPermissions[i].name)
        }
        this.isIndeterminate = false;
      },
      selectReverse() {
        let newSelect = []
        for(let i=0; i<this.allPermissions.length;i++){
          let idx = _.indexOf(this.rolePermissions, this.allPermissions[i].name)
          if(idx<0){
            newSelect.push(this.allPermissions[i].name)
          }
        }
        this.rolePermissions = newSelect
      },
      handleCheckedPermissionChange() {
        let checkedCount = this.rolePermissions.length;
        this.checkAll = checkedCount === this.allPermissions.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.allPermissions.length;
      },
      getList() {
        var self = this

        self.listLoading = true
        if(!self.listQuery.name){
          return;
        }
        axios.post('/admin/role/permissions', self.listQuery).then(
          res => {
            self.listLoading = false

            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.role = res.data.role
              // self.currentRoleDesc = self.role.name+' '+self.role.description+': 权限列表'
              self.rolePermissions = res.data.rolePermissions
              self.allPermissions = res.data.allPermissions
            }

          },
          res => {
            self.listLoading = false
            self.$message.error({message: res.message})
          }
        )
      },
      updatePermission() {
        var self = this

        self.listLoading = true
        if(!self.listQuery.name){
          return;
        }
        axios.post('/admin/role/update-permissions', {name:self.listQuery.name,permissions:self.rolePermissions}).then(
          res => {
            self.listLoading = false

            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.$message.success({message: res.message})
            }

          },
          res => {
            self.listLoading = false
            self.$message.error({message: res.message})
          }
        )
      },
      goAssign(row){
        this.$router.push({name:'vue_auth_assign',params: { role: row.name }});
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
    .el-checkbox {
        line-height: 30px;
        width: 14%;
    }
    .permission_group_title{
        display: block;
        color: #3a8ee6;
        font-size: 16px;
    }
</style>