<!--渠道管理-->
<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input class="filter-item" size="small" style="width: 200px;" v-model="listQuery.name" placeholder="名称" clearable></el-input>
            <el-button class="filter-item" size="small" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
        </div>

        <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="数据加载中，请稍候..." border fit highlight-current-row
                  style="font-size: 12px" stripe>
            <!--<el-table-column align="center" fixed type="selection" width="55" ></el-table-column>-->
            <el-table-column prop="id" label="编号"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column align="center" :label="item + key" v-for="(item,key) in payMethodsOptions" :key="key">
                <template slot-scope="scope">
                    <em v-if="scope.row.pay_methods_ids.indexOf(Number(key)) != -1">支持</em>
                    <em v-else>-</em>
                </template>
            </el-table-column>
            <el-table-column prop="server_ips" label="服务器IP"></el-table-column>
            <el-table-column align="center" label="操作" class="action-btns">
                <template slot-scope="scope">
                    <el-button class="filter-item" size="mini" type="warning" v-waves @click="showEditDialog(scope.row)">设置IP</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog
                title="编辑渠道信息"
                :visible.sync="editVisible"
                width="60%">
            <template>
                <el-form :model="viewModel">
                    <el-form-item label="服务器IP">
                        <el-input
                                type="textarea"
                                :rows="2"
                                placeholder="服务器IP"
                                v-model="viewModel.server_ips">
                        </el-input>
                    </el-form-item>
                </el-form>
            </template>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="edit">确 定</el-button>
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

  const defaultModel = {
    id: '',
    server_ips: '',
  }
  export default {
    name: "vue_channel_list",
    directives: {
      waves
    },
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        editVisible: false,
        viewModel: defaultModel,
        listQuery: {
          name: null,
        },
        payMethodsOptions: {},
        tableKey: 0,
      }
    },
    created() {
      this.getList()
    },
    methods: {
      edit() {
        axios.post('/admin/channel/edit', this.viewModel).then(
          res => {
            if (res.code == 0) {
              this.$message.success({message: '操作成功'})
              this.viewModel = defaultModel
              this.getList()
              this.editVisible = false;
            } else {
              this.$message.error({message: res.message})
            }
          }
        );
      },
      showEditDialog(row) {
        this.viewModel = row;
        this.editVisible = true;
      },
      getList() {
        var self = this
        self.listLoading = true
        axios.post('/admin/channel/list', self.listQuery).then(
          res => {
            self.listLoading = false
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.list = res.data.data;
              self.payMethodsOptions = res.data.payMethodsOptions;
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
      handelBank(row) {

      }
    },
  }
</script>

<style scoped>

</style>