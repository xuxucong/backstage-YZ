import React, { Component } from 'react';
import {Button,Row,Form,Modal,Input,Icon,Upload,message} from 'antd';
import {connect} from 'dva';
import Style from '../detail.less';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestStatus: true,
      fileList: [],
      previewVisible: false,
      previewImage: ""
    };
  }


    //上传图片
    handleCancel = () => this.setState({ previewVisible: false });
    handleChange(info) {
      if(info.file.status == 'removed') {
        this.setState({
          fileList: info.fileList,
        });
      } else {
        let rex = this.checkImg(info.file)
        if(rex) {
          this.setState({
            fileList: info.fileList
          });
        } 
      }
    }
    //校验上传图片
    checkImg(info) {
      if (!/image/.test(info.type)) {
          message.error('文件必须为图片！')
          return false
      }
      if (info.size > 1000000) {
          message.error('图片不能超过1M！')
          return false
      }
      return true
    }


    regx(item){
      //正则匹配只能输入数字
      let regNum = /^[0-9]*$/;
      if(!this.state.fileList.length){
        message.warning("红票图片不能为空");
        return false;
      }
      if(JSON.stringify(this.state.fileList) == '[]'){
        message.warning("红票图片不能为空");
        return false;
      }
      if(!item.writeOffReason){
        message.warning("核销原因不能为空");
        return false;
      }
      return true;
    }

    cancel(){
      const userData = JSON.parse(localStorage.getItem('userDetail'));
      const self = this;
      this.props.form.validateFields((err, values) => {
        let reg = self.regx(values);
        if(reg){
          if(this.state.requestStatus){
              self.setState({requestStatus: false},() => {
                self.props.cancelInvoice({
                  params: {
                    ...values,
                    redTicketPic: JSON.stringify(self.state.fileList) == '[]' ? '' : self.state.fileList[0].response,
                    id: this.props.argument.id,
                    userId: userData.id, 
                    instCode: userData.instCode,
                    operationType: '3',
                    status: '3',
                    operationName: userData.name
                  },
                  func: function () {
                      message.success('操作成功', 1.5, ()=>{
                        self.props.search('cancelVisible');
                      });
                  }
                })
              })
          }
        }
      })
    }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { previewVisible, previewImage,fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" style={{fontSize: 30 }} />
      </div>
    );
    return (
      <div className={Style.userBox}>
        <div className={Style.title}>
            <Row>
              {
                  this.state.requestStatus ? <Button type="primary" onClick={ this.cancel.bind(this) }>保存</Button> :
                  <Button type="primary">保存</Button>
              }
              
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td>发票编号</td>
                    <td colSpan={3}>
                        {getFieldDecorator('redTicket')(
                          <Input placeholder="请输入发票编号" />
                        )}
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>红票图片</td>
                    <td style={{paddingLeft:20,paddingTop:12}} colSpan={3}>
                        <div className="clearfix">
                          <Upload
                            action="/backstage/upload/upLoadRKey"
                            beforeUpload={this.checkImg}
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={this.handlePreview}
                            onChange={this.handleChange.bind(this)}
                          >
                            {fileList.length >= 1 ? null : uploadButton}
                          </Upload>
                          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                            <img style={{ width: '100%' }} src={previewImage} />
                          </Modal>
                        </div>
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>核销原因</td>
                    <td colSpan={3}>
                        {getFieldDecorator('writeOffReason')(
                          <Input placeholder="请输入核销原因" />
                        )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Row>
        </div>

      </div>
    )
  }

  
}


function mapStateToProps(state, ownProps) {
  return {
    argument: state.invoiceManage.saveSeslect,
  }
}

function dispatchToProps(dispatch) {
  return {
    cancelInvoice(payload,params) {  //核销发票
      dispatch({type: 'invoiceManage/update', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
