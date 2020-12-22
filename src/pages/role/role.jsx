import React,{Component} from 'react'
import {Card,Button,Table, Modal, message} from 'antd'

import { PAGE_SIZE } from '../../utils/constants'
import { reqAddRole, reqRoles,reqUpdateRole } from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtils from '../../utils/memoryUtils'
import {formateDate} from '../../utils/dateUtils'
import storageUtils from '../../utils/storageUtils'

// 用户路由

export default class Role extends Component {
    state = {
        roles: [],
        role: {},
        isShowAdd: false, // 是否显示添加界面
        isShowAuth: false,  // 是否显示设置权限界面
    }
    
    constructor(props) {
        super(props) 
        this.auth = React.createRef()
    }

    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            const roles = result.data
            this.setState({
                roles
            })
        }
    }

    initColumns = () => {
        this.columns = [
           {
               title:'角色名称',
               dataIndex:'name',    
           },
           {
                title:'创建时间',
                dataIndex:'create_time',
                render: (create_time) => formateDate(create_time)
            },
            {
                title:'授权时间',
                dataIndex:'auth_time', 
                render: formateDate   
            },
            {
                title:'授权人',
                dataIndex:'auth_name',    
            }
        ]
    }

    onRow = (role) => {
        return { 
            onClick: event => {  // 点击行
                this.setState({
                    role
                })
            }
        }
    }

    /* 添加角色 */
    addRole = () => {
        // 表单验证
        this.form.validateFields(async (error,values) => {
            if (!error) {
                this.setState({
                    isShowAdd: false
                })
                const {roleName} = values
                this.form.resetFields()
                const result = await reqAddRole(roleName)
                if (result.status === 0) {
                    message.success('添加角色成功')
                    // 新产生的角色
                    const role = result.data
                    // 更新roles 状态
                    // const roles = this.state.roles
                    // roles.push(role)
                    // this.setState({
                    //     roles
                    // })                  
                         // 更新roles状态：基于原本状态数据更新
                        this.setState(state => ({
                            roles:[...state.roles,role]
                        }))
                                     
                } else {
                    message.error('添加角色失败')
                }
            }
        })
        
    }

    // 更新角色权限
    updateRole = async () => {
        this.setState({
            isShowAuth: false
        })
        const role = this.state.role
        // 得到最新的menus
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = memoryUtils.user.username

        const result = await reqUpdateRole(role)
        if (result.status === 0) {
            
            // 如果当前更新的是自己角色的权限，强制退出
            if (role._id === memoryUtils.user.role_id) {
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.success('当前用户权限已更改，请重新登录')
            } else {
                message.success('设置权限成功')
                this.setState({
                    // this.getRoles()
                    roles:[...this.state.roles]
                })
            }          
        } else {
            message.error('设置权限失败')
        }
    }
    

    componentWillMount () {
        this.initColumns()
    }
    componentDidMount () {
        this.getRoles()
    }
    render() {

       const {roles,role,isShowAdd,isShowAuth} = this.state

        const title = (
            <span>
                <Button type='primary' onClick={() => this.setState({isShowAdd: true})}  style={{marginRight: 10}} >创建角色</Button>
                <Button type='primary' disabled={!role._id} onClick={() => this.setState({isShowAuth: true})}>设置角色权限</Button>
            </span>
        )
        return (
           <Card title={title}>
               <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{defaultPageSize:PAGE_SIZE,showQuickJumper:true}}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys:[role._id],
                        onSelect: (role) => {  // 选择某个 radio 时的回调
                            this.setState({
                                role
                            })
                        }
                        }}
                    onRow={this.onRow}
               />
                   
               <Modal
                    title='添加角色'
                    visible= {isShowAdd}
                    onOk={this.addRole}
                    onCancel= {() => {
                        this.setState({isShowAdd: false })
                        this.form.resetFields()
                    }}
                   >
                    <AddForm
                        setForm={(form) => {this.form = form}}
                    />
                </Modal>
                <Modal
                    title='设置角色权限'
                    visible= {isShowAuth}
                    onOk={this.updateRole}
                    onCancel= {() => {
                        this.setState({isShowAuth: false })
                    }}
                   >
                    <AuthForm role={role} ref={this.auth}/>
                </Modal>
           </Card>
        )
    }
}