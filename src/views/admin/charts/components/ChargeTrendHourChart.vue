<template>
    <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
    import echarts from 'echarts'
    require('echarts/theme/macarons') // echarts 主题
    import { debounce } from '@/utils'
    const defaultEchartOption = {
        xAxis: [
            {
                data: ['00时','01时','02时','03时','04时','05时','06时','07时','08时','09时','10时','11时','12时','13时','14时','15时','16时','17时','18时','19时','20时','21时','22时','23时'],
                boundaryGap: false,
                axisTick: {
                    show: false
                }
            },
            {
                name: '',
                type: 'value'
            },
        ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '20%',
            containLabel: true
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            },
            padding: [20, 10]
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        yAxis: [
            {
                axisTick: {
                    show: false
                }
            },
            {
                name: '金额(元)',
                type: 'value'
            },
        ],
        legend: {
            data: []
        },
        series: []
    }
    export default {
        props: {
            className: {
                type: String,
                default: 'chart'
            },
            width: {
                type: String,
                default: '95%'
            },
            height: {
                type: String,
                default: '350px'
            },
            autoResize: {
                type: Boolean,
                default: true
            },
            chartData: {
                type: Object,
                // required: true
            }
        },
        data() {
            return {
                chart: null
            }
        },
        watch: {
            chartData: {
                deep: true,
                handler(val) {
                    // console.log(val)
                  let option = defaultEchartOption;
                  option.legend.data = val.name
                  option.series = val.data

                  this.chart.clear();// 重绘之前清理画布
                  this.chart.setOption(option)
                }
            }
        },
        mounted() {
            this.initChart()
        },
        methods: {
            setOptions(value) {
              let option = defaultEchartOption;
              option.legend.data = value.name
              option.series = value.data
                this.chart.setOption(option)
            },
            initChart() {
                this.chart = echarts.init(this.$el, 'macarons')
                this.setOptions(this.chartData)
            }
        }
    }
</script>