/* eslint-disable */
import React from 'react';
import { Form, Row, Col, Input} from 'antd';
import API from '../../api';
import emitter from '../../utils/events';
import styles from '../work/mywork.css';

const FormItem = Form.Item;
/*房东基本信息*/
class HouseAdminInfoForm extends React.Component {
  	constructor(props) {
    	super(props);
	    this.state = {
	      	disable:true
	    };
	}
  	handleChange = (value) => {
  		//console.log(`Selected: ${value}`);
  	}
  	onChangeRadio = () => {
  		
  	}
  	render() {
  		const { getFieldDecorator } = this.props.form;
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
		          		<FormItem label='姓名' style={{marginBottom: '5px'}} {...formItemLayout2}>
		          			{getFieldDecorator('landlordName', {
					            rules: [{ required: false}],
					            initialValue:this.props.landlordInfo.landlordUser?this.props.landlordInfo.landlordUser.name:''
					        })(
					            <Input disabled={this.state.disable} />
					        )}
		          		</FormItem>
	        		</Col>
	        		<Col xl={8} lg={12}>
		          		<FormItem label='性别' style={{marginBottom: '5px'}} {...formItemLayout2}>
		          			{getFieldDecorator('phone', {
					            rules: [{ required: false}],
					            initialValue:this.props.landlordInfo.landlordUser?(this.props.landlordInfo.landlordUser.sex === 2?'女':(this.props.landlordInfo.landlordUser.sex === 1?'男':'无')):''
					        })(
					            <Input disabled={this.state.disable} />
					        )}
		          		</FormItem>
	        		</Col>
	        		<Col xl={8} lg={12}>
		          		<FormItem label='是否结婚' style={{marginBottom: '5px'}} {...formItemLayout2}>
		          			{getFieldDecorator('communityName', {
					            rules: [{ required: false}],
					            initialValue:this.props.landlordInfo.landlordUser?(this.props.landlordInfo.landlordUser.sex === 1?'已婚':(this.props.landlordInfo.landlordUser.sex === 2?'未婚':(this.props.landlordInfo.landlordUser.sex === 3?'离异':'无'))):''
					        })(
					            <Input disabled={this.state.disable} />
					        )}
		          		</FormItem>
	        		</Col>
	        		<Col xl={8} lg={12}>
		          		<FormItem label='身份证' style={{marginBottom: '5px'}} {...formItemLayout2}>
		          			{getFieldDecorator('type', {
					            rules: [{ required: false}],
					            initialValue:this.props.landlordInfo.landlordUser?this.props.landlordInfo.landlordUser.cardId:''
					        })(
					            <Input disabled={this.state.disable} />
					        )}
		          		</FormItem>
	        		</Col>
	        		<Col xl={8} lg={12}>
		          		<FormItem label='居住地址' style={{marginBottom: '5px'}} {...formItemLayout2}>
		          			{getFieldDecorator('type', {
					            rules: [{ required: false}],
					            initialValue:this.props.landlordInfo.landlordUser?this.props.landlordInfo.landlordUser.oftenPlace:''
					        })(
					            <Input disabled={this.state.disable} />
					        )}
		          		</FormItem>
	        		</Col>
	        	</Row>
	      </Form>
	    );
	}
}
const HouseAdminInfo = Form.create()(HouseAdminInfoForm);

export default HouseAdminInfo;