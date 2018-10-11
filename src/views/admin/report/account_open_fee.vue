<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-date-picker class="filter-item"
                            v-model="listQuery.dateStart"
                            align="right"
                            type="date"
                            placeholder="开始日期"
                            size="small"
                            style="width: 200px;"
                            :picker-options="pickerOptions">
            </el-date-picker>
            <el-date-picker class="filter-item"
                            v-model="listQuery.dateEnd"
                            align="right"
                            type="date"
                            size="small"
                            style="width: 200px;"
                            placeholder="结束日期"
                            :picker-options="pickerOptions">
            </el-date-picker>
            <el-button class="filter-item"  size="small" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </div>
        <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="数据加载中，请稍候..." border fit highlight-current-row style="width: 100%">
            <el-table-column label="商户ID" prop="user_id"></el-table-column>
            <el-table-column label="商户名" prop="username"></el-table-column>
            <el-table-column label="上级代理" prop="parent_agent_name"></el-table-column>
            <el-table-column label="状态" prop="status_str"></el-table-column>
            <el-table-column label="开户费金额" prop="fee"></el-table-column>
            <el-table-column label="实际缴纳金额" prop="fee_paid"></el-table-column>
            <el-table-column label="缴纳时间" prop="paid_at"></el-table-column>
            <el-table-column label="缴纳订单号" prop="order_no"></el-table-column>
            <el-table-column label="订单生成时间" prop="order_created_at"></el-table-column>
            <el-table-column label="创建时间" prop="created_at"></el-table-column>
        </el-table>
        <el-row>
            <el-tag type="warning" v-for="(item,key) in openFeeTotal" :key="key">
                <span style="color: blue;font-weight: bold">{{item.name}}</span>:
                <span style="color: red;font-weight: bold">{{item.open_fee}}</span>
            </el-tag>
        </el-row>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                           :page-sizes="[20,30, 50,100]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import axios from '@/utils/http'
    export default {
        name: "vue_account_open_fee",
        data() {
            return {
                list:null,
                tableKey: 0,
                total: null,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 20,
                    dateStart: new Date(new Date().setDate(new Date().getDate()-30)),
                    dateEnd: new Date(),
                },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now()
                    }
                },
                openFeeTotal:null,
            }
        },
        created() {
            this.getList()
        },
        methods: {
            getList() {
                var self = this
                self.listLoading = true
                axios.post('/admin/report/account-open-fee', self.listQuery).then(
                    res => {
                        self.listLoading = false
                        if(res.code != 0 ){
                            self.$message.error({message:res.message})
                        }else{
                            self.list = res.data.list
                            self.openFeeTotal = res.data.parentTotal
                            self.total = res.data.total
                        }
                    }
                )
            },
            handleFilter() {
                this.getList()
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

</style>