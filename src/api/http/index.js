import request from '../../utils/request.js'
import qs from 'qs'

export const select_road = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    return request({
        url: `/api/select/road`,
        method
    })
}

export const luminGroup = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    return request({
        url: `/api/select/luminGroup`,
        method,
        data
    })
}

export const map_search = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    return request({
        url: `/api/index/map/search`,
        method,
        data
    })
}

export const edit_concentrator = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    return request({
        url: `/api/index/marker/concent`,
        method,
        data
    })
}

export const merker_pole = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    return request({
        url: `/api/index/marker/pole`,
        method,
        data
    })
}


export const merker_pole_array = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || []
    return request({
        url: `/api/index/marker/batchPole`,
        method,
        data,
        headers: {
            'Content-Type':'application/json'
        }
    })
}


export const get_concentrator_byid = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    return request({
        url: `/api/concent/find`,
        method,
        data
    })
}


export const get_lamp_byid = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    return request({
        url: `/api/index/map/pole`,
        method,
        data
    })
}


export const get_lamp_linght_byid = (options) => {
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
        data:form
    })
}

export const close_lamp_linght_byid = (options) => {
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
        data:form
    })
}


export const open_lamp_linght_byid = (options) => {
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
        data:form
    })
}

export const dimming_lamp_linght_byid = (options) => {
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
        data:form
    })
}

export const dimming_lamp_linght_all = (options) => {
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
        data:form
    })
}
