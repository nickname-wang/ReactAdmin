
// 能发送异步 ajax 请求的函数模块
// 封装 axios 库
// 函数的返回值是 promise 对象

// 1. 优化1，统一处理请求异常
    // 在外层包一个自己创建的 promise 对象
    // 在请求出错时不 reject，而是显示错误提示

//  2. 优化2：异步得到的不是response，而是response.data
//  在请求成功 resolve 时：resolve(response.data)

import axios from 'axios'
import { message } from "antd";

// data 可能没有参数，所以指定默认值
export default function ajax(url,data={},type='GET') {

    return new Promise((resolve,reject) => {
        let promise;
        // 1.执行异步 ajax 请求
        if (type === 'GET') {
            promise = axios.get(url,{
                params:data  // 指定请求参数
            })
        } else {  // 发 POST 请求
            promise = axios.post(url,data)
        }
        // 2. 成功，调用 resolve
        promise.then(response => {
            resolve(response.data)
        }).catch(error => {
            message.error('请求出错了',error.message)
        })
    })

    
}

// 请求登录接口
// ajax('/login',{username:'Tom',password:'12345'},'POST').then()