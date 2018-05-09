/* eslint-disable */
import React from 'react';
import css from './houseList.less';
import { Form, Input, Col,Modal, Row,message,Spin, Select, InputNumber,Slider,Radio,Button,Checkbox ,Switch ,DatePicker,Table ,Upload,Progress } from 'antd';
import API from '../../api';
import Axios from 'axios';
import emitter from '../../utils/events';
import qs from 'qs';
import BaseJs from '../../assets/base.js';
import moment from 'moment';
//class HouseList extends React.Component{
const { MonthPicker, RangePicker } = DatePicker;

const dateFormat = 'YYYY/MM/DD';
class HouseList extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			data:'',
			disabled:false,
			loading: false
		};
		this.orderid;
		this.edit = this.edit.bind(this);
	}
	componentWillMount(){
	}
	setloading(staut) {
	    this.setState({
	        loading : staut
	    });
	}
	edit () {
		this.setState({
			disabled:!this.state.disabled
		})
	}
  componentDidMount(e) {
  	if( this.props.location.state ){
	  	let obj = {
			id:this.props.location.state.id 
		}
	  	this.orderid = this.props.location.state.id;
		API.landlordDetail(obj).then( res => {
			if( res.data.success == true ){
				this.setState({
					data:res.data.data,
					disabled:true
				},()=>{
				})
			};
		})
		.catch( error => {
			message.error(res.data.msg?res.data.msg:'请求出错了',3)
		})
  	}
	
  }
	render(){
		return (
		  	<div>
			  	<Spin spinning={this.state.loading} className={css.loads}>
				  	<div className={css.content} style={{marginTop:'0px'}}>
					    <div className={css.main_top}>
					        <label className={css.label}>基本信息</label>
					        <em className={css.line}></em>
					        <HouseListTop orderid={this.orderid} ajax_res={this.state.data} ajax_disabled={this.state.disabled} /> 	
					    </div>
				    </div>
				    <div className={css.content}>
				     <div className={css.main_top}>
					   		<WrappedDynamicFieldSet ajax_res={this.state.data} ajax_disabled={this.state.disabled} />
					   		
					    </div>
					</div>  
					<div className={css.content}>
				        <div className={css.main_top}>
					        <label className={css.label}>附件信息</label>
					        <em className={css.line}></em>
					   		<HouseListFooter orderid={this.orderid} setloading = {staut => this.setloading(staut)} ajax_res={this.state.data} ajax_disabled={this.state.disabled}  onChange={this.edit.bind(this)} /> 	
					    </div>
					</div>  
				</Spin>
			</div>
	    );
	}
  
};
 //<Add />
//<HouseListContent /> 	
export default HouseList;

