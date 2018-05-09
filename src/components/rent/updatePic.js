/* eslint-disable */
import React from 'react';
import { Form,Input, Button,Select,message,Table,Progress} from 'antd';
import API from '../../api';
import { connect } from 'dva';
import qs from 'qs';
import Axios from 'axios';
import styles from '../work/mywork.css';

const FormItem = Form.Item;
const Option = Select.Option;
class UpdateFrom extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
		    contentInputValue:4,
			dataSource:[
				{
			      	id:0,
				  	fileName: '',
				  	type:4,
				  	filePath:'',
				  	progress:0,
				}
			],
			columns: [
				{
			  		title: '序号',
			  		width:'25%',
			  		key:'index',
			  		render:( text, record ,index) => index
				}, {
			  		title: '附件类型',
			  		width:'25%',
			  		render:( text,record ) => (
			  			<div>
			  				<Select
			          			style={{ width: '90%' }}
			          			placeholder = '请选择附件类型'
			          			defaultValue="合同"
			        		>
			          			<Option value={4}>合同</Option>
			        		</Select>	
			  			</div> 
			  		)
				}, {
			  		title: '附件名称',
			  		width:'25%',
			  		render:( text, record)=>(
			  			<div>
			  				{record.id ? <span>{record.fileName?record.fileName.split('/')[1]:''}</span> : (record.progress?<Progress percent={record.progress} status="active" />:'')  
			  				}
			  		</div>
			  		),
				},{
					title: '操作',
					width:'25%',
					render: ( text, record ,index) => {
						return(
							<div className={styles.btnWrap}>
					    		{record.filePath != '' ? (<div><button  onClick={(e,recode,num) => this.delete(e,record,index)}>删除</button><button className="ant-dropdown-link"  onClick={(e,recode) => this.openImg(e,record)}>查看</button></div>) :
						    		<button onClick={(e,recode,num) => this.getKey(e,record,index)}>上传</button>}
				    		</div>
						)
			  		},
				}
			],
			currentObj:{},
			currentIndex:0,
			accountId:'',
			loading:false,
		};
		this.onChange = this.onChange.bind(this);
		this.picParameter = {};
	}
	componentWillMount() {
		this.props.sendThis(this)
		console.log(this.props.loading.url)
		if(window.sessionStorage.getItem('loginMsg')){
			let userObj = JSON.parse(window.sessionStorage.getItem('loginMsg'));
			this.setState({
				accountId:userObj.id
			})
			if(JSON.stringify(this.props.updateObj) != '{}'){
				let sendObj = {
					id:this.props.updateObj.id,
					accountId:userObj.id
				};
				this.getList(sendObj)
			}
		}
	}
	/*进入页面时获取图片列表*/
	getList = (obj) => {
		this.setState({loading:true})
		let _this = this;
		API.RentPicList(obj)
		.then(res => {
			this.setState({loading:false})
			if(res.data.success){
				let list = res.data.list;
				if(list){
					const newData = {
					  	id:0,
					  	fileName:'' ,
					  	filePath:'',
					  	type:4,
					  	progress:0,
				    };
				    list.push(newData)
					_this.setState({
						dataSource:list
					})
					console.log(_this.state.dataSource)
				}
			}else{
				message.error(res.data.msg?res.data.msg:'请求出错了',3)
			}
		}).catch( error => {
			this.setState({loading:false})
		});
	}
	/*上传完成后添加一条表格数据*/
	addFj = () => {
		const dataSource = this.state.dataSource;
		let length = dataSource.length;
    	const newData = {
		  	id:0,
		  	fileName:'' ,
		  	filePath:'',
		  	type:4,
		  	progress:0,
	    };
	    let _this = this;
	    this.setState({
	      dataSource: [...dataSource, newData],
	    });
	}
	componentDidMount(){
		
	}
	getKey = (e,obj,index) => {
		let _this = this;
		this.setState({
			currentObj:obj,
			currentIndex:index,
		},() => {
			_this.refs.file_list.click();
		})
	}
	/*删除图片*/
	delete = (e,obj,index) => {
		e.preventDefault();
		this.setState({loading:true});
		let _this = this;
		
		let response = {
			attachId:obj.id,
			type:4,
			contractRentId:_this.props.updateObj.id
		};
		this.setState({loading:true},() => {
			API.delAttach(response).then(res =>{
				this.setState({loading:false});
				if(res.data.success){
					let poress = _this.state.dataSource;
					poress.splice(index,1)
					this.setState({
						dataSource:poress
					});
					message.success('删除成功',3)
				}else{
					message.error(res.data.msg?res.data.msg:'请求出错了',3)
				}
			}).catch( error => {
				this.setState({loading:false});
			});
		})
			
	}
	openImg = (event,obj) => {  
		let responseObj = {
			id:obj.id
		};
		this.setState({loading:true});
		API.lookAttach(responseObj).then(res =>{
			this.setState({loading:false});
			if(res.data.success){
				window.open(res.data.data)
			}else{
				message.error(res.data.msg?res.data.msg:'请求出错了',3)
			}
		}).catch( error => {
			this.setState({loading:false});
		});
	}
	onChange = () => {
		let _this = this;
		let index = this.state.currentIndex;
		console.log(index)
		let arr = this.state.dataSource;
		arr[index].progress = 1;
		// this.state.dataSource[index].progress = 1;
		this.setState({
			dataSource:arr
		},() => {
			const picobj ={
				type:4
			};
			this.token(index)
		})		 
  	}
  	/*上传图片后把信息传给后台*/
  	sendInfo = (index,obj) => {
  		let _this = this;
  		Axios({
			method: 'post',
			url:'/upload/addAttach',
			data:qs.stringify(obj),
			onUploadProgress:(progressEvent)=>{
				let poress = _this.state.dataSource;
				poress[index].progress = 75;
				_this.setState({
					dataSource:poress
				});	
			},
		})
		.then(res => {
			this.setState({loading:false})
			if((res.status == 200) && (res.data.success)){
				let poress = _this.state.dataSource;
				poress[index].progress = 100;
				_this.setState({
					dataSource:poress
				});
				let data = res.data.data;
				
				setTimeout(()=>{
					let poress = _this.state.dataSource;
					poress[index].progress = 0;
					//let file = _this.refs.file_list.files[0]; //获取图片资源
					//let filename = file.name;
					poress[index].fileName = data.fileName;
					// poress[index].fileName = filename;
					poress[index].filePath = data.filePath;
					poress[index].id = data.id;
					_this.setState({
						dataSource:poress
					}, () => {
						_this.refs.file_list.value = '';
					});
					// 图片上传完成后，再添加一栏可上传的表格
					_this.addFj()
				},300);
			}else{
				message.error(res.data.msg?res.data.msg:'请求出错了',3)
			}	
		})
		.catch(error => {
			this.setState({loading:false})
		})
  	}
  	/*获取token*/
  	token = (index) => {
  		let _this = this;
  		this.setState({loading:true})
  		// eslint-disable-next-line
  		OSS.urllib.request(_this.props.loading.url+"/file/getToken",
                    {method: 'GET'}, 
                    function (err, response) {
                        if (err) {
                        	_this.setState({loading:false})
                            return message.error(err);
                        }
                        try {
                            var result = JSON.parse(response);
                        } catch (e) {
                        	_this.setState({loading:false})
                            return message.error('parse sts response info error: ' + e.message);
                        }
                        if(result.StatusCode == 200){
                        	let poress = _this.state.dataSource;
							poress[index].progress = 25;
							_this.setState({
								dataSource:poress
							},() => {
								_this.updateOss(result,index)
							});
                        }else{
                            _this.setState({loading:false})
                        }
                        
                    });
  	}
  	updateOss = (obj,index) => {
  		let _this = this;
  		let file = this.refs.file_list.files[0];
  		let storeAs = 'contract/'+file.name;
  		// eslint-disable-next-line
  		let client = new OSS.Wrapper({
            accessKeyId: obj.AccessKeyId,
            accessKeySecret: obj.AccessKeySecret,
            stsToken: obj.SecurityToken,
            endpoint: 'http://oss-cn-qingdao.aliyuncs.com',
            bucket: 'zhujiatest'
        });
        client.multipartUpload(storeAs, file).then(function (result) {
        	if(result.res.statusCode == 200){
        		let poress = _this.state.dataSource;
				poress[index].progress = 50;
				_this.setState({
					dataSource:poress
				});
				let params = {
			    	fileName:result.name,
			    	type:4,
			    	contractRentId:_this.props.updateObj.id
			    };
	        	_this.sendInfo(index,params)
        	}else{
        		_this.setState({loading:false})
        	}
      	}).catch(function (err) {
        	console.log(err);
        	_this.setState({loading:false})
      	});
  	}
	render(){
		return (
			<div style={{marginTop:'20px',marginBottom:'20px'}}>
				<Table 
					dataSource={this.state.dataSource} 
					columns={this.state.columns} 
					pagination={false} 
					bordered 
					size="small"
					rowKey={record => record.id}
					loading={this.state.loading} 
				/>
				<input ref="file_list" type="file" style={{display:'none'}} onChange={this.onChange}   /> 
			</div>
		)
	}
}
const WrapUpdateFroms = Form.create()(UpdateFrom);
const WrapUpdateFrom = connect(mapStateToProps)(WrapUpdateFroms);
function mapStateToProps({loading}) {
    return {loading};
}
export default WrapUpdateFrom;