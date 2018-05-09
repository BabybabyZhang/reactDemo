/* eslint-disable */
import React from 'react';
import { Form, Row, Col, Input, Button,Table,message,Radio,Modal} from 'antd';
import API from '../../api';
import { connect } from 'dva';
import emitter from '../../utils/events';
import styles from '../work/mywork.css';
import UpdatePic from './updatePic'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
/*创建搜索表单*/
class AdvancedSearchForm extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			options:[],
		}
	}
	componentWillMount(){
		
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
      			emitter.emit('changeRentList', values);
      		}
    	});
  	}
  	handleReset = () => {
    	this.props.form.resetFields();
  	}
  	handleChange = (value) => {
  		//console.log(`Selected: ${value}`);
  	}
  	onChange(checkedValues){
  		//console.log('checked = ', checkedValues);
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
		          		<FormItem label='合同编号'>
		          			{getFieldDecorator('id', {
					            rules: [{ required: false}],
					        })(
					            <Input placeholder="请输入合同编号" />
					        )}
		          		</FormItem>
	        		</Col>
	        		<Col xl={8} lg={12}>
		          		<FormItem label='房东姓名'>
		          			{getFieldDecorator('landlordName', {
					            rules: [{ required: false}],
					        })(
					            <Input placeholder="请输入房东姓名" />
					        )}
		          		</FormItem>
	        		</Col>
	        		<Col xl={8} lg={12}>
		          		<FormItem label='租客姓名'>
		          			{getFieldDecorator('userName', {
					            rules: [{ required: false}],
					        })(
					            <Input placeholder="请输入租客姓名" />
					        )}
		          		</FormItem>
	        		</Col>
	        		<Col xl={8} lg={12}>
		          		<FormItem label='小区名'>
		          			{getFieldDecorator('communityName', {
					            rules: [{ required: false}],
					        })(
					            <Input placeholder="请输入小区名" />
					        )}
		          		</FormItem>
	        		</Col>
	        		<Col xl={8} lg={12}>
		          		<FormItem label='门牌号'>
		          			{getFieldDecorator('resourceName', {
					            rules: [{ required: false}],
					        })(
					            <Input placeholder="请输入门牌号" />
					        )}
		          		</FormItem>
	        		</Col>
	        		<Col xl={8} lg={12}>
		          		<FormItem label='履约完成'>
		          			{getFieldDecorator('type', {
					            rules: [{ required: false}],
					        })(
					            <RadioGroup onChange={this.onChangeRadio}>
							        <Radio value={1}>是</Radio>
							        <Radio value={2}>否</Radio>
							    </RadioGroup>
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
				  	title: '合同编号',
				  	dataIndex: 'id',
				},{
				  	title: '小区名',
				  	dataIndex: 'communityName',
				},{
				  	title: '门牌号',
				  	dataIndex: 'resourceName',
				},{
				  	title: '房东姓名',
				  	dataIndex: 'landlordName',
				},{
				  	title: '租客姓名',
				  	dataIndex:'userName',
				},{
				  	title: '租金（元）',
				  	dataIndex:'amount',
				},{
				  	title: '租期（月）',
				  	dataIndex:'allTenancy',
				},{
				  	title: '合同开始时间',
				  	dataIndex:'startTime',
				},{
				  	title: '合同终止时间',
				  	dataIndex:'endTime',
				},{
				  	title: '已租期数',
				  	dataIndex:'actualTenancy',
				},{
				  	title: '履约完成',
				  	render:(record) => {
				  		if(record.status == 7){
				  			return '否'
				  		}else if(record.status == 9){
				  			return '是'
				  		}
				  	}
				},{
					title:'合同查看',
					render: (record) => {
						return (
						<div className={styles.btnWrap}>
							<button onClick={(e,recode) => this.update(e,record)}>查看</button>
						</div>
					)} 
				}
	      	],
            values: {
            	id:'',
            	landlordName:'',
            	userName:'',
            	communityName:'',
            	resourceName:'',
            	type:'',
            },
            loading: false,
			pagination: {
				current:1,
				pageSize:10
			},
			accountId:'',//登录的id
			updateObj:'',//点击修改时，所选用户的详情
			modalVisible:false,
			saveFlag:false,
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
					accountId:this.state.accountId
				}
				this.getList(obj)
			})	
		}
	}
    componentDidMount(){
	    emitter.addListener('changeRentList', (values) => {
	    	const pager = {
	    		current:1,
	    		pageSize:10
	    	};
		    this.setState({
		        values,
		        pagination:pager
		    },()=>{
		    	//console.log(this.state.values.roleCodes);
			    let obj = {
			    	id:this.state.values.id,
			    	landlordName:this.state.values.landlordName,
			    	userName:this.state.values.userName,
			    	communityName:this.state.values.communityName,
			    	resourceName:this.state.values.resourceName,
			    	type:this.state.values.type,
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
	    		id:this.state.values.id,
				landlordName:this.state.values.landlordName,
				userName:this.state.values.userName,
				communityName:this.state.values.communityName,
				resourceName:this.state.values.resourceName,
				type:this.state.values.type,
		    	pageNum:this.state.pagination.current,
		    	pageSize:10,
		    	accountId:this.state.accountId
		    };
			this.getList(obj)
	    });
		    
	}
    getList = (obj) => {
    	let _this = this;
    	this.props.dispatch({
			type:'loading/updateTable',
			tableLoading:true
		})
    	API.RentList(obj)
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
            	if(list){
            		list.map((item,index) => {
	            	    if(index < 10){
            				item.index = (_this.state.pagination.current-1)+''+index;
            			}else{
            				item.index = index;
            			}
	            	            	})
            	}
            	const pagination = { ...this.state.pagination };
            	pagination.total = res.data.count;
            	this.setState({
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
  	/*查看合同*/
  	update = (e,obj) => {
  		this.setState({
  			modalVisible:true,
  			updateObj:obj,
  		})
  	}
  	renderTime = (time) => {
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
  	cancelFun = () => {
		this.setState({
			modalVisible:false,
			saveFlag:false
		})
	}
	afterCloseFun = () => {
		if(this.state.saveFlag){
			let obj = {
	    		id:this.state.values.id,
				landlordName:this.state.values.landlordName,
				userName:this.state.values.userName,
				communityName:this.state.values.communityName,
				resourceName:this.state.values.resourceName,
				type:this.state.values.type,
		    	pageNum:this.state.pagination.current,
		    	pageSize:10,
		    	accountId:this.state.accountId
		    };
			this.getList(obj)
		}
	}
	updateModal = (flag,saveFlag) => {
		this.setState({
			modalVisible:flag,
			saveFlag:saveFlag
		})
	}
	sendThis = (that) => {

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
	        	<Modal
	          		title=""
	          		wrapClassName="vertical-center-modal"
	          		visible={this.state.modalVisible}
	          		afterClose={this.afterCloseFun}
	          		onCancel={() => this.cancelFun()}
	          		footer={null}
	          		maskClosable={false}
	          		width="60%"
	          		destroyOnClose={true}
	        	>
	        		<UpdatePic updateObj={this.state.updateObj} updateModal={(flag,saveFlag) => this.updateModal(flag,saveFlag)} sendThis={that => this.sendThis(that)} />
	        	</Modal>
      		</div>
    	);
  	}
  	componentWillUnmount () {  
    	//当组件将要卸载的时候，取消监听  
     	emitter.removeAllListeners('changeRentList',() => {
     		
     	});
  	}
}
const WrappedTables = connect(mapStateToProps)(Tables);
class RentList extends React.Component{
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
export default RentList;