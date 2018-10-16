<template>
    <div class="dashboard-editor-container" style="margin-left: 50px;font-size:12px" v-loading="listLoading" element-loading-text="数据加载中，请稍候...">
        <div class="user-attr">
            <span><h4>商户基本信息</h4></span>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="grid-content">
                        <span>商户编号：</span><span>{{userInfo.id}}</span>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content">
                        <span>登陆名：</span><span>{{userInfo.username}}</span>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content">
                        <span>商户类型：</span><span>{{userInfo.group_name}}</span>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="grid-content">
                        <span>邮箱：</span><span>{{userInfo.email}}</span>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content">
                        <span>创建时间：</span><span>{{userInfo.created_at}}</span>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content">
                        <span>状态：</span><span>{{userInfo.status_name}}</span>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="grid-content">
                        <span>支持API下发：</span><span>{{userInfo.allow_api_remit_str}}</span>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content">
                        <span>支持后台下发：</span><span>{{userInfo.allow_manual_remit_str}}</span>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content">
                        <span>出款费率(元/笔)：</span><span>{{userInfo.remit_fee | numberFormat}}</span>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="grid-content">
                        <span>转账手续费(-1使用系统设置,0免费)：</span><span>{{userInfo.account_transfer_fee | numberFormat}}</span>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content">
                        <span>下发总额度：</span><span>{{userInfo.remit_quota_perday | numberFormat}}</span>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content">
                        <span>收款总额度：</span><span>{{userInfo.recharge_quota_perday | numberFormat}}</span>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="grid-content">
                        <span>总资产：</span><span>{{userInfo.asset | numberFormat}}</span>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content">
                        <span>冻结资产：</span><span>{{userInfo.frozen_balance | numberFormat}}</span>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content">
                        <span>可用余额：</span><span>{{userInfo.balance | numberFormat}}</span>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="grid-content">
                        <span>资金密码设置：</span><span>{{userInfo.is_financial}}</span>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content">
                        <span>安全令牌绑定：</span><span>{{userInfo.is_key_2fa}}</span>
                    </div>
                </el-col>
                <!--<el-col :span="8">-->
                    <!--<div class="grid-content">-->
                        <!--<span>商户key：</span><span>{{userInfo.merchant_key}}</span>-->
                    <!--</div>-->
                <!--</el-col>-->
            </el-row>
          <el-row :gutter="20" v-if="accountOpenInfo.fee>0">
            <el-col :span="8">
              <div class="grid-content">
                <span>开户费：</span><span>{{accountOpenInfo.fee}}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <span>开户费订单：</span><span>{{accountOpenInfo.order_no}}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content" :class="{ error: accountOpenInfo.status==0 }">
                <span>开户费状态：</span><span>{{accountOpenInfo.status_str}}</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <span v-if="userInfo.agent">
            <h4>代理</h4>
            <el-row :gutter="20">
                <el-col :span="24" v-text="userInfo.agent"></el-col>
            </el-row>
        </span>
        <span><h4>支付类型--费率</h4></span>
        <el-row :gutter="10" class="rate-list">
            <el-col :span="24" align="left">
                <el-button :type="methods.status_name[key]=='停用'?'warning':'success'" v-for="(item,key) in methods.rate" :key="key" align="center">
                    <span class="rate-list-name">{{methods.name[key]}}</span>:{{item | numberFormat}}
                </el-button>
            </el-col>
        </el-row>
        <span><h4>基本信息相关权限</h4></span>

        <el-row>
            <el-button type="primary" @click="handleResetLoginPass">重置登录密码</el-button>
            <el-button type="primary" @click="handleClearPass">清除资金密码</el-button>
            <el-button type="primary" @click="handleClearGoogle">解绑安全令牌</el-button>
            <el-button type="primary" @click="handleSetRate">设置费率</el-button>
            <el-button type="primary" @click="handleBindIp">绑定API接口IP</el-button>
            <el-button type="primary" @click="handleBindLoginIp">绑定登录IP</el-button>
            <el-button type="primary" @click="apiVisible=true">收款出款接口开关</el-button>
            <el-button type="primary" @click="merchantRemitCheckFormVisible=true">允许商户审核出款订单</el-button>
            <el-button type="primary" @click="showApiResponseFormatForm()">设置API数据格式</el-button>
        </el-row>
        <el-row>
            <el-button type="primary" @click="handleUserStatus">修改商户状态</el-button>
            <el-button type="primary" @click="handleQuota">修改商户额度</el-button>
            <el-button type="primary" @click="handleAgent">切换上级代理</el-button>
            <!--<el-button type="primary" @click="handleClearPass">系统调账</el-button>-->
            <el-button type="primary" @click="handleUpdateUserEmail">修改商户邮箱</el-button>
            <!--<el-button type="primary">修改登录IP</el-button>-->
            <el-button type="primary" @click="showChangeBalanceDialog(1)">调整余额</el-button>
            <el-button type="primary" @click="showChangeBalanceDialog(2)">冻结金额</el-button>
            <el-button type="primary" @click="showChangeBalanceDialog(3)">解冻金额</el-button>
            <el-button type="primary" v-if="accountOpenInfo.status != 1" @click="accountOpenFeeVisible=true">设置开户费</el-button>
            <el-button type="primary" @click="handleChild">子账户</el-button>
        </el-row>
        <el-dialog title="设置费率" :visible.sync="rateVisible" width="53%">
            <el-form :model="rateForm">
                <el-form-item label="出款手续费(元/每笔)：" label-width="180px">
                    <el-input size="small" v-model="rateForm.remit_fee" style="width: 200px"></el-input>
                    <span style="margin-left: 20px;">可填区间</span>
                    <span v-text="userInfo.parent_remit_fee"></span> ~
                    <span v-if="userInfo.lower_remit_fee > 0 " v-text="userInfo.lower_remit_fee"></span>
                    <span v-else></span>
                </el-form-item>
                <el-form-item label="转账手续费(-1使用系统设置,0免费)：" label-width="180px">
                    <el-input size="small" v-model="rateForm.account_transfer_fee" style="width: 200px"></el-input>
                    <span>系统当前{{userInfo.sys_account_transfer_fee}}</span>
                </el-form-item>
                <el-form-item class="el-row-rate" label-width="100px" v-for="(item,key) in payMethodsOptions" :key="key" :label="item+'：'">
                    <el-input size="small" style="width: 200px" @change="checkRate(rateForm.pay_methods[key],key)" v-model="rateForm.pay_methods[key]"></el-input>
                    <el-switch style="margin-left: 20px"
                               v-model="methodStatus[key]"
                               active-text="启用"
                               inactive-text="停用"
                               active-color="#13ce66"
                               inactive-color="#ff4949"
                               active-value="1"
                               inactive-value="0"
                               @change="onMethodStatusChange(key)"
                    >
                    </el-switch>
                    <span style="margin-left: 5px;">可填区间</span>
                    <span v-text="methods.min_rate[key]"></span> ~
                    <span v-if="methods.max_rate[key] > 0 " v-text="methods.max_rate[key]"></span>
                    <span v-else></span>
                    <el-select v-model="settlementType[key]" placeholder="到账" size="mini">
                        <el-option
                                v-for="(item,key) in settlementTypeOptions"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="rateVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="updateRate">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog
                title="修改商户状态"
                :visible.sync="statusVisible"
                width="40%">
            <template>
                <el-radio v-for="(item,key) in userStatusOptions" :key="key" v-model="statusForm.newStatus" :label="key">{{item}}</el-radio>
            </template>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="statusVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateUserStatus">确 定</el-button>
                </span>
        </el-dialog>
        <el-dialog
                title="修改商户额度"
                :visible.sync="quotaVisible"
                width="40%">
            <template>
                <el-form :model="quotaForm">
                    <el-form-item label="单日提款限额：" label-width="180px">
                        <el-input size="small" v-model="quotaForm.remit_quota_perday" style="width: 200px"></el-input>
                    </el-form-item>
                    <el-form-item label="单日充值限额：" label-width="180px">
                        <el-input size="small" v-model="quotaForm.recharge_quota_perday" style="width: 200px"></el-input>
                    </el-form-item>
                    <el-form-item label="单次提款限额：" label-width="180px">
                        <el-input size="small" v-model="quotaForm.remit_quota_pertime" style="width: 200px"></el-input>
                    </el-form-item>
                    <el-form-item label="单次充值限额：" label-width="180px">
                        <el-input size="small" v-model="quotaForm.recharge_quota_pertime" style="width: 200px"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <span slot="footer" class="dialog-footer">
                <el-button @click="quotaVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateQuota">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="修改API开关"
                :visible.sync="apiVisible"
                width="40%">
            <template>
                <el-form :model="apiForm">
                    <el-form-item label="API出款免审核最高金额：" label-width="180px">
                        <el-input size="small" v-model="apiForm.allow_api_fast_remit" style="width: 200px" ></el-input>
                    </el-form-item>
                    <el-form-item label="手工出款免审核最高金额：" label-width="180px">
                        <el-input size="small" v-model="apiForm.allow_manual_fast_remit" style="width: 200px" ></el-input>
                    </el-form-item>
                    <el-form-item label="免出款手续费最低金额：" label-width="180px">
                        <el-input size="small" v-model="apiForm.remit_fee_free_quota" style="width: 200px" ></el-input>
                    </el-form-item>
                    <el-form-item label="支持接口充值：" label-width="180px">
                        <el-switch style="margin-left: 20px"
                                   v-model="apiForm.allow_api_recharge"
                                   active-text="启用"
                                   inactive-text="停用"
                                   active-color="#13ce66"
                                   inactive-color="#ff4949"
                                   active-value="1"
                                   inactive-value="0">
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="支持接口提款：" label-width="180px">
                        <el-switch style="margin-left: 20px"
                                   v-model="apiForm.allow_api_remit"
                                   active-text="启用"
                                   inactive-text="停用"
                                   active-color="#13ce66"
                                   inactive-color="#ff4949"
                                   active-value="1"
                                   inactive-value="0">
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="支持手工充值：" label-width="180px">
                        <el-switch style="margin-left: 20px"
                                   v-model="apiForm.allow_manual_recharge"
                                   active-text="启用"
                                   inactive-text="停用"
                                   active-color="#13ce66"
                                   inactive-color="#ff4949"
                                   active-value="1"
                                   inactive-value="0">
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="支持手工提款：" label-width="180px">
                        <el-switch style="margin-left: 20px"
                                   v-model="apiForm.allow_manual_remit"
                                   active-text="启用"
                                   inactive-text="停用"
                                   active-color="#13ce66"
                                   inactive-color="#ff4949"
                                   active-value="1"
                                   inactive-value="0">
                        </el-switch>
                    </el-form-item>
                </el-form>
            </template>
            <span slot="footer" class="dialog-footer">
                <el-button @click="apiVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateApi">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="修改商户邮箱"
                :visible.sync="emailVisible"
                width="40%">
            <template>
                <el-form :model="quotaForm">
                    <el-form-item label="邮箱：" label-width="180px">
                        <el-input size="small" type="email" v-model="emailForm.newEmail" style="width: 200px"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <span slot="footer" class="dialog-footer">
                <el-button @click="emailVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateEmail">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="绑定接口IP"
                :visible.sync="ipVisible"
                width="40%">
            <template>
                <el-form :model="ipForm">
                    <p style="color: red;padding-left: 180px;">提示：IP，域名有多个 以英文符号分号(;) 分隔</p>
                    <el-form-item label="API接口IP地址：" label-width="180px">
                        <el-input size="small" type="textarea" :rows="3" v-model="ipForm.app_server_ips" style="width: 300px"></el-input>
                    </el-form-item>
                    <el-form-item label="API接口域名：" label-width="180px">
                        <el-input size="small" type="textarea" :rows="3" v-model="ipForm.app_server_domains" style="width: 300px"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ipVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateIps">确 定</el-button>
            </span>
        </el-dialog>
      <el-dialog
          title="绑定登录IP"
          :visible.sync="loginIpFormVisible"
          width="40%">
        <template>
          <el-form :model="loginIpForm">
            <p style="color: red;padding-left: 180px;">提示：IP有多个 以英文符号分号(;) 分隔</p>
            <el-form-item label="登录IP地址：" label-width="180px">
              <el-input size="small" type="textarea" :rows="3" v-model="loginIpForm.bind_login_ip" style="width: 300px"></el-input>
            </el-form-item>
          </el-form>
        </template>
        <span slot="footer" class="dialog-footer">
                <el-button @click="loginIpFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateLoginIp">确 定</el-button>
            </span>
      </el-dialog>
        <el-dialog
                title="切换上级代理"
                :visible.sync="agentVisible"
                width="25%">
            <template>
                <el-select v-model="agentId" filterable placeholder="请选择">
                    <el-option
                            v-for="(item,key) in agentOptions"
                            :key="key"
                            :label="item"
                            :value="key">
                    </el-option>
                </el-select>
            </template>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="agentVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleCheangeAgent">确 定</el-button>
                </span>
        </el-dialog>
        <el-dialog
                :title=changeBalanceDialogTitle
                :visible.sync="changeBalanceDialogVisible"
                width="600px">
            <el-form :model="balanceChangeForm">
                <template>
                    <el-alert
                            :title=changeBalanceDialogNotice
                            type="warning">
                    </el-alert>
                    <el-form-item label="调整金额：" label-width="120px" style="margin-top: 20px;width: 400px">
                        <el-input size="small" type="text" v-model="balanceChangeForm.amount"></el-input>
                        <span class="current-balance">当前余额:{{userInfo.balance}},已冻结余额{{userInfo.frozen_balance}}</span>
                    </el-form-item>
                    <el-form-item label="调整原因：" label-width="120px">
                        <el-input size="small" type="textarea" :rows="3" v-model="balanceChangeForm.bak" style="width: 400px"></el-input>
                    </el-form-item>
                </template>
            </el-form>
            <el-alert
                    v-if="balanceChangeFormErr.length>0"
                    :title="balanceChangeFormErr"
                    type="error">
            </el-alert>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="changeBalanceDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleChangeBalance" :disabled=changeBalanceBtnDisabled>确 定</el-button>
                </span>

        </el-dialog>
      <el-dialog
                title="设置开户费"
                :visible.sync="accountOpenFeeVisible"
                width="600px">
            <el-form :model="accountOpenFeeForm">
                <template>
                    <el-form-item label="开户费金额：" label-width="120px" style="margin-top: 20px;width: 400px">
                        <el-input size="small" type="text" v-model="accountOpenFeeForm.amount"></el-input>
                        <span class="current-balance">当前:{{accountOpenAmount}},已支付{{accountOpenPaid}}</span>
                    </el-form-item>
                </template>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="accountOpenFeeVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleSetAccountOpenFee">确 定</el-button>
                </span>

        </el-dialog>
        <el-dialog
                title="设置出款订单审核权限"
                :visible.sync="merchantRemitCheckFormVisible"
                width="600px">
            <el-form>
                <template>
                    <el-form-item label="允许用户审核出款订单：" label-width="180px" style="margin-top: 20px;width: 400px">
                        <el-radio-group v-model="userInfo.can_check_remit_status">
                            <el-radio-button label="1">允许</el-radio-button>
                            <el-radio-button label="0">不允许</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </template>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="merchantRemitCheckFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="setMerchantRemitCheck">确 定</el-button>
                </span>

        </el-dialog>
        <el-dialog
            class="api-response-format"
                title="设置商户API接口响应格式"
                :visible.sync="apiResponseFormatFormVisible"
                width="600px">
            <!--<p style="" class="el-alert&#45;&#45;info">post form: <b>{"method":"post","format":"form"}</b><br />post json: <b>{"method":"post","format":"json"}</b><br />get: <b>{"method":"get","format":"form"}</b></p>-->
            <el-form>
                <template>
                    <el-form-item label="商户API接口响应格式：" label-width="180px" style="margin-top: 20px;width: 600px">
                        <!--<el-input size="small" type="text" v-model="userInfo.api_response_rule" style="width: 300px"></el-input>-->
                        <el-radio-group v-model="userInfo.api_response_rule">
                            <el-radio-button label="post_json">post_json</el-radio-button>
                            <el-radio-button label="post_form">post_form</el-radio-button>
                            <el-radio-button label="get">get</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </template>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="apiResponseFormatFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="setApiResponseFormat">确 定</el-button>
                </span>

        </el-dialog>
        <el-dialog
                class="api-response-format"
                title="子账号列表"
                :visible.sync="childListVisible"
                :close="closeChildList"
                width="70%">
                <child-list :merchant-id="agentMerchantId" @initMerchantIdEvent="initMerchantId"></child-list>
            <span slot="footer" class="dialog-footer" >
                <el-button @click="closeChildList">关 闭</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="解绑商户安全令牌"
                :visible.sync="clearGoogleVisible"
                width="600px"
                @close="close"
                :close-on-click-modal="false">
            <el-form>
                <template>
                    <el-form-item label="操作员安全令牌：" label-width="180px" style="margin-top: 20px;width: 400px">
                        <el-input size="small" type="text" v-model="googleCode" style="width: 300px"></el-input>
                    </el-form-item>
                </template>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="colse">取 消</el-button>
                <el-button type="primary" @click="handleUnbind">确 定</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
  import axios from '@/utils/http'
  import childList from '@/views/components/childList'
  const apiResponseRules = {
    'post_json':'{"method":"post","format":"json"}',
    'post_form':'{"method":"post","format":"form"}',
    'get':'{"method":"get","format":"form"}'
  }
  export default {
    name: "vue_merchant_detail",
      components:{
          childList
      },
    data() {
      return {
        userInfo: {},
        methods: {},
        listLoading: true,
        merchantId: null,
        agentMerchantId: null,
        rateVisible: false,
        statusVisible: false,
        quotaVisible: false,
        emailVisible: false,
        ipVisible: false,
        agentVisible: false,
        methodStatus: {},
        payMethodsOptions: {},
        agentOptions: [],
        remitMaxFee: 5,
        rechargeMaxRate: 0.3,
        settlementType: {},
        settlementTypeOptions: [],
        remitFeeCanBeZero:0,
        rechargeFeeCanBeZero:0,
        company: {
          // id:0,
          type: 0
        },
        rateForm: {
          channel_id: null,
          remit_channel_id: null,
          parent_agent_id: null,
          remit_fee: 0,
          pay_methods: {},
        },
        quotaForm: {
          remit_quota_perday: 0,
          recharge_quota_perday: 0,
          remit_quota_pertime: 0,
          recharge_quota_pertime: 0,
        },
        userStatusOptions: {},
        statusForm: {
          oldStatus: null,
          newStatus: null
        },
        emailForm: {
          oldEmail: null,
          newEmail: null
        },
        ipForm: {
          app_server_ips: null,
          app_server_domains: null
        },
        apiVisible: false,
        apiForm: {
          allow_api_fast_remit: "0",
          allow_api_recharge: "1",
          allow_api_remit: "1",
          allow_manual_recharge: "1",
          allow_manual_remit: "1",
          allow_manual_fast_remit: "0",
          remit_fee_free_quota: "0",
        },
        agentId: null,
        channelOptions: {},

        changeBalanceDialogVisible: false,
        changeBalanceBtnDisabled: false,
        changeBalanceDialogTitle: '',
        changeBalanceDialogNotice: '',
        balanceChangeFormErr: '',
        balanceChangeForm: {
          type: 1,//1余额，2冻结余额
          amount: '',
          bak: ''
        },
        accountOpenFeeVisible:false,
        accountOpenFeeForm:{
          amount:0,
        },
        accountOpenAmount:0,
        accountOpenPaid:0,
        accountOpenInfo:{
          fee:0
        },
        loginIpFormVisible:false,
        loginIpForm:{
          bind_login_ip:[]
        },
        merchantRemitCheckFormVisible:false,
        apiResponseFormatFormVisible:false,
          childListVisible:false,
          googleCode:null,
          clearGoogleVisible:false,
      }
    },
    created() {
      this.getInitData()
    },
    filters: {
      numberFormat: function (value) {
        if (!value) value = 0
        value = Number(value).toFixed(6);
        return value;
      }
    },
    watch: {
      '$route'(to, from) {
        // 对路由变化作出响应...
        let merchantId = 0
        console.log(to.query,from.query,to.name == from.name)
        if(to.name == from.name){

          if(to.query.merchantId!=from.query.merchantId){
            merchantId = to.query.merchantId
          }
          else if(to.params.merchantId!=from.params.merchantId){
              merchantId = to.params.merchantId
          }
        }else{
          merchantId = to.query.merchantId ? to.query.merchantId : to.params.merchantId
        }

        if(merchantId) this.getInitData(merchantId)
      },
    },
    methods: {
      getInitData(merchantId) {
        let self = this
        self.listLoading = true

        if(!merchantId){
          if(this.$route.query.merchantId){
            self.merchantId = this.$route.query.merchantId;
          }
          else if(this.$route.params.merchantId){
            self.merchantId = this.$route.params.merchantId;
          }else{
            self.$message.error({message: '商户ID错误！'})
            return;
          }
        }else{
          self.merchantId = merchantId
        }

        axios.post('/admin/user/detail', {merchantId: self.merchantId}).then(
          res => {
            self.listLoading = false
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.userInfo = res.data.userInfo
              self.methods = res.data.methods
              self.channelOptions = res.data.channelOptions
              self.userStatusOptions = res.data.userStatusOptions
              self.agentOptions = res.data.agentOptions
              self.payMethodsOptions = res.data.payMethodsOptions

              let methodStatus = {}
              for (let index in res.data.methods.status) {
                methodStatus[index] = res.data.methods.status[index].toString()
              }
              self.methodStatus = methodStatus
              self.settlementType = res.data.methods.settlement_type

              self.apiForm.user_id = self.userInfo.id
              self.apiForm.allow_api_fast_remit = self.userInfo.allow_api_fast_remit + ''
              self.apiForm.allow_manual_fast_remit = self.userInfo.allow_manual_fast_remit + ''
              self.apiForm.allow_api_recharge = self.userInfo.allow_api_recharge + ''
              self.apiForm.allow_api_remit = self.userInfo.allow_api_remit + ''
              self.apiForm.allow_manual_recharge = self.userInfo.allow_manual_recharge + ''
              self.apiForm.allow_manual_remit = self.userInfo.allow_manual_remit + ''
              self.apiForm.remit_fee_free_quota = self.userInfo.remit_fee_free_quota + ''

              self.remitMaxFee = res.data.remitMaxFee
              self.rechargeMaxRate = res.data.rechargeMaxRate
              self.settlementTypeOptions = res.data.settlementType
              self.rechargeFeeCanBeZero = res.data.rechargeFeeCanBeZero
              self.remitFeeCanBeZero = res.data.remitFeeCanBeZero
              self.accountOpenPaid = res.data.accountOpenPaid
              self.accountOpenAmount = res.data.accountOpenAmount
              self.accountOpenFeeForm.amount = res.data.accountOpenAmount
              self.accountOpenInfo = res.data.accountOpenInfo
            }
          },
        )
      },
      handleResetLoginPass() {
        let self = this
        self.$confirm('此操作将重置用户密码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let data = {
            merchantId: this.userInfo.id,
            type: 5
          };
          axios.post('/admin/user/clear-unbind-update', data).then(
            res => {
              if (res.code == 0) {
                self.$message.success({message: '登录密码重置成功'});
              } else {
                self.$message.error({message: res.message});
                self.getInitData()
              }
            }
          )

        }).catch(() => {
          self.$message({
            type: 'warning',
            message: '已取消操作'
          });
        });

      },
      handleClearPass() {
        if (this.userInfo.financial_password_hash_len <= 0) {
          this.$message.error({message: '该商户还没有设置资金密码'});
          return;
        }

        let self = this
        self.$confirm('此操作将清除资金密码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let data = {
            merchantId: this.userInfo.id,
            type: 1
          };
          axios.post('/admin/user/clear-unbind-update', data).then(
            res => {
              if (res.code == 0) {
                self.$message.success({message: '资金密码已清除'});
              } else {
                self.$message.error({message: res.message});
                self.getInitData()
              }
            }
          )

        }).catch(() => {
          self.$message({
            type: 'warning',
            message: '已取消操作'
          });
        });
      },
        handleClearGoogle(){
            if (this.userInfo.key_2fa_len <= 0) {
                this.$message.error({message: '该商户还没有绑定安全令牌'});
                return;
            }
            this.clearGoogleVisible = true
        },
      handleUnbind() {
        let self = this
          if(self.googleCode == null || self.googleCode.length == 0){
              self.$message.error({message: '请输入安全令牌'});
              return;
          }
        self.$confirm('此操作将清解绑安全令牌, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let data = {
            merchantId: self.userInfo.id,
            googleCode:self.googleCode,
            type: 2
          };
          axios.post('/admin/user/clear-unbind-update', data).then(
            res => {
              if (res.code == 0) {
                  self.$message.success({message: '安全令牌已解绑'});
              } else {
                  self.$message.error({message: res.message});
                  self.getInitData()
              }
            }
          )

        }).catch(() => {
          self.$message({
            type: 'warning',
            message: '已取消操作'
          });
        });

      },
      handleSetAccountOpenFee() {
        let self = this
        self.$confirm('此操作将设置开户费为 '+self.accountOpenFeeForm.amount+', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.accountOpenFeeVisible = false
          let data = {
            merchantId: self.userInfo.id,
            amount: self.accountOpenFeeForm.amount
          };
          axios.post('/admin/user/set-account-open-fee', data).then(
            res => {
              if (res.code == 0) {
                  self.$message.success({message: '开户费已设置'});
                  self.getInitData()
              } else {
                  self.$message.error({message: res.message});
              }
            }
          )

        }).catch(() => {
          self.$message({
            type: 'warning',
            message: '已取消操作'
          });
        });

      },
      handleSetRate() {
        this.rateForm.remit_fee = this.userInfo.remit_fee;
        this.rateForm.account_transfer_fee = this.userInfo.account_transfer_fee;
        this.rateForm.channel_id = this.userInfo.channel_account_id;
        this.rateForm.remit_channel_id = this.userInfo.remit_channel_account_id;
        this.rateForm.parent_agent_id = this.userInfo.parent_agent_id;
        for (let key in this.methods.rate) {
          this.rateForm.pay_methods[key] = this.methods.rate[key];
        }
        this.rateVisible = true;
      },
      updateRate() {
        let self = this;
        if (self.rateForm.remit_fee < self.userInfo.parent_remit_fee) {
          this.$message.error({message: '出款费率不能小于上级'});
          return
        }
        if (self.userInfo.lower_remit_fee > 0 && self.rateForm.remit_fee > self.userInfo.lower_remit_fee) {
          this.$message.error({message: '出款费率不能大于下级'});
          return
        }
        if (parseFloat(self.rateForm.remit_fee) > parseFloat(self.remitMaxFee)) {
          this.$message.error({message: '出款费率'+self.rateForm.remit_fee +'不能大于系统设置最大结算手续费:' + self.remitMaxFee})
          return;
        }
        let payMethods = []
        let status = 0
        for (let i in self.rateForm.pay_methods) {
          let rate = self.rateForm.pay_methods[i];
          if (self.methodStatus[i] == '1' && !self.checkRate(rate, i)) {
            status = 1;
          }
          payMethods.push({id: i, rate: rate, status: self.methodStatus[i],settlement_type:self.settlementType[i]})
        }
        if (status == 1) {
          self.$message.error({message: '有收款费率错误！请检查'});
          return;
        }
        if (payMethods.length == 0) {
          self.$message.error({message: '请填写收款费率！'});
          return;
        }
        let data = {
          merchantId: self.userInfo.id,
          channelId: self.rateForm.channel_id,
          remitChannelId: self.rateForm.remit_channel_account_id,
          parent_agent_id: self.rateForm.parent_agent_id,
          remit_fee: self.rateForm.remit_fee,
          appSecrets: self.rateForm.app_secrets,
          pay_methods: payMethods,
          remitQuotaPerday: self.rateForm.remit_quota_perday,
          rechargeQuotaPerday: self.rateForm.recharge_quota_perday,
          rechargeQuotaPertime: self.rateForm.recharge_quota_pertime,
          remitQuotaPertime: self.rateForm.remit_quota_pertime,
          account_transfer_fee: self.rateForm.account_transfer_fee
        };
        axios.post('/admin/user/update-rate', data).then(
          res => {
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.getInitData();
              self.$message.success({message: '编辑成功'});
              self.rateVisible = false;
            }
          },
        )
      },
      updateApi() {
        let self = this
        axios.post('/admin/user/update-api', self.apiForm).then(
          res => {
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.$message.success({message: '更新成功'});
              self.apiVisible = false;
            }
          },
        )
      },
      handleBindIp() {
        this.ipVisible = true;
        this.ipForm.app_server_ips = this.userInfo.app_server_ips;
        this.ipForm.app_server_domains = this.userInfo.app_server_domains;
      },
      updateIps() {
        let self = this
        if (self.ipForm.app_server_ips.length < 1 || self.ipForm.app_server_domains.length < 1) {
          // self.$message.error({message: 'ip,或者域名不能为空'});
          // return false;
        }
        let tmpIp = []
        if (self.ipForm.app_server_ips.length > 0) {
          tmpIp = self.ipForm.app_server_ips.split(';');
          let regIp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
          for (let i = 0; i < tmpIp.length; i++) {
            if (!regIp.test(tmpIp[i])) {
              self.$message.error({message: '有IP地址格式不正确，请检查'});
              return false;
            }
          }
        }
        let tmpUrl = []
        if (self.ipForm.app_server_domains.length > 0) {
          let regUrl = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
          tmpUrl = self.ipForm.app_server_domains.split(';');
          for (let i = 0; i < tmpUrl.length; i++) {
            if (!regUrl.test(tmpUrl[i])) {
              self.$message.error({message: '有域名格式不正确，请检查'});
              return false;
            }
          }
        }
        let data = {
          merchantId: self.userInfo.id,
          channelId: self.userInfo.channel_account_id,
          app_server_ips: tmpIp,
          app_server_domains: tmpUrl,
        }
        axios.post('/admin/user/bind-ips', data).then(
          res => {
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.$message.success({message: '修改状态成功'});
              self.getInitData()
              self.ipVisible = false;
            }
          },
        )
      },

      handleBindLoginIp() {
        this.loginIpFormVisible = true;
        this.loginIpForm.bind_login_ip = this.userInfo.bind_login_ip == ''?'':JSON.parse(this.userInfo.bind_login_ip).join(";")
      },

      updateLoginIp() {
        let self = this
        if (self.loginIpForm.bind_login_ip.length < 1) {
          // self.$message.error({message: 'ip不能为空'});
          // return false;
        }
        let tmpIp = []
        if (self.loginIpForm.bind_login_ip.length > 0) {
          tmpIp = self.loginIpForm.bind_login_ip.split(';');
          let regIp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
          for (let i = 0; i < tmpIp.length; i++) {
            if (!regIp.test(tmpIp[i])) {
              self.$message.error({message: tmpIp[i]+' IP地址格式不正确，请检查'});
              return false;
            }
          }
        }
        let data = {
          merchantId: self.userInfo.id,
          ip: tmpIp,
        }
        axios.post('/admin/user/bind-login-ip', data).then(
          res => {
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.$message.success({message: '绑定成功'});
              self.getInitData()
              self.loginIpFormVisible = false;
            }
          },
        )
      },

      setMerchantRemitCheck() {
        let self = this
        let data = {
          merchantId: self.userInfo.id,
          status: self.userInfo.can_check_remit_status,
        }
        axios.post('/admin/user/set-merchant-remit-check', data).then(
          res => {
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.$message.success({message: '绑定成功'});
              self.getInitData()
              self.merchantRemitCheckFormVisible = false;
            }
          },
        )
      },

      showApiResponseFormatForm(){
        let self = this
        for(let r in apiResponseRules){
          console.log(r,apiResponseRules[r],self.userInfo.api_response_rule)
          if(apiResponseRules[r]==self.userInfo.api_response_rule) self.userInfo.api_response_rule = r
        }
        self.apiResponseFormatFormVisible = true;
      },

      setApiResponseFormat() {
        let self = this
        let data = {
          merchantId: self.userInfo.id,
          rule: apiResponseRules[self.userInfo.api_response_rule],
        }
        axios.post('/admin/user/set-api-response-format', data).then(
          res => {
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.$message.success({message: '绑定成功'});
              self.getInitData()
              self.apiResponseFormatFormVisible = false;
            }
          },
        )
      },

      handleAgent() {
        let self = this
        if (self.agentOptions.length == 0) {
          self.$message.error({message: '没有上级代理可切换'});
          return
        }
        self.agentVisible = true
      },
      handleCheangeAgent() {
        let self = this
        if (self.agentId == null) {
          self.$message.error({message: '没有选择代理'})
          return
        }
        let payMethods = []
        for (let key in self.methods.rate) {
          payMethods.push({id: key, rate: self.methods.rate[key], status: self.methodStatus[key]})
        }
        let data = {
          merchantId: self.userInfo.id,
          agentId: self.agentId,
          pay_methods: payMethods,
          remit_fee: self.userInfo.remit_fee,
          channelId: self.userInfo.channel_account_id,
        }
        axios.post('/admin/user/change-agent', data).then(
          res => {
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.$message.success({message: '切换成功'});
              self.getInitData()
              self.agentId = null;
              self.agentVisible = false;
            }
          },
        )
      },
      handleUserStatus() {
        this.statusVisible = true
        this.statusForm.oldStatus = this.statusForm.newStatus = this.userInfo.status.toString()
      },
      updateUserStatus() {
        var self = this;
        if (self.statusForm.newStatus == self.statusForm.oldStatus) {
          return self.statusVisible = false;
        }
        let data = {
          status: self.statusForm.newStatus,
          merchantId: self.userInfo.id, type: 3
        }
        axios.post('/admin/user/clear-unbind-update', data).then(
          res => {
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.$message.success({message: '修改状态成功'});
              self.getInitData()
              self.statusVisible = false;
            }
          },
        )
      },
      handleQuota() {
        let self = this;
        self.quotaForm.remit_quota_perday = self.userInfo.remit_quota_perday;
        self.quotaForm.recharge_quota_perday = self.userInfo.recharge_quota_perday;
        self.quotaForm.remit_quota_pertime = self.userInfo.remit_quota_pertime;
        self.quotaForm.recharge_quota_pertime = self.userInfo.recharge_quota_pertime;
        self.quotaVisible = true;
      },
      updateQuota() {
        let self = this;
        if (self.quotaForm.remit_quota_pertime > self.quotaForm.remit_quota_perday) {
          self.$message.error({message: '单次提款额度不能大于单日提款额度'});
          return
        }
        if (self.quotaForm.recharge_quota_pertime > self.quotaForm.recharge_quota_perday) {
          self.$message.error({message: '单次充值额度不能大于单日充值额度'});
          return
        }
        let data = {
          merchantId: self.userInfo.id,
          remit_quota_perday: self.quotaForm.remit_quota_perday,
          recharge_quota_perday: self.quotaForm.recharge_quota_perday,
          remit_quota_pertime: self.quotaForm.remit_quota_pertime,
          recharge_quota_pertime: self.quotaForm.recharge_quota_pertime,
          channel_account_id: self.userInfo.channel_account_id
        };
        axios.post('/admin/user/update-quota', data).then(
          res => {
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.$message.success({message: '修改额度成功'});
              self.getInitData()
              self.quotaVisible = false;
            }
          },
        )
      },
      handleUpdateUserEmail() {
        this.emailVisible = true
        this.emailForm.oldEmail = this.emailForm.newEmail = this.userInfo.email
      },
      showChangeBalanceDialog(type) {
        let self = this
        self.balanceChangeForm.type = type
        self.balanceChangeForm.amount = ''
        self.balanceChangeForm.bak = ''
        if (type == 1) {
          self.changeBalanceDialogTitle = '调整用户余额'
          self.changeBalanceDialogNotice = '金额可以小于0。大于0表示加款，小于0表示扣款。'
        } else if (type == 2) {
          self.changeBalanceDialogTitle = '冻结余额'
          self.changeBalanceDialogNotice = '最多可冻结金额为：' + self.userInfo.balance
        } else if (type == 3) {
          self.changeBalanceDialogTitle = '解冻余额'
          self.changeBalanceDialogNotice = '最多可解冻金额为：' + self.userInfo.frozen_balance
        }
        self.changeBalanceDialogVisible = true
      },

      handleChangeBalance() {
        let self = this
        self.balanceChangeForm.amount = parseFloat(self.balanceChangeForm.amount)
        self.userInfo.balance = parseFloat(self.userInfo.balance)
        self.userInfo.frozen_balance = parseFloat(self.userInfo.frozen_balance)

        let data = {
          merchantId: self.userInfo.id,
          amount: self.balanceChangeForm.amount,
          bak: self.balanceChangeForm.bak,
          type: self.balanceChangeForm.type,
        };
        if (self.balanceChangeForm.amount == '' || self.balanceChangeForm.amount == 0) {
          // self.$message.error({message: '调整金额不能为0'})
          self.balanceChangeFormErr = '调整金额不能为0'
          return;
        }
        if (self.balanceChangeForm.bak == '') {
          self.balanceChangeFormErr = '调整原因不能为空'
          return;
        }
        let msg = data.type
        if (data.type == 1) {
          if (data.amount <= 0 && Math.abs(data.amount) > self.userInfo.balance) {
            self.balanceChangeFormErr = '超过扣除金额'
            return;
          }
          if (data.amount > 0) {
            msg = '此操作将增加用户余额(' + data.amount + '), 是否继续?'
          }
          else if (data.amount < 0) {
            msg = '此操作将扣除用户余额(' + data.amount + '), 是否继续?'
          }
        } else if (data.type == 2) {
          if (data.amount <= 0 || data.amount > self.userInfo.balance) {
            self.balanceChangeFormErr = data.amount+'超过可冻结金额'+self.userInfo.balance
            return;
          }
          msg = '此操作将冻结用户金额(' + data.amount + '), 是否继续?'
        }
        else if (data.type == 3) {
          if (data.amount <= 0 || data.amount > self.userInfo.frozen_balance) {
            self.balanceChangeFormErr = Math.abs(data.amount)+'超过可解冻金额'+self.userInfo.balance
            return;
          }
          msg = '此操作将解冻用户金额(' + data.amount + '), 是否继续?'
        }
        self.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.changeBalanceBtnDisabled = true
          //转换解冻参数
          if (data.type == 3){
            data.type = 2
            data.amount = 0-data.amount
          }
          axios.post('/admin/user/change-balance', data).then(
            res => {
              self.changeBalanceBtnDisabled = false
              if (res.code == 0) {
                self.$message.success({message: '操作成功'})
                self.changeBalanceDialogVisible = false
                this.getInitData()
              } else {
                self.$message.error({message: res.message})
              }
            }
          )

        }).catch(() => {
          self.$message({
            type: 'warning',
            message: '已取消操作'
          });
        });

      },
      updateEmail() {
        let self = this;
        let regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
        if (self.emailForm.newEmail != null && !regEmail.test(self.emailForm.newEmail)) {
          self.$message.error({message: '邮箱格式错误'})
          return false;
        }
        if (self.emailForm.oldEmail == self.emailForm.newEmail) {
            self.emailVisible = false
            self.$message.error({message: '邮箱地址没有变化'})
          return false;
        }
        let data = {
          email: self.emailForm.newEmail,
          merchantId: self.userInfo.id, type: 4
        }
        axios.post('/admin/user/clear-unbind-update', data).then(
          res => {
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.$message.success({message: '操作成功'});
              self.getInitData()
              self.emailVisible = false;
            }
          },
        )
      },
      onMethodStatusChange(key) {
      },
      checkRate(rate, method_id) {
        let self = this
        self.methodStatus[method_id] = "0"
        if(self.rechargeFeeCanBeZero){
          self.methodStatus[method_id] = "1"
        }
        if (rate > 0) {
          if (rate > this.rechargeMaxRate) {
            self.$message.error({message: '收款费率不能大于系统设置最大费率:' + self.rechargeMaxRate})
          } else {
            self.methodStatus[method_id] = "1"
          }
        }

        if (rate < self.methods.min_rate[method_id] && self.methodStatus[method_id] == '1') {
          self.$message.error({message: self.methods.name[method_id] + '费率小于上级'});
          return;
        }
        if (self.methods.max_rate[method_id] > 0 && rate > self.methods.max_rate[method_id] && self.methodStatus[method_id] == '1') {
          self.$message.error({message: self.methods.name[method_id] + '费率大于下级'});
          return;
        }


        return true;
      },
        handleChild(){
          this.$set(this,'agentMerchantId',this.userInfo.id)
            this.childListVisible = true
        },
        closeChildList(){
            this.agentMerchantId = null
            this.childListVisible = false
        },
        initMerchantId(){
            this.$set(this,'agentMerchantId',this.userInfo.id)
        },
        colse(){
          this.googleCode = null
            this.clearGoogleVisible = false
        },
    }

  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .dashboard-editor-container {
        padding: 32px;
        //background-color: rgb(240, 242, 245);
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
        .authorised_amount span, .authorised_amount b {
            display: inline-block;
            padding-left: 5px;
        }
        .authorised_amount b {
            color: #F56C6C;
        }
        .el-row {
            margin-bottom: 20px;
            &:last-child {
                margin-bottom: 0;
            }
        }
        .el-col {
            border-radius: 4px;
        }
    }

    .rate-list {
        .el-alert__title {
            font-size: 18px !important;
        }
        .el-button--medium {
            padding: 5px 10px;
            color: #ccc;
            margin-bottom: 10px;
            margin-left: 10px;
        }
        .rate-list-name {
            color: #ffffff;
        }
    }

    .api-response-format .el-alert--info{
        padding-left: 30px;
    }

    .error {
        color: #F56C6C !important;
    }
    .el-row-rate .el-select{
        width:80px;
        margin-left: 10px;
    }
    .user-attr .grid-content{
        /*padding-left: 15px;*/
        background: none;
    }
</style>