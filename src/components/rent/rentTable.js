/* eslint-disable */
import React from 'react';
import { Form, Row, Col, Input, Button,Table,message,Radio,Modal} from 'antd';
import API from '../../api';
import emitter from '../../utils/events';
import { connect } from 'dva';
import UpdatePic from './updatePic'
import styles from '../work/mywork.css';

/*创建表格*/
class RentTables extends React.Component {
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
					accountId:this.state.accountId,
					resourceId:this.props.location.state.id
				}
				this.getList(obj)
			})	
		}
	}
    componentDidMount(){
	    
	} 
  	handleTableChange = (pagination, filters, sorter) => {
  		//console.log(pagination);
    	const pager = pagination;
    	pager.current = pagination.current;
	    this.setState({
	      pagination: pager,
	    },() => {
	    	let obj = {
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
    	API.HouseRend(obj)
        .then(res => {
            //console.log(res)
            this.props.dispatch({
				type:'loading/updateTable',
				tableLoading:false
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
  	/*查看合同*/
	update = (e,obj) => {
  		this.setState({
  			modalVisible:true,
  			updateObj:obj,
  		})
  	}
	afterCloseFun = () => { 
		if(this.state.saveFlag){
			let obj = {
				pageNum:1,
				pageSize:10,
				accountId:this.state.accountId,
				resourceId:this.props.location.state.id
			}
			this.getList(obj)
		}
	}
	cancelFun = () => { 

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
      		<div className={styles.rentTable}>
        		<Table 
	        		columns={this.state.columns} 
	        		dataSource={this.state.data}
	        		loading={this.props.loading.tableLoading}
			    	pagination={this.state.pagination} 
			    	style={{width:'94%',margin:' 0 auto'}}
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
}
function mapStateToProps({loading}) {
    return {loading};
}
const RentTable = connect(mapStateToProps)(RentTables);
export default RentTable;