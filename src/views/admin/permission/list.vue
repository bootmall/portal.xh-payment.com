<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-row>
                <el-col :span="24">
                    <el-input @keyup.enter.native="handleFilter" class="filter-item" placeholder="名称" v-model="listQuery.name"></el-input>
                    <el-input @keyup.enter.native="handleFilter" class="filter-item" placeholder="描述" v-model="listQuery.description"></el-input>
                    <el-select class="filter-item" v-model="listQuery.type" placeholder="类型">
                        <el-option
                                v-for="(item,key) in typeOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>

                    <el-button class="" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
                    <el-button class="" type="success" v-waves icon="el-icon-refresh" @click="refreshPermissionList">刷新权限列表</el-button>
                    <!--<el-button class="" type="success" v-waves icon="el-icon-refresh" @click="导入菜单权限">刷新权限列表</el-button>-->
                </el-col>
            </el-row>
        </div>

        <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="数据加载中，请稍候..." border fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    width="30">
            </el-table-column>

            <el-table-column label="名称">
                <template slot-scope="scope">
                    <span class="link-type" @click="showDetail(scope.row)">{{scope.row.name}}</span>
                </template>
            </el-table-column>

            <el-table-column label="描述">
                <template slot-scope="scope">
                    <span class="link-type" @click="showDetail(scope.row)">{{scope.row.description}}</span>
                </template>
            </el-table-column>

            <el-table-column label="子权限">
                <template slot-scope="scope">
                    <span class="link-type" @click="showDetail(scope.row)">{{scope.row.children_num}}</span>
                </template>
            </el-table-column>

            <el-table-column label="前端url地址">
                <template slot-scope="scope">
                    <span class="link-type" @click="showDetail(scope.row)">{{scope.row.url_path}}</span>
                </template>
            </el-table-column>

            <el-table-column label="绑定api地址">
                <template slot-scope="scope">
                    <span class="link-type" @click="showDetail(scope.row)">{{scope.row.auth_actions}}</span>
                </template>
            </el-table-column>


            <el-table-column align="center" label="备注" class="action-btns">
                <template slot-scope="scope">
                    <span class="link-type" @click="showNotifyRet(scope.row)">{{scope.row.bak}}</span>
                </template>
            </el-table-column>

        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
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

  export default {
    name: 'vue_auth_permissions',
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
          limit: 20,
          description:null,
          name:null,
          type:null,
          sort: ''
        },
        summery: [],
        multipleSelection: [],
        tableKey: 0,
        constFalse: false,
        constTrue: true,
        typeOptions:[
          {id:'0',name:'全部'},
          {id:'1',name:'后端权限'},
          {id:'2',name:'菜单权限'},
        ],
      }
    },
    filters: {
    },
    created() {
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
      refreshPermissionList() {
        var self = this

        self.listLoading = true

        axios.post('/admin/permission/refresh').then(
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
      getList() {
        var self = this

        self.listLoading = true

        axios.post('/admin/permission/list', self.listQuery).then(
          res => {
            self.listLoading = false

            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.list = res.data.data
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
</style>