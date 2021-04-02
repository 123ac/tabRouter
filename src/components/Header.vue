<template>
    <div class="header"> 
        <!-- logo和项目名 -->
        <div class="left_box">
            <img src="../assets/img/timg.gif" />
            <span>XX管理系统</span>
        </div>
                     
        <!-- 用户登录展示头像 -->
        <div class="right_box"> 
           <i class="el-icon-full-screen" @click="toggleFullscreen"></i> 
            <!-- 下拉菜单 -->
            <el-dropdown>
              <img src="../assets/img/timg.gif" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-user">个人信息</el-dropdown-item>
                <el-dropdown-item icon="el-icon-edit-outline">修改密码</el-dropdown-item>
                <el-dropdown-item icon="el-icon-switch-button" ><span @click='logout'>退出登录</span></el-dropdown-item>
              
              </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
    
    
</template>

<script>
export default {
    name:'navTop',
    methods:{
        logout(){
            console.info("退出登录！清除token")
            this.$store.state.openTab = [];
            // this.$store.state.activeIndex = '/main';
            //清除token
            localStorage.removeItem('token');
            this.$router.push('/login') 
        },
        toggleFullscreen() {
        let _this = this;
        let el = document.documentElement;
             if (document.fullscreenElement === null) {
                 _this.openFullscreen(el);
             } else {
                 _this.quitFullscreen();
             }
        },
        openFullscreen(element) {
             if (element.requestFullscreen) {
                 element.requestFullscreen();
             } else if (element.webkitRequestFullScreen) {
                 element.webkitRequestFullScreen();
             } else if (element.mozRequestFullScreen) {
                 element.mozRequestFullScreen();
             } else if (element.msRequestFullscreen) {
                 // IE11
                 element.msRequestFullscreen();
         }
        },
    }
}
</script>

<style lang="less" scoped>

/*头部布局*/
    .header {
       background-color: #001529;
       display: flex;
       justify-content: space-between;
       padding-left:0 ;
       color: #FFFFFF;
      align-items: center;
      font-size:  20px; 
      width: 100%;
     }
     
     /*左边logo和标题*/
     .left_box{
         display:  flex;
         align-items: center;
         /*logo*/
         img{
             width: 60px;
             height: 60px;
             margin: 0px 0px 10px 15px;
         }
         /*标题*/
         span{
             margin-left: 15px;
         }
     }
         
     /*右边的登录头像*/
     .right_box{
         
         /*全屏按钮、主题换色*/
         /* // el-icon-full-screen */
         /* // 头像 */ 
         .el-dropdown > img{
             height: 60px;
             width: 60px;
             border-radius:50% ;
             background-color: #FFFFFF;
             margin:0px 15px 0px 0px ;
         }
    }
</style>
