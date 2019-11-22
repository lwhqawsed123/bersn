import Vue from 'vue'
import VueI18n from 'vue-i18n'
import locale from 'element-ui/lib/locale'
import messages from './login/index'
Vue.use(VueI18n)


// const messages = {
//     en: {
//       en,
//       ...enLocale // 或者用 Object.assign({ message: 'hello' }, enLocale)
//     },
//     zh: {
//         zh,
//       ...zhLocale // 或者用 Object.assign({ message: '你好' }, zhLocale)
//     }
//   }
// 创建vue-i18n实例i18n
const i18n = new VueI18n({
    // 设置默认语言
    locale: localStorage.getItem('locale') || 'zh', // 语言标识
    // 添加多语言（每一个语言标示对应一个语言文件）
    messages: messages
})
locale.i18n((key, value) => i18n.t(key, value)) //为了实现element插件的多语言切换
// 暴露i18n
export default i18n