import request from '../../utils/request.js'
// 新增品牌
export const add_brand = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/brand/save`,
        method,
        data: form
    })
}

// 查询所有品牌
export const get_all_brand = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/brand/loadData`,
        method,
        data: form
    })
}
// 根据id查询品牌
export const get_brand_byid = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/brand/find`,
        method,
        data: form
    })
}

// 删除品牌
export const delete_brand = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/brand/delete`,
        method,
        data: form
    })
}


// ===============灯具========================
// 新增灯具
export const add_light = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/light/save`,
        method,
        data: form
    })
}
// 查询所有光源类型
export const get_annex_select = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    return request({
        url: `/select/annex`,
        method,
    })
}

// 查询所有灯具
export const get_all_light = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/light/loadData`,
        method,
        data: form
    })
}
// 根据id查询灯具
export const get_light_byid = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/light/find`,
        method,
        data: form
    })
}
// 删除灯具
export const delete_light = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/light/delete`,
        method,
        data: form
    })
}


// =========光源================
// 新增光源
export const add_annex = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/annex/save`,
        method,
        data: form
    })
}

// 查询所有光源
export const get_all_annex = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/annex/loadData`,
        method,
        data: form
    })
}
// 根据id查询灯光源
export const get_annex_byid = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/annex/find`,
        method,
        data: form
    })
}
// 删除灯光源
export const delete_annex = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/annex/delete`,
        method,
        data: form
    })
}