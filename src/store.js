import Vue from 'vue'
import Vuex from 'vuex'
import store from './store'  
import router from './router.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    openTab:[],//所有打开的路由
    activeIndex:'/main', //当前激活状态
    curContextTabId:"", //右击当前标签页id 
  },
  mutations: {
    // 添加tabs
    add_tabs (state, data) {
      this.state.openTab.push(data);
    },
    // 删除tabs
    delete_tabs (state, route) {
      let index = 0;
      for (let option of state.openTab) {
        if (option.route === route) {
          break;
        }
        index++;
      }
      this.state.openTab.splice(index, 1);
    },
    // 设置当前激活的tab
    set_active_index (state, index) {
      this.state.activeIndex = index;
    },
     // 保存右键点击tab的id
     saveCurContextTabId(state, curContextTabId) {
         this.state.curContextTabId = curContextTabId
     },
    // 关闭所有标签
    closeAllTabs(state) {
          this.state.openTab = [];
          
          //想实现标签和页面同步，以下三句代码
          store.commit('add_tabs', {route: '/main', name: '首页'}); //添加进入标签页数组
          store.commit('set_active_index', '/main'); // 激活/main的标签页
          router.push({path: '/main'});// 跳转路由页面 显示页面
    },
    
    // 关闭其它标签页
    closeOtherTabs(state, par) { 
          let tabs = state.openTab;
          let length = tabs.length;
          let curContextTabId =  state.curContextTabId;
          let activeTabItem =  state.activeIndex
          console.log("当前激活:"+activeTabItem)
          console.log("右击选中："+curContextTabId)
          let id; // 右键点击时的tab在整个tabs数组中的id
          let curId // 左键点击时的tab在整个tabs数组中的id 
          tabs.forEach((tab, index) => {
            if (tab.route == curContextTabId) {
              id = index
            }
            if (tab.route == activeTabItem) {
              curId = index
            } 
          })
          
           console.log("激活:"+activeTabItem+" id："+id+"|| 右击选中："+curContextTabId+" curid:"+ curId) 
           store.commit('set_active_index', curContextTabId);//激活显示当前页面
           router.push({path: curContextTabId});//激活路由转换页面
           
          if (par == "left") {
            console.info("关闭左边！ 显示当前标签："+curContextTabId)  
            this.state.openTab= state.openTab.slice(id, length) //截取当前标签到末尾标签
            //使首页一直存在第一位置
            if(curContextTabId !="/main")
            {
                this.state.openTab.unshift({route: '/main', name: '首页'}); //导入首页在数组头部
            }
          }
          if (par == "right") { 
           console.info("关闭右边！ 显示当前标签："+curContextTabId)  
           this.state.openTab = state.openTab.slice(0, id + 1) //截取0到当前选择标签
          }
          if (par == "other") { 
            console.info("关闭其他！ 激活当前标签："+curContextTabId) 
            this.state.openTab = [state.openTab[id]] //只留当前标签和首页
            if(curContextTabId !="/main")
            {
                this.state.openTab.unshift({route: '/main', name: '首页'});
            } 
          }
        }
  },
  actions: {

  }
})
