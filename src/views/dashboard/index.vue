<template>
    <div>
        <el-dialog title="请支付开户费用" :visible.sync="needPayAccountOpenFeeVisible" :close-on-click-modal="false" :close-on-press-escape="false" width="40%">
            <el-alert title="您需要先支付开户费用进行开户" type="warning" center show-icon></el-alert>
            <add-recharge :type="3" :amount="needPayAccountOpenAmount" :amount-disabled="1"></add-recharge>
        </el-dialog>
        <div style="width: 90%;margin-left: 50px"  v-show="isMainAccount">
            <el-row class="panel-group" :gutter="40">
            <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
                <div class='card-panel'>
                    <div class="card-panel-icon-wrapper icon-shoppingCard">
                        <svg-icon icon-class="shoppingCard" class-name="card-panel-icon" />
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-text" ><span style="float: left" >今日充值</span><span style="float: left;margin-left: 50px">{{user.order_today_amount}}</span></div>
                        <div class="card-panel-num">
                            <span style="float: left;margin-top: 15px;text-align: center;margin-right: 50px"><p>成功笔数</p><p>{{user.order_today_total}}</p></span>
                            <span style="float: left;margin-top: 15px;text-align: center;margin-right: 50px"><p>待结算金额</p><p>{{user.order_today_paid_total}}</p></span>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
                <div class="card-panel">
                    <div class="card-panel-icon-wrapper icon-money">
                        <svg-icon icon-class="money" class-name="card-panel-icon" />
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-text" ><span style="float: left" >今日代付</span><span style="float: left;margin-left: 50px">{{user.remit_today_amount}}</span></div>
                        <div class="card-panel-num">
                            <span style="float: left;margin-top: 15px;text-align: center;margin-right: 50px"><p>成功笔数</p><p>{{user.remit_today_total_success}}</p></span>
                            <span style="float: left;margin-top: 15px; text-align: center;margin-right: 50px"><p>失败笔数</p><p>{{user.remit_today_total_fail}}</p></span>
                            <span style="float: left;margin-top: 15px; text-align: center"><p>失败金额</p><p>{{user.remit_today_amount_fail}}</p></span>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
            <el-row class="panel-group" :gutter="40">
                <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
                    <div class='card-panel'>
                        <div class="card-panel-icon-wrapper icon-shoppingCard">
                            <svg-icon icon-class="shoppingCard" class-name="card-panel-icon" />
                        </div>
                        <div class="card-panel-description">
                            <div class="card-panel-text" ><span style="float: left" >昨日充值</span><span style="float: left;margin-left: 50px">{{user.order_yesterday_amount}}</span></div>
                            <div class="card-panel-num">
                                <span style="float: left;margin-top: 15px;text-align: center;margin-right: 50px"><p>成功笔数</p><p>{{user.order_yesterday_total}}</p></span>
                                <span style="float: left;margin-top: 15px;text-align: center;margin-right: 50px"><p>待结算金额</p><p>{{user.order_yesterday_paid_total}}</p></span>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
                    <div class="card-panel">
                        <div class="card-panel-icon-wrapper icon-money">
                            <svg-icon icon-class="money" class-name="card-panel-icon" />
                        </div>
                        <div class="card-panel-description">
                            <div class="card-panel-text" >
                                <span style="float: left" >昨日代付</span>
                                <span style="float: left;margin-left: 50px">{{user.remit_yesterday_amount}}</span>
                            </div>
                            <div class="card-panel-num">
                                <span style="float: left;margin-top: 15px;text-align: center;margin-right: 50px"><p>成功笔数</p><p>{{user.remit_yesterday_total_success}}</p></span>
                                <span style="float: left;margin-top: 15px; text-align: center;margin-right: 50px"><p>失败笔数</p><p>{{user.remit_yesterday_total_fail}}</p></span>
                                <span style="float: left;margin-top: 15px; text-align: center"><p>失败金额</p><p>{{user.remit_yesterday_amount_fail}}</p></span>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div style="width: 90%;margin-left: 50px;margin-bottom: 20px;" v-if="user.group_id != 10 " class="rate-list"  v-show="isMainAccount">
            <h4 title="费率列表" class="el-alert el-alert--success" style="margin-bottom: 10px;line-height: 25px">费率列表</h4>
            <el-row :gutter="10" style="text-align: left">
                <el-col :span="24" align="center">
                    <el-button type="success"><span class="rate-list-name">出款费率</span>:{{remit_fee}}</el-button>
                    <el-button v-for="(item,key) in rate" :key="key" v-if="item.rate > 0"  :type="item.status == 1 ? 'success' : 'warning'"><span class="rate-list-name">{{item.name}}</span>:{{item.rate}}</el-button>
                </el-col>
            </el-row>
        </div>
        <el-row :gutter="20" style="margin-left: 50px;line-height: 60px;width: 90%;">
          <h4
              title="最新公告"
              class="el-alert el-alert--success"
              style="margin-bottom: 10px;line-height: 25px">
              最新公告
          </h4>
          <el-tabs
                  tab-position="left"
                  style="height: 300px;"
                  class="notice-list">
            <el-tab-pane style="height: 300px;overflow:auto;line-height: 18px;" :label="item.title" v-for="(item,key) in notice" :key="key" v-html="item.content" @click="content = item.content"></el-tab-pane>
          </el-tabs>
        </el-row>
        <div style="width: 90%;margin-left: 50px;margin-bottom: 20px;" v-if="user.group_id == 30 " v-show="isMainAccount">
            <h4 title="费率列表" class="el-alert el-alert--success" style="margin-bottom: 10px;line-height: 25px">充值/代付统计图</h4>
            <el-row :gutter="10" style="text-align: left;background:#fff;margin-bottom:32px;">
                <el-col :span="12" align="center">
                    <charge-trend-hour-chart :chart-data="lineChartData"></charge-trend-hour-chart>
                </el-col>
                <el-col :span="12" align="center">
                    <charge-trend-hour-chart :chart-data="chargeRemitData"></charge-trend-hour-chart>
                </el-col>
            </el-row>
        </div>
        <el-row :gutter="20" style="margin-left: 50px;line-height: 60px;width: 90%;background-color: #eee;color: #333;">
            <el-col :span="6" align="center">最后登陆时间</el-col>
            <el-col :span="6">{{user.last_login_time}}</el-col>
            <el-col :span="6" align="center">最后登陆IP</el-col>
            <el-col :span="6">{{user.last_login_ip}}</el-col>
        </el-row>
    </div>
