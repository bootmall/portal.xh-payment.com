<template>
    <div class="components-container">
        <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="数据加载中，请稍候..." border fit highlight-current-row style="width: 100%">
            <el-table-column label="银行">
                <template slot-scope="scope">
                    <span class="link-type">{{scope.row.bank_name}}</span>
                </template>
            </el-table-column>

            <el-table-column label="银行代码">
                <template slot-scope="scope">
                    <span class="link-type">{{scope.row.platform_bank_code}}</span>
                </template>
            </el-table-column>
            <el-table-column label="单次限额">
                <template slot-scope="scope">
                    <span class="link-type">{{scope.row.single_quota}}</span>
                </template>
            </el-table-column>
            <el-table-column label="日限额">
                <template slot-scope="scope">
                    <span class="link-type">{{scope.row.everyday_quota}}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime} from '@/utils'
  import axios from '@/utils/http'

  export default {
    components: {waves},
    directives: {
      waves
    },
    data() {
      return {
        list: null,
        tableKey: 0,
        total: null,
        listLoading: true,
      }
    },
    created() {
      this.getInitData()
    },
    methods: {
      getInitData() {
        var self = this
        self.listLoading = true
        axios.post('/util/bank-quota').then(
          res => {
            self.listLoading = false
            if (res.code == 0) {
              self.list = res.data
            }
          }
        )
      },
    }
  }
</script>

<style scoped>
    .editor-content {
        margin-top: 20px;
    }
</style>