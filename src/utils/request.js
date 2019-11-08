import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
axios.defaults.withCredentials = true
// const http = axios.create({
//     baseURL: '/api', // api的base_url
//     timeout: 15000, // 请求超时时间
//     withCredentials:true,
//     headers:{
//         'Content-Type':'application/x-www.from-urlencoded'
//     }
// })
const http = axios.create({
    baseURL: '/api', // api的base_url
    timeout: 15000, // 请求超时时间
    withCredentials:true,
    headers:{
        'Content-Type':'application/json'
    }
})


export default http