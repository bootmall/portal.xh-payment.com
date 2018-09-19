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
                lineChartData:{
                    name:[],
                    data:[],
                    x_data:[],
                    title:''
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
                axios.post('/admin/echarts/charge-trend-hour', self.listQuery).then(
                    res => {
                        if(res.data.length == 0 || res.data == null){
                            self.$message.error({message: res.message})
                            return false
                        }
                        self.lineChartData = {name:[],data:[],x_data:[],title:''}
                        let tmps = {name:[],data:[],x_data:[],title:''};
                        let tmpLength = Object.keys(res.data.chart).length
                        let number = 0;
                        for(let i in res.data.chart){
                            let tmp = {
                                name:i,
                                type: 'line',
                                data:res.data.chart[i],
                                areaStyle: {normal: {}},
                            }
                            tmps.name.push(i)
                            if(tmpLength > 10 && number == Math.round(tmpLength/2)){
                                tmps.name.push('')
                            }
                            tmps.data.push(tmp)
                            number++;
                        }
                        tmps.title = "充值近" + Object.keys(res.data.chart).length  + "天时时统计"

                        for (let i in res.data.hour){
                            tmps.x_data.push(res.data.hour[i]+'时')
                        }
                        self.$set(self,'lineChartData',tmps);
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