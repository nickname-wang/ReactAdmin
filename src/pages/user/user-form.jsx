import React, { PureComponent } from 'react'
import {Form,Select,Input} from 'antd'
import {PropTypes} from 'prop-types'

// 添加/修改用户的form件

const Item = Form.Item
const Option = Select.Option

class UserForm extends PureComponent {

    static propTypes = {
        setForm: PropTypes.func.isRequired,
        roles: PropTypes.array.isRequired,
        user: PropTypes.object,
    }

    componentWillMount () {
        this.props.setForm(this.props.form)
    }

    render() {
        const {roles} = this.props
        const user = this.props.user || {}
        const {getFieldDecorator} = this.props.form

        const formItemLayout = {
            labelCol: {span : 5},
            wrapperCol : {span: 13}
        }
        return (
            <Form {...formItemLayout}>
                <Item label='用户名：' >
                    {
                        getFieldDecorator('username', {
                        initialValue: user.username,
                        rules: [
                            {required: true, message: '用户名称必须输入'}
                        ]
                        })(
                        <Input placeholder='请输入用户名'/>
                        )
                    }
                </Item>
                {
                    user._id ? null: (
                        <Item label='密码：' >
                            {
                                getFieldDecorator('password', {
                                initialValue: user.password,
                                rules: [
                                    {required: true, message: '密码名称必须输入'}
                                ]
                                })(
                                <Input type='password' placeholder='请输入密码'/>
                                )
                            }
                        </Item>
                    )
                }
                
                <Item label='手机号码：' >
                    {
                        getFieldDecorator('phone', {
                        initialValue: user.phone,
                        })(
                        <Input placeholder='请输入手机号码'/>
                        )
                    }
                </Item>
                <Item label='邮箱：' >
                    {
                        getFieldDecorator('email', {
                        initialValue: user.email,
                        })(
                        <Input placeholder='请输入邮箱'/>
                        )
                    }
                </Item>
                <Item label='角色：' >
                    {
                        getFieldDecorator('role_id', {
                        initialValue: user.role_id,
                        })(
                        <Select>
                        {
                            roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                        }
                        </Select>
                        )
                    }
                </Item>
            </Form>
        )
    }
}


export default Form.create() (UserForm)


