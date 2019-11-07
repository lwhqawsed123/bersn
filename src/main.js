// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/base.css'
import Element from 'element-ui'
// 导入 饿了么框架的css文件
import 'element-ui/lib/theme-chalk/index.css';
// import './utils/iconfont/iconfont.css'
import BMap from 'vue-baidu-map'
Vue.use(BMap,{
  ak:'b0hqKLX0sjyi9RtYkpAZQu9yGP73unL7'
})
Vue.config.productionTip = false
Vue.use(Element)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
