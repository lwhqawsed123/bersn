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
            },
            {
              path: '/mgt/lamp',
              name: 'lamp',
              component: () => import('@/components/mgt/lamp/lamp.vue')
            },
            {
              path: '/mgt/lampTask',
              name: 'lampTask',
              component: () => import('@/components/mgt/lampTask/lampTask.vue')
            },
            {
              path: '/mgt/schedule',
              name: 'schedule',
              component: () => import('@/components/mgt/schedule/schedule.vue')
            },
            {
              path: '/mgt/schedule/detail',
              name: 'scheduleDetail',
              component: () => import('@/components/mgt/schedule/detail/detail.vue')
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
