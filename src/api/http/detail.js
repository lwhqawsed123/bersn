import request from '../../utils/request.js'



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


export const get_select_road = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    return request({
        url: `/api/select/road`,
        method
    })
}


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
