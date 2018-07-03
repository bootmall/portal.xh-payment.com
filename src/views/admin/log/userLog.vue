<template>
    <div class="components-container">
        <div class="filter-container">
            类型：
            <el-input style="width: 100px;" class="filter-item" v-model="listQuery.title"></el-input>
            用户名
            <el-input style="width: 100px;" class="filter-item" v-model="listQuery.username"></el-input>
            开始时间：
            <el-date-picker class="filter-item"
                            v-model="listQuery.dateStart"
                            align="right"
                            type="datetime"
                            placeholder="开始日期"
                            :picker-options="pickerOptions">
            </el-date-picker>
            结束时间
            <el-date-picker class="filter-item"
                            v-model="listQuery.dateEnd"
                            align="right"
                            type="datetime"
                            placeholder="结束日期"
                            :picker-options="pickerOptions">
            </el-date-picker>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
            <!--<el-button class="filter-item" type="primary" @click="editVisible = true">添加配置</el-button>-->
        </div>

        <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="数据加载中，请稍候..." border fit highlight-current-row style="width: 100%">
            <el-table-column
                    type="selection"
                    width="30">
            </el-table-column>

            <el-table-column label="类型">
                <template slot-scope="scope">
                    <span class="link-type">{{scope.row.title}}</span>
                </template>
            </el-table-column>

            <el-table-column label="订单号">
                <template slot-scope="scope">
                    <span class="link-type">{{scope.row.order_no}}</span>
                </template>
            </el-table-column>

            <el-table-column label="用户名">
                <template slot-scope="scope">
                    <span class="link-type">{{scope.row.username}}</span>
                </template>
            </el-table-column>
            <el-table-column label="请求action">
                <template slot-scope="scope">
                    <span class="link-type">{{scope.row.type}}</span>
                </template>
            </el-table-column>
            <el-table-column label="时间">
                <template slot-scope="scope">
                    <span class="link-type">{{scope.row.created_at}}</span>
                </template>
            </el-table-column>
            <el-table-column label="描述">
                <template slot-scope="scope">
                    <span class="link-type">{{scope.row.desc}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" class="action-btns">
                <template slot-scope="scope">
                    <el-button class="filter-item" size="mini" type="warning" v-waves @click="showDetailDialog(scope.row)">详情</el-button>
                </template>
            </el-table-column>

        </el-table>

        <el-dialog
                title="查看详情"
                :visible.sync="editVisible"
                width="80%">
            <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition" style="width: 100%;">
                <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="100%">
                    <colgroup>
                        <col name="el-table_2_column_1" width="20%">
                        <col name="el-table_10_column_2" width="80%">
                    </colgroup>
                    <tbody>
                    <tr class="el-table__row" v-for="(v,k) in viewModel" :key="k">
                        <td class="table_4_column_1  ">
                            <div class="cell">{{fieldLabels[k]}}</div>
                        </td>
                        <td class="table_8_column_2  ">
                            <div class="cell">{{v}}</div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">关 闭</el-button>
            </span>
        </el-dialog>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                           :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import Tinymce from '@/components/Assembly/Tinymce'
  import {parseTime} from '@/utils'
  import axios from '@/utils/http'

  export default {
    name:'vue_operation',
    components: {Tinymce, waves},
    directives: {
      waves
    },
    data() {
      return {
        editVisible: false,
        viewModel: {},
        viewModelTableData: [],
        fieldLabels: {},
        list: null,
        tableKey: 0,
        total: null,
        listLoading: true,
        statusOptions: [],
        listQuery: {
          page: 1,
          limit: 10,
          importance: undefined,
          title: null,
          sort: '',
          dateStart: null,
          dateEnd: null,
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
      }
    },
    created() {
      this.getInitData()
    },
    methods: {
      getInitData() {
        var self = this
        self.listLoading = true
        axios.post('/admin/log/user-log-list', self.listQuery).then(
          res => {
            self.listLoading = false
            if (res.code == 0) {
              self.fieldLabels = res.data.fieldLabels
              self.list = res.data.data
              self.total = res.data.pagination.total
              console.log(res.data.fieldLabels);
              console.log(self.fieldLabels);
            }

          }
        )
      },
      showDetailDialog(row) {
        // console.log(row);
        this.viewModel = row;
        for (let k in this.viewModel) {
          console.log(k,this.fieldLabels[k]);
          this.viewModelTableData.push({k: this.fieldLabels[k], v: this.viewModel[k]})
        }
        // this.viewModel.forEach((k)=>{
        //   console.log(k);
        //   self.viewModelTableData=[]
        // })
        // console.log(this.viewModelTableData)

        this.editVisible = true;
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getInitData()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getInitData()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getInitData()
      },
    }
  }
</script>

<style scoped>
    .editor-content {
        margin-top: 20px;
    }
</style>


