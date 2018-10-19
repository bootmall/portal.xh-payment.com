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
        <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
            <chart-bar :chart-data="rechargeGroupMerchantData"></chart-bar>
        </el-row>
    </div>
</template>

<script>
    import axios from '@/utils/http'
    import ChartBar from './components/ChartBar'
    export default {
        name: "vue_recharge_group_merchant",
        components: {
            ChartBar,
        },
        data() {
            return {
                rechargeGroupMerchantData:{
                    title:'',
                    legend:[],
                    y_data:[],
                    series:[],
                },
                listQuery: {
                    dateStart: new Date(new Date().setDate(new Date().getDate()-14)),
                    dateEnd: new Date(),
                },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now()
                    }
                },
            }
        },
        created() {
            this.getList()
        },
        methods: {
            getList() {
                var self = this
                self.listLoading = true
                axios.post('/admin/echarts/recharge-group-merchant', self.listQuery).then(
                    res => {
                        if (res.data.length == 0 || res.data == null) {
                            self.$message.error({message: res.message})
                            return false
                        }
                        self.rechargeGroupMerchantData = {
                            title:'',
                            legend:[],
                            y_data:[],
                            series:[],
                        }
                        let tmps = {
                            title:'',
                            legend:[],
                            y_data:[],
                            series:[],
                        };
                        let tmpLength = Object.keys(res.data).length
                        let number = 0;
                        for (let i in res.data) {
                            let tmp = {
                                name: i,
                                type: 'bar',
                                data: res.data[i],
                                // label: seriesLabel,
                            }
                            tmps.legend.push(i)
                            tmps.y_data.push(i)
                            for (let j=1;j<tmpLength ;j++){
                                if(j/10 == 0){
                                    tmps.legend.push('')
                                }
                            }
                            tmps.series.push(tmp)
                            number++;
                        }
                        tmps.title = "商户充值统计"
                        self.$set(self, 'rechargeGroupMerchantData', tmps);
                    }
                )
            },
            handleFilter() {
                this.getList()
            },
        }
    }
</script>

<style scoped>

</style>