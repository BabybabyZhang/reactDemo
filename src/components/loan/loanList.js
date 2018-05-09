/* eslint-disable */
import React from 'react';
import style from './loanList.less';
import { Form, Select, Input, Button ,Table ,Divider,Modal,Row,Col,Radio} from 'antd';
import { Link,hashHistory } from 'dva/router';
import API from '../../api';
import emitter from '../../utils/events';
import BaseJs from '../../assets/base.js';
const confirm = Modal.confirm;
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
class LoanList extends React.Component {
	constructor(props) {
		super(props);
	}
	render(){
		return (
		  	<div>
			  	<div className={style.search_content} style={{marginTop:'0px'}}>
			    	<Search />
			    </div>
			    <div className={style.search_content}>
			    <Button type="primary" href="/home/houseAdministration/houseList" style={{float:'right',marginRight:'4%',marginTop:'20px',marginBottom:'20px',}}>新增</Button>
			    	<EditableTables that={this} />
			    </div>
		    </div>
	    );
	}  
};

export default LoanList;
//房东状态：1 为有效    2 为失效
class SearchConent extends React.Component {
    handleSubmit = (e) => {
	    e.preventDefault();
	    this.props.form.validateFields((err, values) => {
	        if (!err) {
	            emitter.emit('changeMessage', values);
	        }
	    });
	}

    handleReset = () => {
 		this.props.form.resetFields();
    }
 
    render() {
        const { getFieldDecorator,setFields } = this.props.form;
	    return (
	        <Form onSubmit={this.handleSubmit} style={{marginBottom:'20px'}}>
		        <Row gutter={24}>
			        <Col xl={20} xxl={20}>
				        <FormItem 
			        		labelCol={{span:2}}
			        		wrapperCol={{ span: 20 }}
				        	label="贷款状态"
			        	>
				            {getFieldDecorator(`PropertyCategory`,{initialValue:1 })(
							    <RadioGroup>
							        <Radio value={1}>放款审核</Radio>
							        <Radio value={2}>已逾期</Radio>
							        <Radio value={3}>未完结</Radio>
							        <Radio value={4}>为代偿</Radio>
							    </RadioGroup>
				            )}
				        </FormItem>
			        </Col>
			      	<Col xl={8} xxl={8}>
				        <FormItem label="订单号" {...formItemLayout} >
				          {getFieldDecorator('Order', {
				            rules: [{ required: false, message: 'Please input your note!' }],
				          })(
				            <Input placeholder="请输入订单号" />
				          )}
				        </FormItem>
			        </Col>
			        <Col xl={8} xxl={8}>
				        <FormItem label="手机号" {...formItemLayout} >
				          {getFieldDecorator('tel', {
				            rules: [
				            { 
				            	required: false,
				            	validator(rule, values, callback){
				            		if( values != undefined ){
				            			if (!(/^1[3|4|5|8|7][0-9]\d{4,8}$/.test(values))) {
									        callback('请输入正确手机号');
									         setTimeout(() => {
												setFields({
												  tel: {
												    value: '',
												      },
												   });
												},1000);
									        return ;
								        }else{
								        	callback();
								        };
				            		}else{
				            			callback();
				            		};
					            }
				            }],
				            validateTrigger:'onBlur'
				          })(
				            <Input placeholder="请输入手机号"  />
				          )}
				        </FormItem>
			        </Col>
			        <Col xl={8} xxl={8}>
				        <FormItem label="房东姓名" {...formItemLayout} >
				          {getFieldDecorator('那么', {
				            rules: [{ required: false, message: 'Please select your gender!' }],
				          })(
				           <Input placeholder="请输入房东姓名"  />
				          )}
				          
				        </FormItem>
			        </Col>
			        <FormItem
			          wrapperCol={{ span: 24 }} 
			          style={{width:'250px',height:'30px',float:'right',display:'block'}}
			        >
			          <Button type="primary" htmlType="submit" >
			            查询
			          </Button>
			          <Button type="primary" htmlType="reset" onClick={this.handleReset} style={{ marginLeft: 8 }} >
			            重置
			          </Button>
			        </FormItem>
		        </Row>
	        </Form>
        );
    }
}

const Search = Form.create()(SearchConent);



