import React,{Component} from 'react'
import {Card,Table,Button,Icon, message,Modal} from 'antd'

import LinkButton from '../../components/link-button'
import {reqCategory,reqAddCategory, reqUpdateCategory} from '../../api/index'
import AddForm from './addForm'
import  UpdateForm from './updateForm'


export default class Category extends Component {

    state = {
        loading: false, //是否正在获取数据zhong
        categories: [], // 一级分类列表
        subCategories: [], //二级分类列表
        parentId:'0',  // 当前需要显示的分类列表的 parentId
        parentName: '',   // 分类名称
        showStatus: 0,  // 标识添加/修改的确认框是否显示： 0：都不显示，1：显示添加，2：显示更新
    }

    // 初始化 Table 所有列的数组
    initColumns = () => {
        this.columns = [
            {
              title: '分类',
              dataIndex: 'name',  // 显示数据对应的属性名
            //   key: 'name',
            },
            {
                title: '操作',
                width: 400,
                // key: 'action',
                render: (category) => (  //返回需要显示的界面标签
                    <span>
                    <LinkButton onClick = {() => {
                        this.showUpdate(category)
                    }}>修改分类</LinkButton>
                    {/* 如何向事件回调函数传参数：先定义一个匿名函数，在函数中调用处理的函数并传入数据 */}
                    {this.state.parentId === '0' ? <LinkButton  onClick = {() => {this.showSubCategories(category)}} >查看子分类</LinkButton> : null }                
                    </span>
                ),
              } 
          ]
    }
    
    // 异步获取一级或二级分类列表显示
    // parentId:如果没有指定，根据状态中的parentId请求，如果指定了则根据指定的请求
    getCategories = async (parentId) => {

        // 发请求前，显示 loading
        this.setState({loading:true})
        parentId = parentId || this.state.parentId
        const result = await reqCategory(parentId)
        // 请求结束，隐藏Loading
        this.setState({loading:false})
        if (result.status === 0) {
            // 取出分类数组数据
            const categories =  result.data
            
             if(parentId === "0") {
                this.setState({categories:categories})
             } else {
                 this.setState({subCategories:categories})
             }       
        } else {
            message.error('获取分类列表失败')
        }
    }

    // 显示指定一级分类对象的二级列表
    showSubCategories = (categories) => {
        // 先更新状态
        this.setState({
            parentId: categories._id,
            parentName: categories.name
        },() => {  // 回调函数在状态更新并且重新 render() 之后执行
            this.getCategories()
        })

        // 在 setState() 之后不弄那个立即获取最新的状态，因为setState() 是异步更新状态的  
    }

    // 显示一级分类列表
    showCategories = () => {
        // 更新为显示一级列表的状态
        this.setState( {
            parentId: '0',
            parentName: '',
            subCategories: [],
        })
        this.getCategories()
    }

    // 点击取消 隐藏确认框
    handleCancel = () => {
        // this.form.resetFileds()
        
        this.setState({
            showStatus : 0
        })
    }

    // 添加分类
    addCategory =  () => {

        this.form.validateFields(async (err,vaules) =>{
            if(!err) {
                // 隐藏确认框
                this.setState({
                    showStatus:0
                })  

                // 收集数据，并提交添加分类的请求
                const {parentId,categoryName} = vaules

                // 清除输入数据
                this.form.resetFields()

                const result = await reqAddCategory(categoryName,parentId)

                console.log('chiud',result);
                // 重新获取分类列表显示
                if (result.status === 0) {
                    //添加的分类就是当前列表下的分类 
                if(parentId === this.state.parentId) {
                    // 重新获取分类列表显示
                    this.getCategories()
                } else if (parentId === '0'){  // 在二级分类列表下添加以及分类，重新获取一级分类列表但不需要显示一级分类列表
                        this.getCategories('0')
                }
                }
            }
        })

        
    }

    // 显示添加
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }

    // 更新分类
    updateCategory = () => {
        // 表单验证
        // vaules: 表单数据对象
        this.form.validateFields( async (err,vaules) => {
            if (!err) {
                // 1.关闭窗口
                this.setState({
                    showStatus: 0
                })

                // 准备数据
                const categoryId = this.category._id
                const {categoryName} = vaules

                // 清除输入数据
                this.form.resetFields()
                // 2.发请求更新
                const result = await reqUpdateCategory({categoryId,categoryName})
                console.log('recdi',result);
                if (result.status === 0) {
                    // 3.重新显示列表
                    this.getCategories()
                }  
                    }
                })
        
    }
    // 显示修改确认框
    showUpdate = (category) => {
        // 保存分类对象
        this.category = category
        this.setState({
            showStatus: 2
        })
    }

    
    // 为第一次 render 准备数据
    componentWillMount () {
        this.initColumns()
    }

    // 执行异步任务：发异步ajax请求
    componentDidMount () {
        // 获取一级分类列表
        this.getCategories()
    }

    render() {
        // 读取状态数据
        const {categories,subCategories,parentName,parentId,loading,showStatus} = this.state
        const category = this.category || {}  // 如果还没有 ，指定一个空对象
        // card 的左侧标题
        const title = parentId === '0' ? '一级分类':(
            <span>
                <LinkButton onClick = {this.showCategories}>一级分类列表</LinkButton>
                <Icon type='arrow-right' style={{marginRight: 5}}/>
                <span>{parentName}</span>
            </span>
        )
        // 右侧
        const extra = (
            <Button type='primary' onClick = {this.showAdd }>
            <Icon type='plus'/>
                添加
            </Button>
        )       
        return (          
            <Card title={title} extra={<a href="#">{extra}</a>} >
                <Table 
                dataSource={parentId === '0' ? categories: subCategories} 
                bordered 
                rowKey="_id"
                loading = {loading}
                columns={this.columns} 
                pagination={{defaultPageSize:5,showQuickJumper:true}}
                />
                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm categories={categories} parentId={parentId} setForm ={(form) =>{this.form = form}}/> 
                </Modal>
                <Modal
                    title="修改分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm categoryName={category.name} setForm ={(form) =>{this.form = form}}/>
                </Modal>
          </Card>
        )
    }
}