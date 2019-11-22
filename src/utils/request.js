import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import qs from 'qs'
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