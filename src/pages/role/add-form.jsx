import React, { Component } from 'react'
import {Form,Select,Input} from 'antd'
import {PropTypes} from 'prop-types'

// 添加分类的form组件

const Item = Form.Item

class AddForm extends Component {

    static propTypes = {
        setForm: PropTypes.func.isRequired,
    }

    componentWillMount () {
        this.props.setForm(this.props.form)
    }

    render() {
        const {getFieldDecorator} = this.props.form

        const formItemLayout = {
            labelCol: {span : 5},
            wrapperCol : {span: 13}
        }
        return (
            <Form>
                <Item label='角色名称' {...formItemLayout}>
                    {
                        getFieldDecorator('roleName', {
                        initialValue: '',
                        rules: [
                            {required: true, message: '角色名称必须输入'}
                        ]
                        })(
                        <Input placeholder='请输入角色名称'/>
                        )
                    }
                    </Item>
            </Form>
        )
    }
}


export default Form.create() (AddForm)


