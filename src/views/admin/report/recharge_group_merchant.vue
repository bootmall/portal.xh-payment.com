<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-date-picker class="filter-item input-demo"
                            v-model="listQuery.dateStart"
                            align="right"
                            type="datetime"
                            placeholder="开始日期"
                            size="small"
                            style="width: 200px;"
                            :picker-options="pickerOptions">
            </el-date-picker>
            <el-date-picker class="filter-item input-demo"
                            v-model="listQuery.dateEnd"
                            align="right"
                            type="datetime"
                            size="small"
                            style="width: 200px;"
                            placeholder="结束日期"
                            :picker-options="pickerOptions">
            </el-date-picker>
            <el-input class="filter-item input-demo" size="small" v-model="listQuery.merchant_id" placeholder="商户编号" clearable></el-input>
            <el-input size="small" class="filter-item input-demo" placeholder="商户账号" v-model="listQuery.merchant_account" clearable></el-input>
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
                style="width: 100%">
            <el-table-column label="商户ID" align="center" prop="merchant_id"></el-table-column>
            <el-table-column label="商户名" align="center" prop="merchant_account"></el-table-column>
            <el-table-column label="笔数" align="center" prop="total"></el-table-column>
            <el-table-column label="金额" align="center" prop="amount"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button @click.native="showInfo(scope.row)"  type="primary" size="mini">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                           :page-sizes="[20,30, 50,100]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <!--<el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;height: 100%">-->
            <!--<chart-bar :chart-data="rechargeGroupMerchantData"></chart-bar>-->
        <!--</el-row>-->
    </div>
</template>

<script>
    import axios from '@/utils/http'
    // import ChartBar from '../charts/components/ChartBar'
    export default {
        name: "vue_recharge_group_merchant",
        components: {
            // ChartBar,
        },
        data() {
            return {
                // rechargeGroupMerchantData:{
                //     title:'',
                //     legend:[],
                //     y_data:[],
                //     series:[],
                // },
                listQuery: {
                    dateStart: new Date(new Date().setHours(0, 0, 0, 0)),
                    dateEnd: new Date(new Date().setHours(23, 59, 59, 0)),
                    page: 1,
                    limit: 10,
                    merchant_id:null,
                    merchant_account:null,
                },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now()
                    }
                },
                tableKey:0,
                listLoading:false,
                list:null,
                total:null,
            }
        },
        created() {
            this.getList()
        },
        methods: {
            getList() {
                var self = this
                self.listLoading = true
                axios.post('/admin/report/recharge-group-merchant', self.listQuery).then(
                    res => {
                        self.listLoading = false
                        self.list = res.data.list
                        self.total = res.data.total
                        // self.rechargeGroupMerchantData = {title:'', legend:[], y_data:[], series:[{name: '充值',type: 'bar',data:[]}]}
                        // let tmps = {title:'', legend:['充值'], y_data:[], series:[{name: '充值',type: 'bar',data:[]}]};
                        // for (let i in res.data) {
                        //     tmps.y_data.push(i)
                        //     tmps.series[0].data.push(res.data[i])
                        // }
                        // tmps.title = "商户充值统计"
                        // self.$set(self, 'rechargeGroupMerchantData', tmps);
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
        }
    }
</script>

<style scoped>
    .input-demo {
        width: 13% !important;
    }
</style>