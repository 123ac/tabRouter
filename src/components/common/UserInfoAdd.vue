<template>
  <div>
    <el-dialog v-bind="$attrs" :visible.sync="showDialog"  v-on="$listeners" @open="onOpen" @close="onClose" title="Dialog Titile">
      <el-row :gutter="15">
        <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
          <el-col :span="24">
            <!-- 用户头像 -->
                       <el-form-item label="用户头像">
           
                         <!-- 头衔缩略图 -->
                         <pan-thumb :image="image"/>
                         <!-- 文件上传按钮 -->
                         <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
                         </el-button>
           
                         <!--
                           v-show：是否显示上传组件
                           :key：类似于id，如果一个页面多个图片上传控件，可以做区分
                           :url：后台上传的url地址
                           @close：关闭上传组件
                           @crop-upload-success：上传成功后的回调 -->
                        <image-cropper
                           v-show="imagecropperShow"
                           :width="300"
                           :height="300"
                           :key="imagecropperKey"
                           :url="'/ossservice/upload/uploadImgFile'"
                           field="file"
                           @close="closeImage"
                           @crop-upload-success="cropSuccess"/>
           
                       </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名" prop="name">
              <el-input v-model="formData.name" placeholder="请输入用户名" clearable :style="{width: '100%'}">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="formData.password" placeholder="请输入密码" clearable show-password
                :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="departmentId">
              <el-select v-model="formData.departmentId" placeholder="请选择部门" clearable
                :style="{width: '100%'}">
                <el-option v-for="(item, index) in departmentIdOptions" :key="index" :label="item.label"
                  :value="item.value" :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="formData.nickname" placeholder="请输入昵称" clearable :style="{width: '100%'}">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="formData.sex" size="medium">
                <el-radio v-for="(item, index) in sexOptions" :key="index" :label="item.value"
                  :disabled="item.disabled">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="formData.email" placeholder="请输入邮箱" clearable :style="{width: '100%'}">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="formData.phone" placeholder="请输入手机号" clearable :style="{width: '100%'}">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生日" prop="birthday">
              <el-date-picker type="datetime" v-model="formData.birthday" format="yyyy-MM-dd"
                value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="请选择生日" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handelConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
    import ImageCropper from "../common/ImageCropper/index.vue"
    import PanThumb from '../common/PanThumb/index.vue'
export default {
  inheritAttrs: false,
  components: {
      ImageCropper,
         PanThumb
  },
  props: {
      addOrUpdateVisible:{
                  type: Boolean,         
                  default: false
              },
          
  },
  data() {
    return {
      // 控制弹出框显示隐藏
      showDialog:false,
      imagecropperShow: false, // 是否显示上传组件
      imagecropperKey: 0, // 上传组件id
      image: 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191',
      formData: {
        field102: null,
        name: undefined,
        password: undefined,
        departmentId: undefined,
        nickname: undefined,
        sex: undefined,
        email: undefined,
        phone: undefined,
        birthday: "1997-06-11",
      },
      rules: {
        name: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }],
        departmentId: [{
          required: true,
          message: '请选择部门',
          trigger: 'change'
        }],
        nickname: [{
          required: true,
          message: '请输入昵称',
          trigger: 'blur'
        }],
        sex: [{
          required: true,
          message: '性别不能为空',
          trigger: 'change'
        }],
        email: [{
          required: true,
          message: '请输入邮箱',
          trigger: 'blur'
        }],
        phone: [{
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        }],
        birthday: [{
          required: true,
          message: '请选择生日',
          trigger: 'change'
        }],
      },
      field102Action: 'https://jsonplaceholder.typicode.com/posts/',
      field102fileList: [],
      departmentIdOptions: [{
        "label": "选项一",
        "value": 1
      }, {
        "label": "选项二",
        "value": 2
      }],
      sexOptions: [{
        "label": "男",
        "value": 0
      }, {
        "label": "女",
        "value": 1
      }],
    }
  },
  computed: {},
  watch: {
            // 监听 addOrUpdateVisible 改变
              addOrUpdateVisible(){
                  this.showDialog = this.addOrUpdateVisible
              },
  },
  created() {},
  mounted() {},
  methods: {
    onOpen() {},
    onClose() {
       // 子组件调用父组件方法，并传递参数
      this.$emit('changeShow','false')
    },
    close() {
      this.$emit('update:visible', false)
    },
    handelConfirm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        this.close()
      })
    },
    field102BeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 2
      if (!isRightSize) {
        this.$message.error('文件大小超过 2MB')
      }
      return isRightSize
    },
      // 上传成功后的回调函数
      cropSuccess(data) {
        console.log(data)
        this.imagecropperShow = false
        this.image = data.url;
        // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
        this.imagecropperKey = this.imagecropperKey + 1
      },

      // 关闭上传组件
      closeImage() {
        this.imagecropperShow = false
        // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
        this.imagecropperKey = this.imagecropperKey + 1
      }
  }
}

</script>
<style>
.el-upload__tip {
  line-height: 1.2;
}

</style>
