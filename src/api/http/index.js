import request from '../../utils/request.js'
import qs from 'qs'
// 道路下拉列表
export const select_road = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    return request({
        url: `/select/road`,
        method
    })
}
// 照明分组下拉列表
export const luminGroup = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    return request({
        url: `/select/luminGroup`,
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
        url: `/index/map/search`,
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
        url: `/index/marker/concent`,
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
        url: `/index/marker/pole`,
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
        url: `/index/marker/batchPole`,
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
        url: `/concent/find`,
        method,
        data
    })
}