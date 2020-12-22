import React,{Component} from 'react'
import {Link,withRouter} from 'react-router-dom'
import { Menu,Icon} from 'antd';
// import {
//     AppstoreOutlined,
//     MenuUnfoldOutlined,
//     MenuFoldOutlined,
//     PieChartOutlined,
//     DesktopOutlined,
//     ContainerOutlined,
//     MailOutlined,
//   } from '@ant-design/icons';
  
 

import './index.css'
import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig';
import memoryUtils from '../../utils/memoryUtils'


const { SubMenu } = Menu;

// 左侧导航组件

 class LeftNav extends Component {

    // 判断当前登录用户对 item 是否有权限
    hasAuth = (item) => {
        const key = item.key
        const menus = memoryUtils.user.role.menus
        const username = memoryUtils.user.username
        // 1. 如果当前用户是 admin  直接通过
        // 2. 如果当前item 是公开的，直接返回true
        // 3. 当前用户有此 item 权限，key 是否在 menus 中
        
        if (username === 'admin'|| item.isPublic  || menus.indexOf(key) !== -1) {
            return true
        } else if(item.children) { // 4. 如果当前用户有此 item 的某个子 item 的权限
           return  !!item.children.find(child => menus.indexOf(child.key) !== -1 )
        } else {
            return false
        }
    }
    

    // 根据 menu 的数据数组生成对应的标签数组
    getMenuNodes_map = (menuList) => {
        // {
        //     title:'首页',
        //     key: '/home',
        //     icon:'home',
        //     childern:[]  // 可能没有
        // }

       
        return menuList.map(item => {
            if (!item.children) {
                return (
                    <Menu.Item key={item.key} icon={item.icon}>
                    <Link to={item.key}> {item.title}  </Link>
                   </Menu.Item>
                )
            } else {
                return (
                    <SubMenu key={item.key} icon={item.icon} title={item.title}>
                        {/* 递归 */}
                        {this.getMenuNodes(item.children)}  
                    </SubMenu>
                )
            }
        })
        
    }

    getMenuNodes = (menuList) => {

        const path = this.props.location.pathname

         // 使用 reduce + 递归调用
         return menuList.reduce((pre,item) => {

            // 如果当前用户有 item 对应的权限，才需要显示对应的菜单项
            if (this.hasAuth(item)) {
                //  向pre中添加项
                if (!item.children) {
                    pre.push((
                        <Menu.Item key={item.key} icon={item.icon}>
                        <Link to={item.key}> {item.title}  </Link>
                    </Menu.Item>
                    ))
                } else {
                    // 查找一个与当前请求路径匹配的子 Item
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                    // 如果存在，说明当前item的字列表需要打开
                    if (cItem) {
                        this.openKey = item.key
                    }
                    pre.push((
                        <SubMenu key={item.key} icon={item.icon} title={item.title}>
                            {/* 递归 */}
                            {this.getMenuNodes(item.children)}  
                        </SubMenu>
                    ))
                }
            }   
            return pre
         },[])
    }

    // 在第一次 render 之前执行一次  为第一次渲染做准备数据 （必须是同步的）
componentWillMount() {
    this.menuNodes = this.getMenuNodes(menuList)
}

    render() {

        // 得到当前请求的路由路径
        let path = this.props.location.pathname
        if (path.indexOf('/product') === 0) {  // 当前请求的是商品或其子路由界面
            path = '/product'
        }
        const openKey = this.openKey
        return (
                <div className="left-nav">
                    <Link to = '/' className="left-nav-header">
                        <img src={logo} alt=""/>
                        <h1>硅谷后台</h1>
                    </Link>
                    <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark">
                        {/* <Menu.Item></Menu.Item>
                        <SubMenu></SubMenu> */}
                  
                   {/* <Menu.Item key="/home" icon={<PieChartOutlined />}>
                     <Link to='/home'> 首页  </Link>
                    </Menu.Item>
                    <SubMenu key="sub1" icon={<MailOutlined />} title="商品">
                       <Menu.Item key="/category" icon={<MailOutlined />}> <Link to='/category'>品类管理 </Link></Menu.Item>
                       <Menu.Item key="/product" icon={<MailOutlined />}><Link to='/product'>商品管理 </Link></Menu.Item>
                    </SubMenu>
                    <Menu.Item key="/user" icon={<PieChartOutlined />}>
                    <Link to='/user'>用户管理</Link>
                    </Menu.Item>
                    <Menu.Item key="/role" icon={<PieChartOutlined />}>
                    <Link to='/role'>角色管理</Link>
                    </Menu.Item> */}

                    {
                        this.menuNodes
                    }
                    
                </Menu>
          
                   
            </div>
            
        )
    }
}

// withRouter 高阶组件，包装非路由组件，返回一个新的组件
// 新的组件向非路由组件传递 3 个属性：history/location/match
export default withRouter(LeftNav)