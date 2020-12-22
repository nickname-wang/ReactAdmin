// 包含应用中所有接口请求函数模块
// 每个函数的返回值都是 Promise

import ajax from "./ajax"
import jsonp from 'jsonp'
import {message} from 'antd'

// const BASE = 'http://localhost:5000'
const BASE = ''
// 登录
// export function reqLogin(username,password) {
//     ajax('./login',{username,password},'POST')
// }
export const reqLogin = (username,password) => ajax(BASE +'/login',{username,password},'POST')

// 添加用户
// export const reqAdd = (user) => ajax(BASE + '/manage/user/add',user,'POST')

// 获取一级/二级分类的列表
export const reqCategory = (parentId) =>ajax ( BASE + '/manage/category/list',{parentId},'GET')

// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', {categoryName, parentId}, 'POST')
// 更新分类的名称
export const reqUpdateCategory = ({categoryId,categoryName}) => ajax(BASE + 'manage/category/update',{categoryId,categoryName},'POST')

// 获取一个分类
export const reqOneCategory = (categoryId) => ajax(BASE + '/manage/category/info',{categoryId},'GET')
// 获取商品分页列表  
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {pageNum, pageSize})

// 更新商品状态 上架或者下架操作
export const reqUpdateStatus = (productId,status) => ajax(BASE + '/manage/product/updateStatus',{productId,status},'POST')



// 搜索商品  searchType：搜索的类型 productName/productDesc
export const reqSearchProducts = ({pageNum,pageSize,searchName,searchType}) => ajax(BASE + '/manage/product/search',{
    pageNum,
    pageSize,
    [searchType]:searchName
})

// 删除指定名称的图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete',{name},'POST')

// 添加商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id ? 'update':'add'),product,'POST')

// 修改商品
// export const reqUpdateProduct = () => ajax(BASE + '/manage/product/update',product,'POST')

// 获取所有角色列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')

// 添加角色
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add',{roleName},'POST')

// 更新角色
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update',role,'POST')

// 获取所有用户列表
export const reqUsers = () => ajax(BASE + '/manage/user/list')

// 删除指定用户
export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete',{userId},'POST')

// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/' + (user._id ? 'update':'add'),user,'POST')

// jsonp 请求的接口函数
export const reqWeather = (adcode) => {
    return new Promise((resolve,reject) => {
        const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${adcode}&key=2916392f11490aa043413ce411482f59&output=json`
        jsonp(url,{},(err,data) => {
            console.log(data,err)
            if(!err && data.status === '1') {
                // 成功 ，取出需要的数据
                const {city,weather} = data.lives[0]
                resolve({city,weather})
            } else {
                message.error('获取天气信息失败')
            }
       })
    })
    
}

// reqWeather(110000)