const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 12 },
  },
};
class HouseListTopInfo extends React.Component{
	constructor(props) {
    	super(props);
		this.state = {
		    add: 1,
		    data:'',
		};
	}
    componentDidMount(e) {
    	// 组件装载完成以后声明一个自定义事件
	    emitter.addListener('formSave', (valuess) => {
		    this.props.form.validateFields((err, valuess) => {
		        if (!err) {
				    emitter.emit( 'formSaveOne',valuess );
		        }
		    });
	    });
	}

componentWillUnmount() {
	emitter.removeAllListeners();
}
	render() {
		const  {getFieldValue,getFieldDecorator,setFields} = this.props.form;
		const _this = this;
		return (
			<div style={{marginTop:'20px'}}>
			<Form className="ant-advanced-search-form"  >
	        	<Row gutter={24}>
	        		<Col xl={8} lg={12}>
		          		<FormItem {...formItemLayout} label="姓名" style={{height:'40px',marginBottom:'23px'}} className={css.error}  >
			     			{getFieldDecorator('name',{
				     			initialValue:this.props.ajax_res.name, 
				     			rules:[{
		          					max:5,
		              				message: '最多输入5个字',
		            			}, {
			              		required: false, message: 'Please input your E-mail!',
			            		}],
			            		validateTrigger:'onBlur'
			     			})(
	              				<Input placeholder="请输入姓名" disabled={this.props.ajax_disabled} />
	          				)}
		    			</FormItem>
	        		</Col> 
					<Col xl={8} lg={12}>
					    <FormItem label="性别" {...formItemLayout} >
						    {getFieldDecorator('sex' , {
						    	initialValue :this.props.ajax_res.sex != 'undefined' ? this.props.ajax_res.sex :''
						    })(
						      <Select placeholder="请选择性别" disabled={this.props.ajax_disabled} >
						        <Option value={1}>男</Option>
						        <Option value={2}>女</Option>
						      </Select>
						    )}  
					    </FormItem>
				    </Col>
				 	<Col xl={8} lg={12}>
					    <FormItem {...formItemLayout} label="身份证号"  >
						    {getFieldDecorator('CarNumber',{initialValue : this.props.ajax_res.cardId != 'undefined' ? this.props.ajax_res.cardId: ''})(
						      <Input placeholder="请输入身份证号" disabled={this.props.ajax_disabled} />
						    )}  
					    </FormItem>
				    </Col>
				 	<Col xl={8} lg={12}>
					    <FormItem {...formItemLayout} label="手机号" style={{height:'40px',marginBottom:'23px'}} className={css.error} >
						    {getFieldDecorator('TelNumber',{
						    	initialValue :this.props.ajax_res.phone != 'undefined' ? this.props.ajax_res.phone :'',
						    	rules: [
					            { 
					            	required: false,
					            	validator(rule, values, callback){
					                    if (!(/^1[3|4|5|8|7][0-9]\d{4,8}$/.test(values))) {
									        callback('请输入正确手机号');
									         setTimeout(() => {
												setFields({
												  TelNumber: {
												    value: '',
												      },
												   });
												},1000);
									        return ;
								        }else{
								        	if( values != _this.props.ajax_res.phone   ){
								        			let obj = {
										        		mobile:values
										        	};
										        	API.isRegister(obj)
										        	.then( res=> {
										        		if( res.data.success == true ){
										        			callback();
										        		}else{
										        			 callback('该手机号已注册');
										        		}
										        	})
										        	.catch( error=> {
										        		callback('手机验证出错');
										        	});
								        	}else{
								        		callback();
								        	}
								        };
						            }
					            }],
					            validateTrigger:'onBlur'
						    })(
						      <Input placeholder="请输入手机号" disabled={this.props.ajax_disabled} />
						    )}  
					    </FormItem>
				    </Col>
				 	<Col xl={8} lg={12}>
					    <FormItem {...formItemLayout} label="微信号"  >
						    {getFieldDecorator('WxNumber',{initialValue : this.props.ajax_res.wechat != 'undefined' ?this.props.ajax_res.wechat : ''})(
						        <Input placeholder="请输入微信号" disabled={this.props.ajax_disabled}  />
						    )}   
					    </FormItem>
				    </Col>
				 	<Col xl={8} lg={12}>
					    <FormItem {...formItemLayout} label="是否结婚"  >
						    {getFieldDecorator('Marry',{initialValue : this.props.ajax_res.marriage})(
							    <Select disabled={this.props.ajax_disabled} placeholder="请选择婚姻状况" >
							        <Option value={1}>已婚</Option>
							        <Option value={2}>未婚</Option>
							        <Option value={3}>离异</Option>
							    </Select>
						    )}  
					    </FormItem>
				    </Col>
				 	<Col xl={8} lg={12} >
					    <FormItem {...formItemLayout} label="居住地址" >
						    {getFieldDecorator('Address',{initialValue : this.props.ajax_res.oftenPlace != 'undefined' ? this.props.ajax_res.oftenPlace : '' })(
						        <Input placeholder="请输入居住地址"  disabled={this.props.ajax_disabled} />
						    )}
					    </FormItem>
				    </Col>
		        </Row>
		    </Form>
        </div>
	);
  }
}
const HouseListTop = Form.create()(HouseListTopInfo);



