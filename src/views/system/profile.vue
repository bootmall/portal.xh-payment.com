<template>
  <div class="dashboard-container">
      <el-form class="el-form" :rules="rules" ref="commonForm" :model="commonForm" label-width="160px">
        <h4 class="title"></h4>
        <el-row :gutter="20">
          <el-col :span="18" :offset="3">
            <div class="grid-content bg-purple">
              <el-form-item label="电话号码" prop="username">
                <el-input v-model="commonForm.username"></el-input>
              </el-form-item>
              <el-form-item label="邮件地址" prop="email">
                <el-input v-model="commonForm.email"></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="nickname">
                <el-input v-model="commonForm.nickname"></el-input>
              </el-form-item>
              <el-form-item label="头像" prop="quotation_sheet_imgs">
                <el-upload
                        class="avatar-uploader"
                        :multiple = "false"
                        :limit = "1"
                        :action=uploadUrl
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :on-error="handleUploadError"
                        :before-upload="beforeAvatarUpload">
                  <img v-if="commonForm.avatar" :src="commonForm.avatar" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>

                <el-dialog :visible.sync="dialogAvatarVisible" size="tiny">
                  <img width="100%" :src="dialogAvatarImageUrl" alt="">
                </el-dialog>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="18" :offset="3">
            <div class="grid-content">
              <el-form-item>
                <input type="hidden" v-model="commonForm.company_type" />
                <el-button type="primary" @click="onSubmit">修改</el-button>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    <el-dialog title="图片查看器" :visible.sync="picShow" :fullscreen=PicFullscreen width="80%" size="80%">
      <img @click="picShow=false" :src=picShowSrc class="slide-img">
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from '@/utils/http'
import common from '@/utils/common'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'profile',
  components: { Tinymce },
  data() {
    return {
      dynamicValidateForm: {
        domains: [{
          value: ''
        }],
        email: ''
      },
      commonForm: {
        username:'',
        email:'',
        nickname:'',
        avatar:'',
      },
      rules: {

      },
      picShow: false,
      picShowSrc: '',
      PicFullscreen: true,
    }
  },
  computed: {
    ...mapGetters([
      'roles','uid','user'
    ])
  },
  methods: {
    showImg(src) {
      this.picShow = true
      this.picShowSrc = src
    },

    getProfile() {
      const self = this
      axios.post('/user/profile').then(
        res => {
          if(res.code != 0){
            self.$message.error({message:res.message})
          }else{
//            self.commonForm = res.data
            for(var x in res.data){
              self.commonForm[x] = res.data[x]
            }
            console.log(self.commonForm.extra_goods_rate)
            console.log(self.commonForm.bank_licence_imgs)
            console.log(self.commonForm.licence_img)

            var discountPriceStep = []
            for(var i in res.data.discount_price_step){
              discountPriceStep.push({
                'key':i,
                'value':res.data.discount_price_step[i].value,
                'rate':res.data.discount_price_step[i].rate,
              })
            }
            self.commonForm.discountPriceStep = discountPriceStep
            // console.log(discountPriceStep);

            var discountPriceStepNew = []
            for(var i in res.data.discount_price_step_new){
              discountPriceStepNew.push({
                'key':i,
                'value':res.data.discount_price_step[i].value,
                'rate':res.data.discount_price_step[i].rate,
              })
            }
            self.commonForm.discountPriceStepNew = discountPriceStepNew
          }
        },
        res => {
          self.$message.error({message:res.message})
        }
      )
    },

    onSubmit() {
      self = this
      setTimeout(function () {
        self.$refs['commonForm'].validate((valid) => {
          if (valid) {
            axios.post('/user/update-profile', self.commonForm).then((res) => {
              if (res.code == 0) {
                self.$message.success('修改成功！')
              } else {
                self.$message.error('修改成功:' + res.message)
              }
            })
          } else {
            return false
          }
        })
      }, 100)

    }
  },
  created() {
    this.getProfile()

    console.log('this.commonForm.discountPriceStepNew',this.commonForm.discountPriceStepNew);
  }
}
</script>

<style>
    .el-form-item {
        margin-bottom: 10px;
    }
  .grid-content{
    width: 80%;
    padding-top: 20px;
    padding-bottom: 20px;
  }
  .bg-purple {
    background: #eef1f6;
    margin-top: 20px;
  }
  .el-form-item{
    margin-left:5%;
    margin-right:5%;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .item-discount-price-step input{
    width: 100px;
  }
  .item-discount-price-step-unit{
    padding-left: 5px !important;
    color: #b92c28;
    font-weight: 500;
  }
  .now_step_price_list *{
    font-weight: normal;
  }
  .now_step_price_list label{
    margin-left: 10px;
  }
  .now_step_price_list span{
    color: #b92c28;
    font-size: 16px;
    font-weight: 500;
  }
  .item-discount-price-step-tip{
    margin-bottom: 0;
  }
  .item-discount-price-step-tip p{
    margin-top: 0;
    margin-bottom: 0;
  }
    .licence-img {
      width: 80px;
      height: 80px;
      margin-top: 1px;
    }

    .godown_entry_img {
      margin-left: 5px;
    }

</style>

