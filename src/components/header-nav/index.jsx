import React,{Component} from 'react'
import {withRouter} from 'react-router-dom'
import {Modal} from 'antd'

import './index.less'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import {reqWeather} from '../../api/index'
import menuList from '../../config/menuConfig'
import storageUtils from '../../utils/storageUtils'
import LinkButton from '../link-button/index'

// 左侧导航组件

class HeaderNav extends Component {

    state = {
        currentTime: formateDate(Date.now()),  // 当前时间字符串
        city: '',
        weather: '' 
    }
    getTime =() => {
        // 每隔 1s 获取当前时间，并更新状态数据
        this.intervalId = setInterval(() =>{
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }

    getWeather = async () => {
        // 调用接口请求函数获取数据
        const {city,weather} = await reqWeather(110000)
        this.setState({city,weather})
    }

    getTitle = () => {
        // 得到当前请求路径
        const path = this.props.location.pathname
        let title;
        menuList.forEach((item) => {
            if(item.key === path) {   // 如果当前item对象的key与path一样，item 的 title 就是需要显示的 title
                title = item.title
            } else if (item.children) {
                // 在所有子 item 中查找匹配的
                const cItem =  item.children.find((cItem) => path.indexOf(cItem.key)===0)
                // 如果有值才说明有匹配的
                if(cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    }
    
    // 退出登录
    loginOut = () => {
        // 显示确认框
        Modal.confirm({
            title:'确定退出？',
            onOk: () => {
                // console.log('确定');
                // 删除保存的 user 数据
                storageUtils.removeUser();
                memoryUtils.user = {}
                // 跳转到login
                this.props.history.replace('/login')
            }
        })

    }

    // 第一次 render() 之后执行
    // 一般在此执行异步操作：发ajax请求/启动定时器
    componentDidMount() {
        // 获取当前的时间
        this.getTime()
        // 获取当前天气
        this.getWeather()
    }
    
    // 当前组件卸载之前调用
    componentWillUnmount() {
        // 清除定时器
        clearInterval(this.intervalId)
    }

    render() {

        const {currentTime,city,weather} = this.state;
        const {username} = memoryUtils.user
        const title = this.getTitle()
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.loginOut}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className=" header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <span className="city">{city}</span>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(HeaderNav)