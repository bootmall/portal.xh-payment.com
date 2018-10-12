<!--调单记录-->
<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container" >
            <el-date-picker  class="filter-item" style="width: 200px;" size="small"
                             v-model="listQuery.dateStart"
                             align="right"
                             type="datetime"
                             placeholder="开始日期"
                             format="yyyy-MM-dd 00:00:00"
                             :picker-options="pickerOptions">
            </el-date-picker>
            <el-date-picker  class="filter-item" style="width: 200px;" size="small"
                             v-model="listQuery.dateEnd"
                             align="right"
                             type="datetime"
                             placeholder="结束日期"
                             format="yyyy-MM-dd 23:59:59"
                             :picker-options="pickerOptions">
            </el-date-picker>
            <el-input style="width: 200px;" size="small" class="filter-item" placeholder="订单号" v-model="listQuery.orderNo" clearable></el-input>
            <el-input size="small" style="width: 200px;" class="filter-item" placeholder="商户订单号" v-model="listQuery.merchantOrderNo" clearable></el-input>
            <el-input class="filter-item" size="small" style="width: 200px;" v-model="listQuery.merchantNo" placeholder="商户编号" clearable></el-input>
            <el-input class="filter-item" size="small" style="width: 200px;" v-model="listQuery.merchantAccount" placeholder="商户账号" clearable></el-input>
            <el-select class="filter-item" size="small" v-model="listQuery.channelAccount" placeholder="通道号">
                <el-option
                        v-for="(item,key) in channelAccountOptions"
                        :key="key"
                        :label="item"
                        :value="key">
                </el-option>
            </el-select>
            <el-select class="filter-item" v-model="listQuery.statusOrder" size="small" placeholder="收款订单状态" >
                <el-option
                        v-for="(item,key) in statusOrderOptions"
                        :key="key"
                        :label="item"
                        :value="key">
                </el-option>
            </el-select>
            <el-select class="filter-item" v-model="listQuery.statusRemit" size="small" placeholder="结算订单状态" >
                <el-option
                        v-for="(item,key) in statusRemitOptions"
                        :key="key"
                        :label="item"
                        :value="key">
                </el-option>
            </el-select>
            <el-select class="filter-item" v-model="listQuery.typeTrack" size="small" placeholder="调单类型" >
            <el-option
                    v-for="(item,key) in typeTrackOptions"
                    :key="key"
                    :label="item"
                    :value="key">
            </el-option>
            </el-select>
            <el-select class="filter-item" v-model="listQuery.statusTrack" size="small" placeholder="调单状态" >
            <el-option
                    v-for="(item,key) in statusTrackOptions"
                    :key="key"
                    :label="item"
                    :value="key">
            </el-option>
            </el-select>
            <el-button class="filter-item" size="small" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
        </div>

        <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="数据加载中，请稍候..." border fit highlight-current-row style="width: 100%;font-size: 12px" stripe>
            <!--<el-table-column align="center" fixed type="selection" width="55" ></el-table-column>-->
            <el-table-column prop="parentName" label="调单源" width="80"></el-table-column>
            <el-table-column prop="orderNo" label="订单号" width="160"></el-table-column>
            <el-table-column prop="merchantOrderNo" label="商户订单号" width="160"></el-table-column>
            <el-table-column prop="merchantNo" label="商户编号" width="80"></el-table-column>
            <el-table-column prop="merchantAccount" label="商户账号" width="80"></el-table-column>
            <el-table-column prop="channelAccount" label="通道" width="160"></el-table-column>
            <el-table-column prop="orderAmount" label="订单金额(元)" width="100"></el-table-column>
            <el-table-column prop="orderStatus" label="订单状态" width="100"></el-table-column>
            <el-table-column prop="trackType" label="调单类型" width="80"></el-table-column>
            <el-table-column prop="trackStatus" label="调单状态" width="80"></el-table-column>
            <el-table-column prop="created_at" label="创建时间" width="160"></el-table-column>
            <el-table-column align="center" label="操作" class="action-btns" fixed="right" width="250px">
                <template slot-scope="scope" >
                    <el-button class="filter-item" size="mini" type="primary" @click="handleDetail(scope.row)" v-waves>详情</el-button>
                    <el-button class="filter-item" size="mini" type="primary" @click="handleTrack(scope.row)" v-waves>追加</el-button>
                    <el-button class="filter-item" size="mini" type="primary" @click="handleEdit(scope.row)" v-waves>编辑</el-button>
                    <!--<a class="link-type" @click=showDetail(scope.row)>详情</a>-->
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page"
                           :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog title="调单详情" :visible.sync="trackDetailVisible">
            <el-table :data="trackDetail" >
                <el-table-column property="type_name" label="调单类型" width="100"></el-table-column>
                <el-table-column property="status_name" label="调单状态" width="100"></el-table-column>
                <el-table-column label="图片">
                    <template slot-scope="detail">
                        <a v-if="detail.row.uploadUrl.length > 0" v-for="(item,key) in detail.row.uploadUrl" :href="item" target="_blank">图片{{key + 1}}</a>
                    </template>
                </el-table-column>
                <el-table-column property="note" label="备注"></el-table-column>
                <el-table-column property="created_at" width="160" label="创建时间"></el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog title="调单录入" :visible.sync="trackVisible" width="30%">
            <el-form :model="trackForm">
                <el-form-item label="上传：">
                    <el-upload
                            class="avatar-uploader"
                            :action=uploadUrl
                            :show-file-list="false"
                            multiple
                            :limit="3"
                            ref="track_upload"
                            :on-success="handleUpload">
                        <img  v-if="trackForm.upload_url.length > 0" v-for="item in trackForm.upload_url" :src="item" class="avatar">
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
        <el-dialog title="调单编辑" :visible.sync="editVisible" width="30%">
            <el-form :model="editForm">
                <!--<el-form-item label="上传：">-->
                    <!--<el-upload-->
                            <!--class="avatar-uploader"-->
                            <!--:action=uploadUrl-->
                            <!--:show-file-list="false"-->
                            <!--multiple-->
                            <!--:limit="3"-->
                            <!--ref="track_upload"-->
                            <!--:on-success="handleUpload">-->
                        <!--<img  v-if="trackForm.upload_url.length > 0" v-for="item in trackForm.upload_url" :src="item" class="avatar">-->
                        <!--<i class="el-icon-plus"></i>-->
                    <!--</el-upload>-->
                <!--</el-form-item>-->
                <el-radio v-for="(item,key) in statusTrackOptions" v-model="editForm.status" :key="key" :label="key">{{item}}</el-radio>
                <el-form-item label="备注：">
                    <el-input type="textarea" :rows="3" style="width: 280px" v-model="editForm.note">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="editTrack">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import waves from '@/directive/waves/index.js' // 水波纹指令
    import {parseTime} from '@/utils'
    import common from '@/utils/common'
    import axios from '@/utils/http'
    import { mapGetters } from 'vuex'
    import index from "../../../router";
    export default {
        name: "vue_track_add",
        directives: {
            waves
        },
        data(){
            return{
                list: null,
                total: null,
                trackDetail:null,
                listLoading: true,
                uploadUrl: common.pageMap.baseDomain+'/upload/upload',
                listQuery: {
                    page: 1,
                    limit: 20,
                    importance: undefined,
                    dateStart: new Date(new Date().setHours(0, 0, 0, 0)),
                    dateEnd: new Date(new Date().setHours(23, 59, 59, 0)),
                    orderNo: null,
                    merchantOrderNo: null,
                    statusOrder: null,
                    statusRemit: null,
                    merchantNo: null,
                    merchantAccount: null,
                    channelAccount: null,
                    typeTrack:null,
                    statusTrack:null,
                    sort: ''
                },
                tableKey:0,
                channelAccountOptions:[],
                statusOrderOptions:[],
                statusRemitOptions:[],
                typeTrackOptions:[],
                statusTrackOptions:[],
                trackDetailVisible:false,
                trackVisible:false,
                editVisible:false,
                trackForm:{
                    parentId:undefined,
                    parentType:'',
                    type:'1',
                    upload:[],
                    note:'',
                    upload_url:[],
                },
                editForm:{
                    id:null,
                    parentId:null,
                    parentType:null,
                    status:null,
                    note:null
                },
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
        created() {
            this.getList()
        },
        methods: {
            getList() {
                var self = this
                self.listLoading = true
                axios.post('/admin/track/list', self.listQuery).then(
                    res => {
                        self.listLoading = false
                        if (res.code != 0) {
                            self.$message.error({message: res.message})
                        } else {
                            self.list = res.data.data
                            // self.summery = res.data.summery
                            self.total = res.data.pagination.total
                            self.statusOrderOptions = res.data.condition.statusOrderOptions
                            self.statusRemitOptions = res.data.condition.statusRemitOptions
                            self.statusTrackOptions = res.data.condition.statusTrackOptions
                            self.typeTrackOptions = res.data.condition.typeTrackOptions
                            self.channelAccountOptions = res.data.condition.channelAccountOptions
                        }
                    },
                    res => {
                        self.listLoading = false
                        self.$message.error({message: res.message})
                    }
                )
            },
            handleFilter(){
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
            handleDetail(row){
                // console.log(row);
                let self = this;
                let data= {parentId:row.parentId,parentType:row.parentType};
                axios.post('/admin/track/detail',data).then(
                    res=>{
                        if(res.code !=0 ){
                            self.$message.error({message: res.message});
                        }else{
                            self.trackDetailVisible = true;
                            self.trackDetail = res.data;
                        }
                    }
                );
            },
            handleTrack(row){
                this.trackVisible = true;
                this.trackForm.parentId = row.parentId;
                this.trackForm.parentType = row.parentType;
                this.trackForm.type = row.type;
            },
            createTrack(){
                var self = this;
                var data = {
                    parentId:self.trackForm.parentId,
                    parentType:self.trackForm.parentType,
                    type:self.trackForm.type,
                    upload:self.trackForm.upload,
                    note:self.trackForm.note
                }
                axios.post('/admin/track/add',data).then(
                    res => {
                        if (res.code != 0) {
                            self.$message.error({message: res.message})
                        } else {
                            self.trackVisible = false
                            self.trackForm = {
                                parentId:undefined,
                                parentType:'',
                                type:'1',
                                upload:[],
                                note:'',
                                upload_url:[],
                            }
                            self.$refs.track_upload.clearFiles();
                            self.$message.success({message:'追加成功'})
                        }
                    }
                )
            },
            handleUpload(response,file,fileList) {
                this.trackForm.upload.push(response.data.filepath);
                this.trackForm.upload_url.push(response.data.host+response.data.filepath);
            },
            handleEdit(row){
                this.editForm.status = row.status;
                this.editForm.note = row.note;
                this.editForm.id = row.id;
                this.editForm.parentId = row.parentId;
                this.editForm.parentType = row.parentType;
                this.editVisible = true;
            },
            editTrack(){
                let self = this;
                let data = {
                    id:self.editForm.id,
                    parentId:self.editForm.parentId,
                    parentType:self.editForm.parentType,
                    status:self.editForm.status,
                    note:self.editForm.note,
                }
                axios.post('/admin/track/edit',data).then(
                    res=>{
                        if(res.code == 0){
                            self.$message.success({message:'编辑成功'})
                            this.editVisible = false;
                        }else {
                            self.$message.error({message:res.message});
                        }
                    }
                );
            },
        },
    }
</script>

<style scoped>

</style>