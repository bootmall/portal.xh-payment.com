<template>
    <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
    import echarts from 'echarts'
    require('echarts/theme/macarons') // echarts 主题
    import { debounce } from '@/utils'
    export default {
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
                default: '550px'
            },
            autoResize: {
                type: Boolean,
                default: true
            },
            chartData: {
                type: Object,
                required: true
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
                    this.setOptions(val)
                }
            }
        },
        mounted() {
            this.initChart()
            // if (this.autoResize) {
            //     this.__resizeHandler = debounce(() => {
            //         if (this.chart) {
            //             this.chart.resize()
            //         }
            //     }, 100)
            //     window.addEventListener('resize', this.__resizeHandler)
            // }
            // // 监听侧边栏的变化
            // const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
            // sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler)
        },
        beforeDestroy() {
            if (!this.chart) {
                return
            }
            // if (this.autoResize) {
            //     window.removeEventListener('resize', this.__resizeHandler)
            // }
            // const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
            // sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler)
            this.chart.dispose()
            this.chart = null
        },
        methods: {
            // sidebarResizeHandler(e) {
            //     if (e.propertyName === 'width') {
            //         this.__resizeHandler()
            //     }
            // },
            setOptions(value) {
                this.chart.setOption({
                    xAxis: {
                        data: ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
                        boundaryGap: false,
                        axisTick: {
                            show: false
                        }
                    },
                    grid: {
                        left: 10,
                        right: 10,
                        bottom: 20,
                        top: 30,
                        containLabel: true
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        },
                        padding: [5, 10]
                    },
                    yAxis: {
                        axisTick: {
                            show: false
                        }
                    },
                    legend: {
                        data:Object.keys(value)
                    },
                    series: [
                        {
                            name: Object.keys(value)[0], itemStyle: {
                                normal: {
                                    color: '#FF005A',
                                    lineStyle: {
                                        color: '#FF005A',
                                        width: 2
                                    }
                                }
                            },
                            smooth: true,
                            type: 'line',
                            data: value[Object.keys(value)[0]],
                            animationDuration: 2800,
                            animationEasing: 'cubicInOut'
                        },
                        {
                            name: Object.keys(value)[1],
                            smooth: true,
                            type: 'line',
                            itemStyle: {
                                normal: {
                                    color: '#3888fa',
                                    lineStyle: {
                                        color: '#3888fa',
                                        width: 2
                                    },
                                    areaStyle: {
                                        color: '#f3f8ff'
                                    }
                                }
                            },
                            data: value[Object.keys(value)[1]],
                            animationDuration: 2800,
                            animationEasing: 'quadraticOut'
                        },
                        {
                            name: Object.keys(value)[2],
                            smooth: true,
                            type: 'line',
                            itemStyle: {
                                normal: {
                                    color: '#67c23a',
                                    lineStyle: {
                                        color: '#67c23a',
                                        width: 2
                                    },
                                    areaStyle: {
                                        color: '#f3f8ff'
                                    }
                                }
                            },
                            data: value[Object.keys(value)[2]],
                            animationDuration: 2800,
                            animationEasing: 'quadraticOut'
                        },
                        {
                            name: Object.keys(value)[3],
                            smooth: true,
                            type: 'line',
                            itemStyle: {
                                normal: {
                                    color: '#eb9e05',
                                    lineStyle: {
                                        color: '#eb9e05',
                                        width: 2
                                    },
                                    areaStyle: {
                                        color: '#f3f8ff'
                                    }
                                }
                            },
                            data: value[Object.keys(value)[3]],
                            animationDuration: 2800,
                            animationEasing: 'quadraticOut'
                        }
                    ]
                })
            },
            initChart() {
                this.chart = echarts.init(this.$el, 'macarons')
                this.setOptions(this.chartData)
            }
        }
    }
</script>