const formItemLayouts = {
  labelCol: { span: 6,offset:1 },
  wrapperCol: { span: 12 },
}	
let uuid = 0;
class DynamicFieldSet extends React.Component {
	constructor(props) {
		super(props);
	
	}
  remove = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }

  add = (e) => {
  	e.preventDefault();
  	const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    uuid++;
    form.setFieldsValue({
      keys: nextKeys ? nextKeys : 1,
    });
  }
    componentDidMount(e) {
    // 组件装载完成以后声明一个自定义事件
	    emitter.addListener('formSave', (valuess) => {
		    this.props.form.validateFields((err, valuess) => {
			    if (!err) {
			        emitter.emit('formSaveTwo',valuess );
			    }
		    });
	    });
	}
	componentWillUnmount() {
		emitter.removeAllListeners();
	};
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
   
    let keys;
   
    if( this.props.ajax_res.list ){
    	if( this.props.ajax_res.list.length != 0 ){
    		let arry_length = [];
    		for ( let i = 0 ; i < this.props.ajax_res.list.length ; i++ ){
	    		arry_length.push(this.props.ajax_res.list[i]);
	    	};
	    	keys = arry_length;
	    	getFieldDecorator('keys', { initialValue: keys });
   		 	keys = getFieldValue('keys');
    	}else{
    		getFieldDecorator('keys', { initialValue: [1] });
   		 	keys = getFieldValue('keys');
    	}
    }else{
   		 getFieldDecorator('keys', { initialValue: [1] });
   		 keys = getFieldValue('keys');
    };
    let formItems = keys.map((k, index) => {
    	let date = k.buyTime ? k.buyTime : '921600000';
    	var d = new Date(date * 1000);    //根据时间戳生成的时间对象
		let dates = (d.getFullYear()) + "-" + 
		           (d.getMonth() + 1) + "-" +
		           (d.getDate());
      return (
			<div key={index} style={{marginTop:'20px',marginBottom:'20px'}}>
		      <Form onSubmit={this.handleSubmit} style={{background:'#fafafa'}}>
		       	<Row gutter={24}>
		        <FormItem wrapperCol= {{ span:24 }} label="" style={{width:'100%',marginTop:'10px',marginBottom:'10px'}} >
		         	<span className="ant-form-text" style={{fontSize:'16px',paddingLeft:'20px'}}>房产地址{index+1}</span>
		         	{keys.length > 1 ? (
		                <Button ghost icon="delete" style={{float:'right',marginRight:'20px',border:'1px solid #4e98fe',color:'#4e98fe'}}   onClick={() => this.remove(k)} disabled={this.props.ajax_disabled}>删除</Button>
		            ) : null}
		        </FormItem>
		        <div className={css.lines} ></div>
			        
		        	<Col xl={8} lg={24}>
				        <FormItem
					      {...formItemLayouts}
					      label="小区名"
					     style={{marginBottom:'20px',marginTop:'20px'}}
					     className={css.error}
					    >
					        {getFieldDecorator(`communityName[${index}]`,{ initialValue:k.communityName, rules: [{ required: true, message: '请输入小区名' }] })(
						      <Input  style={{width:'100%'}} placeholder="请输入小区名" disabled={this.props.ajax_disabled} />
						    )} 
				    	</FormItem>
				    </Col>
				    <Col xl={8} lg={24}>
				        <FormItem
					      {...formItemLayouts}
					      label="门牌号"
					      style={{marginBottom:'20px',marginTop:'20px'}}
					      className={css.error}
					    >
					        {getFieldDecorator(`houseNumber[${index}]`,{ initialValue:k.houseNumber, rules: [{ required: true, message: '请输入门牌号' }] })(
						      <Input style={{width:'100%'}} placeholder="请输入门牌号" disabled={this.props.ajax_disabled} />
						    )} 
				    	</FormItem>
				    </Col>
				    <Col xl={8} lg={24}>
				        <FormItem
					      {...formItemLayouts}
					      label="地区"
					      style={{marginBottom:'20px',marginTop:'20px'}}
					      className={css.error}
					    >
					        {getFieldDecorator(`region[${index}]`,{ initialValue:k.region, rules: [{ required: true, message: '请输入地区' }] })(
						      <Input style={{width:'100%'}} placeholder="请输入地区" disabled={this.props.ajax_disabled} />
						    )} 
				    	</FormItem>
				    </Col>
			        <Col xl={15} lg={24}>
				         <FormItem
				          labelCol={{span:4 }}
			      		  wrapperCol={{ span: 18 }}
				          label="房产类别："
				          style={{marginBottom:'20px'}}
				          className={css.errors}
				        >
				            {getFieldDecorator(`PropertyCategory[${index}]`,{initialValue:k.houseType, rules: [{ required: true, message: '请选择房产类型' }] })(
							    <RadioGroup onChange={this.onChange} disabled={this.props.ajax_disabled} >
							        <Radio value={1}>商品房&nbsp;住宅</Radio>
							        <Radio value={2}>房改房</Radio>
							        <Radio value={3}>拆迁房</Radio>
							        <Radio value={4}>公寓</Radio>
							        <Radio value={5}>写字楼</Radio>
							    </RadioGroup>
				            )}
				        </FormItem>
			        </Col>
			        <Col xl={9} lg={24}>
				        <FormItem
				            labelCol={{span:9 }}
			      		    wrapperCol={{ span: 15 }}
				            label="现状态"
				            style={{marginBottom:'20px'}}
				            className={css.errors}
				        >
				            {getFieldDecorator(`Staut[${index}]`,{ initialValue: k.nowStatus, rules: [{ required: true, message: '请选择现状态' }] })(
					            <RadioGroup onChange={this.onChange} disabled={this.props.ajax_disabled}  >
						            <Radio value={1} >已出租</Radio>
						            <Radio value={2}>空置</Radio>
						        </RadioGroup>
				            )}
				        </FormItem>
			        </Col>
		        <Col xl={8} lg={24}>
			        <FormItem
				      {...formItemLayouts}
				      label="产权人"
				      style={{marginBottom:'20px'}}
				      className={css.error}
				    >
				        {getFieldDecorator(`Address[${index}]`,{ initialValue:k.propertyOwner, rules: [{ required: true, message: '请输入产权人' }] })(
					      <Input style={{width:'100%'}} placeholder="请输入产权人" disabled={this.props.ajax_disabled} />
					    )} 
			    	</FormItem>
			    </Col>
			    <Col xl={8} lg={24}>
				    <FormItem
				      {...formItemLayouts}
				      label="购买时间"
				      style={{marginBottom:'20px'}}
				      className={css.errors}
				    >
				    	{getFieldDecorator(`Date[${index}]`,{initialValue:moment(dates, dateFormat), rules: [{ required: true, message: '请选择时间' }]})(
				      		<DatePicker style={{ width: '100%' }} placeholder='请选择时间' disabled={this.props.ajax_disabled} />
				    	)}  
				    </FormItem>
			    </Col>
			    <Col xl={6} lg={20} className={css.divs_dw}>
				    <FormItem
				         wrapperCol= {{ span:15 }}
			            labelCol = {{span:9}}
				        label="建筑面积"
				        style={{marginBottom:'20px'}}
				        className={css.errors}
				    >
					    {getFieldDecorator(`Area[${index}]`,{initialValue:k.area, rules: [{ required: true, message: '请输入居住面积' }]})(
					        <InputNumber  style={{width:'100%'}} placeholder="请输入居住面积" disabled={this.props.ajax_disabled} />
					    )}
				    </FormItem>
			    </Col>
		        <Col xl={2} lg={4} className={css.parent_dw}>
					 <span>(平米)</span>
		        </Col>
			    
		        
		        <Col xl={6} lg={20} className={css.divs_dw} >
			        <FormItem
			            wrapperCol= {{ span:15 }}
			            labelCol = {{span:9}}
			            label="购买价格"
			            style={{marginBottom:'20px'}}
			            className={css.errors}
			        >
			            {getFieldDecorator(`BuyMoney[${index}]`, { initialValue: k.buyPrice, rules: [{ required: true, message: '请输入购买价格' }]})(
			            	<InputNumber style={{width:'100%'}} disabled={this.props.ajax_disabled} />
			            )}
			        </FormItem>
		        </Col>
		         <Col xl={2} lg={4} className={css.parent_dw}>
					 <span>(万元)</span>
		        </Col>
		        <Col xl={8} lg={24}>
					<FormItem
			          	wrapperCol= {{ span:15 }}
			            labelCol = {{span:7}}
			            label="是否有房贷"
			            style={{marginBottom:'20px'}}
			            className={css.errors}
			        >
			            {getFieldDecorator(`Mortgage[${index}]`,{initialValue:k.ifMortgage, rules: [{ required: true, message: '请选择有无房贷' }]})(
				            <RadioGroup disabled={this.props.ajax_disabled} >
						        <Radio value={'1'} >是</Radio>
						        <Radio value={'2'}>否</Radio>
					        </RadioGroup>
			            )}
			        </FormItem>
		        </Col>
		       
		        <Col xl={8} lg={24}>
					<FormItem
				        {...formItemLayouts}
				        label="装修情况"
				        style={{marginBottom:'20px'}}
				        className={css.errors}
				    >
					    {getFieldDecorator(`Renovation[${index}]`,{initialValue : k.decorate, rules: [{ required: true, message: '请选择装修情况' }]})(
					        <Select placeholder="请选择装修情况" disabled={this.props.ajax_disabled} >
					            <Option value={1}>精装</Option>
					            <Option value={2}>中装</Option>
					            <Option value={3}>简装</Option>
					            <Option value={4}>毛胚</Option>
					        </Select>
					    )}  
				    </FormItem>
			    </Col>
			    </Row>
		      </Form>
				</div>
      );
    });
    return (
		<div>
			<label className={css.label}>出租房屋信息 </label><Button type="primary" icon="plus" style={{float:'right',borderRadius:'40px',marginTop:'-30px'}} onClick={this.add} disabled={this.props.ajax_disabled}>新增</Button>
    		<em className={css.line}></em>	
    		{formItems}
	    </div>
    );
  }
}

