import React, { Component } from 'react'
import {Form,Select,Input} from 'antd'
import {PropTypes} from 'prop-types'

// 添加分类的form组件

const Item = Form.Item
const Option = Select.Option


class AddForm extends Component {

    static propTypes = {
        setForm: PropTypes.func.isRequired,
        categories : PropTypes.array.isRequired,  // 一级分类的数组
        parentId: PropTypes.string.isRequired   // 父分类Id
    }

    componentWillMount () {
        this.props.setForm(this.props.form)
    }

    render() {
        const {categories,parentId} = this.props
        const {getFieldDecorator} = this.props.form
        return (
            <Form>
                <Item>
                    {
                    getFieldDecorator('parentId', {
                    initialValue: parentId
                    })(
                    <Select>
                        <Option value='0'>一级分类</Option>
                        {
                        categories.map(c => <Option value={c._id}>{c.name}</Option>)
                        }
                    </Select>
                    )
                }
               </Item>
                <Item>
                    {
                        getFieldDecorator('categoryName', {
                        initialValue: '',
                        rules: [
                            {required: true, message: '分类名称必须输入'}
                        ]
                        })(
                        <Input placeholder='请输入分类名称'/>
                        )
                    }
                    </Item>
            </Form>
        )
    }
}


export default Form.create() (AddForm)