//房东列表
const data =[];
class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
		    values: {
		    	name:'',
		    	tel:'',
		    	gender:''
		    },
		    loading: false,
				pagination: {
					current:1,
					pageSize:10
				},
				data:data
		};
    this.columns = [{
      title: '订单号',
      dataIndex: 'orderId',
      width: '8%',
      key:'orderId'
    },
    {
      title: '申请时间',
      dataIndex: 'applyDate',
      key:'applyDate'
    },
    {
      title: '申请房东',
      dataIndex: 'name',
      width: '15%',
      key:'name'
    },
    {
      title: '申请金额(万元)',
      dataIndex: 'applyMoney',
      width: '20%',
      key:'applyMoney'
    },
    {
        title: '贷款期限(月)',
        dataIndex: 'loanTerm',
        width: '20%',
     	key:'loanTerm'
    },
    {
      title: '还款方式',
      dataIndex: 'repayment',
      width: '100',
      key:'repayment'
    },
    {
      title: '到期还款时间',
      dataIndex: 'repaymentDate',
      width: '100',
      key:'repaymentDate'
    },
    {
      title: '实际还款时间',
      dataIndex: 'actualRepaymentDate',
      width: '100',
      key:'actualRepaymentDate'
    },
    {
      title: '还款金额(万)',
      dataIndex: 'repaymentMoney',
      width: '100',
      key:'repaymentMoney'
    },
    {
      title: '还款期数',
      dataIndex: 'repaymentTime',
      width: '100',
      key:'repaymentTime'
    },
    {
      title: '是否逾期',
      dataIndex: 'overdue',
      width: '100',
      key:'overdue'
    },
    {
      title: '逾期手续费',
      dataIndex: 'over',
      width: '100',
      key:'over'
    },
    {
      title: '是否完结',
      dataIndex: 'overduePrice',
      width: '100',
      key:'overduePrice'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '400',
      key:'operation',
      render: (text,record,index) => {
        return (
            <span>
				<a data-id={record.key} onClick={(index)=>this.Update(record.key)} >房东详情</a>
		        <Divider type="vertical" />
		        <a data-id={record.key} onClick={(index)=>this.delete(record.key)}>删除</a>
		    </span>
        );
      },
    }];
    this.cacheData = data.map(item => ({ ...item }));
    this.handleTableChange = this.handleTableChange.bind(this);
    this.Update = this.Update.bind(this);
  }
  Update =( index ) => {
  	let thats = this.props.that;
  	thats.props.history.push({
  			pathname:'/home/houseAdministration/houseList',
  			state:{
  				id:index
  			}
  		})

  }
  delete = (index) => {
  	let _this = this;
  	let obj = {
  		id:index
  	};
  	confirm({
	    title: '确定房东失效吗?',
	    content: '失效后将。。。。。',
	    okText: '确认',
	    okType: 'danger',
	    cancelText: '取消',
	    onOk() {
	      API.delLandlord(obj).then( res=> {
	      	_this.ajax();
	      })
	      .catch( error =>{
	      	
	      })
	    },
	    onCancel() {
	    },
	  });
  }
  Look = (index) => {
  }
  Sh = (index) => {
  }
  ajax(){
  	let obj = {
    	name:this.state.values.name ? this.state.values.name :'',
    	phone:this.state.values.tel ? this.state.values.tel :'', 
    	status:this.state.values.gender ? this.state.values.gender :'',
    	pageNum:this.state.pagination.current ?this.state.pagination.current :'',
    	pageSize:10
    };
    this.setState({ loading: true });
   	API.landlordList(obj).then(res => {
    	let data_list = [];
    	if( res.data.data != null ){
    		res.data.data.forEach(function(i,e){
	    		let abnormal = '';
	    		switch(i.abnormal){
	    			case 1:
	    				abnormal = '未审核';
	    				break;
	    			case 2:
	    				abnormal = '审核通过';
	    				break;
	    			case 3:
	    				abnormal = '审核不通过';
	    				break;
	    			case 4:
	    				abnormal = '打回';
	    				break;	
	    			case 5:
	    				abnormal = '无效';
	    				break;	
	    			default:
	    				abnormal = '无效';
	    				break;	
	    		}
		    	data_list.push({
				    key: i.id,
				    id:e,
				    housename:i.name ,
				    tel:i.phone,
				    address: i.oftenPlace ,
				    date:BaseJs.formatDate(i.signingStartTime) ,
				    state:abnormal,
				    operation:e.id
				  });
	    	});
    	}
    	const pagination = { ...this.state.pagination };
    	pagination.total = res.data.count;
    	this.setState({
	        loading: false,
	        data:data_list,
	        pagination,
        });
		}).catch(error => {
			/*this.updateLoading(false)
		    this.TAlert({
		      show: true,
		      content: '服务器出错了，请稍后再试',
		      cancel: false,
		      onSure: function (){}
		  })*/
		});
  }
  componentDidMount(){
    emitter.addListener('changeMessage', (values) => {
	    this.setState({
	        values,
	    },()=> {
	    	this.ajax();
			});
    });
    this.ajax();
  }
	componentWillUnmount (pagination) {  
    //当组件将要卸载的时候，退订信息  
    emitter.removeListener('changeMessage',()=>{
    	
    });
  };  

  handleTableChange (pagination, filters, sorter) {
    const pager = pagination;
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    },()=> {
    	this.ajax();
		});
  }

  render() {
    return  <Table 
    			size="small"
    			loading={this.state.loading}
				dataSource={this.state.data}
		    	pagination={this.state.pagination} 
		    	columns={this.columns} 
		    	style={{width:'94%',margin:' 0 auto',marginTop:' 50px',marginBottom:'30px'}}
		    	onChange={this.handleTableChange}
	    	/>;
  }

}

const EditableTables = EditableTable;
