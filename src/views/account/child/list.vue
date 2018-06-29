<template>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="数据加载中，请稍候..." border fit highlight-current-row style="width: 100%;font-size: 12px" stripe>
        <!--<el-table-column align="center" fixed type="selection" width="55" ></el-table-column>-->
        <el-table-column prop="id" label="子账户编号" width="80"></el-table-column>
        <el-table-column prop="username" label="用户名" width="160"></el-table-column>
        <el-table-column prop="nickname" label="昵称" width="160"></el-table-column>
        <el-table-column prop="last_login_ip" label="上次登陆IP" width="80"></el-table-column>
        <el-table-column prop="last_login_time" label="上次登陆时间" width="80"></el-table-column>
        <el-table-column prop="status_name" label="状态" width="160"></el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="100"></el-table-column>
        <el-table-column align="center" label="操作" class="action-btns" fixed="right" width="250px">
            <template slot-scope="scope" >
                <!--<el-button class="filter-item" size="mini" type="primary" @click="handleDetail(scope.row)" v-waves>详情</el-button>-->
                <!--<a class="link-type" @click=showDetail(scope.row)>详情</a>-->
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    import waves from '@/directive/waves/index.js' // 水波纹指令
    import {parseTime} from '@/utils'
    import common from '@/utils/common'
    import axios from '@/utils/http'
    export default {
        name: "list",
        directives: {
            waves
        },
        data(){
            return{
                list:null,
                listLoading:false,
            }
        },
        created() {
            this.getList()
        },
        methods: {
            getList() {
                var self = this
                self.listLoading = true
                axios.post('/user/child-list', self.listQuery).then(
                    res => {
                        self.listLoading = false
                        if (res.code != 0) {
                            self.$message.error({message: res.message})
                        } else {
                            self.list = res.data.data
                        }
                    },
                )
            },
        }
    }
</script>

<style scoped>

</style>