const WrappedDynamicFieldSet = Form.create()(DynamicFieldSet);


let FormStaut = 1;
class HouseListFooterInfo extends React.Component{
	constructor(props) {
		super(props);
		this.openImg = this.openImg.bind(this);
		this.close = this.close.bind(this);
		this.uploadKey=0;
		this.state = {
			marginT:'',
			width:'',
			height:'',
			visible:false,
			img_url:'',
			dis:false,
		    contentInputValue:1,
			dataSource:[],
			columns: [{
			  title: '序号',
			  dataIndex: 'key',
			  key: 'key',
			  className:css.tab_text,
			  width:'25%'
			}, {
			  title: '附件类型',
			  dataIndex: 'age',
			 	className:css.tab_text,
			  key: 'age',
			  width:'25%',
			  render:( text,record ) => (
			  	<div>
			  		<span>{record.age}</span>
			  	</div> 
			  )
			}, {
			  title: '附件名称',
			  dataIndex: 'address',
			  className:css.tab_text,
			  key: 'address',
			  width:'25%',
			  render:( text, record)=>{
			  	console.log(record);
			  	return (
				  	<div>
				  		<div><span>{record.name}</span></div>
				  	</div>
			  )},
			},{
				title: '操作',
				key: 'action',
				className:css.tab_text,
				width:'25%',
				render: ( text, record ) => {
					return(
						<span>
					        <a className="ant-dropdown-link" data-index={record.key} onClick={this.openImg} >查看</a> 
					    </span>
					)
			  },
			}]
		};
		this.valueChange = this.valueChange.bind(this);
	}
	componentWillUnmount() {
		emitter.removeAllListeners();
	}
	valueChange(currency){
   	    this.setState({
   	    	contentInputValue:currency
   	    })
	}

