<template>
    <div class="app-container calendar-list-container">
        <div v-show="uploadVisible">
            <h4 style="color: red" align="center">批量提款一次最多300条</h4>
            <el-row >
                <el-col :span="24" align="center">
                    <el-button @click="downTemplate('txt')">TXT模版下载</el-button>
                    <el-button @click="downTemplate('csv')">CSV模版下载</el-button>
                    <el-button @click="downTemplate('xls')">XLS模版下载</el-button>
                    <el-button @click="downTemplate('xlsx')">XLSX模版下载</el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" align="center">
                    <el-upload
                            class="avatar-uploader"
                            :action=uploadUrl
                            :show-file-list="false"
                            multiple
                            :limit="1"
                            ref="excel_upload"
                            accept=".txt,.xls,.csv,.xlsx"
                            :on-success="handleUpload"
                            :on-error="handleUploadError">
                        <el-input v-model="excelUpload"></el-input>
                    </el-upload>
                    <el-button class="filter-item" @click="handleExcel" v-waves>下一步</el-button>
                </el-col>
            </el-row>
        </div>
        <div v-show="confirmVisible" align="center">
            <h4>确认批量信息</h4>
            <el-table :data="excelData" :key="tableKey" v-loading="listLoading" align="center" element-loading-text="数据加载中，请稍候..." border fit highlight-current-row style="width: 70%;font-size: 12px;" stripe>
                <el-table-column  prop="bank_name" label="银行" align="center"></el-table-column>
                <el-table-column prop="bank_number" label="卡号" align="center"></el-table-column>
                <el-table-column prop="real_name" label="姓名" align="center"></el-table-column>
                <el-table-column prop="amount" label="金额" align="center"></el-table-column>
            </el-table>
            <div class="filter-container">
                <span>资金密码：<el-input type="password" style="width: 280px;" v-model="financial_password_hash"></el-input></span>
                <span>安全令牌：<el-input style="width: 280px;" v-model="key_2fa"></el-input></span>
                <span>
                    <el-button class="filter-item" style="margin-top: 6px" @click="handleLast" v-waves>上一步</el-button>
                    <el-button class="filter-item" style="margin-top: 6px" @click="batchSubmit" v-waves>确认并提交</el-button>
                </span>
            </div>
        </div>
        <div>
            <h4>支持银行</h4>
            <el-row>
                <el-col :span="24">
                    <el-button type="primary">上海银行</el-button>
                    <el-button type="primary">中信银行</el-button>
                    <el-button type="primary">中国银行</el-button>
                    <el-button type="primary">交通银行</el-button>
                    <el-button type="primary">光大银行</el-button>
                    <el-button type="primary">兴业银行</el-button>
                    <el-button type="primary">农业银行</el-button>
                    <el-button type="primary">北京银行</el-button>
                    <el-button type="primary">中国邮政银行</el-button>
                </el-col>
            </el-row>
            <el-row style="margin-top: 10px">
                <el-col :span="24">
                    <el-button type="primary">华夏银行</el-button>
                    <el-button type="primary">工商银行</el-button>
                    <el-button type="primary">平安银行</el-button>
                    <el-button type="primary">广发银行</el-button>
                    <el-button type="primary">建设银行</el-button>
                    <el-button type="primary">招商银行</el-button>
                    <el-button type="primary">民生银行</el-button>
                    <el-button type="primary">浦发银行</el-button>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import waves from '@/directive/waves/index.js' // 水波纹指令
    import {parseTime} from '@/utils'
    import common from '@/utils/common'
    import axios from '@/utils/http'
    import {checkCanRemit} from '@/api/user'
    export default {
        name: "vue_add_remit_batch",
        directives: {
            waves
        },
        data() {
            return {
                uploadUrl: common.pageMap.baseDomain+'/upload/upload',
                excelUpload: null,
                listLoading:false,
                upload_id:null,
                uploadVisible:true,
                confirmVisible:false,
                tableKey:0,
                excelData:[],
                financial_password_hash:null,
                key_2fa:null
            }
        },
        created(){
          checkCanRemit().then(res => {
            if (res.code!=0) {
              this.$alert(res.message,'系统提示', { type: 'error'})

            }
          }).catch(error => {
            this.$alert(error,'系统提示', { type: 'error'})
          })
        },
        methods:{
            downTemplate(type) {
              let a = document.createElement("a")
              a.href = common.pageMap.baseDomain
              let url = 'http://'+a.hostname+'/uploads/docs/remit/remit_remplate.'+type+'.zip'
              window.open(url)
              this.$alert('默认文件已经下载,请按照模板文件添加出款记录!', '系统提示', {
                confirmButtonText: '确定'
              });
            },
          handleUpload(response,file,fileList) {
                this.excelUpload = response.data.url.filepath;
                this.upload_id = response.data.id
            },
            handleUploadError(err, file, fileList){
                let res = JSON.parse(err.message);
                this.$message.error({message:res.message});
            },
            handleExcel(){
                if(this.upload_id == null){
                    this.$message.error({message:'没有上传任何文件'});
                    return;
                }
                this.listLoading = true;
                this.uploadVisible = false;
                this.confirmVisible = true;
                let data = {upload_id:this.upload_id};
                axios.post('/remit/batch-remit',data).then(
                    res=>{
                        this.listLoading = false
                        if(res.code == 0){
                            this.excelData = res.data;
                        }else{
                            this.$message.error({message:res.message})
                            this.$refs.excel_upload.clearFiles();
                            this.uploadVisible = true;
                            this.confirmVisible = false;
                            this.excelUpload = null;
                        }
                    }
                );
            },
            handleLast(){
                this.uploadVisible = true;
                this.confirmVisible = false;
            },
            batchSubmit(){
                let status = 0;
                for(let i in this.excelData){
                    if(this.excelData[i].status == 1){
                        status = 1
                    }
                }
                if(status == 1){
                    this.$message.error({message:'提款方案有错，请检查'})
                    return
                }
                let regPass =/^.*(?=.{6,16})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/;
                if(!regPass.test(this.financial_password_hash)){
                    this.$message.error({message:'资金密码格式不正确'})
                    return
                }
                let regKey = /^[0-9]{6}$/;
                if(!regKey.test(this.key_2fa)){
                    this.$message.error({message:'安全令牌格式不正确'})
                    return
                }
                let data={financial_password_hash:this.financial_password_hash,key_2fa:this.key_2fa,remitData:this.excelData}
                axios.post('/remit/single-batch-remit',data).then(
                    res=>{
                        if(res.code == 0){
                            this.$message.success({message:'操作成功'})
                        }else {
                            this.$message.error({message:res.message})
                        }
                    }
                );
            },
        }
    }
</script>

<style scoped>

</style>