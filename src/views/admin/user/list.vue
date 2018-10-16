<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-row>
                <el-col :span="24">
                    <el-input class="filter-item select-class" placeholder="商户号" v-model="listQuery.userId" clearable></el-input>
                    <el-input class="filter-item select-class" placeholder="商户帐号" v-model="listQuery.username" clearable></el-input>
                    <el-input class="filter-item select-class" placeholder="父帐号" v-model="listQuery.parentUsername" clearable></el-input>
                    <el-select class="filter-item select-class" v-if="listQuery.parentUsername.length > 0 " v-model="listQuery.child" placeholder="下级" filterable clearable>
                        <el-option
                                v-for="(item,key) in childOptions"
                                :key="key"
                                :label="item"
                                :value="key">
                        </el-option>
                    </el-select>
                    <el-select class="filter-item select-class" v-model="listQuery.status" placeholder="状态" filterable>
                        <el-option
                                v-for="(item,key) in statusOptions"
                                :key="key"
                                :label="item"
                                :value="key">
                        </el-option>
                    </el-select>
                    <el-select class="filter-item select-class" v-model="listQuery.type" placeholder="类型" filterable>
                        <el-option
                                v-for="(item,key) in typeOptions"
                                :key="key"
                                :label="item"
                                :value="key">
                        </el-option>
                    </el-select>

                    <el-select class="filter-item select-class" v-model="listQuery.remit" placeholder="出款通道" filterable>
                        <el-option
                                v-for="(item,key) in remitOptions"
                                :key="item.id"
                                :label="item.channel_name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select class="filter-item select-class" v-model="listQuery.payChannel" placeholder="充值通道" >
                        <el-option
                                v-for="(item,key) in payChannelOptions"
                                :key="item.id"
                                :label="item.channel_name"
                                :value="item.id">
                        </el-option>
                    </el-select>

                    <el-select class="filter-item select-class" v-model="listQuery.tagId" placeholder="分组标签" filterable >
                        <el-option
                                v-for="(item,key) in tagList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                        >
                        </el-option>
                    </el-select>
                    <el-select class="filter-item select-class" v-model="listQuery.accountOpenFeeStatus" placeholder="开户费缴纳状态"  filterable >
                        <el-option
                                v-for="(item,key) in accountOpenFeeStatusOptions"
                                :key="key"
                                :label="item"
                                :value="key">
                        </el-option>
                    </el-select>
                    <el-button class="" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
                    <el-button class="" type="success" v-waves icon="search" @click="handleEditUser">开户</el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-button-group>
                        <el-button class="small-padding-btn" type="info" plain v-waves icon="search"
                                   @click="switchPayChannelWithQueryForm=0; showSwitchPayChannel()">切充值
                        </el-button>
                        <el-button class="small-padding-btn" type="info" plain v-waves icon="search"
                                   @click="switchPayChannelWithQueryForm=1; showSwitchPayChannel()">切全部
                        </el-button>
                    </el-button-group>
                    <el-button-group>
                        <el-button class="small-padding-btn" type="warning" plain v-waves icon="search"
                                   @click="switchRemitWithQueryForm=0; showSwitchRemitChannelDialog()">切出款
                        </el-button>
                        <el-button class="small-padding-btn" type="warning" plain v-waves icon="search"
                                   @click="switchRemitWithQueryForm=1;showSwitchRemitChannelDialog()">切全部
                        </el-button>
                    </el-button-group>
                    <el-button-group>
                        <el-button class="small-padding-btn" type="success" plain v-waves icon="search"
                                   @click="switchTagWithQueryForm=0;showSwitchTagDialog()">切换组
                        </el-button>
                        <el-button class="small-padding-btn" type="success" plain v-waves icon="search"
                                   @click="switchTagWithQueryForm=1;showSwitchTagDialog()">切全部
                        </el-button>
                    </el-button-group>
                    <!--<el-button-group>-->
                        <!--<el-button v-for="(item,key) in payTypeOptions" :key="key" class="small-padding-btn"-->
                                   <!--type="primary" plain v-waves icon="search" @click="switchPayMedhod(key,item)">{{item}}-->
                        <!--</el-button>-->
                    <!--</el-button-group>-->
                </el-col>
            </el-row>

        </div>

        <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="数据加载中，请稍候..." border fit stripe
                  highlight-current-row style="width: 100%" :summary-method="getSummaries" @sort-change="handleChangeSort"
                  @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    width="30">
            </el-table-column>

            <el-table-column label="商户号">
                <template slot-scope="scope">
                    <span v-bind:class="{ 'error': scope.row.status_str!='正常' }" class="link-type" @click="showDetail(scope.row)">{{scope.row.id}}</span>
                </template>
            </el-table-column>

            <el-table-column label="类型">
                <template slot-scope="scope">
                    <span class="link-type" @click="showDetail(scope.row)">{{scope.row.group_str}}</span>
                </template>
            </el-table-column>

            <el-table-column label="商户帐号">
                <template slot-scope="scope">
                    <span v-bind:class="{ 'error': scope.row.status_str!='正常' }" class="link-type" @click="showDetail(scope.row)">{{scope.row.username}}</span>
                </template>
            </el-table-column>
            <el-table-column label=" 上级商户">
                <template slot-scope="scope">
                    <span>{{parentUserNameOptions[scope.row.parent_agent_id]}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="出款通道">
                <template slot-scope="scope">
                    <span>{{scope.row.remit_channel_name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="分组标签">
                <template slot-scope="scope">
                    <span v-for="(p,pk) in scope.row.tags" :key="pk">{{p.name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="可用余额" sortable="custom" prop="balance" width="150px;">
                <template slot-scope="scope">
                    <span>{{scope.row.balance==0?0:scope.row.balance}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="冻结余额">
                <template slot-scope="scope">
                    <span>{{scope.row.frozen_balance==0?0:scope.row.frozen_balance}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" :label="p" v-for="(p,pk) in payTypeFields" :key="pk">
                <template slot-scope="scope">
                    <em v-bind:class="{ error: isMerchantPayMethodStatus(scope.row.pay_config,pk) }">{{scope.row.pay_config |
                        filterMerchantPayMethod(pk)}}</em>
                </template>
            </el-table-column>
            <el-table-column align="center" label="下发费率">
                <template slot-scope="scope">
                    <span>{{scope.row.remit_fee}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="状态">
                <template slot-scope="scope">
                    <span>{{scope.row.status_str}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="开户费">
                <template slot-scope="scope">
                    <span>{{scope.row.account_open_fee}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="开户费缴纳状态">
                <template slot-scope="scope">
                    <span>{{scope.row.account_open_fee_status_str}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="注册时间">
                <template slot-scope="scope">
                    <span class="link-type">{{scope.row.created_at}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" class="action-btns"  fixed="right" width="180">
                <template slot-scope="scope">
                    <el-button class="filter-item" size="mini" type="primary"
                               @click="handleDetail(scope.row)" v-waves>详情
                    </el-button>

                    <el-dropdown size="mini">
                        <el-button type="primary" size="mini">
                            更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown" size="mini">
                            <el-dropdown-item @click.native="handleResetLoginPass(scope.row)">重置登录密码</el-dropdown-item>
                            <el-dropdown-item @click.native="handleClearPass(scope.row)">清除资金密码</el-dropdown-item>
                            <el-dropdown-item v-if="scope.row.key_2fa_len > 0" @click.native="handleUnbind(scope.row)">解绑安全令牌</el-dropdown-item>
                            <el-dropdown-item @click.native="handleSetRate(scope.row)">设置费率</el-dropdown-item>
                            <el-dropdown-item @click.native="handleSetApiStatus(scope.row)">接口开关</el-dropdown-item>
                            <el-dropdown-item @click.native="handleUserStatus(scope.row)">修改商户状态</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page"
                           :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog title="切换通道" :visible.sync="dialogSwitchChannelVisible" width="600px">
            <el-form label-width="80px">
                <el-form-item label="通道类型" class="switchPayChannelForm-payMethodIdList">
                    <!--<el-select v-model="switchPayChannelForm.payMethodId" placeholder="选择通道类型"-->
                               <!--@change="getAccountListInSwitchPayChannelForm">-->
                        <!--<el-option-->
                                <!--v-for="(item,key) in payTypeOptions"-->
                                <!--:key="key"-->
                                <!--:label="item"-->
                                <!--:value="key">-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                    <el-checkbox v-model="switchPayChannelForm.payMethodId[key]" v-for="(item,key) in payTypeOptions"
                     :key="key" :label="item" @change="getAccountListInSwitchPayChannelForm">{{item}}</el-checkbox>
                </el-form-item>
                <el-form-item v-loading="switchPayChannelFormAccountListLoading" element-loading-text="数据加载中，请稍候..."
                              label="通道" width="200">
                    <el-select v-model="switchPayChannelForm.rechargeChannelId" placeholder="选择请选择通道">
                        <el-option
                                v-for="(item,key) in methodFilteredPayChannelOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="switchPayChannelFormAccountListLoading = false;dialogSwitchChannelVisible = false">取 消</el-button>
                <el-button type="primary" @click="switchPayChannel()">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="切换出款通道" :visible.sync="dialogSwitchRemitVisible" width="500px">
            <el-form label-width="80px">
                <el-form-item label="出款通道" width="200">
                    <el-select v-model="remitIdSwitchTo" placeholder="请选择出款通道">
                        <el-option
                                v-for="(item,key) in remitOptions"
                                :key="item.id"
                                :label="item.channel_name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogSwitchRemitVisible = false">取 消</el-button>
                <el-button type="primary" @click="switchRemit()">确 定</el-button>
            </div>
        </el-dialog>


        <el-dialog title="切换分组" :visible.sync="dialogSwitchTagVisible" width="500px">
            <el-form label-width="80px">
                <el-form-item label="新增分组" width="200">
                    <el-input style="width: 200px" class="filter-item" placeholder="分组名称" v-model="newTag"></el-input>
                    <el-button type="primary" @click="addTag()">确 定</el-button>
                </el-form-item>

                <el-form-item label="选择分组">
                    <!--<el-radio-group v-model="tagsSwitchTo" size="small">-->
                        <!--<el-radio :label="item.id" border v-for="(item,key) in tagList"-->
                                  <!--:key="item.id">{{item.name}}-->
                        <!--</el-radio>-->
                    <!--</el-radio-group>-->
                    <el-select class="filter-item" v-model="tagsSwitchTo" placeholder="分组标签"  >
                        <el-option
                                v-for="(item,key) in tagList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogSwitchTagVisible = false">取 消</el-button>
                <el-button type="primary" @click="switchTag()">确定切换</el-button>
            </div>
        </el-dialog>

        <el-dialog title="设置费率" :visible.sync="rateVisible" width="53%" >
            <el-form :model="rateForm">
                <el-form-item label="出款手续费(元/每笔)：" label-width="180px">
                    <el-input size="small" v-model="rateForm.remit_fee" style="width: 200px"></el-input>
                    <span style="margin-left: 20px;">可填区间</span>
                    <span v-text="userInfo.parent_remit_fee"></span> ~
                    <span v-if="userInfo.lower_remit_fee > 0 " v-text="userInfo.lower_remit_fee"></span>
                    <span v-else></span>
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
    </div>

</template>

<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime} from '@/utils'
  import common from '@/utils/common'
  import axios from '@/utils/http'
  import {mapGetters} from 'vuex'

  export default {
    name: 'vue_merchant_list_nocache',
    directives: {
      waves
    },
    components: {},
    data() {
      return {
        rules: {},
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          importance: undefined,
          dateStart: null,//new Date(new Date().setHours(0, 0, 0, 0)),
          dateEnd: null,
          orderNo: null,
          userId: null,
          username: null,
          parentUsername: '',
          status: null,
          accountOpenFeeStatus: null,
          type: null,
          remit: null,
          payChannel: null,
          tagId: '',
          sort: '',
          appIds: [],
            child:null
        },
        switchPayChannelForm: {
          payMethodId: {},
          rechargeChannelId: '',
          appIds: [],
        },
        switchPayChannelFormAccountListLoading: false,
        methodFilteredPayChannelOptions: [],
        dialogSwitchChannelVisible: false,
        newTag: '',
        tagList: [],
        filteredTagList: [],
        tagsSwitchTo: '',
        dialogSwitchTagVisible: false,
        dialogSwitchRemitVisible: false,
        switchPayChannelWithQueryForm: false,
        switchRemitWithQueryForm: false,
        switchTagWithQueryForm: false,
        remitIdSwitchTo: '',
        currentMerchantRechargeConfigs: [],
        summery: [],
        multipleSelection: [],
        tableKey: 0,
        constFalse: false,
        constTrue: true,
        statusOptions: [],
        typeOptions: [],
        payTypeOptions: [],
        payTypeFields: [],
        remitOptions: [],
        payChannelOptions: [],
        parentUserNameOptions: [],
        aviableRemitOptions: [],
        aviablePayChannelOptions: [],
        accountOpenFeeStatusOptions: [],

        quotaVisible:false,
        emailVisible:false,
        ipVisible:false,
        agentVisible:false,
        rateVisible:false,
        statusVisible:false,
        userInfo:{},
        methods:{},
        methodStatus:{},
        payMethodsOptions:{},
        agentOptions:[],
        remitMaxFee: 5,
        rechargeMaxRate: 0.3,
        settlementType: {},
        settlementTypeOptions: [],
        remitFeeCanBeZero:0,
        rechargeFeeCanBeZero:0,

        userStatusOptions:{},
        statusForm:{
          oldStatus:null,
          newStatus:null
        },
        rateForm:{
          channel_id:null,
          remit_channel_id:null,
          parent_agent_id:null,
          remit_fee:0,
          pay_methods:{},
        },

        apiVisible: false,
        apiForm:{
          allow_api_fast_remit:"0",
          allow_manual_fast_remit: "0",
          allow_api_recharge:"1",
          allow_api_remit:"1",
          allow_manual_recharge:"1",
          allow_manual_remit:"1",
        },
          childOptions:['直属下级','所有下级'],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
      }
    },
    filters: {
      filterMerchantPayMethod(payConfig, methodId) {
        if (!payConfig || !methodId) return
        let val = ''
        if (typeof payConfig[methodId] !== 'undefined') {
          if(payConfig[methodId].rate==0) payConfig[methodId].rate = '-'
          val = payConfig[methodId].rate + ' ' + payConfig[methodId].channel_account_name
        }
        return val
      }
    },
    created() {
      this.getFormOptions()

      this.getList()
    },
    computed: {
      ...mapGetters([
        'roles', 'uid', 'user'
      ])
    },
    methods: {
      isMerchantPayMethodStatus(payConfig, methodId) {
        if (!payConfig || !methodId) return true

        if (typeof payConfig[methodId] == 'undefined' || typeof payConfig[methodId].status == 'undefined' || payConfig[methodId].status != 1) {
          return true
        }
        return false
      },
      handleSelectionChange(val) {
        let self = this
        self.multipleSelection = val;
        self.listQuery.appIds = []
        self.multipleSelection.forEach((u) => {
          self.listQuery.appIds.push(u.id)
        })
      },
      handleChangeSort(column, prop, order){
        this.listQuery.sort = ''
        if(column.order == 'ascending'){
          this.listQuery.sort=column.prop+'+'
        }else if(column.order == 'descending'){
          this.listQuery.sort=column.prop+'-'
        }
        this.getList()
      },
      getList() {
        var self = this

        self.listLoading = true
        if(self.listQuery.parentUsername == null || self.listQuery.parentUsername.length == 0){
            self.listQuery.child = null
        }
        axios.post('/admin/user/list', self.listQuery).then(
          res => {
            self.listLoading = false

            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.list = res.data.data
              self.summery = res.data.summery
              self.total = res.data.pagination.total
              self.parentUserNameOptions = res.data.parentUserNameOptions
              self.listQuery.appIds = []
            }

          },
          res => {
            self.listLoading = false
            self.$message.error({message: res.message})
          }
        )
      },
      getUserEditDetail(user, cb) {
        let self = this
        self.listLoading = true
        axios.post('/admin/user/detail',{merchantId:user.id}).then(
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
              self.settlementType = res.data.methods.settlement_type

              let methodStatus = {}
              for (let index in res.data.methods.status) {
                methodStatus[index] = res.data.methods.status[index].toString()
              }
              self.methodStatus = methodStatus

              self.apiForm.user_id = self.userInfo.id
              self.apiForm.allow_api_fast_remit = self.userInfo.allow_api_fast_remit + ''
              self.apiForm.allow_manual_fast_remit = self.userInfo.allow_manual_fast_remit + ''
              self.apiForm.allow_api_recharge = self.userInfo.allow_api_recharge + ''
              self.apiForm.allow_api_remit = self.userInfo.allow_api_remit + ''
              self.apiForm.allow_manual_recharge = self.userInfo.allow_manual_recharge + ''
              self.apiForm.allow_manual_remit = self.userInfo.allow_manual_remit + ''

              if(cb){
                cb()
              }
            }
          },
        )
      },
      filterTagList(query) {
        this.filteredTagList = this.tagList.filter(tag => {
          return tag.pinyin.indexOf(query) > -1 || tag.name.indexOf(query) > -1;
        })
        // console.log(this.tagList)
        // console.log(this.filteredTagList)
      },
      getTagList() {
        // return;
        let self = this
        axios.post('/admin/user/tag-list',).then(
          res => {
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.tagList = res.data
            }
          },
          res => {
            self.$message.error({message: res.message})
          }
        )
      },
      showSwitchTagDialog(type) {
        let self = this
        if(self.switchTagWithQueryForm==0 && this.multipleSelection.length == 0){
          self.$message.error({message: '请先勾选要切换的商户'})
          return
        }
        self.dialogSwitchTagVisible = true
        self.getTagList()
      },
      addTag() {
        let self = this
        console.log('self.newTag', self.newTag)
        if (!self.newTag) {
          self.$message.error({message: '请填写正确的分组'})
          return;
        }
        axios.post('/admin/user/add-tag', {tag: self.newTag}).then(
          res => {
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.$message.success({message: res.message})
              // self.getTagList()
              self.tagList.push(res.data)
            }

          },
          res => {
            self.$message.error({message: res.message})
          }
        )
      },
      switchTag() {
        let self = this
        console.log('self.tagsSwitchTo', self.tagsSwitchTo)
        if (!self.tagsSwitchTo) {
          self.$message.error({message: '请选择正确的分组'})
          return;
        }
        let postData = self.listQuery
        if(self.switchTagWithQueryForm==1){
          postData.appIds=[]
        }
        postData.tagIdSwitchTo = self.tagsSwitchTo

        console.log(postData)
        axios.post('/admin/user/switch-tag', postData).then(
          res => {
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.$message.success({message: res.message})

              self.dialogSwitchTagVisible = false
              if (self.listQuery.tagId != '') self.listQuery.tagId = ''
              self.getList()
            }
          },
          res => {
            self.$message.error({message: res.message})
          }
        )
      },
      getAccountListInSwitchPayChannelForm() {

        let self = this
        self.switchPayChannelFormAccountListLoading = true
        let methodIds = []
        for(let x in self.switchPayChannelForm.payMethodId){
          if(self.switchPayChannelForm.payMethodId[x]){
            methodIds.push(x)
          }
        }
        if(methodIds.length==0){
          // self.$message.error({message: '请选择收款类型！'})
          self.switchPayChannelFormAccountListLoading = false
          return
        }
        axios.post('/admin/user/channel-account-list', {methodId: methodIds}).then(
          res => {
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.switchPayChannelForm.rechargeChannelId = ''
              self.methodFilteredPayChannelOptions = res.data
              if(res.data.length==0){
                self.$message.error({message: '没有符合筛选条件的通道账户！'})
              }

            }
            self.switchPayChannelFormAccountListLoading = false
          },
          res => {
            self.$message.error({message: res.message})
            self.switchPayChannelFormAccountListLoading = false
          }
        )
      },

      showSwitchPayChannel() {
        let self = this

        if(self.switchPayChannelWithQueryForm==0 && this.multipleSelection.length == 0){
          self.$message.error({message: '请先勾选要切换的商户'})
          return
        }

        self.initSwitchPayFormMethods()
        self.dialogSwitchChannelVisible = true
      },
      switchPayChannel() {
        let self = this
        if (!self.switchPayChannelForm.rechargeChannelId) {
          self.$message.error({message: '请选择收款方式及收款渠道'})
          return
        }
        let postData = self.listQuery
        postData.switchPayChannelForm =   JSON.parse(JSON.stringify(self.switchPayChannelForm));

        if(self.switchPayChannelWithQueryForm==1){
          postData.appIds=[]
        }
        let methodIds = []
        for(let x in self.switchPayChannelForm.payMethodId){
          if(self.switchPayChannelForm.payMethodId[x]){
            methodIds.push(x)
          }
        }

        if (!methodIds) {
          self.$message.error({message: '请选择收款方式及收款渠道'})
          return
        }

        postData.switchPayChannelForm.payMethodId = methodIds
        self.initSwitchPayFormMethods()
        console.log(JSON.stringify(postData))

        axios.post('/admin/user/switch-recharge-channel', postData).then(
          res => {
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.$message.success({message: '通道切换成功'})
              self.methodFilteredPayChannelOptions = []
              self.listQuery.payChannel = ''
              self.switchPayChannelForm.rechargeChannelId = ''
              self.getList()
              self.dialogSwitchChannelVisible = false
            }
          },
          res => {
            self.$message.error({message: res.message})
          }
        )
      },
      switchPayMedhod(key, val) {
        this.listQuery.payMedhod = key;
        this.getList();
        console.log(key, val)
      },
      initSwitchPayFormMethods(){
        console.log('initSwitchPayFormMethods')
        let self = this
        self.switchPayChannelForm.payMethodId = {}
        for (let i in self.payTypeFields) {
          self.switchPayChannelForm.payMethodId[i] = false
        }
      },
      showSwitchRemitChannelDialog() {
        let self = this
        if(self.switchRemitWithQueryForm==0 && this.multipleSelection.length == 0){
          self.$message.error({message: '请先勾选要切换的商户'})
          return
        }
        self.dialogSwitchRemitVisible = true
      },
      switchRemit() {
        console.log(this.multipleSelection)
        let self = this
        if (!self.remitIdSwitchTo) {
          self.$message.error({message: '请选择出款渠道'})
          return
        }
        let postData = self.listQuery
        postData.remitIdSwitchTo = self.remitIdSwitchTo
        if(self.switchRemitWithQueryForm==1){
          postData.appIds=[]
        }
        console.log(postData)

        axios.post('/admin/user/switch-remit-channel', postData).then(
          res => {
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.dialogSwitchRemitVisible = false
              self.$message.success({message: '通道切换成功'})
              self.methodFilteredPayChannelOptions = []
              self.listQuery.remit = ''
              self.getList()
            }
          },
          res => {
            self.$message.error({message: res.message})
          }
        )
      },
      getFormOptions() {
        self = this

        axios.post('/admin/user/form-option-list').then(
          res => {
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {

              self.statusOptions = res.data.user_status
              self.accountOpenFeeStatusOptions = res.data.account_open_fee_status
              self.typeOptions = res.data.user_type
              self.payTypeOptions = res.data.pay_method
              self.aviableRemitOptions = res.data.channel_can_remit
              self.aviablePayChannelOptions = res.data.channel_can_recharge
              self.remitOptions = res.data.all_channel
              self.payChannelOptions = res.data.all_channel
              self.tagList = self.filteredTagList = res.data.tags
              self.remitMaxFee = res.data.remitMaxFee
              self.rechargeMaxRate = res.data.rechargeMaxRate
              self.settlementTypeOptions = res.data.settlementType
              self.rechargeFeeCanBeZero = res.data.rechargeFeeCanBeZero
              self.remitFeeCanBeZero = res.data.remitFeeCanBeZero
              let payTypeFields = {}
              for (let i in res.data.pay_method) {
                if (i != '__ALL__') payTypeFields[i] = res.data.pay_method[i]
              }
              self.payTypeFields = payTypeFields
            }
          },
          res => {
            self.$message.error({message: res.message})
          }
        )
      },

      handleResetLoginPass(user){
        let self = this
        self.$confirm('此操作将重置用户密码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let data = {
            merchantId:user.id,
            type:5
          };
          axios.post('/admin/user/clear-unbind-update',data).then(
            res=>{
              if(res.code == 0){
                self.$message.success({message:'登录密码重置成功'});
              }else{
                self.$message.error({message:res.message});
                self.getList()
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
      handleClearPass(user){
        if(user.financial_password_len<=0){
          this.$message.error({message:'该商户还没有设置资金密码'});
          return;
        }

        let self = this
        self.$confirm('此操作将清除资金密码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let data = {
            merchantId:user.id,
            type:1
          };
          axios.post('/admin/user/clear-unbind-update',data).then(
            res=>{
              if(res.code == 0){
                self.$message.success({message:'资金密码已清除'});
              }else{
                self.$message.error({message:res.message});
                self.getList()
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
      handleUnbind(user){
        if(user.key_2fa_len <= 0){
          this.$message.error({message:'该商户还没有绑定安全令牌'});
          return;
        }

        let self = this
        self.$confirm('此操作将清解绑安全令牌, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let data = {
            merchantId:user.id,
            type:2
          };
          axios.post('/admin/user/clear-unbind-update',data).then(
            res=>{
              if(res.code == 0){
                this.$message.success({message:'安全令牌已解绑'});
              }else{
                this.$message.error({message:res.message});
                this.getList()
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

      onMethodStatusChange(key){
      },
      handleSetRate(user){
        let self = this
        self.getUserEditDetail(
          user,
          function () {
            self.rateForm.remit_fee = self.userInfo.remit_fee;
            self.rateForm.channel_id = self.userInfo.channel_account_id;
            self.rateForm.remit_channel_id = self.userInfo.remit_channel_account_id;
            self.rateForm.parent_agent_id = self.userInfo.parent_agent_id;
            for(let key in self.methods.rate){
              self.rateForm.pay_methods[key] = self.methods.rate[key];
            }
            self.rateVisible = true;

          }
        )

      },
      handleSetApiStatus(user){
        console.log(user)
        let self = this
        self.getUserEditDetail(
          user,
          function () {
            self.apiVisible = true;
          }
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
      updateRate(){
        let self = this;
        if(self.rateForm.remit_fee < self.userInfo.parent_remit_fee){
          this.$message.error({message:'出款费率'+self.rateForm.remit_fee +'不能小于上级'+self.userInfo.parent_remit_fee});
          return
        }
        if(self.userInfo.lower_remit_fee > 0 && self.rateForm.remit_fee > self.userInfo.lower_remit_fee){
          this.$message.error({message:'出款费率'+self.rateForm.remit_fee +'不能大于下级'+self.userInfo.lower_remit_fee});
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
          if(self.methodStatus[i] == '1' && !self.checkRate(rate,i)){
            status = 1;
          }
          payMethods.push({id: i, rate: rate, status:self.methodStatus[i],settlement_type:self.settlementType[i]})
        }
        if(status == 1 ){
          self.$message.error({message:'有收款费率错误！请检查'});
          return;
        }
        if(payMethods.length==0){
          self.$message.error({message:'请填写收款费率！'});
          return;
        }

        let data = {
          merchantId:self.userInfo.id,
          channelId:self.rateForm.channel_id,
          remitChannelId:self.rateForm.remit_channel_account_id,
          parent_agent_id:self.rateForm.parent_agent_id,
          remit_fee:self.rateForm.remit_fee,
          appSecrets:self.rateForm.app_secrets,
          pay_methods:payMethods,
          remitQuotaPerday:self.rateForm.remit_quota_perday,
          rechargeQuotaPerday:self.rateForm.recharge_quota_perday,
          rechargeQuotaPertime:self.rateForm.recharge_quota_pertime,
          remitQuotaPertime:self.rateForm.remit_quota_pertime
        };
        axios.post('/admin/user/update-rate', data).then(
          res => {
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.getList();
              self.$message.success({message:'编辑成功'});
              self.rateVisible = false;
            }
          },
        )
      },

      handleUserStatus(user){
        let self = this
        self.getUserEditDetail(
          user,
          function () {
            self.statusVisible = true
            self.statusForm.oldStatus = self.statusForm.newStatus = user.status.toString()
          }
        )
      },

      updateUserStatus(){
        var self = this;
        if(self.statusForm.newStatus == self.statusForm.oldStatus){
          return self.statusVisible = false;
        }
        let data = {
          status:self.statusForm.newStatus,
          merchantId:self.userInfo.id,type:3
        }
        axios.post('/admin/user/clear-unbind-update', data).then(
          res => {
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.$message.success({message:'修改状态成功'});
              self.getList()
              self.statusVisible = false;
            }
          },
        )
      },

      showNotifyRet(row) {
        // self.$message.error({message: res.message})
        this.$alert(row.notify_ret, '商户服务器响应内容', {
          confirmButtonText: '确定',
          callback: action => {

          }
        });
      },
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '当前查询条件总计';
            return;
          }
          sums[index] = 'N/A';
        });
        sums[2] = this.summery.amount + '元'
        return sums;
      },
      //:span-method="objectSpanMethod"
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 0) {
          if (rowIndex == this.data.data.length) {
            return {
              rowspan: 1,
              colspan: 4
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      timeFilter(time) {
        if (!time[0]) {
          this.listQuery.start = undefined
          this.listQuery.end = undefined
          return
        }
        this.listQuery.start = parseInt(+time[0] / 1000)
        this.listQuery.end = parseInt((+time[1] + 3600 * 1000 * 24) / 1000)
      },
      handleEditUser() {
        this.$router.push({name: 'vue_merchant_add'});
      },
      handleDetail(row) {
        this.$router.push({name: 'vue_merchant_detail', query: {merchantId: row.id}});
      },
        showDetail(){

        }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .action-btns a {
        margin-left: 5px;
    }

    .pagination-container {
        margin-top: 10px;
    }

    .el-tag {
        margin-top: 10px;
        margin-left: 10px;
    }

    .el-table td, .el-table th {
        padding: 5px 0 !important;
    }

    .filter-container .filter-item {
        margin-bottom: 5px;
        width: 120px;
    }

    .small-padding-btn {
        padding: 12px 5px !important;
    }

    /*.el-button + .el-button {*/
        /*margin-left: 5px;*/
    /*}*/

    .dialog-footer {
        text-align: center;
    }

    .recharge-fee-pop .el-button--mini {
        padding: 2px 4px;
    }

    .error {
        color: #F56C6C
    }


    .el-row-rate .el-select{
        width:80px;
        margin-left: 10px;
    }
    .switchPayChannelForm-payMethodIdList .el-checkbox{
            width: 120px;
    }
    .switchPayChannelForm-payMethodIdList .el-checkbox+.el-checkbox{
        margin-left: 0 !important;
    }
    .el-dropdown-menu--mini .el-dropdown-menu__item {
        line-height: 36px !important;
        font-size: 14px !important;
    }
    .select-class {
        width: 13% !important;
    }
</style>