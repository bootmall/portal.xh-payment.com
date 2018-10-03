<template>
    <div class="components-container">
        <div class="filter-container">
            搜索配置：
            <el-input style="width: 240px;" class="filter-item" v-model="listQuery.desc"></el-input>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item" type="primary" @click="clearCache">刷新缓存</el-button>
        </div>

        <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="数据加载中，请稍候..." border fit highlight-current-row style="width: 100%">
        <el-table-column
                type="selection"
                width="30">
        </el-table-column>

        <el-table-column label="名称">
            <template slot-scope="scope">
                <span class="link-type">{{scope.row.title}}</span>
            </template>
        </el-table-column>

        <el-table-column label="描述">
            <template slot-scope="scope">
                <span class="link-type">{{scope.row.desc}}</span>
            </template>
        </el-table-column>

        <el-table-column label="内容">
            <template slot-scope="scope">
                <span class="link-type">{{scope.row.content}}</span>
            </template>
        </el-table-column>


        <el-table-column align="center" label="操作" class="action-btns">
            <template slot-scope="scope">
                <el-button class="filter-item" size="mini" type="warning" v-waves @click="showEditDialog(scope.row)">
                    编辑
                </el-button>
            </template>
        </el-table-column>

        </el-table>

        <el-dialog
                title="添加/编辑配置"
                :visible.sync="editVisible"
                width="60%">
            <template>
                <el-form :model="viewModel">
                    <el-form-item label="配置key：">
                        <!--<el-input size="small" type="email" v-model="viewModel.title" style="width: 300px" :disabled="true"></el-input>-->
                        <span class="link-type">{{viewModel.title}}</span>
                    </el-form-item>
                    <el-form-item label="描述：">
                        <!--<el-input size="small" type="email" v-model="viewModel.desc" style="width: 400px" :disabled="true"></el-input>-->
                        <span class="link-type">{{viewModel.desc}}</span>
                    </el-form-item>
                    <!--配置：<el-input-->
                    <!--type="textarea"-->
                    <!--:rows="3"-->
                    <!--placeholder="请输入配置内容"-->
                    <!--v-model="viewModel.content">-->
                    <!--</el-input>-->

                    <el-form-item label="配置内容" v-if="viewModel.data_type.ui=='radio'">
                        <el-radio v-for="(v,k) in viewModel.data_type.uiExt.list" :key="k" v-model="viewModel.content"
                                  :label="v.val" border>{{v.label
                            }}
                        </el-radio>
                    </el-form-item>
                    <el-form-item label="配置内容" v-if="viewModel.data_type.ui=='text'">
                        <el-input
                                type="textarea"
                                :rows="3"
                                placeholder="请输入配置内容"
                                v-model="viewModel.content">
                        </el-input>
                    </el-form-item>

                </el-form>
            </template>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="edit">确 定</el-button>
            </span>
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
    import Tinymce from '@/components/Assembly/Tinymce'
    import {parseTime} from '@/utils'
    import axios from '@/utils/http'

    const defaultModel = {
        id: null,
        title: null,
        content: null,
        data_type: {"ui": "text"},
    }

    export default {
        name: 'vue_setting',
        components: {Tinymce, waves},
        directives: {
            waves
        },
        data() {
            return {
                editVisible: false,
                viewModel: defaultModel,
                list: null,
                tableKey: 0,
                total: null,
                listLoading: true,
                statusOptions: [],
                listQuery: {
                    page: 1,
                    limit: 20,
                    importance: undefined,
                    title: null,
                    sort: ''
                },
            }
        },
        created() {
            this.getInitData()
        },
        methods: {
            getInitData() {
                var self = this
                self.listLoading = true
                axios.post('/admin/site-config/list', self.listQuery).then(
                    res => {
                        self.listLoading = false
                        if (res.code == 0) {
                            self.list = res.data.data
                            self.total = res.data.pagination.total
                        }
                    }
                )
            },
            edit() {
                if (this.viewModel.title == null) {
                    this.$message.error({message: '配置项名称不能为空'});
                    return;
                }
                if (this.viewModel.content == null) {
                    this.$message.error({message: '配置内容不能为空'});
                    return;
                }
                axios.post('/admin/site-config/add', this.viewModel).then(
                    res => {
                        if (res.code == 0) {
                            this.$message.success({message: '操作成功'})
                            this.viewModel = defaultModel
                            this.getInitData()
                            this.editVisible = false;
                        } else {
                            this.$message.error({message: res.message})
                        }
                    }
                );
            },

            clearCache() {
                axios.post('/admin/site-config/flush-cache').then(
                    res => {
                        if (res.code == 0) {
                            this.$message.success({message: '操作成功'})
                        } else {
                            this.$message.error({message: res.message})
                        }
                    }
                );
            },
            showEditDialog(row) {
                // console.log(row);
                this.viewModel = row;
                this.editVisible = true;
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
    .editor-content {
        margin-top: 20px;
    }
</style>


