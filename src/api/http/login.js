import request from '../../utils/request.js'

export const http_login=(options)=>{
    var options=options||{}
    var method=options.method||'POST'
    var data=options.data||{}
    return request({
        url:`/index/login`,
        method,
        data,
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    })
}