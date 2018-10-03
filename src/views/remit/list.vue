<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" size="small" class="filter-item"
                placeholder="结算订单号" v-model="listQuery.orderNo"></el-input>
      <el-input @keyup.enter.native="handleFilter" size="small" style="width: 200px;" class="filter-item"
                placeholder="商户订单号" v-model="listQuery.merchantOrderNo"></el-input>
      <el-input @keyup.enter.native="handleFilter" size="small" style="width: 200px;" class="filter-item" placeholder="凭证" v-model="listQuery.channelOrderNo"></el-input>
      <el-input class="filter-item" size="small" style="width: 200px;" v-model="listQuery.merchantNo"
                placeholder="商户编号"></el-input>
      <el-input class="filter-item" size="small" style="width: 200px;" v-model="listQuery.merchantAccount"
                placeholder="商户账号"></el-input>
      <el-select class="filter-item" size="small" v-model="listQuery.channelAccount" placeholder="通道号" multiple >
        <el-option
            v-for="(item,key) in channelAccountOptions"
            :key="key"
            :label="item"
            :value="key">
        </el-option>
      </el-select>
      <el-input @keyup.enter.native="handleFilter" size="small" style="width: 200px;" class="filter-item"
                placeholder="卡号" v-model="listQuery.bankNo"></el-input>
      <el-select class="filter-item" v-model="listQuery.status" size="small" placeholder="状态" multiple >
        <el-option
            v-for="(item,key) in statusOptions"
            :key="key"
            :label="item"
            :value="key">
        </el-option>
      </el-select>
      <el-date-picker class="filter-item" size="small" style="width: 200px;"
                      v-model="listQuery.dateStart"
                      align="right"
                      type="datetime"
                      placeholder="开始日期"
                      :picker-options="pickerOptions">
      </el-date-picker>
      <el-date-picker class="filter-item" size="small" style="width: 200px;"
                      v-model="listQuery.dateEnd"
                      align="right"
                      type="datetime"
                      placeholder="结束日期"
                      :picker-options="pickerOptions">
      </el-date-picker>
      <el-input class="filter-item" size="small" style="width: 200px;" @change.native="checkNumber()"
                v-model="listQuery.minMoney" placeholder="金额"></el-input>
      -
      <el-input class="filter-item" size="small" style="width: 200px;" @change.native="checkNumber()"
                v-model="listQuery.maxMoney"></el-input>
      <!--<el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="持卡人" v-model="listQuery.bankAccount"></el-input>-->
      <!--<el-select @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.sort" placeholder="排序">-->
      <!--<el-option v-for="item in sortOptions" :key="item.label" :label="item.label" :value="item.key">-->
      <!--</el-option>-->
      <!--</el-select>-->

      <el-button class="filter-item" size="small" type="primary" v-waves icon="search" @click="handleFilter">搜索
      </el-button>
      <el-button class="filter-item" size="small" type="primary" v-waves icon="search" @click="exportResult('csv')">
        导出CSV
      </el-button>
      <!--<el-button class="filter-item" size="small" type="primary" v-waves @click="syncStatus()">批量同步状态</el-button>-->
      <el-button class="filter-item" size="small" type="primary" v-waves @click="setChecked()">批量审核</el-button>
      <el-button class="filter-item" size="small" type="primary" v-waves @click="dialogSwitchRemitVisible=true">批量切通道</el-button>
      <el-button class="filter-item" size="small" type="primary" v-waves @click="autoCommitStatusVisible=true">自动提交开关</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="数据加载中，请稍候..." border fit
              highlight-current-row style="width: 100%;font-size: 12px" :summary-method="getSummaries"
              @selection-change="handleSelectionChange" show-summary stripe>

      <el-table-column align="center" fixed type="selection" width="55"></el-table-column>
      <el-table-column prop="merchant_id" label="商户编号" width="80"></el-table-column>
      <el-table-column prop="merchant_account" label="商户账号" width="100"></el-table-column>
      <el-table-column prop="order_no" label="结算订单号" width="165"></el-table-column>
      <el-table-column prop="merchant_order_no" label="商户订单号" width="160"></el-table-column>
      <el-table-column prop="bank_account" label="持卡人" width="80"></el-table-column>
      <el-table-column prop="bank_no" label="卡号" width="200">
        <template slot-scope="scope">
          <el-popover
              v-loading="bankCardTodayStatisticLoading"
              placement="right"
              title="该卡今日出款统计"
              width="400"
              trigger="click"
          >
            <el-table :data="bankCardTodayStatisticList">
              <el-table-column width="150" property="status_str" label="状态"></el-table-column>
              <el-table-column width="100" property="nums" label="数量"></el-table-column>
              <el-table-column width="100" property="amount" label="金额"></el-table-column>
            </el-table>
            <span class="link-type" slot="reference"
                  @click="getBankCardTodayStatistic(scope.row)">{{scope.row.bank_no}}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="channel_account_name" label="通道" width="100"></el-table-column>
      <el-table-column prop="amount" label="金额" width="100"></el-table-column>
      <el-table-column prop="bank_name" label="银行" width="130">
        <template slot-scope="scope">
          <span>{{scope.row.bank_code}}/{{scope.row.bank_name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status_str" label="订单状态" width="130">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.bank_ret!=''" class="item" effect="light" placement="top">
            <span class="link-type">{{scope.row.status_str}}</span>
            <span slot="content" v-html="scope.row.bank_ret"></span>
          </el-tooltip>
          <span v-if="scope.row.bank_ret==''">{{scope.row.status_str}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="channel_order_no" label="凭证" width="165"></el-table-column>
      <el-table-column prop="bak" label="备注" width="100">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.bak!=''" class="item" effect="light" placement="top">
            <span class="link-type">详情</span>
            <span slot="content" v-html="scope.row.bak"></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="merchant_check_status_str" label="商户审核" width="100"></el-table-column>
      <el-table-column prop="created_at" label="建立时间" width="160"></el-table-column>

      <el-table-column align="center" label="操作" class="action-btns" fixed="right" width="220px" class-name="op-column">
        <template slot-scope="scope">
          <div v-if="scope.row.merchant_check_status_str!='未审核'">
            <el-button @click.native="syncStatusRealtime(scope.row.id)"  type="primary" size="mini">同步</el-button>

            <el-button class="filter-item" size="mini" v-if="[0,20].indexOf(scope.row.status) !== -1" icon="el-icon-zoom-in
" @click="setChecked(scope.row.id)" type="success" v-waves>审核</el-button>
            <el-dropdown size="mini">
              <el-button type="primary" size="mini">
                更多操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown" size="mini">
                <el-dropdown-item ><el-button @click.native="setSuccess(scope.row)" style="width: 100%" type="success" size="mini">成功</el-button></el-dropdown-item>
                <el-dropdown-item ><el-button @click.native="reSubmit(scope.row.id)" style="width: 100%" type="danger" size="mini">重提</el-button></el-dropdown-item>
                <el-dropdown-item ><el-button @click.native="handleTrack(scope.row)" style="width: 100%" type="primary" size="mini">录入</el-button></el-dropdown-item>
                <el-dropdown-item >
                  <el-button
                          class="filter-item"
                          size="mini" v-if="[-10,-20,10,20,30,40,60].indexOf(scope.row.status) !== -1"
                          type="warning"
                          style="width: 100%"
                          @click="setFail(scope.row)"
                          v-waves>退款
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item ><el-button @click.native="addToBlackList(scope.row)" style="width: 100%" type="info" size="mini">拉黑</el-button></el-dropdown-item>
                <el-dropdown-item ><el-button @click.native="syncStatus(scope.row.id)" style="width: 100%" type="danger" size="mini">强制同步</el-button></el-dropdown-item>
                <!--<el-button class="filter-item" icon="el-icon-refresh" size="mini" v-if="[0,20,60].indexOf(scope.row.status) !== -1" @click="currentRemit=scope.row;dialogSwitchRemitVisible=true" v-waves>切通道</el-button>-->
                <!--<a class="link-type" @click=showDetail(scope.row)>详情</a>-->
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>

    </el-table>
    <el-row class="summary-list">
      <el-tag type="warning" v-for="(v,k) in summery.all_status_list" :key="v.status"><span>{{v.status_str}}:{{v.amount}}</span>
      </el-tag>
    </el-row>
    <el-dialog title="调单录入" :visible.sync="trackVisible" width="30%">
      <el-form :model="trackForm">
        <el-form-item label="调单类型：">
          <el-radio v-model="trackForm.type" label="1">投诉</el-radio>
          <el-radio v-model="trackForm.type" label="2">协查</el-radio>
          <el-radio v-model="trackForm.type" label="3">其他</el-radio>
        </el-form-item>
        <el-form-item label="上传：">
          <el-upload
              class="avatar-uploader"
              :action=uploadUrl
              :show-file-list="false"
              multiple
              :limit="3"
              ref="track_upload"
              :on-success="handleUpload">
            <img v-if="trackForm.upload_url.length > 0" v-for="item in trackForm.upload_url" :src="item" class="avatar">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" :rows="3" style="width: 280px" v-model="trackForm.note">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="trackVisible = false">取 消</el-button>
        <el-button type="primary" @click="createTrack">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="切换出款通道" :visible.sync="dialogSwitchRemitVisible" width="500px">
      <el-form label-width="80px">
        <el-form-item label="出款通道" width="200">
          <el-select class="filter-item" size="small" v-model="remitIdSwitchTo" placeholder="请选择出款通道">
            <el-option
                v-for="(item,key) in channelAccountOptions"
                :key="key"
                :label="item"
                :value="key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSwitchRemitVisible = false">取 消</el-button>
        <el-button type="primary" @click="switchRemit()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="切换自动提交到上游" :visible.sync="autoCommitStatusVisible" width="500px">
      <el-form label-width="120px">
        <el-form-item label="提交到上游" width="200">
          <el-switch
              v-model="autoCommitStatus.content"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开启提交"
              inactive-text="关闭提交"
              active-value="1"
              inactive-value="0">
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="autoCommitStatusVisible = false">取 消</el-button>
        <el-button type="primary" @click="setAutoCommitStatus()">确 定</el-button>
      </div>
    </el-dialog>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime} from '@/utils'
  import common from '@/utils/common'
  import axios from '@/utils/http'
  import {mapGetters} from 'vuex'

  export default {
    name: 'vue_admin_remit_list',
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
        uploadUrl: common.pageMap.baseDomain + '/upload/upload',
        listQuery: {
          page: 1,
          limit: 10,
          importance: undefined,
          dateStart: new Date(new Date().setHours(0, 0, 0, 0)),//.getDateStr(-3),
          dateEnd: new Date(new Date().setHours(23, 59, 59, 0)),
          orderNo: null,
          merchantOrderNo: null,
          channelOrderNo: null,
          status: null,
          bankAccount: null,
          bankNo: null,
          minMoney: null,
          maxMoney: null,
          merchantNo: null,
          merchantAccount: null,
          channelAccount: null,
          idList: [],
          sort: '',
          export: 0,
          exportType: '',
        },
        summery: {
          'amount': 0,
        },
        trackVisible: false,
        trackForm: {
          id: undefined,
          type: '2',
          upload: [],
          note: '',
          upload_url: [],
        },
        tableKey: 0,
        constFalse: false,
        constTrue: true,
        channelAccountOptions: [],
        statusOptions: [],
        currentRemit: {},
        dialogSwitchRemitVisible: false,
        remitIdSwitchTo: '',
        bankCardTodayStatisticList: [],
        bankCardTodayStatisticLoading: false,
        canCheckRemitStatus: 0,
        autoCommitStatus: {
            id: null,
            title: null,
            content: null,
        },
          autoCommitStatusVisible: false,
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
    filters: {},
    created() {
      this.getList()
    },
    mounted() {
      // console.log('mounted',this.$route.path)
    },
    updated() {

    },
    computed: {
      ...mapGetters([
        'roles', 'uid', 'user'
      ])
    },
    methods: {
      getList() {
        var self = this

        self.listLoading = true
        for (let i in self.listQuery) {
          if (self.listQuery[i] == '__ALL__') self.listQuery[i] = ''
        }
        axios.post('/remit/list', self.listQuery).then(
          res => {
            self.listLoading = false

            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
                // console.log(res.data.data)
              self.list = res.data.data
              self.summery = res.data.summery
              self.autoCommitStatus = res.data.remitAutoCommitStatus
              self.total = res.data.pagination.total
              self.statusOptions = res.data.condition.statusOptions
              self.channelAccountOptions = res.data.condition.channelAccountOptions
            }

          },
          res => {
            self.listLoading = false
            self.$message.error({message: res.message})
          }
        )
      },
      showDetail(row, cb) {
        return
        self = this

        axios.post('/order/detail', {id: row.id}).then(
          res => {
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.orderDetail = res.data
              self.orderDetailBarCodeStr = self.orderDetail.order.order_no
              console.log('self.orderDetailBarCodeStr', self.orderDetailBarCodeStr)
              this.dialogOrderVisible = true
              if (cb) cb()
            }
          },
          res => {
            self.$message.error({message: res.message})
          }
        )
      },
      getBankCardTodayStatistic(row) {
        self = this
        self.bankCardTodayStatisticList = []
        self.bankCardTodayStatisticLoading = true
        axios.post('/admin/remit/bank-card-today-statistic', {cardNo: row.bank_no}).then(
          res => {
            self.bankCardTodayStatisticLoading = false
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.bankCardTodayStatisticList = res.data
            }
          },
          res => {
            self.$message.error({message: res.message})
          }
        )
      },
      exportResult(type) {
        self = this
        self.listQuery.export = 1
        self.listQuery.exportType = type
        let url = common.pageMap.baseDomain + '/remit/list?access-token=' + common.getToken()

        let params = JSON.parse(JSON.stringify(self.listQuery))
        common.downloadFile(url, params)
        self.$message.success({message: '文件已导出'})
        self.listQuery.export = 0
        self.listQuery.exportType = ''
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
            sums[index] = '总计';
            return;
          }
          sums[index] = 'N/A';
        });
        sums[3] = this.summery.amount + '元'
        return sums;
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
      handleSelectionChange(val) {
        let self = this
        self.multipleSelection = val;
        self.listQuery.idList = []
        self.multipleSelection.forEach((u) => {
          self.listQuery.idList.push(u.id)
        })

      },
      checkNumber: function () {
        // console.log(this.listQuery.minMoney);
        let reg = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
        if (!reg.test(this.listQuery.minMoney)) {
          this.listQuery.minMoney = '';
        }
        if (!reg.test(this.listQuery.maxMoney)) {
          this.listQuery.maxMoney = '';
        }
      },
      handleTrack(row) {
        this.trackVisible = true;
        this.trackForm.id = row.id;
      },
      createTrack() {
        self = this;
        axios.post('/admin/track/add', {
          parentId: self.trackForm.id,
          parentType: 'remit',
          type: self.trackForm.type,
          upload: self.trackForm.upload,
          note: self.trackForm.note
        }).then(
          res => {
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.trackVisible = false
              self.trackForm = {
                id: undefined,
                type: '1',
                upload: [],
                note: '',
                upload_url: [],
              }
              self.$refs.track_upload.clearFiles();
            }
          }
        )
      },
      handleUpload(response, file, fileList) {
        this.trackForm.upload.push(response.data.url.filepath);
        this.trackForm.upload_url.push(response.data.url.host + response.data.url.filepath);
      },
      handleStatus(row) {
        let data = {id: row.id, status: 10}
      },
      setSuccess(row) {
        self = this
        self.$confirm('此操作将设置订单成功, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.post('/admin/remit/set-success', {id: row.id}).then(
            res => {
              if (res.code != 0) {
                self.$message.error({message: res.message})
              } else {
                self.$message.success({message: res.message})
                row.status = 20
                self.getList()
              }
            },
            res => {
              self.$message.error({message: res.message})
            }
          )
        })

      },
      setAutoCommitStatus() {
        self = this

        if (self.autoCommitStatus.title == null) {
            self.$message.error({message: '配置项名称不能为空'});
            return;
        }
        if (self.autoCommitStatus.content == null) {
            self.$message.error({message: '配置内容不能为空'});
            return;
        }
        axios.post('/admin/site-config/add', self.autoCommitStatus).then(
            res => {
                if (res.code == 0) {
                    self.$message.success({message: '操作成功'})
                    self.getList()
                    self.autoCommitStatusVisible = false;
                } else {
                    self.$message.error({message: res.message})
                }
            }
        );

      },
      setFail(row) {
        self = this
        self.$confirm('此操作将设置订单为失败并退款, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.post('/admin/remit/set-fail', {id: row.id}).then(
            res => {
              if (res.code != 0) {
                self.$message.error({message: res.message})
              } else {
                self.$message.success({message: res.message})
                row.status = 20
                self.getList()
              }
            },
            res => {
              self.$message.error({message: res.message})
            }
          )
        })

      },
      setChecked(id) {
        self = this
        let idList = self.listQuery.idList
        if (id) {
          idList = [id]
        }
        axios.post('/admin/remit/set-checked', {idList: idList}).then(
          res => {
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.$message.success({message: res.message})
              self.getList()
            }
          },
          res => {
            self.$message.error({message: res.message})
          }
        )
      },
      reSubmit(id) {
        self = this

        self.$confirm('此操作将重新提交订单到上游, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let idList = self.listQuery.idList
          if (id) {
            idList = [id]
          }
          self.listLoading = true
          axios.post('/admin/remit/re-submit-to-bank', {idList: idList}).then(
            res => {
              self.listLoading = false
              if (res.code != 0) {
                self.$message.error({message: res.message})
              } else {
                self.$message.success({message: res.message})
                self.getList()
              }
            },
            res => {
              self.$message.error({message: res.message})
            }
          )

        })

      },
      syncStatus(id) {
        self = this

        self.$confirm('此操作将到上游实时同步状态并根据状态处理订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          axios.post('/admin/remit/sync-status', {id: id}).then(
            res => {
              if (res.code != 0) {
                self.$message.error({message: res.message})
              } else {
                self.$message.success({message: res.message})
                // self.$alert(res.message, '提示', {
                //   dangerouslyUseHTMLString: true,
                //   'customClass':'sync-alert'
                // }).then(() => {
                //   self.getList()
                // })
              }
            },
            res => {
              self.$message.error({message: res.message})
            }
          )
        })

      },
      syncStatusRealtime(id) {
        self = this

        axios.post('/admin/remit/sync-status-realtime', {id: id}).then(
          res => {
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              // self.$message.success({message: res.message})
              self.$alert(res.message, '提示', {
                dangerouslyUseHTMLString: true,
                customClass:'remit-sync-alert'
              }).then(() => {
                self.getList()
              })
            }
          },
          res => {
            self.$message.error({message: res.message})
          }
        )
      },
      switchRemit(id) {
        self = this
        let idList = self.listQuery.idList
        if (id) {
          idList = [id]
        }

        if (!idList) {
          self.$message.error({message: '请选择出款渠道'})
          return
        }

        axios.post('/admin/remit/switch-channel-account', {id: idList, channelAccountId: self.remitIdSwitchTo}).then(
          res => {
            if (res.code != 0) {
              self.$alert(res.message, '错误提示', {
                confirmButtonText: '确定',
                type: 'error'
              });
            } else {
              self.$message.success({message: '通道切换成功'})

              self.dialogSwitchRemitVisible = false
              self.currentRemit = {}
              self.remitIdSwitchTo = ''
              self.getList()
            }
          },
          res => {
            self.$message.error({message: res.message})
          }
        )
      },

      addToBlackList(row) {
        let self = this
        self.$confirm('此此订单的银行卡加入黑名单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let idList = []
          if (row) {
            idList = [row.id]
          } else {
            idList = self.listQuery.idList
          }
          self.listLoading = true
          axios.post('/admin/remit/add-blacklist', {idList: idList}).then(
            res => {
              self.listLoading = false
              if (res.code != 0) {
                self.$message.error({message: res.message})
              } else {
                self.$message.success({message: res.message})
                row.status = 30
                self.getList()
              }
            },
            res => {
              self.listLoading = false
              self.$message.error({message: res.message})
            }
          )

        }).catch(() => {
          self.$message({
            type: 'warning',
            message: '已取消操作'
          });
        });
      },


    }

  }
</script>
<style>
  .remit-sync-alert{
    width: 50%;
    word-break: break-all;
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .action-btns a {
    margin-left: 5px;
  }

  .el-table td, .el-table th {
    padding: 0 0 !important;
  }

  .el-table__row button {
    margin-top: 5px;
  }

  .op-column .el-button {
    margin: 5px;
  }

  .op-column .cell {
    padding-left: 0;
    text-align: left;
  }

  .summary-list {
    margin-top: 10px;
    .el-tag + .el-tag {
      margin-left: 10px;
    }
  }

  .el-dropdown-menu--mini .el-dropdown-menu__item {
    line-height: 36px !important;
    font-size: 14px !important;
  }
</style>