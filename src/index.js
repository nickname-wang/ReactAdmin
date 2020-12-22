// 入口js
import React from 'react'
import ReactDOM from 'react-dom'


import App from './app'
import storageUtils from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'


// 读取local中保存的user，保存到内存中
const user = storageUtils.getUser()
memoryUtils.user = user

// 将APP 组件标签渲染到index页面的div上
ReactDOM.render(<App />, document.getElementById('root'))