	componentDidMount(){
		let that = this;
		const addUserobj = {};
		emitter.addListener('formSaveOne', (valuess) => {
	      	addUserobj.name = valuess.name ? valuess.name :'';
	      	addUserobj.phone = valuess.TelNumber ? valuess.TelNumber :'';
	      	addUserobj.cardId = valuess.CarNumber ? valuess.CarNumber : '';
	      	addUserobj.sex = valuess.sex ?valuess.sex :'';
	      	addUserobj.wechat = valuess.WxNumber ? valuess.WxNumber :'';
	      	addUserobj.marriage = valuess.Marry ? valuess.Marry :'';
	      	addUserobj.oftenPlace = valuess.Address ? valuess.Address :'';
		    emitter.addListener('formSaveTwo', (valuess) => {
		    	let value;
		    	value = valuess;
			   	if( value.Address != undefined  ){
			    	let UserList = [];
			    	for ( let i = 0 ; i < value.Address.length; i ++ ){
			    		let date = new Date(value.Date[i].format('YYYY-MM-DD'));
						let adate =date.getTime();
						adate = adate.toString();
						let dates = adate.substring(0,adate.length-3);
			    		UserList.push({
			    			houseType:`${value.PropertyCategory[i]}`,
							propertyOwner:`${value.Address[i]}`,
							buyTime:dates,		
							area:`${value.Area[i]}`,
							nowStatus:`${value.Staut[i]}`,
							buyPrice:`${value.BuyMoney[i]}`,
							ifMortgage:`${value.Mortgage[i]}`,
							decorate:`${value.Renovation[i]}`,
							houseId:`${i}`,
							region:`${value.region[i]}`,
							houseNumber:`${value.houseNumber[i]}`,
							communityName:`${value.communityName[i]}`
			    		})
			    	};
			    	addUserobj.list = UserList;
			    	let accountId = JSON.parse(sessionStorage.getItem('loginMsg'));
			    	addUserobj.accountId = accountId.id;
					addUserobj.id=this.props.orderid;
					that.props.setloading(true);
					this.setState({
						dis:true
					})
					if ( FormStaut == 1 ){
						FormStaut ++ ;
						Axios({
							method: 'post',
							url:'/landlordUser/addLandlordUser',
							data:JSON.stringify(addUserobj),
							headers:{
								"Content-Type":"application/json;charset=UTF-8"
							}
						})
						.then(res => {
							if(res.data.success){
								message.success('新增成功');
								setTimeout(() => {
								 	this.props.setloading(false);
							     	window.location.href= '../../home/houseAdministration/houseExamine/houseExamine';
							    },2000);
							}else{
								FormStaut = 1;
								this.props.setloading(false);
								this.setState({
									dis:false
								})
								message.error(res.data.msg);
							};
						})
						.catch(error => {
							FormStaut = 1;
							this.setState({
								dis:false
							})
							this.props.setloading(false);
							message.error(error);
						})
					}
		    		
			   	}else{
			   		this.props.setloading(false);
		   			this.setState({
						dis:false
					})
			   	}
		    });	
	   });
	}

