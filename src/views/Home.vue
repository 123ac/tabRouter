<template>
 <el-container class="el-container"> 
        <!-- 头部布局 -->
        <el-header> 
            <nav-top></nav-top> 
        </el-header>
        
         <!-- 左侧导航栏 -->
        <el-container> 
            <slider></slider> 
      
            <el-main>
               <!-- 内容区 -->
               <div class="app-wrap">
                   <!-- 此处放置el-tabs 标签代码 -->
                   <div >
                     <el-tabs
                       v-model="activeIndex"
                       type="border-card"
                       closable
                       v-if="openTab.length"
                        @tab-click='tabClick'
                        @tab-remove='tabRemove'
                        @contextmenu.prevent.native="openContextMenu($event)"
                       >
                       
                       <el-tab-pane
                         :key="item.name"
                         v-for="(item, index) in openTab"
                         :label="item.name"
                         :name="item.route"
                        >
                       </el-tab-pane>
                     </el-tabs>
                   </div>
                   <div class="content-wrap">
                     <router-view/>
                   </div>
               </div>
                <ul
                              v-show="contextMenuVisible"
                              :style="{left:left+'px',top:top+'px'}"
                              class="contextmenu"
                            >
                              <li @click="closeAllTabs">关闭所有</li>
                              <li @click="closeOtherTabs('left')">关闭左边</li>
                              <li @click="closeOtherTabs('right')">关闭右边</li>
                              <li @click="closeOtherTabs('other')">关闭其他</li> 
                            </ul>
           </el-main>
       </el-container>
   </el-container> 
</template>

<script>
// @ is an alias to /src
import Slider from '@/components/Slider.vue'
import navTop from '@/components/Header.vue'
export default {
  name: 'Home',
  components: {
    Slider,navTop
  },
  data(){
    return{
        contextMenuVisible:false,
        currentContextTabId:'',
        left:0,
        top:0,
    }
  }, 
  mounted () {
      //监控标签页点击空白事件
      document.body.addEventListener("click", this.closeContextMenu);
     
      window.addEventListener("keydown", this.getKeyDown);
      
    // 刷新时以当前路由做为tab加入tabs
    // 当前路由不是首页时，添加首页以及另一页到store里，并设置激活状态
    // 当当前路由是首页时，添加首页到store，并设置激活状态
    if (this.$route.path != '/' && this.$route.path != '/main') {
      console.log('1');
      this.$store.commit('add_tabs', {route: '/main', name: '首页'}); //添加到标签页中
      this.$store.commit('set_active_index', '/main');//激活显示页面
      
      this.$store.commit('add_tabs', {route: this.$route.path , name: this.$route.name });
      this.$store.commit('set_active_index', this.$route.path);
    } else {
      console.log('2');
      this.$store.commit('add_tabs', {route: '/main', name: '首页'}); 
      this.$router.push('/');
    }

  }, 
  methods:{
      
        // 标签页右击菜单
        openContextMenu(e) {
           //console.log(e.srcElement);
           if (e.srcElement.id) {
             let currentContextTabId = e.srcElement.id.split("-")[1];
             this.contextMenuVisible = true;
             console.info("标签id："+currentContextTabId);
             this.$store.commit("saveCurContextTabId", currentContextTabId);
             this.currentContextTabId=currentContextTabId;
             this.left = e.clientX;
             this.top = e.clientY + 10;
           }
         }, 
        // 关闭所有标签页
        closeAllTabs() {
          this.$store.commit("closeAllTabs");
          this.contextMenuVisible = false;
        },
        // 关闭其它标签页
        closeOtherTabs(par) {
          this.$store.commit("closeOtherTabs", par);
          this.contextMenuVisible = false;
        }, 
        
        
    // 关闭右击菜单
    closeContextMenu() {
          this.contextMenuVisible = false;
    }, 
    
    //tab标签点击时，切换相应的路由
    tabClick(tab){
      console.log("tab",tab);
      console.log('active',this.activeIndex);
      this.$router.push({path: this.activeIndex});
    },
    //移除tab标签
    tabRemove(targetName){
      console.log("tabRemove",targetName);
      //首页不删
      if(targetName == '/'||targetName == '/main'){
        return
      }
      this.$store.commit('delete_tabs', targetName);
      if (this.activeIndex === targetName) {
        // 设置当前激活的路由
        console.info("当前标签："+this.openTab.length)
        if (this.openTab && this.openTab.length >= 1) {
          console.log('=============',this.openTab[this.openTab.length-1].route)
          this.$store.commit('set_active_index', this.openTab[this.openTab.length-1].route);
          this.$router.push({path: this.activeIndex});
        } else {
          this.$router.push({path: '/'});
        }
      }
    }
  },
  computed: {
    openTab () {
      return this.$store.state.openTab;
    },
    activeIndex:{
      get () {
        return this.$store.state.activeIndex;
      },
      set (val) {
        this.$store.commit('set_active_index', val);
      }
    }
  },
  watch:{
    '$route'(to,from){
        //判断路由是否已经打开
        //已经打开的 ，将其置为active
        //未打开的，将其放入队列里
        let flag = false;
        for(let item of this.openTab){
          console.log("item.name",item.name)
          console.log("t0.name",to.name)

          if(item.name === to.name){
            console.log('to.path',to.path);
            this.$store.commit('set_active_index',to.path)
            flag = true;
            break;
          }
        }

        if(!flag){
          console.log('to.path',to.path);
          this.$store.commit('add_tabs', {route: to.path, name: to.name});
          this.$store.commit('set_active_index', to.path);
        }

    }
  }


}
</script>
<style  >
 /*设置整个容器*/
 .el-container{
     width: 100%;
     height: 100%;
 }
 /*头部布局*/
 .el-header {
    background-color: #001529;
    display: flex;
    justify-content: space-between;
    padding-left:0 ;
    color: #FFFFFF;
   align-items: center;
   font-size:  20px;
  }
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
   
   }
   
  } 
    /*内容*/
  .el-main {
    background-color: #E9EEF3;
     
  }
  
  body > .el-container {
    margin-bottom: 40px;
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
      // el-icon-full-screen
      // 头像
      .el-dropdown > img{
          height: 60px;
          width: 60px;
          border-radius:50% ;
          background-color: #FFFFFF;
           margin:0px 15px 0px 0px ;
      }
     
  }
  /* // 下拉菜单 */
   .el-dropdown-link {
      cursor: pointer;
      color: #409EFF;
    }
    .el-icon-arrow-down {
      font-size: 12px;
    }
  
   a {
    text-decoration: none;
    color: #000000;
   }
   
   /* 标签页右击菜单样式 */
   .contextmenu {
     width: 100px;
     margin: 0;
     border: 1px solid #ccc;
     background: #fff;
     z-index: 3000;
     position: absolute;
     list-style-type: none;
     padding: 5px 0;
     border-radius: 4px;
     font-size: 14px;
     color: #333;
     box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.2);
   }
   .contextmenu li {
     margin: 0;
     padding: 7px 16px;
   }
   .contextmenu li:hover {
     background: #f2f2f2;
     cursor: pointer;
   }
   
</style>


