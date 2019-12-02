import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import router from '../router'
import qs from 'qs'
import { Loading } from "element-ui";

// const http = axios.create({
//     baseURL: '/api', // api的base_url
//     timeout: 15000, // 请求超时时间
//     withCredentials:true,
//     headers:{
//         'Content-Type':'application/x-www.from-urlencoded'
//     }
// })

axios.defaults.withCredentials = true           //
const http = axios.create({
    baseURL: '/api', // api的base_url
    // baseURL: 'http://lamp.eclight.com', // api的base_url
    timeout: 70000, // 请求超时时间
    headers: {
        'Content-Type': 'application/x-www.from-urlencoded; charset=UTF-8'
    }

})
let MyLoading=null
// 请求拦截
http.interceptors.request.use((req) => {
    // 全局设置 提交 接口的loading
    if(req.url.indexOf('/save')!==-1){
        MyLoading = Loading.service()
    }
    // //这个例子中data是loginName和password
    // let req_DATA = req.data
    // //统一进行qs模块转换
    // req.data = qs.stringify(req_DATA)
    // //再发送给后台
    if (req.url != '/api/index/login') {
        let token = window.localStorage.getItem('token')
        if (!token) {
            Message.error('请先登录')
            router.push('/login')
        } else {
            req.headers.token = token
            return req;
        }
    } else {
        return req;
    }

}, function (error) {
    // Do something with req error
    return Promise.reject(error);
});
// 响应拦截
http.interceptors.response.use(
    response => {
        if(MyLoading){
            MyLoading.close()
            MyLoading=null
        }
        if (response.data.msgCode && response.data.msgCode == 'system.session.invalid') {
            Message.error('系统会话失效')
            sessionStorage.setItem('fromUrl', router.history.current.fullPath)
            router.push('/login')
        } else if (response.data.msgCode && response.data.msgCode == 'system.unauthorized') {
            Message.error('系统未授权,没有权限访问!')
        } else if (response.data.msgCode && response.data.msgCode == 'system.error') {
            Message.error('系统错误')
        }else{
            return response
        }
    },
    error => {
        if(MyLoading){
            MyLoading.close()
            MyLoading=null
        }
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    Message.error('参数错误');
                    break;
                // location.reload()
                case 500:
                    Message.error('服务器错误');
                    break;
            }

        }
        return Promise.reject(error.response.data)   // 返回接口返回的错误信息
    })
// http.defaults.transformRequest = data => {
//     //=>DATA:就是请求主体中需要传递给服务器的内容（对象）
//     let str = ``;
//     for (let attr in data) {
//         if (data.hasOwnProperty(attr)) {
//             str += `${attr}=${data[attr]}&`;
//         }
//     }
//     return str.substring(0, str.length - 1);
// };

// http.interceptors.request.use(
//     config => {
//       config.data = qs.stringify(config.data) // 转为formdata数据格式
//       return config
//     },
//     error => Promise.error(error))


export default http