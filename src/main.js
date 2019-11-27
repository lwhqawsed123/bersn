// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/base.css'
import Element from 'element-ui'
// 导入 饿了么框架的css文件
// import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/element.css'
// 导入字体图标
import './assets/iconfont/iconfont.css'
// import './utils/iconfont/iconfont.css'
// import BMap from 'vue-baidu-map'
// Vue.use(BMap, {
//   ak: 'b0hqKLX0sjyi9RtYkpAZQu9yGP73unL7'
// })
// import 'vue-google-maps/dist/vue-google-maps.css'
// import VueGoogleMaps from 'vue-google-maps'
// Vue.use(VueGoogleMaps, {
//   load: {
//     apiKey: 'AIzaSyBBPofZLGmBNDowBB1h-cPBruONAEeLx_E',
//     libraries: ['places'],
//     useBetaRenderer: false,
//   },
// })

// 输入框禁止输入特殊字符(-&除外)
// 使用方法,<el-input maxlength='15' :value="searchForm.logId" @input='e => searchForm.logId = validSe (e)' placeholder="请输入日志ID"></el-input>
Vue.prototype.validSe = function (value) {
  value = value.replace(/[`～*~!@#$%^*()_+=<>?:"{}|,./;'\\[\]·~！@#￥%……*（）——+={}|《》？：“”【】、；‘’，。、]/g, '').replace(/\s/g, "");
  // if (value.length >= number) {
  // this.$message({
  // type: "warning",
  // message: `输入内容不能超过${number}个字符`
  // });
  // }
  return value;
};

// 自定义全局规则,禁止输入特殊字符(-&除外)
// 使用方法 <el-input v-filterSpecialChar></el-input>
Vue.directive('charRules', {
  update: function (el, { value, modifiers }, vnode) {
    try {
      //此处可以debug看看el具体值是什么,这里演示的是原生控件input,如果是使用element中的<el-input />标签,需要通过 el.children[0] 拿到原生input.
      if (!el.children[0].value) {
        return;
      }
      el.children[0].value = el.children[0].value.replace(/[`～*~!@#$%^*()_+=<>?:"{}|,./;'\\[\]·~！@#￥%……*（）——+={}|《》？：“”【】、；‘’，。、]/g, '').replace(/\s/g, "");
      if (el.children[0].value.length > 100) {
        el.children[0].value = el.children[0].value.substring(0, 100)
      }
      el.children[0].dispatchEvent(new Event(modifiers.lazy ? "change" : "input"));
    } catch (e) { }
  }
})

import i18n from './lang/i18n'
Vue.config.productionTip = false
Vue.use(Element)
/* eslint-disable no-new */
// rem适配

new Vue({
  el: '#app',
  i18n,
  router,
  components: { App },
  template: '<App/>',
  mounted() {
    // setRem();
  }
})
