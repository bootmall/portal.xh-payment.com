<template>
    <div class="components-container">
        <div class="filter-container">
            标题：
            <el-input  style="width: 100px;" class="filter-item" v-model="listQuery.title"></el-input>
            状态：
            <el-select class="filter-item" v-model="listQuery.status" placeholder="状态" >
                <el-option
                        v-for="(item,key) in statusOptions"
                        :key="key"
                        :label="item"
                        :value="key">
                </el-option>
            </el-select>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item" type="primary" @click="noticeVisible = true">添加公告</el-button>
        </div>
        <el-collapse accordion v-loading="listLoading" element-loading-text="数据加载中，请稍候..." border fit highlight-current-row style="width: 100%;font-size: 12px;">
            <el-collapse-item v-for="(item,key) in list" :key="key">
                <template slot="title">
                    <span>{{item.title}}</span>
                    <span style="float: right;margin-right: 50px">
                        <el-button class="filter-item" size="mini" type="primary" @click="handleEdit(item)" >编辑</el-button>
                    </span>
                    <span style="float: right;margin-right: 50px;">{{item.created_at}}</span>
                    <span style="float: right;margin-right: 50px">{{item.status_name}}</span>
                </template>
                <div>
                    <span v-html="item.content"></span>
                </div>
            </el-collapse-item>
        </el-collapse>

        <el-dialog
                title="添加/编辑公告"
                :visible.sync="noticeVisible"
                width="60%">
            <template>
                <el-form :model="viewModel">
                    <el-form-item label="标题：">
                        <el-input size="small" type="email" v-model="viewModel.title" style="width: 200px"></el-input>
                    </el-form-item>
                    <el-form-item label="显示状态：">
                        <el-radio label="0" v-model="viewModel.status">不显示</el-radio>
                        <el-radio label="10" v-model="viewModel.status">显示</el-radio>
                    </el-form-item>
                    内容：<tinymce :height=200 ref="editor" v-model="viewModel.content"></tinymce>
                </el-form>
            </template>
            <span slot="footer" class="dialog-footer">
                <el-button @click="noticeVisible = false">取 消</el-button>
                <el-button type="primary" @click="handelNotice">确 定</el-button>
            </span>
        </el-dialog>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>    </div>
</template>

<script>
    import waves from '@/directive/waves/index.js' // 水波纹指令
    import Tinymce from '@/components/Assembly/Tinymce'
    import {parseTime} from '@/utils'
    import axios from '@/utils/http'
    export default {
      name: 'vue_notice',
        components: { Tinymce ,waves},
        data() {
            return {
                noticeVisible:false,
                viewModel:{
                    id:null,
                    title:null,
                    status:'10',
                    content: null
                },
                list: null,
                tableKey:0,
                total: null,
                listLoading: true,
                statusOptions:[],
                listQuery: {
                    page: 1,
                    limit: 20,
                    importance: undefined,
                    title:null,
                    status: null,
                    sort: ''
                },
            }
        },
        created(){
            this.getInitData()
        },
        methods:{
            getInitData(){
                var self = this
                self.listLoading = true
                axios.post('/admin/notice/list', self.listQuery).then(
                    res => {
                        self.listLoading = false
                        if(res.code == 0){
                            self.list = res.data.data
                            self.statusOptions = res.data.statusOptions
                            self.total = res.data.pagination.total
                        }
                    }
                )
            },
            handelNotice(){
                if(this.viewModel.title == null){
                    this.$message.error({message:'标题不能为空'});
                    return ;
                }
                if(this.viewModel.content == null){
                    this.$message.error({message:'内容不能为空'});
                    return ;
                }
                let data ={
                    id:this.viewModel.id,
                    title:this.viewModel.title,
                    status:this.viewModel.status,
                    content:this.viewModel.content,
                }
                axios.post('/admin/notice/add',data).then(
                    res=>{
                        if(res.code == 0){
                            this.$message.success({message:'操作成功'})
                            this.viewModel.id = null,
                            this.viewModel.title = null,
                            this.viewModel.status = null,
                            this.viewModel.content = null
                            this.getInitData()
                            this.noticeVisible = false;
                        }else {
                            this.$message.error({message:res.message})
                        }
                    }
                );
            },
            handleEdit(row){
                // console.log(row);
                this.viewModel.id = row.id;
                this.viewModel.title = row.title;
                this.viewModel.status = row.status.toString();
                this.viewModel.content = row.content;
                this.noticeVisible = true;
            },
            handleFilter() {
                this.listQuery.page = 1
                this.getInitData()
            },
            handleSizeChange(val) {
                this.listQuery.limit = val
                this.getInitData()
            },
            handleCurrentChange(val) {
                this.listQuery.page = val
                this.getInitData()
            },
        }
    }
</script>

<style scoped>
    .editor-content{
        margin-top: 20px;
    }
</style>


