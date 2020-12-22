import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal, message } from 'antd';

import { reqDeleteImg } from '../../api/index';
import { BASE_IMG_URL } from '../../utils/constants';

// 用于图片上传的组件

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

 export default class PicturesWall extends React.Component {

    static propTypes = {
        imgs:PropTypes.array
    }

  state = {
    previewVisible: false,   // 标识是否显示大图预览
    previewImage: '',  // 大图的地址
    fileList: [
    //   {
    //     uid: '-1',   // 每个file唯一的 id
    //     name: 'image.png',  // 文件名
    //     status: 'done',   // 图片的状态：done：已上传，uploading：正在上传中  removed ：已删除
    //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',  // 图片地址
    //   },
    ],
  };
  constructor(props) {
      super(props) 
      let fileList = []
      const {imgs} = this.props
      if (imgs && imgs.length > 0) {
          fileList = imgs.map((img,index) => ({
              uid: -index,
              name: img,
              status: 'done',
              url: BASE_IMG_URL + img
          }))
      }
      this.state ={
        previewVisible: false,   // 标识是否显示大图预览
        previewImage: '',  // 大图的地址
        fileList   // 所有已上传图片的数组
      }
      
  }

//   获取所有已上传图片 文件名的数组
    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }

  // 隐藏 modal
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview =async file => {
    // 显示指定 file 对应的大图
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

//   file: 当前操作的图片文件（上传/删除）
//   fileList： 所有已上传的图片文件对象的数组
  handleChange = async ({file, fileList }) => {
      console.log(file);
    //   一旦上传成功，将当前上传的 file 的信息修正
    if (file.status === 'done') {
        const result =  file.response  // {status:0,data:{name:'xxx',url:'图片地址'}}
        if (result.status === 0) {
            message.success('上传图片成功')
            const {name,url} = result.data
            file = fileList[fileList.length - 1]   // file 与 fileList[fileList.length - 1] 保存的是同一个文件的数据，但是他们是两个不同的对象
            file.name = name
            file.url = url
        } else {
            message.error('上传图片失败')
        }
    } else if (file.status === 'removed') {  // 删除完成
        const result = await reqDeleteImg(file.name)
        if (result.status === 0) {
            message.success('删除图片成功')
        } else {
            message.error('删除图片失败')
        }
    }

      this.setState({ fileList })
      
    };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div>Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          accept="image/*"   // 只接收图片格式
          action="/manage/img/upload"  // 上传图片的接口地址
          listType="picture-card"  // 卡片样式
          name = 'image'    // 请求参数名
          fileList={fileList}   // 所有已上传图片文件对象的数组
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 4 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

