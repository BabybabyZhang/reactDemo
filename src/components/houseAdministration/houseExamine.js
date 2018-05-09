/* eslint-disable */
import React from 'react';
import style from './houseExamine.less';
import { Form, Select, Input, Button, message ,Table ,Divider,Modal} from 'antd';
import { Link,hashHistory } from 'dva/router';
import API from '../../api';
import emitter from '../../utils/events';
import BaseJs from '../../assets/base.js';
const confirm = Modal.confirm;
class HouseExamine extends React.Component {
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

export default HouseExamine;
const FormItem = Form.Item;
const Option = Select.Option;
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
      <Form onSubmit={this.handleSubmit} layout='inline' style={{marginBottom:'20px'}}>
        <FormItem
          label="姓名"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 12 }}
          style={{width:'30%'}}
        >
          {getFieldDecorator('name', {
            rules: [{ required: false, message: 'Please input your note!' }],
          })(
            <Input placeholder="姓名" />
          )}
        </FormItem>
        <FormItem
          label="手机号"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 12 }}
          style={{width:'30%'}}
        >
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
       
        <FormItem
          wrapperCol={{ span: 24 }} 
          style={{width:'250px',height:'45px',float:'right',display:'block',marginTop:'20px',marginBottom:'20px'}}
        >
          <Button type="primary" htmlType="submit" >
            查询
          </Button>
          <Button type="primary" htmlType="reset" onClick={this.handleReset} style={{ marginLeft: 8 }} >
            重置
          </Button>
           
        </FormItem>
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
      title: '序号',
      dataIndex: 'id',
      width: '8%',
      key:'id'
    },
    {
      title: '房东名称',
      dataIndex: 'housename',
      key:'housename'
    },
    {
      title: '手机号',
      dataIndex: 'tel',
      width: '15%',
      key:'tel'
    },
    {
      title: '居住地',
      dataIndex: 'address',
      width: '25%',
      key:'address'
    },
    {
      title: '入驻时间',
      dataIndex: 'date',
      width: '25%',
     	key:'date'
    },
   
    {
      title: '操作',
      dataIndex: 'operation',
      width: '400',
      key:'operation',
      render: (text,record,index) => {
        return (
            <span>
				<a data-id={record.key} onClick={(index)=>this.Update(record.key)} >查看</a>
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
	    title: '确定房东删除吗?',
	    content: '',
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
  	let _this = this;
  	let obj = {
    	name:this.state.values.name ? this.state.values.name :'',
    	phone:this.state.values.tel ? this.state.values.tel :'', 
    	pageNum:this.state.pagination.current ?this.state.pagination.current :'',
    	pageSize:10,
    	accountId:JSON.parse(sessionStorage.getItem('loginMsg')).id
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
				    housename:i.name ? i.name : '' ,
				    tel:i.phone ? i.phone :'' ,
				    address: i.oftenPlace != 'undefined' ? i.oftenPlace :'',
				    date:BaseJs.formatDate(i.signingStartTime) ,
				    state:abnormal ? abnormal : '',
				    operation:e.id ? e.id : ''
			    });
			    
	    	});
    	}else{
    		_this.setState({ loading: false });
    		//message.error(res.data.msg?res.data.msg:'请求出错了',3);
    	};
    	const pagination = { ...this.state.pagination };
    	pagination.total = res.data.count;
    	if(data_list){
    		data_list.map((item,index) => {
    			if(index < 10){
    				item.id = (_this.state.pagination.current-1)+''+index;
    			}else{
    				item.id = index;
    			}	
        	})
    	}
    	this.setState({
	        loading: false,
	        data:data_list,
	        pagination,
        });
		}).catch(error => {
			_this.setState({ loading: false });
			//message.error('请求出错了',3)
		    
		});
  }
  componentDidMount(){
  
    emitter.addListener('changeMessage', (values) => {
	   	const pager = {
    		current:1,
    		pageSize:10
    	};
	    this.setState({ 
	        values:values,
	        pagination:pager
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
