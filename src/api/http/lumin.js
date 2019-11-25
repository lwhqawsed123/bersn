import request from '../../utils/request.js'
// 新增照明类型
export const add_category = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/api/luminCategory/save`,
        method,
        data: form
    })
}

// 查询所有照明类型
export const get_all_category = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/api/luminCategory/loadData`,
        method,
        data: form
    })
}
// 根据id查询照明类型
export const get_category_byid = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/api/luminCategory/find`,
        method,
        data: form
    })
}

// 删除照明类型
export const delete_category = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/api/luminCategory/delete`,
        method,
        data: form
    })
}


// ===============照明分组========================
// 新增照明分组
export const add_group = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/api/luminGroup/save`,
        method,
        data: form
    })
}

// 查询所有照明分组
export const get_all_group = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/api/luminGroup/loadData`,
        method,
        data: form
    })
}
// 根据id查询照明分组
export const get_group_byid = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/api/luminGroup/find`,
        method,
        data: form
    })
}
// 删除照明分组
export const delete_group = (options) => {
    var options = options || {}
    var method = options.method || 'POST'
    var data = options.data || {}
    var form = new FormData()
    Object.keys(data).forEach(item => {
        form.append(item, data[item])
    })
    return request({
        url: `/api/luminGroup/delete`,
        method,
        data: form
    })
}

