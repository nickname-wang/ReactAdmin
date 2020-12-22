import React,{Component} from 'react'
import {Card,Form,Input,Cascader,Button, Icon,message} from 'antd'

import LinkButton from '../../components/link-button'
import {reqCategory,reqAddOrUpdateProduct} from '../../api/index'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'


// Product的 添加和更新的子路由
const {Item} = Form
const {TextArea} = Input

class ProductAddUpdate extends Component {

    state = {
        options : [],
    }
    constructor(props) {
        super(props)
        // 创建用来保存 ref 标识的标签对象容器
        this.pw = React.createRef()
        this.editor = React.createRef()
    }

    initOptions = async (categories) => {
        // 根据 categories 生成 options 数组
        const options =  categories.map(c => ({
            value: c._id ,
            label: c.name,
            isLeaf: false   // 不是叶子
        }))

        // 如果是二级分类商品的更新
        const {isUpdate,product} = this
        const {pCategoryId} = product
        if (isUpdate && pCategoryId !== '0') {
            // 获取对应的二级分类列表
            const subCategories = await this.getCategories(pCategoryId)
            // 生成二级下拉列表
            const childOptions =  subCategories.map(c =>({
                value: c._id ,
                label: c.name,
                isLeaf: true 
            }))
            // 找到当前商品对应的一级对象
            const targetOption = options.find(option => option.value === pCategoryId)
            // 关联到对应的一级 options 
            targetOption.children = childOptions
        }

        // 更新options状态
        this.setState({
            options
        })
    }

    // 异步获取一级或二级分类列表显示
    // async 函数的返回值是一个新的 promise 对象，promise 的值和结果由 async 的结果决定
    getCategories = async (parentId) => {
      const result = await reqCategory(parentId)
      if (result.status === 0) {
          const catrgories = result.data
        //   如果是一级分类
          if (parentId === '0') {
                this.initOptions(catrgories)
          } else {
              return catrgories  // 返回二级列表 ==> 当前 async 函数返回的 promise 就会成功且 value 为 categories 
          }
      }
    }

