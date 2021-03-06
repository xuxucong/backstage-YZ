import React, {Component} from 'react';
import {Input,Select,Tooltip,Icon,Tag,Button,Row,Col,Form,message} from 'antd';
import { connect } from 'dva';
import areaAddress from '../../../util/selectBank';   //省市区数据
import Style from './addStyle.less';


const Option = Select.Option;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestStatus: true,
      visible: false,
      userData: '',
      tags: [],
      inputVisible: true,
      inputValue: '',
      provinceData: [], //省
      cityData: [],//市
      areaData: [],//区
      qval: '选择省',
      cval: '选择市',
      aval: '选择区',
      area: '',
      areaCode: '',
      cityName: '',
      proName: '',
      proCode: '',
      instValue: ''
    };
  }
  componentWillMount() {
    let self= this
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    self.props.getInstitutions({userId : userData.id, code: userData.instCode});

    self.props.detailCommunis({
      params: {userId : userData.id, id: self.props.communisId},
      func: function(){
        self.props.getGarden({
          params:{
            comId : self.props.data.id,
            userId: userData.id
          }
        })
      }
    });
    //一进入页面把省市区的数据push到空数组里面
    const provinceData = areaAddress.map((item) => { //省
      return {areaCode: item.code, areaName: item.p};
    });
    const cityData = areaAddress[0].c.map((item) => {  //市
        return {areaCode: item.code, areaName: item.n}
    });
    const areaData = areaAddress[0].c[0].a.map((item) => { //区
      return {areaCode: item.code, areaName: item.n};
    });
    this.setState({
      provinceData
    });
  }
  componentWillReceiveProps (nextProps) {
    if(nextProps.data) {
      //物业公司
      let instValue = `${nextProps.data.instCode},${nextProps.data.instId}`
      this.setState({
        instValue
      })
      // 省
      let province = nextProps.data.areaInfo.split('-')[0]
      this.setState({
        qval: province,
        proName: JSON.parse(province).areaName,
        proCode:  JSON.parse(province).areaCode
      })
      //市
      let city = nextProps.data.areaInfo.split('-')[1]
      let cityData = []
      areaAddress.forEach((item) => { //省
        if(item.code == JSON.parse(province).areaCode) {
          item.c.forEach((i) =>{
            cityData.push({areaCode: i.code, areaName: i.n})
          })
        }
      });
      this.setState({
        cval: city,
        cityName:  JSON.parse(city).areaName,
        cityData
      })
      //区
      let area = {
        areaCode: nextProps.data.areaCode, 
        areaName: nextProps.data.area
      }
      let areaData = []
      areaAddress.forEach((item) => { //省
        if(item.code == JSON.parse(province).areaCode) {
          item.c.forEach((i) =>{
            if(i.code == JSON.parse(city).areaCode) {
              i.a.forEach((k) =>{
                areaData.push({areaCode: k.code, areaName: k.n})
              })
            }
          })
        }
      });
      this.setState({
        aval: JSON.stringify(area),
        area: nextProps.data.area,
        areaCode: nextProps.data.areaCode,
        areaData
      })
    }
    //苑
    if(nextProps.gardenData.length) {
        let tags = nextProps.gardenData.map((item) =>{
          return {name: item.name, status: false}
        })
        this.setState({
          tags
        })
    }
  }
  //省市操作
  provinceChange(lable) {
    let provinceData = JSON.parse(lable)
    let dataContent = areaAddress;
    let cityData
    dataContent.forEach((item)=>{
      if(provinceData.areaCode == item.code) {
        cityData = item.c.map((item) => {
          return {areaCode: item.code, id: item.code, areaName: item.n} //市
      })
      }
    })
    this.setState({
      proName: provinceData.areaName,
      proCode: provinceData.areaCode,
      qval: lable,
      cval: '选择市',
      aval: '选择区',
      cityData
    })
  }
  cityChange (lable) {
    let cityData = JSON.parse(lable)
    let dataContent = areaAddress;
    let areaData
    dataContent.forEach((item)=>{
      item.c.forEach((i)=>{
        if(cityData.areaCode == i.code) {
          areaData = i.a.map((item) => {
            return {areaCode: item.code, id: item.code, areaName: item.n} //市
          })
        }
      })
    })
    this.setState({
      cval: lable,
      cityName: cityData.areaName,
      areaData,
      aval: '选择区'
    })
  }
  areaChange (lable) {
    let areaData = JSON.parse(lable)
    this.setState({
      aval: lable,
      area: areaData.areaName,
      areaCode : areaData.areaCode,
    })
  }
  //苑/区 操作
  handleClose = (removedTag) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
  }
  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  }
  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }
  handleInputConfirm = () => {
    const state = this.state;
    const inputValue = state.inputValue;
    let tags = state.tags;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags.push(
        {name: inputValue, status: true}
      )
    }
    this.setState({
      tags,
      // inputVisible: false,
      inputValue: '',
    });
  }
  saveInputRef = input => this.input = input;

  addUserSub = () => {
    const self = this;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {
      let rex = this.rex(values)
      if (rex) {
        if(this.state.requestStatus){
          self.setState({requestStatus: false},() => {
            if (values.instData) {
              values.instCode = values.instData.split(',')[0]
              values.instId = values.instData.split(',')[1]
            }
              let tags = []
              self.state.tags.forEach((item)=>{
                if (item.status == true) {
                  tags.push(item.name)
                }
              })
              self.props.updateCommunis({
                params: {
                  id: self.props.data.id,
                  areaDetail: values.areaDetail,
                  code: values.code,
                  name: values.name,
                  phone: values.phone,
                  instCode: values.instCode,
                  instId: values.instId,
                  proName: self.state.proName,
                  proCode: self.state.proCode,
                  area: self.state.area,
                  areaInfo: `${self.state.qval}-${self.state.cval}`,
                  areaCode: self.state.areaCode,
                  courtNames: tags.join(),
                  userId: userData.id,
                },
                func: function(){
                  
                  message.success('操作成功!', 1.5, function() {
                    self.props.search('editVisible')
                  });
                }
              })
          })
        }
      } 

    })
  }
  rex (item) {
    let self = this
    message.destroy();
    if(!item.code){
      message.warning('社区编号不能为空');
      return false
    }
    if(!item.name){
      message.warning('社区名称不能为空');
      return false
    }
    if(!self.state.proName) {
      message.warning('请选择省');
      return false
    }
    if(!self.state.cityName) {
      message.warning('请选择市');
      return false
    }
    if(!self.state.area) {
      message.warning('请选择区');
      return false
    }
    if(!item.areaDetail) {
      message.warning('详细地址不能为空');
      return false
    }
    if(!item.instData){
      message.warning('请选择物业公司');
      return false
    }
    if(!self.state.tags.length) {
      message.warning('苑/区不能为空');
      return false
    }
    return true;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { tags, inputVisible, inputValue } = this.state;
    const content = this.props.data
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF"}}>
        </div>
        <div style={{width: '100%',backgroundColor: "#FFF"}}>
          <Row>
          <Form>
            {
              this.state.requestStatus ? <Button type="primary" onClick={this.addUserSub}>保存</Button> :
              <Button type="primary">保存</Button>
            }
           
            <table cellSpacing="0" className={Style.mytable}>
              <tbody>
                <tr>
                  <td><span className={Style.red}>*</span>社区编号</td>
                  <td colSpan="3">
                    <span>{getFieldDecorator('code', {
                          initialValue: content.code
                      })(<Input placeholder="请输入社区编号(线下编号)" maxLength={30}/>)}</span>
                  </td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>社区名称</td>
                  <td colSpan="3">
                    <span>{getFieldDecorator('name', {
                          initialValue: content.name
                      })(<Input placeholder="请输入社区名称" maxLength={30}/>)}</span>
                  </td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>所在省市</td>
                  <td colSpan="3">
                    <Col span={5} style={{marginRight:10}}>
                        <Select value={this.state.qval} onChange={this.provinceChange.bind(this)}>
                          {this.state.provinceData ? this.state.provinceData.map(item => (
                            <Option value={JSON.stringify({areaCode: item.areaCode, areaName: item.areaName})} key={item.areaCode}>{item.areaName}</Option>
                          )) : ( <Option value={' '}>暂无数据</Option> )}
                        </Select>
                    </Col>
                    <Col span={5} style={{marginRight:10}}>
                        <Select value={this.state.cval} onChange={this.cityChange.bind(this)}>
                            {this.state.cityData ? this.state.cityData.map(item => (
                              <Option value={JSON.stringify({areaCode: item.areaCode, areaName: item.areaName})} key={item.areaCode}>{item.areaName}</Option>
                            )) : ( <Option value={' '}>暂无数据</Option> )}
                        </Select>
                    </Col>
                    <Col span={5}>
                        <Select value={this.state.aval} onChange={this.areaChange.bind(this)}>
                            {this.state.areaData ? this.state.areaData.map(item => (
                              <Option value={JSON.stringify({areaCode: item.areaCode, areaName: item.areaName})} key={item.areaCode}>{item.areaName}</Option>
                            )) : ( <Option value={' '}>暂无数据</Option> )}
                        </Select>
                    </Col>
                  </td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>详细地址</td>
                  <td colSpan="3">
                    <span>
                      {getFieldDecorator('areaDetail', {
                          initialValue: content.areaDetail
                      })(
                        <Input placeholder="请输入详细地址" />)}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>联系方式</td>
                  <td colSpan="3">
                    <span>
                      {getFieldDecorator('phone', {
                          initialValue: content.phone
                      })(
                        <Input placeholder="请输入常用联系方式" />)}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>物业公司</td>
                  <td colSpan="3">
                    {getFieldDecorator('instData', {
                          initialValue: this.state.instValue
                    })(
                      <Select 
                        showSearch
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        placeholder="请选择">
                         {this.props.institutionsData ? this.props.institutionsData.map(item => (
                              <Option value={`${item.code},${item.id}`} key={item.id}>{item.name}</Option>
                            )) : ( <Option value={' '}>暂无数据</Option> )}
                      </Select>
                    )}
                  </td>
                </tr>
                <tr>
                  <td><span className={Style.red}>*</span>苑/区</td>
                  <td colSpan="3" style={{padding:'15px 15px'}}>
                    {tags.map((tag, index) => {
                      const isLongTag = tag.name.bindlength > 20;
                      const tagElem = (
                        <Tag key={tag.name} closable={tag.status} afterClose={() => this.handleClose(tag)}>
                          {isLongTag ? `${tag.name.slice(0, 20)}...` : tag.name}
                        </Tag>
                      );
                      return isLongTag ? <Tooltip title={tag.name} key={tag.name}>{tagElem}</Tooltip> : tagElem;
                    })}
                    
                    <Col className={Style.addComm}>
                      {inputVisible && (
                        <Input
                          ref={this.saveInputRef}
                          type="text"
                          size="small"
                          maxLength={15}
                          style={{ width: 183,height:30 }}
                          value={inputValue}
                          onChange={this.handleInputChange}
                          // onBlur={this.handleInputConfirm}
                          onPressEnter={this.handleInputConfirm}
                        />
                      )}
                      <Button type="primary" 
                        onClick={this.handleInputConfirm}
                        style={{width:72,height:28,marginLeft:20}} >确定</Button>
                      {!inputVisible && (
                        <Tag
                          onClick={this.showInput}
                          style={{ background: '#fff', borderStyle: 'dashed' }}
                        >
                          <Icon type="plus" /> 
                        </Tag>
                      )}
                    </Col>
                    
                  </td>
                </tr>

              </tbody>
            </table>
              
            </Form>
          </Row>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    communisId: state.houseManagement.communisId,
    institutionsData: state.houseManagement.institutionsData,
    data: state.houseManagement.detailCommunisData,
    gardenData: state.houseManagement.gardenData
  }
}
function dispatchToProps(dispatch) {
  return {
    getInstitutions(payload, params) {
      dispatch({
        type: 'houseManagement/getInstitutions',
        payload
      })
    },
    detailCommunis(payload, params) {
      dispatch({
        type: 'houseManagement/detailCommunis',
        payload
      })
    },
    getGarden(payload, params) {
      dispatch({
        type: 'houseManagement/getGarden',
        payload
      })
    },
    updateCommunis(payload, params) {
      dispatch({
        type: 'houseManagement/updateCommunis',
        payload
      })
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
