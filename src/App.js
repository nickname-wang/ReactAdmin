// 应用根组件
import React,{Component} from 'react'
// import { Button,message } from 'antd'
// import 'antd/dist/antd.css'
import {BrowserRouter,Route,Switch} from 'react-router-dom'

import Login from './pages/login/login.jsx'
import Admin from './pages/admin/admin.jsx'

export default class App extends Component {

    render() {
        return (
            <BrowserRouter>
                <Switch> {/* 只匹配其中一个 */}
                    <Route path='/login' component={Login}></Route>
                    <Route path= '/' component={Admin}></Route>
                </Switch>
            </BrowserRouter>
        )
    }
}