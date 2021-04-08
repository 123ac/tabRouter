import Vue from 'vue'
import App from './App.vue'
import router from './router' //引入路由
import store from './store'     //引入标签
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/global.css' //引入全局样式

//验证码插件
import SlideVerify from 'vue-monoplasty-slide-verify';
Vue.use(SlideVerify);

Vue.use(ElementUI);
Vue.config.productionTip = false


import { Message } from 'element-ui';

//引入日期标签格式化插件
import moment from 'moment'
Vue.use(require('vue-moment'));
Vue.prototype.moment = moment
Vue.filter('dateYMDHMSFormat',function(dateStr,pattern='YYYY-MM-DD HH:mm:ss'){
  return moment(dateStr).format(pattern);
})


import axios from 'axios' //引入axios
import qs from 'qs'
  
var base="http://localhost:8090" 
export const POST = (url, params) => {
   axios.defaults.transformRequest = [
     function (data) {
       return qs.stringify(data)
     }
   ];
  console.log(url);
  return axios.post(`${base}${url}`, params).then(res => {
    console.log(res);
    if (res.status == 200)
      return res.data;
    else
     this.$message.error("操作失败，服务端出现异常错误！") 
  })
}

Vue.prototype.$ajax = { 
  POST(url, params) {
         return POST(url, params);
  },
}

// 添加请求拦截器 
axios.interceptors.request.use(function (config) {
  let token=localStorage.getItem('token')
  // console.info("每次带token")
  // console.info(token)
  if(token)
    config.headers.common['token'] = token; 
    
  return config;
}, function (error) {
  // Do something with request error
  Message.error('网络连接异常，请稍后再试！');
  console.info("error: ");
  console.info(error);
  return Promise.reject(error); 
});


// 添加一个响应拦截器
axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  // Do something with response error
  if (error.response.status == 404) {
    //找不到请求的服务
    Message.error('找不到请求的服务！');
  } 
  else if (error.response.status == 401) {
    //没有token需要登录
    Message.error('登录凭证失效，请重新登录！'); 
    localStorage.removeItem("token"); 
    window.location.href = "/login";
  } else if (error.response.status == 403) {
     Message.error('token过期，请重新登录！');
     localStorage.removeItem("token"); 
     window.location.href = "/login";
  }  
  return Promise.reject(error);
})

router.beforeEach((to, from, next) => { 
     console.info("当前标签数："+store.state.openTab.length)
     //限制最大标签页数 超过不跳转路由~
     if(store.state.openTab.length>12){
         Message.info('标签页已达到最大12页');
         return
     } 
      
     //根据字段判断是否进行路由过滤（即是否需要登录才能访问） 
    if (localStorage.getItem('token') != null || to.name == 'login') {
        next()
    } else { 
       console.info("token失效跳转登录页面") 
        next({
            path: '/login',
        });
    } 
});


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
