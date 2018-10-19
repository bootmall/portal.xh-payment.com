<template>
    <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>

    import echarts from 'echarts'
    require('echarts/theme/macarons') // echarts 主题
    import { debounce } from '@/utils'
    const seriesLabel = {
        normal: {
            show: true,
            textBorderColor: '#333',
            textBorderWidth: 2
        }
    }
    const defaultEchartOption = {
        title: {
            text: 'Wheater Statistics'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['City Alpha', 'City Beta', 'City Gamma']
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
            name: 'Days',
            axisLabel: {
                formatter: '{value}'
            }
        },
        yAxis: {
            type: 'category',
            inverse: true,
            data: ['Sunny', 'Cloudy', 'Showers'],
            axisLabel: {
                formatter: function (value) {
                    return '{' + value + '| }\n{value|' + value + '}';
                },
                margin: 20,
                rich: {
                    value: {
                        lineHeight: 30,
                        align: 'center'
                    },
                    Sunny: {
                        height: 40,
                        align: 'center',
                        backgroundColor: {
                            image: weatherIcons.Sunny
                        }
                    },
                    Cloudy: {
                        height: 40,
                        align: 'center',
                        backgroundColor: {
                            image: weatherIcons.Cloudy
                        }
                    },
                    Showers: {
                        height: 40,
                        align: 'center',
                        backgroundColor: {
                            image: weatherIcons.Showers
                        }
                    }
                }
            }
        },
        series: [
            {
                name: 'City Alpha',
                type: 'bar',
                data: [165, 170, 30],
                label: seriesLabel,
            },
            {
                name: 'City Beta',
                type: 'bar',
                label: seriesLabel,
                data: [150, 105, 110]
            },
            {
                name: 'City Gamma',
                type: 'bar',
                label: seriesLabel,
                data: [220, 82, 63]
            }
        ]
    }
    export default {
        name: "ChartBar",
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
                default: 'auto'
            },
            autoResize: {
                type: Boolean,
                default: true
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
                    // console.log(val)
                    let option = defaultEchartOption;
                    option.legend.data = val.name
                    option.series = val.data
                    option.xAxis[0].data = val.x_data
                    option.title.text = val.title
                    this.chart.clear();// 重绘之前清理画布
                    this.chart.setOption(option)
                }
            },
        },
        mounted() {
            this.initChart()
        },
        methods: {
            setOptions(value) {
                let option = defaultEchartOption;
                option.legend.data = value.name
                option.series = value.data
                option.xAxis[0].data = value.x_data
                option.title.text = value.title
                this.chart.setOption(option)
            },
            initChart() {
                this.chart = echarts.init(this.$el, 'macarons')
                // console.log(this.chartData)
                this.setOptions(this.chartData)
            }
        }
    }
</script>

<style scoped>

</style>