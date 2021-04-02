import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import main11 from './views/main11.vue'
import page1 from './views/page1.vue'
import page2 from './views/page2.vue'
import page3 from './views/page3.vue'
import page4 from './views/page4.vue'
import login from './views/Login'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/login',
      component:login,
      name:'login'
    },
    { 
      path: '/', 
      component: Home,
      redirect: 'main',
      children: [
        {
          path: 'main',
          name: '首页',
          component: main11
        },
        {
          path: 'page1',
          name: 'page1',
          component: page1
        },
        {
          path: 'page2',
          name: 'page2',
          component: page2
        },
        {
          path: 'page3',
          name: 'page3',
          component: page3
        },
        {
          path: 'page4',
          name: 'page4',
          component: page4
        }
      ]
    }
  ]
})

const originalPush = Router.prototype.push
  Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

