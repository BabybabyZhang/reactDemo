/* eslint-disable */
import React from 'react';
import { Form, Row, Col, Input, Button,Table,Radio,message} from 'antd';
import API from '../../api';
import { connect } from 'dva';
import emitter from '../../utils/events';
import styles from '../work/mywork.css';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
/*创建搜索表单*/
class AdvancedSearchForm extends React.Component {
  	constructor(props) {
    	super(props);
	}
	componentWillMount(){
		
	}
  	handleSearch = (e) => {
    	e.preventDefault();
    	this.props.form.validateFields((err, values) => {
      		//console.log('Received values of form: ', values);
      		if(err){
      			return ;
      		}else{
      			this.props.dispatch({
      				type:'loading/update',
      				loading:true
      			})
      			emitter.emit('changeResourceList', values);
      		}
    	});
  	}
  	handleReset = () => {
    	this.props.form.resetFields();
  	}
  	onChangeRadio = () => {
  		
  	}
  	render() {
  		const { getFieldDecorator,getFieldsValue } = this.props.form;
	    return (
	      	<Form
	        	className="ant-advanced-search-form"
	        	onSubmit={this.handleSearch}
	        	layout="inline"
	      	>
	        	<Row gutter={24}>
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
		          		<FormItem label='手机号'>
		          			{getFieldDecorator('phone', {
					            rules: [{ required: false}],
					        })(
					            <Input placeholder="请输入手机号" />
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
		          		<FormItem label='是否空置'>
		          			{getFieldDecorator('isRent', {
					            rules: [{ required: false}],
					        })(
					            <RadioGroup onChange={this.onChangeRadio}>
							        <Radio value={0}>是</Radio>
							        <Radio value={1}>否</Radio>
							    </RadioGroup>
					        )}
		          		</FormItem>
	        		</Col>
	        		<Col xl={8} lg={12}>
		          		<FormItem label='是否贷款中'>
		          			{getFieldDecorator('isLoan', {
					            rules: [{ required: false}],
					        })(
					            <RadioGroup onChange={this.onChangeRadio}>
							        <Radio value={1}>是</Radio>
							        <Radio value={0}>否</Radio>
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
				  	title: '编号',
				  	dataIndex: 'index',
				},{
				  	title: '小区名',
				  	dataIndex: 'communityName',
				},{
				  	title: '门牌号',
				  	dataIndex: 'resourceName',
				},{
				  	title: '房东',
				  	dataIndex: 'landlordName',
				},{
				  	title: '手机号',
				  	dataIndex: 'phone',
				}/*,{
				  	title: '已安装门锁',
				  	//dataIndex:'updateTime',
				  	render:(record) => record.resourceStatus
				}*/,{
				  	title: '是否空置',
				  	render:(record) => {
				  		if(record.isRent){
				  			return '否';
				  		}else{
				  			return '是'
				  		}
				  	}
				},{
				  	title: '是否贷款中',
				  	//dataIndex:'updateTime',
				  	render:(record) => {
				  		if(record.isLoan){
				  			return '是';
				  		}else{
				  			return '否'
				  		}
				  	}
				},{
					title:'操作',
					render: (record) => {
						return (<div className={styles.btnWrap}>
									<button onClick={(e,recode) => this.infoClick(e,record)}>查看</button>
									{
										record.isRent?<button onClick={(e,recode) => this.rentClick(e,record)}>查看合同</button>:''
									}
								</div>)	
					} 
				}
	      	],
            values: {
            	landlordName:'',
            	phone:'',
            	communityName:'',
            	isLoan:'',
            	isRent:'',
            },
            loading: false,
			pagination: {
				current:1,
				pageSize:10
			},
			accountId:'',//登录的id
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
					pageSize:this.state.pagination.pageSize,
					accountId:this.state.accountId
				}
				this.getList(obj)
			})		
		}
	}
    componentDidMount(){
	    emitter.addListener('changeResourceList', (values) => {
	    	const pager = {
	    		current:1,
	    		pageSize:10
	    	};
		    this.setState({
		        values:values,
		        pagination:pager
		    },() => {
		    	let obj = {
			    	landlordName:this.state.values.landlordName,
			    	phone:this.state.values.phone,
			    	communityName:this.state.values.communityName,
			    	isLoan:this.state.values.isLoan,
			    	isRent:this.state.values.isRent,
			    	accountId:this.state.accountId,
			    	pageNum:1,
			    	pageSize:this.state.pagination.pageSize
			    };
			    this.setState({ loading: true });
			    this.getList(obj)
		    });
			    
	    });
	} 
  	handleTableChange (pagination, filters, sorter) {
    	const pager = pagination;
    	pager.current = pagination.current;
	    this.setState({
	      pagination: pager,
	    },() => {
	    	let obj = {
	    		landlordName:this.state.values.landlordName,
				phone:this.state.values.phone,
				communityName:this.state.values.communityName,
				isLoan:this.state.values.isLoan,
				isRent:this.state.values.isRent,
		    	accountId:this.state.accountId,
		    	pageNum:this.state.pagination.current,
		    	pageSize:this.state.pagination.pageSize
		    };
			this.setState({ loading: true });
			this.getList(obj)
	    });
	}
    getList (obj) {
    	let _this = this;
    	this.setState({
        	loading: true,
      	});
    	API.HouseReList(obj)
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
  	infoClick = (event,obj) => {
  		let that = this.props.that;
  		that.props.history.push({
  			pathname:'/home/houseResources/houseResourceDetail',
  			state:{
  				id:obj.resourceId
  			}
  		})
  		//this.props.history.push('/home/houseResources/houseResourceDetail')
  		//window.location.hash = '/home/houseResources/houseResourceDetail?id='+obj.resourceId;
  	}
  	rentClick = (event,obj) => {
  		let that = this.props.that;
  		that.props.history.push({
  			pathname:'/home/rent/rentTable',
  			state:{
  				id:obj.resourceId
  			}
  		})
  	}
  	render() {
    	return (
      		<div className={styles.tableWrapChild}>
        		<Table 
        		columns={this.state.columns} 
        		dataSource={this.state.data}
        		loading={this.state.loading}
		    	pagination={this.state.pagination} 
		    	style={{width:'94%',margin:' 0 auto',marginTop:' 50px'}}
		    	onChange={this.handleTableChange}
		    	rowKey={record => record.index} 
		    	size="small"
        		bordered />
      		</div>
    	);
  	}
  	componentWillUnmount () {  
    	//当组件将要卸载的时候，取消监听  
     	emitter.removeAllListeners('changeResourceList',() => {
     		
     	});
  	}
}
const WrappedTables = connect(mapStateToProps)(Tables);
class HouseResourceList extends React.Component{
	constructor(props) {
    	super(props);
	}
	render(){
		return (
		    <div>
		    	<div className={styles.formWrap}>
			        <WrappedFrom that={this} />
			    </div>
			    <div className={styles.tableWrap}>
			    	<WrappedTables that={this} />
			    </div>
		    </div>
		);
	}	  
};

// const MyWork = Form.create()(MyWorkCon);
function mapStateToProps({loading}) {
  	return {loading};
}

export default connect(mapStateToProps)(HouseResourceList);

// <Col xl={8} lg={12}>
// 		<FormItem label='已安装门锁'>
// 			{getFieldDecorator('type', {
//             rules: [{ required: false}],
//         })(
//             <RadioGroup onChange={this.onChangeRadio}>
// 		        <Radio value={1}>是</Radio>
// 		        <Radio value={0}>否</Radio>
// 		    </RadioGroup>
//         )}
// 		</FormItem>
// </Col>