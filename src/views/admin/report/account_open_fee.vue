<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-select class="filter-item" v-model="listQuery.month" placeholder="月份" filterable>
                <el-option
                        v-for="(item,key) in monthOptions"
                        :key="key"
                        :label="item"
                        :value="key">
                </el-option>
            </el-select>
            <el-button class="filter-item"  size="small" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </div>
        <el-table
                :key='tableKey'
                :data="list"
                v-loading="listLoading"
                element-loading-text="数据加载中，请稍候..."
                border
                fit
                highlight-current-row
                show-summary
                style="width: 100%">
            <el-table-column label="商户ID" align="center" prop="merchant_id"></el-table-column>
            <el-table-column label="商户名" align="center" prop="username"></el-table-column>
            <el-table-column label="开户数" align="center" prop="total"></el-table-column>
            <el-table-column label="开户费金额" align="center" prop="fee"></el-table-column>
            <el-table-column label="实际缴纳金额" align="center" prop="fee_paid"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button @click.native="showInfo(scope.row)"  type="primary" size="mini">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="开户费明细" :visible.sync="infoVisible" width="70%">
            <el-table :key='tableKey' :data="infoList" v-loading="listLoading" element-loading-text="数据加载中，请稍候..." border fit highlight-current-row style="width: 100%">
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
            <div v-show="!listLoading" class="pagination-container">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                               :page-sizes="[20,30, 50,100]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="infoVisible = false">关 闭</el-button>
            </div>
        </el-dialog>
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
                    limit: 10,
                    month:new Date().getMonth(),
                    agent_merchant_id:null,
                    agent_merchant_name:null,
                    // dateStart: new Date(new Date().setDate(new Date().getDate()-30)),
                    // dateEnd: new Date(),
                },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now()
                    }
                },
                openFeeTotal:null,
                monthOptions:['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                infoVisible:false,
                infoList:null,
            }
        },
        created() {
            this.getList()
        },
        methods: {
            getList() {
                var self = this
                self.listLoading = true
                axios.post('/admin/report/account-open-fee', {month:self.listQuery.month}).then(
                    res => {
                        self.listLoading = false
                        if(res.code != 0 ){
                            self.$message.error({message:res.message})
                        }else{
                            self.list = res.data
                        }
                    }
                )
            },
            handleFilter() {
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
            showInfo(row){
                var self = this
                self.infoList = null
                self.total = null
                self.listQuery.agent_merchant_name = row.username
                self.listQuery.agent_merchant_id = row.merchant_id
                axios.post('/admin/report/account-open-fee-info', self.listQuery).then(
                    res => {
                        self.listLoading = false
                        if(res.code != 0 ){
                            self.$message.error({message:res.message})
                        }else{
                            self.infoVisible = true
                            self.infoList = res.data.list
                            self.total = res.data.total
                        }
                    }
                )
            },
        }
    }
</script>

<style scoped>
    .el-tag {
        margin-top: 10px;
        margin-left: 10px;
    }
</style>