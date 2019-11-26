import request from '../../utils/request.js'


// 根据id查询集中器
export const get_concent_byid = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/api/concent/find`,
        method,
        data: form
    })
}


// 修改集中器
export const edit_concent = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/api/concent/save`,
        method,
        data: form
    })
}

// 删除集中器
export const delete_concent = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/api/concent/delete`,
        method,
        data: form
    })
}

// 道路下拉列表
export const get_select_road = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    return request({
        url: `/api/select/road`,
        method
    })
}

// 道路下拉列表
export const get_all_light = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/api/concent/loadLamp`,
        method,
        data: form
    })
}


// 查询集中器终端信息
export const get_concentVersionInfo = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/monitor/cmd/query/concentVersionInfo`,
        method,
        data: form
    })
}

// 同步光源信息
export const push_lamp = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/monitor/cmd/pushLamp/archives`,
        method,
        data: form
    })
}