</template>

<script>
  import addRecharge from '@/views/components/addRecharge'
  import ChargeTrendHourChart from '@/views/admin/charts/components/ChargeTrendHourChart'
  import { mapGetters } from 'vuex'
  import axios from '@/utils/http'
  import common from '@/utils/common'

  const lineChartOrderCountData = {
    line: [],
    xAxis:[],
    legend: '近7天订单金额',
  }
  const lineChartOrderMoneyData = {
    line: [],
    xAxis:[],
    legend: '近7天订单数量',
  }

  export default {
    name: 'dashboardIndex',
    components: {
        addRecharge,
        ChargeTrendHourChart
    },
    computed: {
    },
    data() {
      return {
        groupPanel:{},
          listLoading:false,
        lineChartOrderCountData: lineChartOrderCountData,
        lineChartOrderMoneyData: lineChartOrderMoneyData,
        notice: {},
        noticeVisible: false,
        content: null,
        user: {},
        rate: {},
        remit_fee: null,
        payMethodOptions: {},
        needPayAccountOpenFeeVisible: false,
        needPayAccountOpenFee: false,
        needPayAccountOpenAmount: 0,
        isMainAccount:false,
        lineChartData:{
            name:[],
            chartsData:[],
            days:[],
            title:'充值、代付当日统计'
        },
        lineChartType:{
            'charge':'充值',
            'remit':'代付'
        },
          chargeRemitData:{
              name:[],
              chartsData:[],
              days:[],
              title:'充值、代付近7日统计'
          }
      }
    },
    methods: {
      go(path) {
        this.$router.push({path: path});
      },
      getInitData() {
        let self = this
        self.listLoading = true
        axios.post('/dashboard/index').then(
          res => {
            self.listLoading = false
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.groupPanel = res.data.groupPanel
              self.isMainAccount = res.data.isMainAccount
              self.user = res.data.user
              self.notice = res.data.notice
              if (self.notice.length > 0){
                self.noticeVisible = true
                self.content = self.notice[0].content
              }

              for(let i in res.data.rate){
                if(res.data.rate[i].rate==0){
                  res.data.rate[i].rate = 0
                }
              }
              self.rate = res.data.rate

              self.remit_fee = res.data.remit_fee
              self.payMethodOptions = res.data.payMethodOptions
              self.needPayAccountOpenFee = res.data.needPayAccountOpenFee

              if(self.needPayAccountOpenFee){
                self.noticeVisible = false
                self.needPayAccountOpenFeeVisible = true
                self.needPayAccountOpenAmount = parseInt(res.data.needPayAccountOpenAmount)
              }

            }
          },
          res => {
            self.$message.error({message:res.message})
          }
        )
      },
        getChartData(){
          var self = this
            axios.post('/admin/echarts/charge-remit-trend-merchant').then(
                res => {
                    self.lineChartData = {name:[],data:[],x_data:[]}
                    let tmps = {name:[],data:[],x_data:[]}
                    for(let i in res.data.charts){
                        let tmp = {
                            name:self.lineChartType[i],
                            type: 'line',
                            data:[],
                            areaStyle: {normal: {}},
                        }
                        for(let j in res.data.hour){
                            tmp.data.push(res.data.charts[i][res.data.hour[j]])
                        }
                        tmps.name.push(self.lineChartType[i])
                        tmps.data.push(tmp)
                    }
                    for (let i in res.data.hour){
                        tmps.x_data.push(res.data.hour[i]+'时')
                    }
                    self.$set(self,'lineChartData',tmps);
                    self.chargeRemitData = {name:[],data:[],x_data:[]}
                    let tmpChargeRemit = {name:[],data:[],x_data:[]}
                    for (let i in res.data.merchant) {
                        let tmp = {
                            name:self.lineChartType[i],
                            type: 'line',
                            data:[],
                            areaStyle: {normal: {}},
                        }
                        tmpChargeRemit.x_data = Object.keys(res.data.merchant[i])
                        for (let j in res.data.merchant[i]){
                            tmp.data.push(res.data.merchant[i][j])

                        }
                        tmpChargeRemit.name.push(self.lineChartType[i])
                        tmpChargeRemit.data.push(tmp)
                    }
                    self.$set(self,'chargeRemitData',tmpChargeRemit);
                }
            )
        }
    },
    created(){
      this.getInitData()
      this.getChartData()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .el-row {
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
    }
    .el-col {
        border-radius: 4px;
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
  .dashboard-editor-container {
      padding: 32px;
      background-color: rgb(240, 242, 245);
      .chart-wrapper {
          background: #fff;
          padding: 16px 16px 0;
          margin-bottom: 32px;
      }

      .authorised_amount {
          padding: 5px 10px;
          background-color: #ecf8ff;
          border-radius: 4px;
          border-left: 5px solid #50bfff;
      }
    .authorised_amount span,.authorised_amount b{
      display: inline-block;padding-left: 5px;
    }
      .authorised_amount b{
        color: #F56C6C;
      }
  }
    .panel-group {
        margin-top: 18px;
        .card-panel-col{
            margin-bottom: 32px;
        }
        .card-panel {
            height: 108px;
            cursor: pointer;
            font-size: 12px;
            position: relative;
            overflow: hidden;
            color: #666;
            background: #fff;
            box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
            border-color: rgba(0, 0, 0, .05);
            &:hover {
                .card-panel-icon-wrapper {
                    color: #fff;
                }
                .icon-people {
                    background: #40c9c6;
                }
                .icon-message {
                    background: #36a3f7;
                }
                .icon-money {
                    background: #f4516c;
                }
                .icon-shoppingCard {
                    background: #34bfa3
                }
            }
            .icon-people {
                color: #40c9c6;
            }
            .icon-message {
                color: #36a3f7;
            }
            .icon-money {
                color: #f4516c;
            }
            .icon-shoppingCard {
                color: #34bfa3
            }
            .card-panel-icon-wrapper {
                float: left;
                margin: 14px 0 0 14px;
                padding: 16px;
                transition: all 0.38s ease-out;
                border-radius: 6px;
            }
            .card-panel-icon {
                float: left;
                font-size: 48px;
            }
            .card-panel-description {
                float: left;
                font-weight: bold;
                margin: 26px;
                margin-left: 0px;
                width: 75%;
                .card-panel-text {
                    line-height: 18px;
                    color: rgba(0, 0, 0, 0.45);
                    font-size: 16px;
                    margin-bottom: 12px;
                    margin-left: 20px;
                }
                .card-panel-num {
                    font-size: 12px;
                }
            }
        }
    }
  /*.panel-group {*/
    /*margin-top: 18px;*/
    /*.card-panel-col{*/
      /*margin-bottom: 32px;*/
    /*}*/
    /*.card-panel {*/
      /*height: 108px;*/
      /*cursor: pointer;*/
      /*font-size: 12px;*/
      /*position: relative;*/
      /*overflow: hidden;*/
      /*color: #666;*/
      /*background: #fff;*/
      /*box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);*/
      /*border-color: rgba(0, 0, 0, .05);*/
      /*&:hover {*/
        /*.card-panel-icon-wrapper {*/
          /*color: #fff;*/
        /*}*/
        /*.icon-people {*/
          /*background: #40c9c6;*/
        /*}*/
        /*.icon-message {*/
          /*background: #36a3f7;*/
        /*}*/
        /*.icon-money {*/
          /*background: #f4516c;*/
        /*}*/
        /*.icon-shoppingCard {*/
          /*background: #34bfa3*/
        /*}*/
      /*}*/
      /*.icon-people {*/
        /*color: #40c9c6;*/
      /*}*/
      /*.icon-message {*/
        /*color: #36a3f7;*/
      /*}*/
      /*.icon-money {*/
        /*color: #f4516c;*/
      /*}*/
      /*.icon-shoppingCard {*/
        /*color: #34bfa3*/
      /*}*/
      /*.card-panel-icon-wrapper {*/
        /*float: left;*/
        /*margin: 14px 0 0 14px;*/
        /*padding: 16px;*/
        /*transition: all 0.38s ease-out;*/
        /*border-radius: 6px;*/
      /*}*/
      /*.card-panel-icon {*/
        /*float: left;*/
        /*font-size: 48px;*/
      /*}*/
      /*.card-panel-description {*/
        /*float: right;*/
        /*font-weight: bold;*/
        /*margin: 26px;*/
        /*margin-left: 0px;*/
        /*.card-panel-text {*/
          /*line-height: 18px;*/
          /*color: rgba(0, 0, 0, 0.45);*/
          /*font-size: 16px;*/
          /*margin-bottom: 12px;*/
        /*}*/
        /*.card-panel-num {*/
          /*font-size: 20px;*/
        /*}*/
      /*}*/
    /*}*/
  /*}*/
.rate-list{
    .el-alert__title {
        font-size: 18px !important;
      font-weight: bolder;
    }
    .el-button--medium {
        padding: 5px 10px;
        color: #ccc;
        margin-bottom: 10px;
        margin-left: 10px;
    }
    .rate-list-name{
        color: #ffffff;
    }
   .el-row .el-col-24{
    text-align: left;
  }
}
  .notice-list{
    .el-alert__title, .el-alert__content{
      font-size: 18px !important;
      font-weight: bolder;
      line-height: 25px !important;
    }
  }

</style>