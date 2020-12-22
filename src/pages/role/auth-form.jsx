import React, { Component ,PureComponent} from 'react'
import {Form,Input,Tree} from 'antd'
import {PropTypes} from 'prop-types'

import menuList from '../../config/menuConfig'

// 添加分类的form组件

const Item = Form.Item
const { TreeNode } = Tree

export default class AuthForm extends  PureComponent {
    static propTypes = {
        role: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props)
        // 根据传入角色的menus 生成初始状态
        const {menus} = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }

    getTreeNodes = (menuList) => {
        return menuList.reduce((pre,item) => {
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {item.children ? this.getTreeNodes(item.children) : null}
                </TreeNode>
            )
            return pre
        },[])
    }
    
    // 为父组件获取最新menus
    getMenus = () => this.state.checkedKeys

    // 选中某个 node 时的回调
    onCheck = checkedKeys => {
        this.setState({
            checkedKeys
        })
    }

    componentWillMount() {
        this.treeNodes = this.getTreeNodes(menuList)
    }

    // 根据新传入的 role 来更新 checkedKeys 状态,
    // 当组件接收到新的属性之前调用，render之前
    UNSAFE_componentWillReceiveProps (nextProps) {
       const menus = nextProps.role.menus
       this.setState({
           checkedKeys: menus
       })
    }

    render() {
        const {role} = this.props
        const {checkedKeys} = this.state

        const formItemLayout = {
            labelCol: {span : 5},
            wrapperCol : {span: 13}
        }
        return (
            <div>
                <Item label='角色名称' {...formItemLayout}>     
                    <Input value={role.name} disabled/>           
                </Item>
                <Tree
                    checkable
                    defaultExpandAll = {true}
                    checkedKeys = {checkedKeys}
                    onCheck = { this.onCheck }

                >
                    <TreeNode title="平台权限" key="all">
                        {this.treeNodes}
                    </TreeNode>
                </Tree>
            </div>
            
        )
    }
}




