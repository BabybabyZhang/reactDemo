/* eslint-disable */
import React from 'react';
import { Form, Row, Col, Input, Button,Table,Select,Checkbox,Radio,Modal,message} from 'antd';
import API from '../../api';
import { connect } from 'dva';
import RoleFrom from './roleFrom'
import emitter from '../../utils/events';
import styles from '../work/mywork.css';

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
/*创建搜索表单*/
class AdvancedSearchForm extends React.Component {
  	constructor(){
		super()
		this.state = {
			options:[
				{
					label: '业务角色',
					value: '0'
				},{
					label: '管理员', 
					value: '1'
				}
			],
			radioValue:'',
		}
	}
  	handleSearch = (e) => {
    	e.preventDefault();
    	this.props.form.validateFields((err, values) => {
      		//console.log('Received values of form: ', values);
      		if(err){

      		}else{
      			this.props.dispatch({
      				type:'loading/update',
      				loading:true
      			})
      			emitter.emit('changeRoleList', values);
      		}
    	});
  	}
  	handleReset = () => {
    	this.props.form.resetFields();
  	}
  	handleChange = (value) => {
  		//console.log(`Selected: ${value}`);
  	}
  	onChangeRadio(){

  	}
  	onChange(){

  	}
  	render() {
  		const { getFieldDecorator } = this.props.form;
	    return (
	      	<Form
	        	className="ant-advanced-search-form"
	        	onSubmit={this.handleSearch}
	        	layout="inline"
	      	>
	        	<Row gutter={24}>
	        		<Col xl={8} lg={12}>
		          		<FormItem label='是否有效'>
		          			{getFieldDecorator('status', {
					            rules: [{ required: false}],
					        })(
					            <RadioGroup onChange={this.onChangeRadio}>
							        <Radio value={1}>是</Radio>
							        <Radio value={0}>否</Radio>
							    </RadioGroup>
					        )}
		          		</FormItem>
	        		</Col>
	        		<Col xl={8} lg={12}>
		          		<FormItem label='关键信息'>
		          			{getFieldDecorator('key', {
					            rules: [{ required: false}],
					        })(
					           <Input placeholder="请输入关键信息" /> 
					        )}
		          		</FormItem>
	        		</Col>
	        	</Row>
	        	<Row>
	          		<Col span={24} style={{ textAlign: 'right' }}>
	            		<Button type="primary" htmlType="submit" loading={this.props.loading.loading}>查询</Button>
	           		 	<Button style={{ marginLeft: 8 }} type="primary" onClick={this.handleReset}>
	              			重置
	            		</Button>
	          		</Col>
	        	</Row>
	      </Form>
	    );
	  }
}
const WrappedAdvancedSearchForm = Form.create()(AdvancedSearchForm);
const WrappedFrom = connect(mapStateToProps)(WrappedAdvancedSearchForm);
/*创建表格*/
class Tables extends React.Component {
  	constructor(props) {
    	super(props);
	    this.state = {
	      	data:[],
	      	columns:[
	      		{
				  	title: '序号',
				  	dataIndex:'index'
				},{
				  	title: '角色',
				  	className: 'column-money',
				  	dataIndex: 'roleName',
				},{
				  	title: '角色编码',
				  	dataIndex: 'roleCode',
				},{
				  	title: '是否有效',
				  	//dataIndex: 'createTime',
				  	render:(record) => {
				  		if(record.status){
				  			return '是';
				  		}else{
				  			return '否';
				  		}
				  	}
				},{
					title:'操作',
					render: (record) => {
						let str = '';
						if(record.status){//说明角色有效
							str = '禁用';
						}else{
							str = '启用';
						}
						return (
						<div className={styles.btnWrap}>
							<button onClick={(e,recode) => this.update(e,record)}>修改</button>
							<button onClick={(e,recode) => this.delete(e,record)}>{str}</button>
						</div>
					)} 
				}
	      	],
            values: {
            	status:'',
            	key:''
            },
            loading: false,
			pagination: {
				current:1,
				pageSize:10
			},
			accountId:'',
			modalVisible:false,
			updateObj:{},//点击修改时，所选用户的详情
			childThis:'',
			saveFlag:false,//子组件调用接口后关闭弹窗
	    };
	    this.cacheData = this.state.data.map(item => ({ ...item }));
    	this.handleTableChange = this.handleTableChange.bind(this);
	}
	componentWillMount(){
		if(window.sessionStorage.getItem('loginMsg')){
			let userObj = JSON.parse(window.sessionStorage.getItem('loginMsg'));
			this.setState({
				accountId:userObj.id
			},() => {
				let obj = {
					pageNum:1,
					pageSize:10,
					type:1,
					accountId:this.state.accountId
				}
				this.getList(obj)
			})	
		}
	}
    componentDidMount(){
	    this.eventEmitter = emitter.addListener('changeRoleList', (values) => {
	    	const pager = {
	    		current:1,
	    		pageSize:10
	    	};
		    this.setState({
		        values,
		        pagination:pager
		    },() => {
		    	let obj = {
			    	status:this.state.values.status,
			    	key:this.state.values.key,
			    	pageNum:this.state.pagination.current,
			    	pageSize:10,
			    	accountId:this.state.accountId
			    };
			    this.getList(obj)
		    }); 
	    });
	} 
  	handleTableChange = (pagination, filters, sorter) => {
  		//console.log(pagination);
    	const pager = pagination;
    	pager.current = pagination.current;
	    this.setState({
	      pagination: pager,
	    },() => {
	    	let obj = {
				status:this.state.values.status,
				key:this.state.values.key,
		    	pageNum:this.state.pagination.current,
		    	pageSize:10,
		    	accountId:this.state.accountId
		    };
			this.getList(obj)
	    }); 
	}
    getList = (obj) => {
    	let _this = this;
    	this.setState({ loading: true });
    	API.RoleList(obj)
        .then(res => {
            //console.log(res)
            this.setState({
	        	loading: false,
	      	});
	      	this.props.dispatch({
  				type:'loading/update',
  				loading:false
  			})
            if((res.status == 200) && (res.data.success)){
            	let list = res.data.data;
            	const pagination = { ...this.state.pagination };
            	pagination.total = res.data.count;
            	if(list){
            		list.map((item,index) => {
	            	    if(index < 10){
            				item.index = (_this.state.pagination.current-1)+''+index;
            			}else{
            				item.index = index;
            			}
	            	            	})
	            	
            	}
            	this.setState({
		        	data:list,
		        	pagination,
		      	});          	
	            	
            }else{
            	message.error(res.data.msg?res.data.msg:'请求出错了',3)
            }
        }).catch(error => {
        	this.setState({
	        	loading: false,
	      	});
	      	this.props.dispatch({
  				type:'loading/update',
  				loading:false
  			})
        })
    }
    /*添加按钮*/
    handleAdd = () => {
    	this.setState({
			modalVisible:true,
			updateObj:{},
		})
  	}
  	/*修改角色*/
  	update = (event,obj) => {
  		this.setState({
  			modalVisible:true,
  			updateObj:obj,
  		})
  	}
  	/*删除、恢复角色*/
  	delete = (event,objs) => {
  		let obj = {
      		roleCode:objs.roleCode,
      		accountId:this.state.accountId
      	};
      	let str = '';
      	if(objs.status){//说明角色是有效状态，该请求是禁用角色
      		obj.type = 1;
      		str = '确认要禁用该角色么？';
      	}else{
      		obj.type = 2;
      		str = '确认要启用该角色么？'
      	}
      	let _this = this;
  		Modal.confirm({
		    title: '提示',
		    content: str,
		    okText: '确认',
		    cancelText: '取消',
		    onOk:() => {
		    	_this.deleteFun(obj)
		    }
		});
      	/*
      	this.setState({
        	loading: true,
      	});
  		API.RoleDelete(obj)
  		.then(res => {
  			this.setState({
	        	loading: false,
	      	});
  			if((res.status == 200) && (res.data.success)){
  				let obj = {
					status:this.state.values.status,
					key:this.state.values.key,
			    	pageNum:this.state.pagination.current,
			    	pageSize:10,
			    	accountId:this.state.accountId
			    };
				this.getList(obj)
            }else{
            	message.error(res.data.msg?res.data.msg:'请求出错了',5)
            }
  		}).catch(error => {

        })*/
  	}
  	/*删除、恢复调用的方法*/
  	deleteFun = (obj) => {
  		API.RoleDelete(obj)
  		.then(res => {
  			if((res.status == 200) && (res.data.success)){
  				let obj = {
					status:this.state.values.status,
					key:this.state.values.key,
			    	pageNum:this.state.pagination.current,
			    	pageSize:10,
			    	accountId:this.state.accountId
			    };
				this.getList(obj)
            }else{
            	message.error(res.data.msg?res.data.msg:'请求出错了',5)
            }
  		}).catch(error => {

        })
  	}
  	/*点击弹窗关闭*/
  	cancelFun = () => {
		this.setState({
			modalVisible:false,
			saveFlag:false
		})
	}
	/*监听子组件关闭弹窗*/
	updateModal = (flag,saveFlag) => {
		this.setState({
			modalVisible:flag,
			saveFlag
		})
	}
	/*获取子组件的this*/
	sendThis = that => {
		this.setState({
			childThis:that
		})
	}
	/*在弹窗关闭后，刷新列表*/
	afterCloseFun = () => {
		let obj = {
			status:this.state.values.status,
			key:this.state.values.key,
	    	pageNum:this.state.pagination.current,
	    	pageSize:10,
	    	accountId:this.state.accountId
	    };
	    if(this.state.saveFlag){
	    	this.getList(obj)
	    }
		let that = this.state.childThis;
		that.props.form.resetFields()
	}
  	renderTime = time => {
  		let date = new Date(time);
  		let Y = date.getFullYear() + '-';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
        let h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
        let m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes() ) + ':';
        let s = date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds();
        //console.log(Y+M+D+h+m+s)
        return Y+M+D+h+m+s;
  	}
  	render() {
    	return (
      		<div className={styles.tableWrapChild}>
        		<Button type="primary" onClick={this.handleAdd} style={{float:'right',marginRight:'4%',marginBottom:'20px',zIndex:1000}}>新增</Button>
        		<Table 
        		columns={this.state.columns} 
        		dataSource={this.state.data}
        		loading={this.state.loading}
		    	pagination={this.state.pagination} 
		    	style={{width:'94%',margin:' 0 auto',marginTop:' 20px'}}
		    	onChange={this.handleTableChange}
		    	rowKey={record => record.id} 
		    	size="small"
        		bordered />
        		<Modal
	          		title=""
	          		wrapClassName="vertical-center-modal"
	          		visible={this.state.modalVisible}
	          		afterClose={this.afterCloseFun}
	          		onCancel={() => this.cancelFun()}
	          		footer={null}
	          		maskClosable={false}
	        	>
	        		<RoleFrom updateObj={this.state.updateObj} updateModal={(flag,saveFlag) => this.updateModal(flag,saveFlag)} sendThis={that => this.sendThis(that)} />
	        	</Modal>
      		</div>
    	);
  	}
  	componentWillUnmount () {  
    	//当组件将要卸载的时候，取消监听  
     	emitter.removeAllListeners('changeRoleList',() => {
     		this.eventEmitter = '';
     	});
  	}
}
const WrappedTables = connect(mapStateToProps)(Tables);
class RoleList extends React.Component{
	render(){
		return (
		    <div>
		    	<div className={styles.formWrap}>
			        <WrappedFrom />
			    </div>
			    <div className={styles.tableWrap}>
			    	<WrappedTables />
			    </div>
		    </div>
		);
	}	  
};

// const MyWork = Form.create()(MyWorkCon);
function mapStateToProps({loading}) {
  	return {loading};
}
export default RoleList;