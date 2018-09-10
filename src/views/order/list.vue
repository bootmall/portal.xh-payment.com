<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" size="small" style="width: 200px;" class="filter-item" placeholder="收款订单号" v-model="listQuery.orderNo"></el-input>
            <el-input @keyup.enter.native="handleFilter" size="small" style="width: 200px;" class="filter-item" placeholder="商户订单号" v-model="listQuery.merchantOrderNo"></el-input>
            <el-input @keyup.enter.native="handleFilter" size="small" style="width: 200px;" class="filter-item" placeholder="渠道订单号" v-model="listQuery.channelOrderNo"></el-input>
            <el-input class="filter-item" size="small" style="width: 200px;" v-model="listQuery.merchantNo" placeholder="商户编号"></el-input>
            <el-input @keyup.enter.native="handleFilter" size="small" style="width: 200px;" class="filter-item" placeholder="商户账号" v-model="listQuery.merchantUserName"></el-input>
            <el-date-picker class="filter-item"
                            v-model="listQuery.dateStart"
                            align="right"
                            type="datetime"
                            placeholder="开始日期"
                            size="small"
                            style="width: 200px;"
                            :picker-options="pickerOptions">
            </el-date-picker>
            <el-date-picker class="filter-item"
                            v-model="listQuery.dateEnd"
                            align="right"
                            type="datetime"
                            size="small"
                            style="width: 200px;"
                            placeholder="结束日期"
                            :picker-options="pickerOptions">
            </el-date-picker>

            <el-input style="width: 100px;" class="filter-item" size="small" clearable placeholder="最小金额" @change.native="checkNumber()" v-model="listQuery.minMoney"></el-input>
            -
            <el-input style="width: 100px;" class="filter-item" size="small" clearable placeholder="最大金额" @change.native="checkNumber()" v-model="listQuery.maxMoney"></el-input>
            <el-input style="width: 120px;" class="filter-item" size="small" placeholder="代理账号" v-model="listQuery.agentAccount"></el-input>
            <el-select class="filter-item" size="small" v-model="listQuery.status" placeholder="订单状态" multiple >
                <el-option
                        v-for="(item,key) in statusOptions"
                        :key="item.id"
                        :label="item.val"
                        :value="item.id">
                </el-option>
            </el-select>
            <el-select class="filter-item" size="small" v-model="listQuery.notifyStatus" placeholder="通知状态">
                <el-option
                        v-for="(item,key) in notifyStatusOptions"
                        :key="item.id"
                        :label="item.val"
                        :value="item.id">
                </el-option>
            </el-select>
            <el-select class="filter-item" size="small" v-model="listQuery.channelAccount" placeholder="通道号" multiple >
                <el-option
                        v-for="(item,key) in channelAccountOptions"
                        :key="item.id"
                        :label="item.val"
                        :value="item.id">
                </el-option>
            </el-select>
            <el-select class="filter-item" size="small" v-model="listQuery.method" placeholder="支付类型" multiple >
                <el-option
                        v-for="(item,key) in methodOptions"
                        :key="item.id"
                        :label="item.val"
                        :value="item.id">
                </el-option>
            </el-select>

            <!--<el-input  style="width: 120px;" class="filter-item" placeholder="代理号" v-model="listQuery.merchantOrderNo"></el-input>-->

            <!--<el-select @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.sort" placeholder="排序">-->
            <!--<el-option v-for="item in sortOptions" :key="item.label" :label="item.label" :value="item.key">-->
            <!--</el-option>-->
            <!--</el-select>-->

            <el-button class="filter-item"  size="small" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item"  size="small" type="primary" v-waves icon="search" @click="exportResult('csv')">导出CSV</el-button>
            <!--<el-button class="filter-item"  size="small" type="primary" >批量同步</el-button>-->
            <el-button class="filter-item"  size="small" type="primary" @click="setSettlement('')" >结算筛选订单</el-button>
        </div>

        <el-table stripe :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="数据加载中，请稍候..." border fit highlight-current-row style="width: 100%" :summary-method="getSummaries" show-summary @selection-change="handleSelectionChange">
            <el-table-column align="center" fixed type="selection" width="30"></el-table-column>
            <el-table-column fixed="left" align="center" label="商户编号">
                <template slot-scope="scope">
                    <span>{{scope.row.merchant_id}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="商户账号">
                <template slot-scope="scope">
                    <span>{{scope.row.merchant_account}}</span>
                </template>
            </el-table-column>

            <el-table-column label="收款订单号" width="180">
                <template slot-scope="scope">
                    <span>{{scope.row.order_no}}</span>

                </template>
            </el-table-column>

            <el-table-column label="商户订单号" width="180">
                <template slot-scope="scope">
                    <span>{{scope.row.merchant_order_no}}</span>
                </template>
            </el-table-column>
            <el-table-column label="渠道订单号" width="180">
                <template slot-scope="scope">
                    <span>{{scope.row.channel_order_no}}</span>
                </template>
            </el-table-column>
            <!--<el-table-column label="最终订单号" width="180">-->
                <!--<template slot-scope="scope">-->
                    <!--<span>{{scope.row.final_channel_order_no}}</span>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column label="金额">
                <template slot-scope="scope">
                    <span>￥{{scope.row.amount}}</span>
                </template>
            </el-table-column>
            <el-table-column label="到账">
                <template slot-scope="scope">
                    <span>{{scope.row.settlement_type}}</span>
                </template>
            </el-table-column>

            <el-table-column label="通道" width="180">
                <template slot-scope="scope">
                    <span>{{scope.row.channel_account_name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="类型">
                <template slot-scope="scope">
                    <span>{{scope.row.pay_method_code_str}}</span>
                </template>
            </el-table-column>

            <el-table-column label="银行">
                <template slot-scope="scope">
                    <span>{{scope.row.bank_code}}/{{scope.row.bank_name}}</span>

                </template>
            </el-table-column>

            <el-table-column align="center" label="订单状态">
                <template slot-scope="scope">
                    <el-tooltip v-if="scope.row.bak!=''" class="item" effect="light" placement="top">
                        <span class="link-type">{{scope.row.status_str}}</span>
                        <span slot="content" v-html="scope.row.bak"></span>
                    </el-tooltip>
                    <span  v-if="scope.row.bak==''">{{scope.row.status_str}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="通知状态">
                <template slot-scope="scope">
                    <el-popover
                        placement="top"
                        width="400"
                        trigger="click">
                        <p><span>通知地址：</span><span v-text="notify_url"></span></p>
                        <p><span>通知次数：</span><span v-text="notify_times"></span></p>
                        <p><span>通知时间：</span><span v-if="scope.row.notify_at>0">{{scope.row.notify_at|parseTime}}</span><span v-else>-</span></p>
                        <p><span>商户响应：</span><span v-text="notify_ret"></span></p>
                        <span class="link-type" slot="reference" @click="showDetail(scope.row)">{{scope.row.notify_status_str}}</span>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column align="center" width="180" label="创建时间">
                <template slot-scope="scope">
                    <span>{{scope.row.created_at}}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" width="180" align="center" label="操作" class-name="op-column">
                <template slot-scope="scope">
                    <el-button class="filter-item" size="mini" type="success" v-if="scope.row.status == 10" v-waves @click="setSuccess(scope.row)">成功</el-button>
                    <el-button class="filter-item" size="mini" @click="syncStatus(scope.row)" v-waves>同步
                    </el-button>
                    <el-popover
                            placement="top"
                            width="400"
                            trigger="click">
                        <p><span>通知地址：</span><span v-text="notify_url"></span></p>
                        <p><span>通知次数：</span><span v-text="notify_times"></span></p>
                        <p><span>通知时间：</span><span v-if="scope.row.notify_at>0">{{scope.row.notify_at|parseTime}}</span><span v-else>-</span></p>
                        <p><span>商户响应：</span><span v-text="notify_ret"></span></p>
                        <!--<el-button class="filter-item" slot="reference" size="mini" type="primary" @click="showDetail(scope.row)"  v-waves>详情</el-button>-->
                    </el-popover>

                    <!--<el-button slot="reference" v-if="scope.row.track == 0" class="filter-item" size="mini" type="danger" @click="handleTrack(scope.row)" v-waves>录入</el-button>-->

                    <el-button class="filter-item" size="mini" type="info" v-if="[20,60].indexOf(scope.row.status) !== -1" @click="sendNotify(scope.row)" circle>通知</el-button>
                    <!--<el-button class="filtr-item" size="mini" type="warning" v-if="scope.row.status == 60" v-waves @click="setFrozen(scope.row)">冻结</el-button>-->
                    <!--<el-button class="filtr-item" size="mini" type="warning" v-if="scope.row.status == 30" v-waves @click="setUnFrozen(scope.row)">解冻</el-button>-->
                    <el-button class="filtr-item" size="mini" type="warning" v-if="scope.row.status == 60" v-waves @click="setRefund(scope.row)">退款</el-button>
                    <el-button class="filtr-item" size="mini" type="warning" v-if="scope.row.status == 20" v-waves @click="setSettlement(scope.row)">结算</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row class="summary-list">
            <el-tag type="warning" v-for="(v,k) in summery.all_status_list" :key="v.status"><span>{{v.status_str}}:{{v.amount}}</span></el-tag>
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

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                           :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
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
    name: 'vue_admin_order_list',
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
        trackOptions: [],
        uploadUrl: common.pageMap.baseDomain + '/upload/upload',
        listQuery: {
          page: 1,
          limit: 10,
          importance: undefined,
          dateStart: new Date(new Date().setHours(0, 0, 0, 0)),
          dateEnd: null,
          orderNo: null,
          merchantNo: null,
          channelOrderNo: null,
          merchantOrderNo: null,
          status: null,
          notifyStatus: null,
          sort: '',
          export: 0,
          exportType: '',
          idList: [],
        },
        trackVisible: false,
        trackForm: {
          id: undefined,
          type: '1',
          upload: [],
          note: '',
          upload_url: [],
        },
        summery: {
          amount: 0
        },
        notify_url: null,
        notify_times: null,
        notify_ret: null,
        tableKey: 0,
        constFalse: false,
        constTrue: true,
        statusOptions: [],
        notifyStatusOptions: [],
        methodOptions: [],
        channelAccountOptions: [],
        multipleSelection:[],
        // {0:'全部'},
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
      handleSelectionChange(val) {
        let self = this
        self.multipleSelection = val;
        self.listQuery.idList = []
        self.multipleSelection.forEach((u) => {
          self.listQuery.idList.push(u.id)
        })

      },
      getList() {
        var self = this

        self.listLoading = true
        for(let i in self.listQuery){
          if(self.listQuery[i]=='__ALL__') self.listQuery[i] = ''
        }
        axios.post('/order/list', self.listQuery).then(
          res => {
            self.listLoading = false

            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.list = res.data.data
              self.summery = res.data.summery
              self.total = res.data.pagination.total
              self.statusOptions = (res.data.condition.statusOptions)
              self.notifyStatusOptions = (res.data.condition.notifyStatusOptions)
              self.channelAccountOptions = (res.data.condition.channelAccountOptions)
              self.methodOptions = (res.data.condition.methodOptions)
              self.trackOptions = (res.data.trackOptions)
            }

          },
          res => {
            self.listLoading = false
            self.$message.error({message: res.message})
          }
        )
      },
      showDetail(row) {
        let self = this
        axios.post('/order/detail', {id: row.id}).then(
          res => {
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.notify_url = res.data.notify_url;
              self.notify_times = res.data.notify_times;
              self.notify_ret = res.data.notify_ret;
            }
          },
        )
      },
      exportResult(type) {
        self = this
        self.listQuery.export = 1
        self.listQuery.exportType = type
        let url = common.pageMap.baseDomain + '/order/list?access-token=' + common.getToken()

        let params = JSON.parse(JSON.stringify(self.listQuery))
        common.downloadFile(url,params)
        self.$message.success({message: '文件已导出'})
        self.listQuery.export = 0
        self.listQuery.exportType = ''
      },
      sendNotify(row) {
        self = this

        axios.post('/order/send-notify', {id: row.id}).then(
          res => {
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              self.$message.success({message: res.message})
            }
          },
          res => {
            self.$message.error({message: res.message})
          }
        )
      },
      syncStatus(row) {
        self = this
        self.listLoading = true
        axios.post('/order/sync-status', {id: row.id}).then(
          res => {
            self.listLoading = false
            if (res.code != 0) {
              self.$message.error({message: res.message})
            } else {
              // self.$message.success({message: res.message})
              self.$alert(res.message, '提示', {
                dangerouslyUseHTMLString: true,
                customClass: 'sync-box',
              }).then(() => {
                // self.getList()
              })
            }

          },
          res => {
            self.$message.error({message: res.message})
            self.listLoading = false
          }
        )
      },
      setFrozen(row) {
        let self = this
        self.$confirm('此操作将订单设置为冻结状态并冻结余额, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let idList = []
          if(row){
            idList = [row.id]
          }else{
            idList = self.listQuery.idList
          }
          self.listLoading = true
          axios.post('/admin/order/frozen', {idList: idList}).then(
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
      setUnFrozen(row) {
        let self = this
        self.$confirm('此操作将订单设置为解冻并恢复为成功, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          axios.post('/admin/order/un-frozen', {id: row.id}).then(
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

        }).catch(() => {
          self.$message({
            type: 'warning',
            message: '已取消操作'
          });
        });
      },
      setRefund(row) {
        let self = this
        this.$prompt('请输入退款原因', '提示', {
                     confirmButtonText: '确定',
                     cancelButtonText: '取消',
                     // inputPattern: /\W+/,
                     // inputErrorMessage: '格式不正确'
      }).then(({ value }) => {
          axios.post('/admin/order/refund', {id: row.id,bak:value}).then(
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

        }).catch(() => {
          self.$message({
            type: 'warning',
            message: '已取消操作'
          });
        });
      },
      setSuccess(row) {
        let self = this
        self.$confirm('此操作将订单设置为成功, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          axios.post('/admin/order/set-success', {id: row.id}).then(
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

        }).catch(() => {
          self.$message({
            type: 'warning',
            message: '已取消操作'
          });
        });
      },
      setSettlement(row) {
        let self = this
        self.$confirm('此操作将订单设置为已结算并增加用户余额, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = self.listQuery
          if (row) {
            data.idList = [row.id]
          }else{
            // if(data.idList.length==0){
            //   self.$message.success({message: '请选择订单！'})
            //   return;
            // }
          }

          axios.post('/admin/order/set-settlement', data).then(
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

        }).catch(() => {
          self.$message({
            type: 'warning',
            message: '已取消操作'
          });
        });
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
            sums[index] = '-';
            return;
          }
          sums[index] = 'N/A';
        });
        sums[2] = this.summery.amount
        return sums;
      },
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 0) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
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
        axios.post('/admin/track/add', {parentId: self.trackForm.id, parentType: 'order', type: self.trackForm.type, upload: self.trackForm.upload, note: self.trackForm.note}).then(
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
      handleDetail() {

      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .el-table td, .el-table th {
        padding: 5px 0 !important;
    }

    .el-button--mini{
        margin-left: 5px;
        float: left;
        display: inline-block;
        margin-top: 5px;
    }
    .op-column .el-button{
        margin: 5px;
    }
    .op-column .cell{
        padding-left: 0;
        text-align: left;
    }
    .summary-list{
        margin-top: 10px;
        .el-tag  + .el-tag{
            margin-left: 10px;
        }
    }
</style>