import request from '../../utils/request.js'

export const add_lamp = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/api/lamp/save`,
        method,
        data: form
    })
}

// 查询所有光源
export const get_all_lamp = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/api/lamp/loadData`,
        method,
        data: form
    })
}
// 根据id查询光源
export const get_lamp_byid = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/api/lamp/find`,
        method,
        data: form
    })
}

// 删除光源
export const delete_lamp = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/api/lamp/delete`,
        method,
        data: form
    })
}
// 根据id查询 光源数据(硬件)
export const get_monitor_cmd_lamp_byid = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/monitor/cmd/query/lampData`,
        method,
        data: form
    })
}

export const set_groupLamp_byid = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/monitor/cmd/control/groupLamp`,
        method,
        data: form
    })
}
export const set_singleLamp_byid = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/monitor/cmd/control/lamp`,
        method,
        data: form
    })
}


export const open_groupLamp_byid = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/monitor/cmd/control/lamp/open`,
        method,
        data: form
    })
}


export const close_groupLamp_byid = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/monitor/cmd/control/lamp/close`,
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


export const get_select_luminGroup = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    return request({
        url: `/api/select/luminGroup`,
        method
    })
}

export const get_select_concent = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    return request({
        url: `/api/select/concent`,
        method
    })
}

export const get_select_pole = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    return request({
        url: `/api/select/pole`,
        method
    })
}

export const get_select_light = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    return request({
        url: `/api/select/light`,
        method
    })
}

export const get_select_annex = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    return request({
        url: `/api/select/annex`,
        method
    })
}