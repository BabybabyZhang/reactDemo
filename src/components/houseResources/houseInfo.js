/* eslint-disable */
import React from 'react';
import { Form, Row, Col, Input} from 'antd';
import API from '../../api';
import emitter from '../../utils/events';
import styles from '../work/mywork.css';

const FormItem = Form.Item;
/*房源基本信息*/
class HouseInfoForm extends React.Component {
  	constructor(props) {
    	super(props);
	    this.state = {
	      	obj:{
	      		airConditioner:'空调',
	      		closet:'衣柜',
	      		refrigerator:'冰箱',
	      		television:'电视',
	      		broadband:'宽带',
	      		sofa:'沙发',
	      		heat:'暖气',
	      		waterHeater:'热水器',
	      		washer:'洗衣机',
	      		cook:'做饭',
	      		balcony:'阳台',
	      		bathroom:'独卫',
	      		houseTable:'桌子',
	      		houseChair:'椅子'
	      	},
	      	disable:true,
	    };
	}
	componentWillMount(){
		
		
	}
  	handleChange = (value) => {
  		
  	}
  	onChangeRadio = () => {
  		
  	}
  	setFaclity(){
  		let item = this.props.houseInfo.resourceFaclity;
  		if(item){
  			delete item.id;
	  		delete item.houseResourceId;
	  		let returnArr = [];
	  		let _this = this;
	  		for(let i in item){
	  			if(item[i]){
	  				returnArr.push(_this.state.obj[i])
	  			}
	  		}
	  		return returnArr;
  		}else{
  			return '';
  		}	
  	}
  	render() {
  		const { getFieldDecorator } = this.props.form;
  		const formItemLayout = {
	      	labelCol: { span: 8},
	      	wrapperCol: { span: 10},
	    };
	    const formItemLayout2 = {
	      	labelCol: { span: 8 },
	      	wrapperCol: { span: 16},
	    };
  		return (
		      	<Form
		        	className="ant-advanced-search-form"
		        	layout="inline"
		      	>
		        	<Row gutter={24}>
		        		<Col xl={8} lg={12}>
			          		<FormItem label='房源小区' style={{marginBottom: '5px'}} {...formItemLayout2}>
			          			{getFieldDecorator('landlordName', {
						            rules: [{ required: false}],
						            initialValue:this.props.houseInfo.landlordCommunity?this.props.houseInfo.landlordCommunity.name:''
						        })(
						            <Input disabled={this.state.disable} />
						        )}
			          		</FormItem>
		        		</Col>
		        		<Col xl={8} lg={12}>
			          		<FormItem label='门牌号' style={{marginBottom: '5px'}} {...formItemLayout2}>
			          			{getFieldDecorator('phone', {
						            rules: [{ required: false}],
						            initialValue:this.props.houseInfo.houseResource.name
						        })(
						            <Input disabled={this.state.disable} />
						        )}
			          		</FormItem>
		        		</Col>
		        		<Col xl={8} lg={12}>
			          		<FormItem label='房源租金' style={{marginBottom: '5px'}} {...formItemLayout2}>
			          			{getFieldDecorator('communityName', {
						            rules: [{ required: false}],
						            initialValue:this.props.houseInfo.resourceRentprice?this.props.houseInfo.resourceRentprice.monthPrice+'元':''
						        })(
						            <Input disabled={this.state.disable} />
						        )}
			          		</FormItem>
		        		</Col>
		        		<Col xl={8} lg={12}>
			          		<FormItem label='地址' style={{marginBottom: '5px'}} {...formItemLayout2}>
			          			{getFieldDecorator('type', {
						            rules: [{ required: false}],
						            initialValue:this.props.houseInfo.landlordCommunity?this.props.houseInfo.landlordCommunity.area:''
						        })(
						            <Input disabled={this.state.disable} />
						        )}
			          		</FormItem>
		        		</Col>
		        		<Col xl={8} lg={12}>
			          		<FormItem label='房源面积' style={{marginBottom: '5px'}} {...formItemLayout2}>
			          			{getFieldDecorator('type', {
						            rules: [{ required: false}],
						            initialValue:this.props.houseInfo.houseResource.area+'㎡'
						        })(
						            <Input disabled={this.state.disable} />
						        )}
			          		</FormItem>
		        		</Col>
		        		<Col xl={8} lg={12}> 
			          		<FormItem label='楼层' style={{marginBottom: '5px'}} {...formItemLayout2}>
			          			{getFieldDecorator('type', {
						            rules: [{ required: false}],
						            initialValue:this.props.houseInfo.houseResource.floor
						        })(
						            <Input disabled={this.state.disable} />
						        )}
			          		</FormItem>
		        		</Col>
		        		<Col xl={8} lg={12}>
			          		<FormItem label='户型' style={{marginBottom: '5px'}} {...formItemLayout2}>
			          			{getFieldDecorator('type', {
						            rules: [{ required: false}],
						            initialValue:this.props.houseInfo.houseResource.houseType
						        })(
						            <Input disabled={this.state.disable} />
						        )}
			          		</FormItem>
		        		</Col>
		        		<Col xl={8} lg={12}>
			          		<FormItem label='付款方式' style={{marginBottom: '5px'}} {...formItemLayout2}>
			          			{getFieldDecorator('type', {
						            rules: [{ required: false}],
						            initialValue:this.props.houseInfo.resourceRentprice?(this.props.houseInfo.resourceRentprice.monthPrice?'月付':(this.props.houseInfo.resourceRentprice.quarterPrice?'季付':'年付')):''
						        })(
						            <Input disabled={this.state.disable} />
						        )}
			          		</FormItem>
		        		</Col>
		        		<Col xl={8} lg={12}  md={10}>
			          		<FormItem label='申请安装门锁' style={{marginBottom: '5px'}} {...formItemLayout}>
			          			{getFieldDecorator('type', {
						            rules: [{ required: false}],
						            initialValue:this.props.houseInfo.isApplyDoorLock
						        })(
						            <Input disabled={this.state.disable} />
						        )}
			          		</FormItem>
		        		</Col>
		        		<Col xl={8} lg={12}>
			          		<FormItem label='配套' style={{marginBottom: '5px'}} {...formItemLayout2}>
			          			{getFieldDecorator('type', {
						            rules: [{ required: false}],
						            initialValue:this.setFaclity()
						        })(
						            <Input disabled={this.state.disable} />
						        )}
			          		</FormItem>
		        		</Col>
		        	</Row>
		      	</Form>
		)
  	}
}
const HouseInfo = Form.create()(HouseInfoForm);


export default HouseInfo;