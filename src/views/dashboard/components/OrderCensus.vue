<template>
    <div>
        <el-row class="panel-group" :gutter="40">
            <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
                <div class='card-panel'>
                    <div class="card-panel-icon-wrapper icon-shoppingCard">
                        <svg-icon icon-class="shoppingCard" class-name="card-panel-icon" />
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-text" >
                            <span style="float: left" >今日充值</span>
                            <span style="float: left;margin-left: 50px">{{user.order_today_amount}}</span>
                        </div>
                        <div class="card-panel-num">
                            <span style="float: left;margin-top: 15px;text-align: center;margin-right: 50px">
                                <p>成功笔数</p>
                                <p>{{user.order_today_total}}</p>
                            </span>
                            <!--<span style="float: left;margin-top: 15px; text-align: center">-->
                                <!--<p>手续费</p>-->
                                <!--<p>{{user.order_today_fee_amount}}</p>-->
                            <!--</span>-->
                            <span style="float: left;margin-top: 15px;text-align: center;margin-right: 50px">
                                <p>待结算金额</p>
                                <p>{{user.order_today_paid_total}}</p>
                            </span>
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
                            <span style="float: left" >今日代付</span>
                            <span style="float: left;margin-left: 50px">{{user.remit_today_amount}}</span>
                        </div>
                        <div class="card-panel-num">
                            <span style="float: left;margin-top: 15px;text-align: center;margin-right: 50px">
                                <p>成功笔数</p>
                                <p>{{user.remit_today_total_success}}</p>
                            </span>
                            <span style="float: left;margin-top: 15px; text-align: center;margin-right: 50px">
                                <p>失败笔数</p>
                                <p>{{user.remit_today_total_fail}}</p>
                            </span>
                            <span style="float: left;margin-top: 15px; text-align: center">
                                <p>失败金额</p>
                                <p>{{user.remit_today_amount_fail}}</p>
                            </span>
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
                        <div class="card-panel-text" >
                            <span style="float: left" >昨日充值</span>
                            <span style="float: left;margin-left: 50px">{{user.order_yesterday_amount}}</span>
                        </div>
                        <div class="card-panel-num">
                            <span style="float: left;margin-top: 15px;text-align: center;margin-right: 50px">
                                <p>成功笔数</p>
                                <p>{{user.order_yesterday_total}}</p>
                            </span>
                            <!--<span style="float: left;margin-top: 15px; text-align: center">-->
                                <!--<p>手续费</p>-->
                                <!--<p>{{user.order_yesterday_fee_amount}}</p>-->
                            <!--</span>-->
                            <span style="float: left;margin-top: 15px;text-align: center;margin-right: 50px">
                                <p>待结算金额</p>
                                <p>{{user.order_yesterday_paid_total}}</p>
                            </span>
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
                            <span style="float: left;margin-top: 15px;text-align: center;margin-right: 50px">
                                <p>成功笔数</p>
                                <p>{{user.remit_yesterday_total_success}}</p>
                            </span>
                            <span style="float: left;margin-top: 15px; text-align: center;margin-right: 50px">
                                <p>失败笔数</p>
                                <p>{{user.remit_yesterday_total_fail}}</p>
                            </span>
                            <span style="float: left;margin-top: 15px; text-align: center">
                                <p>失败金额</p>
                                <p>{{user.remit_yesterday_amount_fail}}</p>
                            </span>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import CountTo from 'vue-count-to'
    import axios from '@/utils/http'
    export default {
        data() {
            return {
                user:{},
            }
        },
        components: {
            CountTo
        },
        methods: {
            getInitData() {
                let self = this
                axios.post('/dashboard/index').then(
                    res => {
                        if(res.code != 0){
                            self.$message.error({message:res.message})
                        }else{
                            self.user = res.data.user
                        }
                    },
                    res => {
                        self.$message.error({message:res.message})
                    }
                )
            },
        },
        created(){
            this.getInitData();
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
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
</style>
