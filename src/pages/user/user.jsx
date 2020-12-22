import React,{Component} from 'react'
import {Card,Button,Modal,Table, message} from 'antd'

import {formateDate} from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'
import {PAGE_SIZE} from '../../utils/constants'
import {reqUsers,reqDeleteUser, reqAddOrUpdateUser} from '../../api/index'
import UserForm from './user-form'



// 用户路由
export default class User extends Component {

    state = {
        users:[],  // 所有用户列表
        roles: [],  // 所有角色列表
        isShow: false,
    }

    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username'  
            },
            {
                title: '邮箱',
                dataIndex: 'email' 
            },
            {
                title: '电话',
                dataIndex: 'phone' 
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: (role_id) =>this.roleNames[role_id]
                // render: (role_id) => this.state.roles.find(role => role_id === role._id ).name  不知道为什么会报错
            },
            {
                title: '操作',
                render:(user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
            }
    
        ]   
    }

    /* 根据 role 的数组，生成包含所有角色名的对象（属性名用角色id值） */
    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre,role) => {
            pre[role._id] = role.name
            return pre
        },{})
        this.roleNames = roleNames
    }

    // 显示添加界面
    showAdd = () => {
        this.user = null  // 清除之前保存的数据
        this.setState({
            isShow: true
        })
    }

    // 显示修改界面
    showUpdate = (user) => {
        // 保存 user
        this.user = user
        this.setState({
            isShow: true
        })
    }
    // 删除指定用户
    deleteUser = (user) => {
        Modal.confirm({
            title: `确认删除${user.username}吗？`,
            onOk: async () => {
              const result = await reqDeleteUser(user._id)
              if(result.status === 0) {
                  message.success('删除用户成功')
                  this.getUsers()
              }
            }
          })
    }

    // 添加 / 更新用户
    addOrUpdateUser = () => {
        this.form.validateFields(async (error,values) => {
            if (!error) {
                this.setState({
                    isShow: false
                })
                 // 收集输入数据
                 console.log('收集数据：',values)
                const user = values
                this.form.resetFields()

                // 如果是更新，需要给user 指定 _id 属性
                if( this.user && this.user._id) {
                    user._id = this.user._id
                }
                // 提交添加/或者请求
                const result = await reqAddOrUpdateUser(user)
                if(result.status === 0) {
                    message.success(`${this.user ? '修改': '修改'}用户成功`)
                    this.getUsers()
                } else {
                    message.error(`${this.user ? '修改': '修改'}用户失败`)
                }

                // 更新列表显示
            }
        }) 
    }
    getUsers = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            const {users,roles} = result.data
            this.initRoleNames(roles)
            this.setState({
                users,
                roles
            })
        }
    }

    componentWillMount () {
        this.initColumns()
    }

    componentDidMount () {
        this.getUsers()
    }

    render() {
        const {users,isShow,roles} = this.state
        const user = this.user || {}
        const title = <Button type='primary' onClick= {this.showAdd}>创建用户</Button>
        return (
            <Card title={title}>            
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={users}
                    columns={this.columns}
                    pagination={{defaultPageSize:PAGE_SIZE,showQuickJumper:true}}
               />
                   
               <Modal
                    title={ user._id ? '修改用户':'添加用户'}
                    visible= {isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel= {() => {
                        this.form.resetFields()
                        this.setState({isShow: false })
                    }}
                   >
                    <UserForm setForm={form => this.form=form} roles={roles} user={user}/>
                </Modal>
               
            </Card>
        )
    }
}