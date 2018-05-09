/* eslint-disable */
import React from 'react';
import { Form,Input, Button,Select,message} from 'antd';
import API from '../../api';

const FormItem = Form.Item;
const Option = Select.Option;
class UserFrom extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			accountId:'',
			loading:false,
			options:[],
			roleNameArr:[],
			roleCodeArr:[],
			id:'',//修改用户的id
			statusOption:[
				{
					value:0,
					name:'否'
				},{
					value:1,
					name:'是'
				}
			],
			statusOptionArr:[],
		}
	}
	componentWillMount(){
		this.setStatusOption()
		this.props.sendThis(this)
		this.getRoleName()
		if(window.sessionStorage.getItem('loginMsg')){
			let userObj = JSON.parse(window.sessionStorage.getItem('loginMsg'));
			this.setState({
				accountId:userObj.id
			})
			if(JSON.stringify(this.props.updateObj) != '{}'){
				let roleNameStr = this.props.updateObj.roleName;
				let roleCodeStr = this.props.updateObj.roleCode;
				if(roleNameStr && roleCodeStr){
					let arr = roleNameStr.split(',');
					let codeArr = roleCodeStr.split(',');
					this.setState({
						roleNameArr:arr,
						roleCodeArr:codeArr,
					})
				}
				let id = this.props.updateObj.id;
				this.setState({

					id:id
				})
			}
		}		
	}
	componentWillReceiveProps(nextProps) {
	   //console.log('componentWillReceiveProps',nextProps)
	}
	componentDidMount(){
		//console.log('componentDidMount')
	}
	handleSearch = (e) => {
		this.setState({
        	loading: true,
      	});
		e.preventDefault();
    	this.props.form.validateFields((err, values) => {
      		//console.log('Received values of form: ', values);
      		let obj = values;
      		obj.accountId = this.state.accountId;
      		if(this.state.id){
      			obj.id = this.state.id;
      		}
      		this.saveFrom(obj)
      		//this.props.updateModal(false)
    	});
	}
	/*调用修改的接口*/
	saveFrom = (obj) => {
		API.UserUpdate(obj)
  		.then(res => {
  			this.setState({
	        	loading: false,
	      	});
  			if((res.status == 200) && (res.data.success)){
            	this.props.updateModal(false,true)
            }else{
            	message.error(res.data.msg?res.data.msg:'请求出错了',3)
            }
  		}).catch(error => {
  			this.setState({
	        	loading: false,
	      	});
	      	
        })
	}
	handleChange = (value) => {
		
	}
	handleChangeState = (value) => {
		
	}
	/*获取角色名称*/
  	getRoleName = () => {
  		API.RoleName()
        .then(res => {
        	this.setState({
	        	loading: false,
	      	});
            if((res.status == 200) && (res.data.success)){
            	let list = res.data.list;
            	let arr = [];
            	for(let i =0;i<list.length;i++){
            		arr.push(<Option key={i} value={list[i].roleCode}>{list[i].roleName}</Option>)
            	}
            	this.setState({
		        	options:arr,
		      	});
            }
        }).catch(error => {
        	this.setState({
	        	loading: false,
	      	});
	      	
        })
  	}
  	/*设置状态选项*/
  	setStatusOption = () =>{
  		let arr = [];
  		let item = this.state.statusOption;
  		for(let i = 0; i < item.length; i++){
  			arr.push(<Option key={i} value={item[i].value}>{item[i].name}</Option>)
  		}
  		this.setState({
  			statusOptionArr:arr
  		})
  	}
	render(){
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
	      	labelCol: { span: 6 },
	      	wrapperCol: { span: 14 },
	    };
		return (
      		<Form
      			layout="horizontal"
	        	className="ant-advanced-search-form"
	        	onSubmit={::this.handleSearch}
	        	
	      	>
          		<FormItem label='用户名' {...formItemLayout}>
          			{getFieldDecorator('userName', {
			            rules: [
			            	{ 	
			            		required: true,
			            		massage:'请输入用户名'
			            	},
			            	{	
			            		pattern:/^[0-9a-zA-Z]{6,12}$/,
			            		message:'用户名的正确格式是6-12位的字母或数字'
			            	}
			            ],
			            initialValue:this.props.updateObj.userName
			        })(
			            <Input placeholder="请输入6-12位的字母或数字" />
			        )}
          		</FormItem>
          		<FormItem label='角色' {...formItemLayout}>
          			{getFieldDecorator('roleCodes', {
			            rules: [{ required: true,massage:'请选择角色',type: 'array'}],
			            initialValue:this.state.roleCodeArr
			        })(
			            <Select
						    mode="multiple"
						    placeholder="请选择角色"
						    onChange={this.handleChange}
						>
						    {this.state.options}
						</Select>
			        )}
          		</FormItem>
          		<FormItem label='邮箱' {...formItemLayout}>
          			{getFieldDecorator('mailbox', {
			            rules: [{ required: true,massage:'请输入邮箱名'}],
			            initialValue:this.props.updateObj.mailbox
			        })(
			            <Input placeholder="请输入邮箱名" />
			        )}
          		</FormItem>
    			<FormItem label='移动电话' {...formItemLayout}>
          			{getFieldDecorator('phone', {
			            rules: [{ required: true,massage:'请输入移动电话'}],
			            initialValue:this.props.updateObj.phone
			        })(
			            <Input placeholder="请输入移动电话" />
			        )}
          		</FormItem>
          		<FormItem label='是否有效' {...formItemLayout}>
          			{getFieldDecorator('status', {
			            rules: [{ required: true,massage:'请选择是否有效',type: 'number'}],
			            initialValue:this.props.updateObj.status
			        })(
			            <Select
						    placeholder="请选择是否有效"
						    onChange={this.handleChangeState}
						>
						    {this.state.statusOptionArr}
						</Select>
			        )}
          		</FormItem>
          		<FormItem wrapperCol={{ span: 6, offset: 10 }}>
            		<Button loading={this.state.loading} type="primary" htmlType="submit">保存</Button>
	            </FormItem>
	      	</Form>
		)
	}
	componentWillUnmount(){
		console.log('要被清除了')
	}
}
const WrapUserFrom = Form.create()(UserFrom);
export default WrapUserFrom;