    // 用于加载下一级列表的回调函数
    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0]  // 得到选择的option 对象
        targetOption.loading = true   // 显示 loading 效果 
    
        // 根据选中的一级分类，请求获取二级分类列表
       const subCategories = await this.getCategories(targetOption.value) 
       targetOption.loading = false  // 数据获取到后， 隐藏loading
       if (subCategories && subCategories.length > 0) {
        //    生成一个二级列表的 options
           const childOptions =  subCategories.map(c =>({
            value: c._id ,
            label: c.name,
            isLeaf: true 
           }))
        //    关联到当前 option 上
        targetOption.children = childOptions
       } else {  // 当前选中的分类没有二级分类
            targetOption.isLeaf = true
       }

       //   更新options状态
       this.setState({
        options: [...this.state.options],
      });

        // load options lazily
        // 模拟请求异步获取二级列表数据并更新
        // setTimeout(() => {
        //   targetOption.loading = false;  
        //   targetOption.children = [
        //     {
        //       label: `${targetOption.label} Dynamic 1`,
        //       value: 'dynamic1',
        //       isLeaf: true
        //     },
        //     {
        //       label: `${targetOption.label} Dynamic 2`,
        //       value: 'dynamic2',
        //       isLeaf: true
        //     },
        //   ];
        // //   更新options状态
        //   this.setState({
        //     options: [...this.state.options],
        //   });
        // }, 1000);
      }

    // 验证价格的自定义验证函数
    validatePrice = (rule, value, callback) => {
         if (value*1 > 0) {
            callback()  // 验证通过
         } else {
             callback('商品价格必须大于0')
         }
    }

    submit =  () => {
        // 整体的进行表单验证，如果通过了才发送请求
        this.props.form.validateFields( async (err,values) => {
            if (!err) {  //验证通过

                // 1.收集数据并封装成product对象
                const {name,desc,price,categoryIds} = values
                let categoryId,pCategoryId
                if (categoryIds.length === 1) {
                    pCategoryId = '0'
                    categoryId = categoryIds[0]
                } else {
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }
                const imgs = this.pw.current.getImgs()
                const detail = this.editor.current.getDetail()

                const product = {name,desc,price,imgs,detail,categoryId,pCategoryId}
                
                // 如果是更新，需要添加 _id
                if (this.isUpdate) {
                    product._id = this.product._id
                }
                // 2.调用接口请求函数添加或者更新数据
                
                const result = await reqAddOrUpdateProduct(product)
                // 3.根据结果提示
                if (result.status === 0) {
                    message.success(`${this.isUpdate ? '更新':'添加'}商品成功`)
                    this.props.history.goBack()
                } else {
                    message.error(`${this.isUpdate ? '更新':'添加'}商品失败`)
                }
            
            }
        })
    }

    componentDidMount() {
        this.getCategories('0')
    }
    componentWillMount () {
        // 取出携带的state 
       const product =  this.props.location.state  // 如果添加，没有值，修改则有值
       this.isUpdate = !! product  // !! 强制转换为bool 型， 用于保存是否更新的标识
       this.product = product || {}  // 保存商品（如果没有，就保存空对象）
    }

    render() {
        const {isUpdate,product} = this
        const {pCategoryId,categoryId,imgs,detail} = product
        console.log(product);
        console.log(product.name);
        let categoryIds = []  // 用于接收级联分类ID的数组
        if (isUpdate) {
            // 商品是一级分类的商品
            if(pCategoryId === '0') {
                categoryIds.push(categoryId)
            } else {
                // 商品是一个二级分类商品
                categoryIds.push(pCategoryId) 
                categoryIds.push(categoryId)
            }
        }
        const formItemLayout = {
            labelCol: {span: 2},  // 左侧 label 的宽度
            wrapperCol:{span: 8 },  // 指定右侧包裹的宽度
          }

        const title = (
            <span>
                <LinkButton onClick = {() =>this.props.history.goBack()}>
                  <Icon type='arrow-left' style={{fontSize:20,marginRight:5}}></Icon>
                </LinkButton>
                <span>{isUpdate ? '修改商品':'添加商品'}</span>
            </span>
        )

        const {getFieldDecorator} = this.props.form

        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label="商品名称">
                        {getFieldDecorator('name',{
                            initialValue: product.name,
                            rules :[
                               { required: true, message: '必须输入商品名称'}
                            ]
                        }
                        ) (
                            <Input placeholder='请输入商品名称'></Input>
                        )}
                        
                    </Item>
                    <Item label="商品描述">
                    {getFieldDecorator('desc',{
                            initialValue:product.desc,
                            rules :[
                               { required: true, message: '必须输入商品描述'}
                            ]
                        }
                        )(
                            <TextArea placeholder='请输入商品描述' autoSize={ {minRows: 2, maxRows: 6} }></TextArea>
                        )}  
                    </Item>
                    <Item label="商品价格">
                    {getFieldDecorator('price',{
                            initialValue: product.price,
                            rules :[
                               { required: true, message: '必须输入商品价格'},
                               { validator: this.validatePrice }
                            ]
                        }
                        )(
                            <Input type='number' placeholder='请输入商品价格' addonAfter="元"></Input>
                        )}  
                    </Item>
                    <Item label="商品分类">
                    {getFieldDecorator('categoryIds',{
                            initialValue: categoryIds,
                            rules :[
                               { required: true, message: '必须指定商品分类'},
                               
                            ]
                        }
                        )(
                            <Cascader
                                placeholder='请指定商品分类'
                                options={this.state.options}   // 需要显示的列表数据数组
                                loadData={this.loadData}    // 选择某个列表项，加载下一级列表的监听回调
                            >
                            </Cascader>
                        )}  
                        
                        
                    </Item>
                    <Item label="商品图片">
                        <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Item> 
                    <Item label="商品详情" labelCol={{span: 2}} wrapperCol={{span: 20}}>
                        <RichTextEditor ref={this.editor} detail = {detail}/>
                    </Item>
                    <Button type='primary' onClick={this.submit}>提交</Button>
                </Form >
            </Card>
        )
    }
}

export default Form.create() (ProductAddUpdate)


// 子组件调用父组件的方法：将父组件的方法以函数属性的形式传递给子组件，子组件就可以调用
// 父组件调用子组件的方法：在父组件中通过 ref 得到子组件标签对象（也就是组件对象），调用其方法