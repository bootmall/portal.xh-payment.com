<template>
    <div class="components-container">
        <a :href="data.document_link" target="_blank"><el-button type="primary">点击下载接口文档</el-button></a>
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
        data:{}
      }
    },
    created() {
      this.getInitData()
    },
    methods: {
      getInitData() {
        var self = this
        self.listLoading = true
        axios.post('/util/document').then(
          res => {
            self.listLoading = false
            if (res.code == 0) {
              self.data = res.data
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