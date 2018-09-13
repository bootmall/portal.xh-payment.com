<template>
    <div class="dashboard-editor-container">
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
            <line-chart :chart-data="lineChartData"/>
        </el-row>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import common from '@/utils/common'
    import axios from '@/utils/http'
    import VueQr from 'vue-qr'
    import LineChart from './components/LineChart'
    export default {
        name: "vue_charge_charts",
        components: {
            LineChart,
        },
        data() {
            return {
                lineChartData:{},
                listQuery: {
                    dateStart: null,
                    dateEnd: null,
                },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
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
                axios.post('/admin/order/echarts', self.listQuery).then(
                    res => {
                        self.lineChartData = res.data
                    },
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