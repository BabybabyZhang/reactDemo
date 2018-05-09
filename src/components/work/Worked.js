/* eslint-disable */
import React from 'react';
import { Form, Row, Col, Input, Button,Table,Select,message } from 'antd';
import API from '../../api';
import { connect } from 'dva';
import emitter from '../../utils/events';
import styles from './mywork.css';

const FormItem = Form.Item;
const Option = Select.Option;
/*创建搜索表单*/
class AdvancedSearchForm extends React.Component {
  	constructor(props){
		super(props);
		this.state = {
			
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
      			emitter.emit('changeWorkedList', values);
      		}
    	});
  	}
  	handleReset = () => {
    	this.props.form.resetFields();
  	}
  	handleChange = (value) => {
  		//console.log(`Selected: ${value}`);
  	}
  	renderChild = () => {
  		let children = [];
  		let arr = ['房东入驻','贷款审核','房源新增审核'];
  		for (let i = 0; i < arr.length; i++) {
  			children.push(<Option key={i+1}>{arr[i]}</Option>);
		}
  		return children;
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
		          		<FormItem label='任务号'>
		          			{getFieldDecorator('taskNo', {
					            rules: [{ required: false}],
					        })(
					            <Input placeholder="请输入任务号" />
					        )}
		          		</FormItem>
	        		</Col>
	        		<Col xl={8} lg={12}>
		          		<FormItem label='任务标题'>
		          			{getFieldDecorator('instanceName', {
					            rules: [{ required: false}],
					        })(
					            <Input placeholder="请输入任务标题" />
					        )}
		          		</FormItem>
	        		</Col>
	        		<Col xl={8} lg={12}>
		          		<FormItem label='流程名称'>
		          			{getFieldDecorator('instanceType', {
					            rules: [{ required: false}],
					        })(
					            <Select
						          	size="large"
						          	onChange={this.handleChange}
						          	style={{ width: 200 }}
						        >
						          {this.renderChild()}
						        </Select>
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
				  	title: '任务号',
				  	dataIndex: 'taskNo',
				  	
				},{
				  	title: '任务类型',
				  	className: 'column-money',
				  	/*dataIndex: 'instanceName',*/
				  	render:(record) => {
				  		if(record.type == 1){
				  			return '房东入驻'
				  		}else if(record.type == 2){
				  			return '房东贷款申请'
				  		}else if(record.type == 3){
				  			return '房源新增审核'
				  		}
				  	}
				},{
				  	title: '任务反馈',
				  	dataIndex: 'targetName',
				},{
				  	title: '反馈时间',
				  	//dataIndex: 'createTime',
				  	render:(record) => this.renderTime(record.createTime)
				},{
				  	title: '任务状态',
				  	dataIndex: 'status',
				  	render:() => '已处理'
				},{
					title:'操作',
					render: () => (
						<div className={styles.btnWrap}>
							<button>已处理</button>
						</div>
					) 
				}
	      	],
            values: {
            	taskNo:'',
            	instanceName:'',
            	instanceType:''
            },
            loading: false,
			pagination: {
				current:1,
				pageSize:10
			},
			accountId:null
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
					type:2,
					accountId:this.state.accountId
				}
				this.getList(obj)
			})
				
		}
	}
    componentDidMount(){
	    this.eventEmitter = emitter.addListener('changeWorkedList', (values) => {
	    	const pager = {
	    		current:1,
	    		pageSize:10
	    	};
		    this.setState({
		        values,
		        pagination:pager
		    },() => {
		    	let obj = {
			    	taskNo:this.state.values.taskNo,
			    	instanceName:this.state.values.instanceName,
			    	instanceType:this.state.values.instanceType,
			    	pageNum:this.state.pagination.current,
			    	pageSize:10,
			    	type:2,
			    	accountId:this.state.accountId
			    };
			    this.setState({ loading: true });
			    this.getList(obj)
		    });
			    
	    });
	} 
  	handleTableChange (pagination, filters, sorter) {
  		//console.log(pagination);
    	const pager = pagination;
    	pager.current = pagination.current;
	    this.setState({
	      pagination: pager,
	    },() => {
	    	let obj = {
	    		taskNo:this.state.values.taskNo,
		    	instanceName:this.state.values.instanceName,
		    	instanceType:this.state.values.instanceType,
		    	pageNum:this.state.pagination.current,
		    	pageSize:10,
		    	type:2,
		    	accountId:this.state.accountId
		    };
			this.setState({ loading: true });
			this.getList(obj)
	    });
		    
	}
    getList (obj) {
    	let _this = this;
    	this.props.dispatch({
			type:'loading/updateTable',
			tableLoading:true
		})
    	API.todoTaskList(obj)
        .then(res => {
            //console.log(res)
            this.props.dispatch({
				type:'loading/updateTable',
				tableLoading:false
			})
	      	this.props.dispatch({
  				type:'loading/update',
  				loading:false
  			})
            if((res.status == 200) && (res.data.success)){
            	let list = res.data.data;
            	const pagination = { ...this.state.pagination };
            	pagination.total = res.data.count;
            	this.setState({
		        	loading: false,
		        	data:list,
		        	pagination,
		      	});
            }else{
            	message.error(res.data.msg?res.data.msg:'请求出错了',3)
            }
        }).catch(error => {
        	this.props.dispatch({
				type:'loading/updateTable',
				tableLoading:false
			})
	      	this.props.dispatch({
  				type:'loading/update',
  				loading:false
  			})
        })
    }
    /*添加按钮*/
    handleAdd () {
    	
  	}
  	renderTime(time){
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
        		<Table 
        		columns={this.state.columns} 
        		dataSource={this.state.data}
        		loading={this.props.loading.tableLoading}
		    	pagination={this.state.pagination} 
		    	style={{width:'94%',margin:' 0 auto',marginTop:' 50px'}}
		    	onChange={this.handleTableChange}
		    	rowKey={record => record.id} 
		    	size="small"
        		bordered />
      		</div>
    	);
  	}
  	componentWillUnmount () {  
    	//当组件将要卸载的时候，退订信息  
     	emitter.removeAllListeners('changeWorkedList',() => {
     		this.eventEmitter = '';
     	});
  	}
}
const WrappedTables = connect(mapStateToProps)(Tables);
class Worked extends React.Component{
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
function mapStateToProps({loading}) {
    return {loading};
}

export default Worked;