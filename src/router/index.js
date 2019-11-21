import Vue from 'vue'
import Router from 'vue-router'
import { Message } from 'element-ui';

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
