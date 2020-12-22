import React,{Component} from 'react'
import {Card,Select,Input,Button,Icon,Table, message} from 'antd'

import LinkButton from '../../components/link-button'
import {reqProducts,reqSearchProducts,reqUpdateStatus} from '../../api/index'
import {PAGE_SIZE} from '../../utils/constants'

// Product的默认子路由组件

const Option = Select.Option
export default class ProductHome extends Component {

    state = {
        total: 0, // 商品的总数量
        products:[], //商品的数组
        loading: false, // 是否正在加载中
        searchName: '',  //搜索的关键字
        searchType:'productName',  //根据哪个字段搜索
    }
    
    // 初始化表格列的数组
    initColumns = () => {
        this.columns = [
            {
              title: '商品名称',
              dataIndex: 'name', 
            },
            {
              title: '商品描述',
              dataIndex: 'desc',
            },
            {
              title: '价格',
              dataIndex: 'price',
              render:(price) => `￥ ${price}`  // 点前指定了属性，传入的是对应属性的值
            },
            {
                width: 100,
                title: '状态',
                render: (product) => {
                    const {status,_id} = product
                    const newStatus = status === 1 ? 2 : 1
                    return (
                        <span>
                            <Button type="primary" onClick = {() => this.updateStatus(_id,newStatus)}>
                                {status === 1 ? '下架' :'上架'}
                            </Button>
                            <span>{status === 1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
              },
              {
                width: 100,
                title: '操作',
                //render 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引
                render: (product) => {
                    return (
                        <span>
                           <LinkButton onClick={()=> this.props.history.push('/product/detail',{product})}>详情</LinkButton>
                           <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
                        </span>
                    )
                }
              }
          ];
    }

    // 获取指定页码的列表数据显示
    getProducts = async (pageNum) => {
        this.pageNum = pageNum  // 保存 pageNum ,让其他方法可以看见
        this.setState({loading:true})  // 发送请求之前 显示loading

        const {searchName,searchType} = this.state
        // 如果搜索关键字有值，说明我们要做搜索分页
        let result
        if(searchName) {
            result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
        } else {  // 一般分页请求
            result = await reqProducts(pageNum,PAGE_SIZE)
        }
        this.setState({loading:false})  // 请求结束，隐藏loading
        if (result.status === 0) {
            // 取出分页数据，更新状态，显示列表
            const {total,list} = result.data
            this.setState({
                total,
                products: list
            })
        }
    }

    // 更新指定商品的状态
    updateStatus = async (productId,status) => {
        const result = await reqUpdateStatus(productId,status)
        if (result.status === 0) {
            message.success('更新商品成功')
            this.getProducts(this.pageNum)
        }
    }

    componentWillMount() {
        this.initColumns()
    }
    componentDidMount () {
        this.getProducts(1)
    }

    render() {

        const {products,total,loading,searchName,searchType} = this.state 

        const title = (
            <span>
                <Select value= {searchType} style={{width: 150}} onChange={(value) => this.setState({searchType:value})}>
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input placeholder="关键字" style={{width: 200,margin:'0 15px'}} value={searchName} onChange={(e) => this.setState({searchName:e.target.value})}></Input>
                <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
            </span>
        )

        const extra = (
            <Button type="primary" onClick={() => this.props.history.push('/product/addupdate')}>
                <Icon type='plus' />
                添加商品
            </Button>
        )

        
        return (
            <Card title={title} extra={extra} >
                <Table 
                dataSource={products} 
                columns={this.columns} 
                rowKey="_id"
                loading = {loading}
                bordered
                pagination={{
                    current: this.pageNum,
                    defaultPageSize:PAGE_SIZE,
                    showQuickJumper:true,
                    total:total,
                    // onChange:(pageNum) => {this.getProducts(pageNum)}
                    onChange: this.getProducts
                }}
                >

                </Table>
            </Card>
        )
    }
}