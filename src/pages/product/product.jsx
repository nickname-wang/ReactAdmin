import React,{Component} from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'


import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'
import './product.less'

// 商品的路由组件

export default class Product extends Component {
    render() {
        return (
            <Switch>
                {/* exact 路径完全匹配*/}
                <Route exact path='/product' component={ProductHome}></Route>
                <Route path='/product/addupdate' component={ProductAddUpdate}></Route>
                <Route path='/product/detail' component={ProductDetail}></Route>
                <Redirect to='/product'></Redirect>
            </Switch>
        )
    }
}