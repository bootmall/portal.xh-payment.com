<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-select class="filter-item select-class" v-model="listQuery.type" placeholder="封禁类型" filterable multiple clearable>
                <el-option
                        v-for="(item,key) in typeOptions"
                        :key="key"
                        :label="item"
                        :value="key">
                </el-option>
            </el-select>
            <el-input size="small" class="filter-item" placeholder="封禁内容" style="width: 200px" v-model="listQuery.val" clearable></el-input>
            <el-date-picker class="filter-item"
                            v-model="listQuery.dateStart"
                            align="right"
                            type="datetime"
                            placeholder="开始日期"
                            size="small"
                            style="width: 13%;"
                            :picker-options="pickerOptions">
            </el-date-picker>
            <el-date-picker class="filter-item"
                            v-model="listQuery.dateEnd"
                            align="right"
                            type="datetime"
                            size="small"
                            style="width: 13%;"
                            placeholder="结束日期"
                            :picker-options="pickerOptions">
            </el-date-picker>
            <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item" size="small" type="success" v-waves icon="el-icon-plus" @click="addVisible = true">添加</el-button>
        </div>
        <el-table stripe :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="数据加载中，请稍候..." border fit highlight-current-row style="width: 100%" >
            <el-table-column prop="type_str" align="center" label="封禁类型"></el-table-column>
            <el-table-column prop="val" align="center" label="封禁内容"></el-table-column>
            <el-table-column prop="merchant_id" align="center" label="商户编号"></el-table-column>
            <el-table-column prop="merchant_name" align="center" label="商户账户"></el-table-column>
            <el-table-column prop="op_uid" align="center" label="操作人编号"></el-table-column>
            <el-table-column prop="op_username" align="center" label="操作人账户"></el-table-column>
            <el-table-column prop="created_at" align="center" label="创建时间"></el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page"
                           :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog
                title="添加黑名单"
                :visible.sync="addVisible"
                width="600px"
                :close-on-click-modal="false" >
            <el-form>
                <template>
                    <el-form-item label="封禁类型：" label-width="120px" style="margin-top: 20px;width: 400px">
                        <el-radio-group v-model="addFrom.type">
                            <el-radio-button v-for="(item,key) in typeOptions" :label="key" :key="key">{{item}}</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="封禁内容：" label-width="120px" style="margin-top: 20px;width: 370px">
                        <el-input size="small" type="text" v-model="addFrom.val"></el-input>
                    </el-form-item>
                    <el-form-item label="商户编号：" label-width="120px" style="margin-top: 20px;width: 370px">
                        <el-input size="small" type="text" v-model="addFrom.merchant_id"></el-input>
                    </el-form-item>
                    <el-form-item label="商户账户：" label-width="120px" style="margin-top: 20px;width: 370px">
                        <el-input size="small" type="text" v-model="addFrom.merchant_name"></el-input>
                    </el-form-item>
                </template>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="close">取 消</el-button>
                    <el-button type="primary" @click="handleAdd">确 定</el-button>
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
        name: "vue_user_black_list",
        directives: {
            waves
        },
        data() {
            return {
                rules: {},
                list: null,
                total: null,
                listLoading: true,
                tableKey:0,
                typeOptions: null,
                listQuery: {
                    page: 1,
                    limit: 10,
                    dateStart: new Date(new Date().setHours(0, 0, 0, 0)),
                    dateEnd: new Date(new Date().setHours(23, 59, 59, 0)),
                    type: null,
                    val: null,
                },
                addVisible:false,
                addFrom:{
                    type:null,
                    val:null,
                    merchant_id:null,
                    merchant_name:null
                },
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
        created() {
            this.getList()
        },
        methods: {
            getList() {
                var self = this
                self.listLoading = true
                axios.post('/admin/user-black-list/list', self.listQuery).then(
                    res => {
                        self.listLoading = false

                        if (res.code != 0) {
                            self.$message.error({message: res.message})
                        } else {
                            self.list = res.data.list
                            self.total = res.data.total
                            self.typeOptions = (res.data.typeOptions)
                        }

                    },
                    res => {
                        self.listLoading = false
                        self.$message.error({message: res.message})
                    }
                )
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
            handleAdd(){
                var self = this
                console.log(self.addFrom)
                if(self.addFrom.type == null || self.addFrom.type.length == 0){
                    self.$message.error({message:'请选择封禁类型'})
                    return false
                }
                if(self.addFrom.val.length == 0){
                    self.$message.error({message:'请输入封禁内容'})
                    return false
                }
                axios.post('/admin/user-black-list/add', self.addFrom).then(
                    res => {
                        self.close()
                        if (res.code != 0) {
                            self.$message.error({message: res.message})
                        } else {
                            self.$message.success({message: res.message})
                            self.getList()
                        }

                    },
                )
            },
            close(){
                this.addVisible = false
                this.addFrom = {
                    type:null,
                    val:null,
                    merchant_id:null,
                    merchant_name:null
                }
            }
        }
    }
</script>

<style scoped>

</style>