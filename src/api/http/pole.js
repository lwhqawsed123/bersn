import request from '../../utils/request.js'
// 新增灯杆
export const add_pole = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/api/pole/save`,
        method,
        data: form
    })
}

// 查询所有灯杆
export const get_all_pole = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/api/pole/loadData`,
        method,
        data: form
    })
}
// 根据id查询灯杆
export const get_pole_byid = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/api/pole/find`,
        method,
        data: form
    })
}

// 删除灯杆
export const delete_pole = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/api/pole/delete`,
        method,
        data: form
    })
}

// 道路列表
export const get_select_road = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    return request({
        url: `/api/select/road`,
        method
    })
}

// 集中器列表
export const get_select_content = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    return request({
        url: `/api/select/concent`,
        method
    })
}