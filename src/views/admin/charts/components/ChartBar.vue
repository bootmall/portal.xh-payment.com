<template>
    <div :class="className" :style="{height:height,width:width}"> </div>
</template>

<script>

    import echarts from 'echarts'
    require('echarts/theme/macarons') // echarts 主题
    import { debounce } from '@/utils'
    const defaultEchartOption = {
        title: {
            text: ''
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: []
        },
        grid: {
            left: 100
        },
        toolbox: {
            show: true,
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'value',
            name: '金额(元)',
            axisLabel: {
                formatter: '{value}'
            }
        },
        yAxis: {
            type: 'category',
            inverse: true,
            data: [],
        },
        series: []
    }
    export default {
        // name: "ChartBar",
        props: {
            className: {
                type: String,
                default: 'chart'
            },
            width: {
                type: String,
                default: '100%'
            },
            height: {
                type: String,
                default: '900px'
            },
            chartData: {
                type: Object,
                // required: true
            },
        },
        data() {
            return {
                chart: null,
            }
        },
        watch: {
            chartData: {
                deep: true,
                handler(val) {
                    console.log(val)
                    let option = defaultEchartOption;
                    option.legend.data = val.legend
                    option.series = val.series
                    option.yAxis.data = val.y_data
                    option.title.text = val.title
                    this.chart.clear();// 重绘之前清理画布
                    this.chart.setOption(option,true)
                }
            },
        },
        mounted() {
            this.initChart()
        },
        methods: {
            setOptions(val) {
                let option = defaultEchartOption;
                option.legend.data = val.legend
                option.series = val.series
                option.yAxis.data = val.y_data
                option.title.text = val.title
                this.chart.setOption(option,true)
            },
            initChart() {
                this.chart = echarts.init(this.$el, 'macarons')
                this.setOptions(this.chartData)
            }
        }
    }
</script>

<style scoped>

</style>