	openImg(e){
		let _this = this;
		let index = e.target.getAttribute('data-index')-1;
		let url_id = this.state.dataSource[index].id;
		let obj = {
			id:url_id
		};
		this.props.setloading(true);
		API.lookAttach(obj).then(res =>{
			let $tempImg = new Image();
			$tempImg.src = res.data.data;
			let sourceWidth,realityHeight,wind_height,wind_width,margt;
			$tempImg.onload = function () {
			    sourceWidth = this.naturalWidth; // 在没有加入文档前，jQuery无法获得正确宽高，但可以通过原生属性来读取
				realityHeight = this.naturalHeight;
				wind_height = document.body.offsetHeight;
				wind_width = document.body.offsetWidth;
				margt = '';
				if( sourceWidth > wind_width || realityHeight > wind_height  ){
					if( sourceWidth > realityHeight ){
						sourceWidth = wind_width;
						realityHeight = sourceWidth/wind_width*realityHeight;
					}else{
						realityHeight = wind_height;
						sourceWidth = realityHeight/wind_height*sourceWidth;
					}
				};
				margt = (wind_height-realityHeight)/2;
				_this.setState({
			      visible: true,
			      img_url:res.data.data,
			      marginT:margt+'px',
			      width:sourceWidth+'px',
			      height:realityHeight+'px',
			    },()=>{
			    	_this.props.setloading(false);
			    });
			};
		})
		.catch( error => {
		})
	}
	sbm (e) {
		emitter.emit('formSave', FormStaut);  
		
	}
	componentWillReceiveProps(ajax_res){
		if(ajax_res.ajax_res != '' && ajax_res.ajax_res.attachList != null ){
			let datas_list = [];
			for(let i = 0 ; i < ajax_res.ajax_res.attachList.length; i++ ){
				let datas = {};
				let age_name = '';
				console.log(ajax_res.ajax_res.attachList[i].fileType);
			    switch(ajax_res.ajax_res.attachList[i].fileType)
				{
				case '1':
				  age_name = '身份证正面';
				  break;
				case '2':
				  age_name = '身份证反面';
				  break;
				case '3':
				  age_name = '房产证';
				  break;
				case '4':
				  age_name = '合同';
				  break;
				default:
				  age_name = '身份证正面';
				}
				datas.id = ajax_res.ajax_res.attachList[i].id; 
				datas.key = i+1;
				datas.name = ajax_res.ajax_res.attachList[i].fileName;
				datas.type = ajax_res.ajax_res.attachList[i].fileType;
				datas.age = age_name;
				datas.url = ajax_res.ajax_res.attachList[i].fileName;
				datas.progress = 0;
				datas_list.push(datas);
			};
			this.setState({
				dataSource:datas_list
			});
		}
	}
	close(){
		this.setState({
	      visible: false,
	   });
	}
	render(){
		return (
			<div>
				<div className={css.show_img} style={{display:this.state.visible ? 'block' : 'none'}}>
					<div className={css.close} onClick={this.close}></div>
		            <img src={this.state.img_url} style={{marginTop:this.state.marginT,width:this.state.width,height:this.state.height}} />
		        </div>
				<div style={{marginTop:'20px',marginBottom:'20px'}}>
					<Table dataSource={this.state.dataSource} columns={this.state.columns} pagination={false} bordered />
					<input ref="file_list" type="file" style={{display:'none'}} onChange={this.onChange}   />   
				</div>
				<div style={{width:'30%',margin:'0 auto'}}>
					<Button type="primary"  onClick={this.props.onChange} style={{width:'34%',float:'left',heignt:'80px',fontSize:'18px',margin:'0 auto',display:this.props.ajax_disabled ? 'block' : 'none',marginBottom:'30px'}} >编辑</Button>
					<Button type="primary"  onClick={this.sbm} style={{width:'34%',heignt:'80px',float:this.props.ajax_disabled ? 'right' : '',fontSize:'18px',margin:'0 auto',display:'block',marginBottom:'30px'}} disabled={this.state.dis} >保存</Button>
				</div>
			</div>
		)
	}
}
const HouseListFooter = HouseListFooterInfo;
