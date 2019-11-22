import request from '../../utils/request.js'
import qs from 'qs'
// 道路下拉列表
export const select_road = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    return request({
        url: `/api/select/road`,
        method
    })
}
// 照明分组下拉列表
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
// 搜索框
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
// 修改或者标记集中器
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
// 标记灯杆
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

// 批量修改灯杆
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

// id查询集中器
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

// id查询灯杆
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

// id查询灯源
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
// 关闭光源
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

// 开启光源
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
// 单灯调光
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

// 群体调光(传单灯id也可以控制单灯)
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
