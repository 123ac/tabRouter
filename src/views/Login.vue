<template>
    <!-- 登录布局 -->
    <div class="login_container"> 
        <!-- 登录区域 -->
        <div class="login_box">
            <!-- 头像 -->
            <div class="avatar_box">
                <img src="../assets/img/timg.gif" />
            </div>
            <!-- 表单 -->
            <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-width="0px" class="login_Form">
              
              <el-form-item   prop="username">
                <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
              </el-form-item>
              
              <el-form-item  prop="password">
                <el-input type="password" v-model="loginForm.password" autocomplete="off" prefix-icon="el-icon-lock"></el-input>
              </el-form-item>
              
              <el-form-item   prop="verifyCode">
                  <div class="verify_box">
                     <el-popover
                       placement="top-start"
                       width="380"
                       trigger="click" 
                       v-model="SlideVerify">
                       <slide-verify ref="slideblock"
                                      :l="42"
                                      :r="10"
                                      :w="380"
                                      :h="185"
                                      @success="onSuccess"
                                      @fail="onFail"
                                      @refresh="onRefresh"
                                      @again="onAgain"
                                      :slider-text="text"
                                      ></slide-verify>
                        <el-button style="width: 410px;" :type="codeType" @click="handleClick" :disabled="disabled"  slot="reference">{{TipMsg}}</el-button>
                     </el-popover>
                  </div>
                   
               </el-form-item>
              
              <el-form-item class="login_btn">
                <el-button type="primary" @click="submitForm()">提交</el-button>
                <el-button @click="resetForm('loginForm')">重置</el-button>
              </el-form-item> 
                
            </el-form>
        </div>
    </div>
</template>

<script> 
    export default{
        name: 'Login',
        data() {
              return {
                  fullscreenLoading: false,
                SlideVerify:false,
                text: '向右滑',
                codeType:"",
                TipMsg:"点击验证",
                disabled:false, 
                loginForm: {
                  username: '',
                  password: '',
                  verifyCode: ''
                },
                loginRules: {
                    username: [
                      { required:true , message: "请输入用户名称",trigger: 'blur' },
                      { min :3 ,max:5, message: "长度在 3 到 5 个字符",trigger: 'blur'}
                    ],
                  password: [
                    { required:true , message: "请输入密码",trigger: 'blur' },
                    { min :3 ,max:5, message: "长度在 3 到 5 个字符",trigger: 'blur'}
                  ],
                  verifyCode:[
                      { required:true , message: "请输入验证码",trigger: 'blur'}
                  ]
                }
              };
            },
            methods: { 
                onSuccess(){
                       console.info('成功！')
                       this.loginForm.verifyCode=true; 
                       this.SlideVerify=false; 
                       this.codeType="success";
                       this.TipMsg="验证成功";
                       // this.disabled=true;
                },
                onFail(){
                        console.info('失败！')
                        this.loginForm.verifyCode=false;
                        this.codeType="danger";
                        this.TipMsg="验证失败";
                 },
                 onRefresh(){
                        console.info('刷新！')
                        this.loginForm.verifyCode=false;
                        this.codeType="";
                        this.TipMsg="点击验证";
                         // this.disabled=false;
                },
                onAgain(){
                  console.log("检测到非人为操作的哦！"); 
                  this.$refs.slideblock.reset();
                  this.onRefresh();
                },
                 handleClick() {
                      // 父组件直接可以调用刷新方法
                      this.$refs.slideblock.reset();
                      this.TipMsg="验证中";
                      this.codeType="";
                    },
              submitForm() {
                 var _this=this
                 if(_this.loginForm.verifyCode==true){
                     console.info("验证成功！")
                     
                     //登录时加载样式
                     const loading = this.$loading({
                       lock: true,
                       text: 'Loading',
                       spinner: 'el-icon-loading',
                       background: 'rgba(0, 0, 0, 0.7)'
                     });
                     
                     this.$ajax
                     .POST("/login", {
                       username: this.loginForm.username,
                       password: this.loginForm.password
                     })
                     .then((data) => {
                          console.info(data)
                         if(data.success){
                             _this.$message.success("登录成功！");
                             console.info("存储token")
                             localStorage.setItem("token",data.data.token)
                             
                              loading.close();//关闭加载样式
                             _this.$router.push("/") 
                         } else{ 
                             _this.$message.error("登录失败！账号密码错误！");
                             _this.onRefresh();
                         }
                        })
                 }else{
                     this.$message.info("请点击验证！");
                 }
                  
              },
              resetForm(formName) {
                this.$refs[formName].resetFields();
              }
            }
          
    }
</script>

<!-- 内部样式 -->
<style lang="less" scoped >
     
    
    .login_container{
        width: 100%;
        height: 100%;
        background-color:aquamarine;
    }
    
    .login_box{
        width: 450px;
        height: 380px;
        background-color: #FFFFFF;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform:  translate(-50%,-50%);
    }
    .avatar_box{
        width: 130px;
        height: 130px;
        border: 1px solid #EEEEEE;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
        margin:  -65px auto;
        background-color: #FFFFFF;
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eeeeee;
        }
    }
    .login_Form{
        position: absolute;
        bottom: 0px;
        width: 100%;
        padding: 0px 20px;
        box-sizing: border-box;
        .login_btn{
            display: flex;
            justify-content: flex-end;
        }
        
    }
    .verify_box{
        display: flex;
        .verify_code{
            width: 70%;
            justify-content: left;
        }
        .verify_img{
            width: 30%;
            height: 45px;
            justify-content: flex-end;
        }
        
    }
   
   
</style>
