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
            <charge-trend-hour-chart :chart-data="lineChartData"></charge-trend-hour-chart>
        </el-row>
    </div>
</template>
<script>
    import axios from '@/utils/http'
    import ChargeTrendHourChart from './components/ChargeTrendHourChart'
    export default {
        name: "vue_charge_trend_hour",
        components: {
            ChargeTrendHourChart,
        },
        data() {
            return {
                lineChartData:{name:[],chartsData:[]},
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
                axios.post('/admin/echarts/charge-trend-hour', self.listQuery).then(
                    res => {
                        if(res.data.length == 0 || res.data == null){
                            self.$message.success({message: "未查询到充值数据，请检查查询条件"})
                            return false
                        }
                        self.lineChartData = {name:[],chartsData:[]}
                        let tmps = {name:[],data:[]};
                        for(let i in res.data){
                            let tmp = {
                                name:i,
                                type: 'line',
                                data:res.data[i],
                                areaStyle: {normal: {}},
                            }
                            tmps.name.push(i)
                            tmps.data.push(tmp)
                        }
                        self.$set(self.lineChartData,'name',tmps.name);
                        self.$set(self.lineChartData,'chartsData',tmps.data);
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