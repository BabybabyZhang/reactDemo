/* eslint-disable */
import React from 'react';
import { Form,Input, Button,Select,message,Table,Progress} from 'antd';
import API from '../../api';
import { connect } from 'dva';
import qs from 'qs';
import Axios from 'axios';
import styles from '../work/mywork.css';
import css from './house.css';
const FormItem = Form.Item;
const Option = Select.Option;
class UpdateFrom extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
		    contentInputValue:3,
			dataSource:[
				{
			      	id:0,
				  	fileName: '',
				  	type:3,
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
			  		render:( text,record ) => {
			  			let str = '';
			  			if((record.fileType == 1) || (record.fileType ==2)){
			  				return (<div>身份证</div>)
			  			}else{
			  				return (<div>
						  				<Select
						          			style={{ width: '90%' }}
						          			placeholder = '请选择附件类型'
						          			defaultValue="房产证"
						        		>
						          			<Option value={3}>房产证</Option>
						        		</Select>	
						  			</div>)
			  			}
			  		}
				}, {
			  		title: '附件名称',
			  		width:'25%',
			  		render:( text, record)=> {
			  			if(record.fileType == 1){
			  				return (<div>正面</div>)
			  			}else if(record.fileType == 2){
			  				return (<div>反面</div>)
			  			}else{
			  				return (<div>
							  			{record.id ? <span>{record.fileName?record.fileName.split('/')[1]:''}</span> : (record.progress?<Progress percent={record.progress} status="active" />:'')  
							  				}
							  		</div>)
			  			}  			
			  		}
				},{
					title: '操作',
					width:'25%',
					render: ( text, record ,index) => {
						if((record.fileType == 1) || (record.fileType ==2)){
							return (<div className={styles.btnWrap}>
					    		{record.filePath != '' ? (<div><button className="ant-dropdown-link"  onClick={(e,recode) => this.openImg(e,record)}>查看</button></div>) :''
						    		}
				    			</div>)
						}else{
				    		return(<div className={styles.btnWrap}>
						    		{record.filePath != '' ? (props.taskId?(<div><button  onClick={(e,recode,num) => this.delete(e,record,index)}>删除</button><button className="ant-dropdown-link"  onClick={(e,recode) => this.openImg(e,record)}>查看</button></div>):<div><button className="ant-dropdown-link"  onClick={(e,recode) => this.openImg(e,record)}>查看</button></div>) :
							    		<button onClick={(e,recode,num) => this.getKey(e,record,index)}>上传</button>}
					    		</div>)
						}	
			  		},
				}
			],
			currentObj:{},
			currentIndex:'',
			accountId:'',
			loading:false,
			img_url:'',
			visible:false,
			marginTop:0,
			width:0,
			height:0,
		};
		this.onChange = this.onChange.bind(this);
		this.picParameter = {};
	}
	componentWillMount() {
		this.props.sendThis(this)
		if(window.sessionStorage.getItem('loginMsg')){
			let userObj = JSON.parse(window.sessionStorage.getItem('loginMsg'));
			this.setState({
				accountId:userObj.id
			})
			if(JSON.stringify(this.props.houseId) != '{}'){
				let sendObj = {
					houseResId:this.props.houseId,
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
		API.AttachList(obj)
		.then(res => {
			this.setState({loading:false})
			if(res.data.success){
				let list = res.data.list;
				if(list){
					if(this.props.taskId){
						const newData = {
						  	id:0,
						  	fileName:'' ,
						  	filePath:'',
						  	fileType:3,
						  	progress:0,
					    };
					    list.push(newData)
					}
					_this.setState({
						dataSource:list
					})
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
		  	fileType:3,
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
		this.setState({
			currentObj:obj,
			currentIndex:index,
		},() => {
			this.refs.file_list.click();
		})
	}
	/*删除图片*/
	delete = (e,obj,index) => {
		e.preventDefault();
		let _this = this;
		let response = {
			attachId:obj.id
		};
		this.setState({loading:true},() => {
			API.delAttach(response).then(res =>{
				_this.setState({loading:false})
				if(res.data.success){
					let poress = _this.state.dataSource;
					poress.splice(index,1)
					this.setState({
						dataSource:poress
					},() => {
						this.props.sendThis(this)
					});
					message.success('删除成功',3)
				}else{
					message.error(res.data.msg?res.data.msg:'请求出错了',3)
				}
			}).catch( error => {
				_this.setState({loading:false})
			});
		})	
	}
	openImg = (event,obj) => {  
		let responseObj = {
			id:obj.id
		};
		let _this = this;
		this.setState({loading:true})
		API.lookAttach(responseObj).then(res =>{
			this.setState({loading:false})
			if(res.data.success){
				//window.open(res.data.data)
				let $tempImg = new Image();
				$tempImg.src = res.data.data;
				let sourceWidth,realityHeight,wind_height,wind_width,margt;
				$tempImg.onload = function () {
				    sourceWidth = this.naturalWidth; // 在没有加入文档前，jQuery无法获得正确宽高，但可以通过原生属性来读取
					realityHeight = this.naturalHeight;
					wind_height = document.body.offsetHeight;
					wind_width = document.body.offsetWidth;
					margt = '';
					if( sourceWidth > wind_width || realityHeight > wind_height  ){
						if( sourceWidth > realityHeight ){
							sourceWidth = wind_width;
							realityHeight = sourceWidth/wind_width*realityHeight;
						}else{
							realityHeight = wind_height;
							sourceWidth = realityHeight/wind_height*sourceWidth;
						}
					};
					margt = (wind_height-realityHeight)/2;
					_this.setState({
				      visible: true,
				      img_url:res.data.data,
				      marginT:margt+'px',
				      width:sourceWidth+'px',
				      height:realityHeight+'px',
				    });
				};
			}else{
				message.error(res.data.msg?res.data.msg:'请求出错了',3)
			}
		}).catch( error => {
			this.setState({loading:false})
		});
	}
	onChange = () => {
		let _this = this;
	  	this.setState({
			loading:false
		});
		let index = this.state.currentIndex;
		let arr = this.state.dataSource;
		arr[index].progress = 1;
		// this.state.dataSource[index].progress = 1;
		this.setState({
			dataSource:arr
		},() => {
			const picobj ={
				type:3
			};
			this.token(index)
		})
  	}
  	/*上传图片后把信息传给后台*/
  	sendInfo = (index,obj) => {
  		Axios({
			method: 'post',
			url:'/upload/addAttach',
			data:qs.stringify(obj),
			onUploadProgress:(progressEvent)=>{
				let poress = this.state.dataSource;
				poress[index].progress = 75;
				this.setState({
					dataSource:poress
				});	
			},
		})
		.then(res => {
			this.setState({loading:false})
			if((res.status == 200) && (res.data.success)){
				let poress = this.state.dataSource;
				poress[index].progress = 100;
				this.setState({
					dataSource:poress
				});
				let data = res.data.data;
				this.refs.file_list.value = '';
				setTimeout(()=>{
					let poress = this.state.dataSource;
					poress[index].progress = 0;
					poress[index].fileName = data.fileName;
					poress[index].filePath = data.filePath;
					poress[index].id = data.id;
					this.setState({
						dataSource:poress
					},() => {
						this.props.sendThis(this)
					});
					// 图片上传完成后，再添加一栏可上传的表格
					this.addFj()
					
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
							});
                            _this.updateOss(result,index)
                        }else{
                            _this.setState({loading:false})
                        }
                        
                    });
  	}
  	updateOss = (obj,index) => {
  		let _this = this;
  		let file = this.refs.file_list.files[0];
  		let storeAs = 'houseProperty/'+file.name;
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
			    	type:3,
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
  	close = () => {
		this.setState({
	      visible: false,
	      marginT:0+'px',
	      width:0+'px',
	      height:0+'px',
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
				<div className={css.show_img} style={{display:this.state.visible ? 'block' : 'none'}}>
					<div className={css.imgMask}></div>
					<div className={css.close} onClick={this.close}></div>
					<div className={css.imgWrap} style={{marginTop:this.state.marginT,width:this.state.width,height:this.state.height}}><img src={this.state.img_url}  /></div>
				    
				</div> 
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

