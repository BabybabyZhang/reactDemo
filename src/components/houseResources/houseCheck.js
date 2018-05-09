/* eslint-disable */
import React from 'react';
import { Form, Row, Col, Input,Button,Table,Radio,message,Modal} from 'antd';
import API from '../../api';
import emitter from '../../utils/events';
import styles from './house.css';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
/*房源基本信息*/
class HouseInfoForm extends React.Component {
  	constructor(props) {
    	super(props);
	    this.state = {
	      	accountId:'',
	      	loading:false,
	    };
	}
	componentWillMount(){
		if(window.sessionStorage.getItem('loginMsg')){
			let userObj = JSON.parse(window.sessionStorage.getItem('loginMsg'));
			this.setState({
				accountId:userObj.id
			})	
		}
	}
  	handleChange = (value) => {
  		
  	}
  	handleSubmit = () => {
  		let _this = this.props.that;
  		let picThis = _this.state.childThis;
  		console.log(picThis.state.dataSource)
  		let arr = picThis.state.dataSource;
  		let attachIdList = [];
  		arr.map((item,index) => {
  			console.log(item)
  			if((item.id) && (item.fileType == 3)){
  				attachIdList.push(item.id)
  			}
  		})
  		
  		let arrStr = attachIdList.join(',');
  		this.props.form.validateFields((err, values) => {
	      	if (!err) {
	      		
	      		let obj = values;
	      		if(obj.status == 2){
	      			if(!attachIdList.length){
			  			message.error('请先上传房产证图片',3)
			  			return ;
			  		}
	      		}
	      		let arrStr = '';
	      		if(attachIdList.length){
	      			arrStr = attachIdList.join(',');
	      		}
	      		obj.accountId = this.state.accountId;
	      		obj.taskId = _this.props.location.state.taskId; //任务id
	      		obj.id = _this.props.location.state.id; //房源id
	      		obj.taskNo =  _this.props.location.state.taskNo;
	      		obj.attachId = arrStr;//房产证id集合
	      		this.setState({
	      			loading:true
	      		})
	      		API.HouseCheck(obj)
	        	.then(res => {
		            this.setState({
		      			loading:false
		      		})
		            if((res.status == 200) && (res.data.success)){
		            	Modal.confirm({
						    title: '提示',
						    content: (obj.status == 2)?'审核通过':'审核已打回',
						    okText: '确认',
						    cancelText: '取消',
						    onOk:() => {
						    	_this.props.history.push({
						  			pathname:'/home/work/working',
						  		})
						    }
						});  	
		            }else{
		            	message.error(res.data.msg?res.data.msg:'请求出错了',3)
		            } 
		        }).catch(error => {
		        	this.setState({
		      			loading:false
		      		})
		        	
		        })
	      	}
	    });
  	}
  	onChangeRadio = () => {
  		
  	}
  	render() {
  		const { getFieldDecorator } = this.props.form;
  		const formItemLayout = {
	      	labelCol: { span: 2 },
	      	wrapperCol: { span: 8 },
	    };
  		return (
		      	<Form
		      		layout="horizontal"
		        	className="ant-advanced-search-form"
		      	>
	          		<FormItem label='审核结果：' {...formItemLayout}>
	          			{getFieldDecorator('status', {
				            rules: [{ required: true}],
				        })(
				            <RadioGroup onChange={this.onChangeRadio}>
					        	<Radio value={2}>审核通过</Radio>
					        	<Radio value={4}>审核打回</Radio>
					    	</RadioGroup>
				        )}
	          		</FormItem>
	          		<FormItem label='描述：' {...formItemLayout}>
	          			{getFieldDecorator('describtion', {
				            rules: [{ required: false}],
				        })(
				            <TextArea  />
				        )}
	          		</FormItem>
		        	<Row>
		          		<Col span={24} style={{ textAlign: 'center' }}>
		            		<Button type="primary" onClick={this.handleSubmit} loading={this.state.loading}>完成</Button>
		          		</Col>
		        	</Row>
		      	</Form>
		)
  	}
}
class Tables extends React.Component {
  	constructor(props) {
    	super(props);
	    this.state = {
	      	data:[],
	      	columns:[
	      		{
				  	title: '审核人',
				  	dataIndex: 'userName',
				  	
				},{
				  	title: '角色',
				  	dataIndex: 'roleName',
				},{
				  	title: '审核时间',
				  	render:(record) => this.renderTime(record.createTime)
				},{
				  	title: '审核结果',
				  	dataIndex: 'targetName',
				},{
				  	title: '描述',
				  	dataIndex:'remark',
				}
	      	],
            loading: false,
			accountId:'',//登录的id
	    };
	}
	componentWillMount(){
		let _this = this.props.that;
		if(window.sessionStorage.getItem('loginMsg')){
			let userObj = JSON.parse(window.sessionStorage.getItem('loginMsg'));
			this.setState({
				accountId:userObj.id
			},() => {
				let obj = {
					accountId:this.state.accountId,
					houseResId:_this.props.location.state.id,
				}
				this.getList(obj)
			})		
		}
	}
    componentDidMount(){
	   
	} 
  	handleTableChange (pagination, filters, sorter) {
  			
	}
    getList (obj) {
    	let _this = this;
    	API.HouseCheckList(obj)
        .then(res => {
            //console.log(res)
            this.setState({
	        	loading: false,
	      	});
            if((res.status == 200) && (res.data.success)){
            	let list = res.data.data;
            	this.setState({
		        	data:list,
		      	});
            }else{
            	message.error(res.data.msg?res.data.msg:'请求出错了',3)
            }
        }).catch(error => {
        	this.setState({
	        	loading: false,
	      	});
	      	message.error('请求出错了',3)
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
      		<div>
        		<Table 
        		columns={this.state.columns} 
        		dataSource={this.state.data}
        		loading={this.state.loading}
		    	style={{width:'100%',margin:' 0 auto'}}
		    	rowKey={record => record.index} 
		    	size="small"
		    	pagination={false}
        		bordered />
      		</div>
    	);
  	}
  	componentWillUnmount () {  
    	//当组件将要卸载的时候，取消监听  
     	emitter.removeListener('changeWorkList',() => {
     		this.eventEmitter = '';
     	});
  	}
}
const HouseInfo = Form.create()(HouseInfoForm);

class HouseCheck extends React.Component{
	constructor(props) {
    	super(props);
	}
	render(){
		return (
		    <div>
			    <Tables that={this.props.that} />
			   	<HouseInfo that={this.props.that} />
		    </div>
		);
	}	  
};

export default HouseCheck;