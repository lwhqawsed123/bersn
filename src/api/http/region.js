import request from '../../utils/request.js'
// 新增区域
export const add_region = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/api/region/save`,
        method,
        data: form
    })
}

// 查询所有区域
export const get_all_region = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/api/region/loadData`,
        method,
        data: form
    })
}
// 根据id查询区域
export const get_region_byid = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/api/region/find`,
        method,
        data: form
    })
}

// 删除区域
export const delete_region = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/api/region/delete`,
        method,
        data: form
    })
}


// ===============道路========================
// 新增道路
export const add_road = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/api/road/save`,
        method,
        data: form
    })
}
// 查询所有光源类型
export const get_annex_select = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    return request({
        url: `/api/select/annex`,
        method,
    })
}

// 查询所有道路
export const get_all_road = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/api/road/loadData`,
        method,
        data: form
    })
}
// 根据id查询道路
export const get_road_byid = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/api/road/find`,
        method,
        data: form
    })
}
// 删除道路
export const delete_road = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/api/road/delete`,
        method,
        data: form
    })
}
