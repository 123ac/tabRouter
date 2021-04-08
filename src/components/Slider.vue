<template>
    
    <el-aside class="aside" :width="isCollapse?'60px':'200px'" >
        <!--展开/收起-->
        <div class="toggle_box" @click="toggleCollapse">|||</div>
        <el-menu
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              background-color="#001529"
              text-color="#fff"
              active-text-color="#ffd04b"
              :collapse="isCollapse"
              :default-active="activePath"
              :collapse-transition="false"
              :unique-opened="true"
              :router="true">
              
              <el-menu-item index="/main" >
                <i class="el-icon-menu"></i>
                <span slot="title">首页</span>
              </el-menu-item>
               
               <el-submenu  v-for="(item,index) in menuList" 
                             :key="index" 
                             :index='item.id'
                             v-if="item.show && item.children!=''">
                        <!-- 主菜单 -->
                      <template slot="title">
                        <i :class="item.icon"></i>
                        <span>{{item.title}}</span>
                      </template>
                      <!-- 子菜单 -->
                      <el-menu-item-group >
                        <el-menu-item v-for="child in item.children" 
                                      :key="child.id" 
                                      :index='child.index' 
                                      v-if="child.show" >
                          <i :class="child.icon"></i><span>{{child.childtitle}}</span>
                        </el-menu-item>
                      </el-menu-item-group> 
                      
               </el-submenu>
              
              
            </el-menu>
    </el-aside>
    
</template>

<script>
export default {
  name: 'Slider',
  data(){
    return {
      isCollapse: false,
      activePath: '',
      menuList:[ 
        {
          id:'1',
          title: '系统管理',
          icon:'el-icon-s-tools',
          show:true,
          children:[
            {
              index:'/user',
              childtitle:'用户管理',
              icon:'el-icon-user',
              show:true,//是否显示子菜单页面
            },
            {
              index:'/page2',
              childtitle:'权限管理',
              icon:'el-icon-star-off',
              show:true,
            },
          ]
        },
        {
          id:'2',
          title: '日志管理',
          icon:'el-icon-message-solid',
          show:true,
          children:[
            {
              index:'/page3',
              childtitle:'sql日志',
              icon:'el-icon-view',
              show:true,
            },
            {
              index:'/page4',
              childtitle:'用户日志',
              icon:'el-icon-edit',
              show:true,
            },
          ]
        }
      ]
    }
  },
  methods:{
       toggleCollapse () {
         this.isCollapse = !this.isCollapse
       },
       handleOpen (key, keyPath) {
         // console.log(key, keyPath)
       },
       handleClose (key, keyPath) {
         // console.log(key, keyPath)
       },
       
        quitFullscreen() {
             if (document.exitFullscreen) {
                 document.exitFullscreen();
             } else if (document.webkitCancelFullScreen) {
                 document.webkitCancelFullScreen();
             } else if (document.mozCancelFullScreen) {
                 document.mozCancelFullScreen();
             } else if (document.msExitFullscreen) {
                 document.msExitFullscreen();
             }
        },
        getKeyDown() {
             let _this = this;
             if (event.keyCode === 122) {
                 event.preventDefault() || (event.returnValue = false);
                 _this.toggleFullscreen(); // 触发全屏的按钮
             } else if (event.keyCode === 27) {
                 if (document.fullscreenElement !== null) {
                     _this.quitFullScreen();
                 }
             }
        },
  }
}
</script>
<style lang="less" scoped>
 
    /*侧边栏*/
     .el-aside {
       background-color: #001529;
       color: #333;
          /* //去掉边框 */
          .el-menu {
            border-right: none;
          }
      
      /*展开/收起*/
      .toggle_box {
        background-color: chartreuse;
        font-size: 15px;
        font-weight: bold;
        line-height: 24px;
        color: #FFFFFF;
        letter-spacing: 0.2em;
        text-align: center;
        cursor: pointer;
        
            .i{
                 font-size: 15px;
            }
        }
      }
</style>
