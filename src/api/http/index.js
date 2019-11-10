import request from '../../utils/request.js'

export const select_road=(options)=>{
    var options=options||{}
    var method=options.method||'POST'
    return request({
        url:`/select/road`,
        method
    })
}