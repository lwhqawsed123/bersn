import Vue from 'vue'
import Router from 'vue-router'
import { Message } from 'element-ui';

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/index',
      component: () => import('@/components/home/home.vue'),
      children: [
        {
          path: '/index',
          name: 'index',
          component: () => import('@/components/index/index.vue')
        },
        {
          path: '/mgt',
          name: 'mgt',
          component: () => import('@/components/mgt/mgt.vue'),
          children:[
            {
              path: '/mgt/brand',
              name: 'brand',
              component: () => import('@/components/mgt/brand/brand.vue')
            },
            {
              path: '/mgt/road',
              name: 'road',
              component: () => import('@/components/mgt/road/road.vue')
            },
            {
              path: '/mgt/lumin',
              name: 'lumin',
              component: () => import('@/components/mgt/lumin/lumin.vue')
            },
            {
              path: '/mgt/concent',
              name: 'concent',
              component: () => import('@/components/mgt/concent/concent.vue'),
            },
            {
              path: '/mgt/concent/detail',
              name: 'detail',
              component: () => import('@/components/mgt/detail/detail.vue')
            },
            {
              path: '/mgt/pole',
              name: 'pole',
              component: () => import('@/components/mgt/pole/pole.vue')
            }
          ]
        }

      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/components/login/login.vue')
    },
    {
      path: '/socket',
      name: 'socket',
      component: () => import('@/components/websocket/websocket.vue')
    }
  ]
})
