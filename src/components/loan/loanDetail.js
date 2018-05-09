/* eslint-disable */
import React from 'react';
import { Form, Row, Col, Input,Spin, Button, Radio,Table,Select,message,Progress } from 'antd';
import API from '../../api';
import styles from './loanDetail.less';
import emitter from '../../utils/events';
import Axios from 'axios';
import qs from 'qs';
import BaseJs from '../../assets/base.js';
import moment from 'moment';
import { connect } from 'dva';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    xs: { span: 5 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 12 },
  },
};
class loanDetail extends React.Component{
	constructor(props) {
    	super(props);
	    this.state = {
	      	data:'',
					accountId:'',//登录的id
					disabled:true,
					disableds:true,
					childThis:'',
					loanDetailData:{},
					occupational:{},
					spousal:{},
					updateObj:{},
					LoanAssessments:[],
					LoanAuditRecords:[],
					loading:true,
	    };
	    this.getInfo = this.getInfo.bind(this);
	}
	componentWillMount(){
		if(window.sessionStorage.getItem('loginMsg')){
			let userObj = JSON.parse(window.sessionStorage.getItem('loginMsg'));
			let obj = {
				  orderId:this.props.location.state.id,
				  accountId:userObj.id
			};
			let orderid = {
					orderid:this.props.location.state.id,
					roleCodes:userObj.roleCodes,
					targetId:this.props.location.state.targetId
			};

			if( this.props.location.state.status == 1 ){
					this.setState({
						  disabled:false,
						  disableds:false
					});
			}else if ( this.props.location.state.status == 2 || this.props.location.state.status == 3 || this.props.location.state.status == 5) {
				  this.setState({
						  disabled:true,
						  disableds:false,
					});
			}else if ( this.props.location.state.status == 4 ) {
					this.setState({
						  disabled:false,
						  disableds:true,
					});
			};
			
			this.setState({
				updateObj:orderid,
			})
			this.getInfo(obj);
		}
	}
	componentDidMount(){
		  
	}
	setloading(staut) {
	    this.setState({
	        loading : staut
	    });
	}

	getInfo(obj){
		let _this = this;
    	API.orderDetail(obj)
        .then(res => {
            if((res.status == 200) && (res.data.success)){
            	let data = res.data.data;
            	let obj = {};
            	obj.loanName = data.loanName;
            	obj.loanAmount = data.loanAmount;
            	obj.timeLimit = data.timeLimit;
            	obj.loanUse = data.loanUse;
            	obj.repaymentSources = data.repaymentSources;
            	switch(data.sex){
								case 1:
								 obj.sex = '男';
								  break;
								case 2:
								 obj.sex= '女';
								  break;
								default:
								 obj.sex= '';
							};
            	switch(data.spouseMarriage){
								case 1:
								 obj.spouseMarriage = '已婚';
								  break;
								case 2:
								    obj.spouseMarriage = '未婚';
								    break;
							    case 3:
								   obj.spouseMarriage = '离异';
								   break;
								default:
								    obj.spouseMarriage = '';
								};
            	obj.cardId = data.cardId;
            	obj.oftenPlace = data.oftenPlace;
            	
            	
            	//职业信息
            	let occupational = {};
            	occupational.workUnits  = data.workUnits;
            	occupational.unitAddress = data.unitAddress;
            	occupational.industry = data.industry;
            	occupational.department = data.department;
            	occupational.jobLevel = data.jobLevel;
            	occupational.unitPhone = data.unitPhone;
            	occupational.monthlySalary = data.monthlySalary;
            	occupational.otherIncomeSources = data.otherIncomeSources;
            	occupational.otherIncome = data.otherIncome;
            	
            	//配偶信息
            	let spousal = {};
            	spousal.spouseName = data.spouseName;
            	spousal.spouseSex  = data.spouseSex; 
            	spousal.spouseCardId = data.spouseCardId;
            	spousal.spouseAccumulationFundLines = data.spouseAccumulationFundLines;
            	spousal.spouseMarriage = data.spouseMarriage;
            	spousal.spouseEducationalBackground = data.spouseEducationalBackground;
            	spousal.spouseNativePlace = data.spouseNativePlace;
            	spousal.spousePhone = data.spousePhone;
            	spousal.spouseOftenPlace = data.spouseOftenPlace;
            	
            	
            	
            	//借款评估
            	let LoanAssessments = [];
            	let LoanAssessmentss = {};
            	
            	//审核记录
            	let LoanAuditRecords = [];
            	let LoanAuditRecordss = {};
            	
            	data.recordList.map(function( e,i ){
            		  LoanAssessmentss = {};
            		  LoanAuditRecordss = {};
            		  LoanAssessmentss.monthlyRent = e.monthlyRent ? e.monthlyRent : '';
            		  LoanAssessmentss.entrustMonths  = e.entrustMonths ? e.entrustMonths :''; 
            		  LoanAssessmentss.totalBorrowingAmount = e.totalBorrowingAmount ? e.totalBorrowingAmount :''; 
            		  LoanAssessmentss.auditAccount = e.auditAccount ? e.auditAccount: '';
            		  LoanAssessmentss.key = i;
            		  LoanAuditRecordss.auditAccount = e.auditAccount ? e.auditAccount:'';
            		  LoanAuditRecordss.roleCode = e.roleCode ? e.roleCode : '';
            		  
            		  let date = e.createTime ? e.createTime : '921600000';
						    	let d = new Date(date);    //根据时间戳生成的时间对象
									let dates = (d.getFullYear()) + "-" + 
									           (d.getMonth() + 1) + "-" +
									           (d.getDate()) + "   "+
									           (d.getHours()) + ":" +
									           (d.getMinutes()) + ":" +
									           (d.getSeconds());
									           
									          
            		  
            		  LoanAuditRecordss.createTime =dates ? dates : '';
            		  LoanAuditRecordss.operation = e.operation ? e.operation : '';
            		  LoanAuditRecordss.remark = e.remark ? e.remark : ''; 
            		  LoanAuditRecordss.key = i;
            		  LoanAssessments.push(LoanAssessmentss);
            		  LoanAuditRecords.push(LoanAuditRecordss);
            		  
            	});
            	
            	
            	_this.setState({
  							loanDetailData:obj,
  							occupational:occupational,
								spousal:spousal,
								LoanAssessments:LoanAssessments,
								LoanAuditRecords:LoanAuditRecords,
								loading:false  					
            	});
            }else{
            	message.error(res.data.msg?res.data.msg:'请求出错了',3);
            	_this.setState({
								loading:false  					
            	});
            }
        }).catch(error => {
        		_this.setState({
								loading:false  					
            });
        })
	}
	sendThis = (that) => {
		this.setState({
			childThis:that
		});
	}
	render(){
		return (
			<div>
				<Spin spinning={this.state.loading} className={styles.loads}>
			    	<div className={styles.wrap}>
			        	<h3>房源基本信息</h3>
				        <div className={styles.formWrap}>
				        	<Row gutter={24} >
				        		<Col xl={6} xxl={6}>
				        			<div className={styles.spans}>
				        				<label>房东&nbsp;:</label>
				        				<span>{this.state.loanDetailData.loanName}</span>
				        			</div>
				        		</Col>
				        		<Col xl={6} xxl={6}>
				        			<div className={styles.spans}>
				        				<label>申请金额(万元)&nbsp;:</label>
				        				<span>{this.state.loanDetailData.loanAmount}</span>
				        			</div>
				        		</Col>
				        		<Col xl={6} xxl={6}>
				        			<div className={styles.spans}>
				        				<label>贷款期限(天)&nbsp;:</label>
				        				<span>{this.state.loanDetailData.timeLimit}</span>
				        			</div>
				        		</Col>
				        		<Col xl={6} xxl={6}>
				        			<div className={styles.spans}>
				        				<label>还款方式&nbsp;:</label>
				        				<span>到期还本付息</span>
				        			</div>
				        		</Col>
				        		<Col xl={6} xxl={6}>
				        			<div className={styles.spans}>
				        				<label>借款用途&nbsp;:</label>
				        				<span>{this.state.loanDetailData.loanUse}</span>
				        			</div>
				        		</Col>
				        		<Col xl={6} xxl={6}>
				        			<div className={styles.spans}>
				        				<label>还款来源&nbsp;:</label>
				        				<span>{this.state.loanDetailData.repaymentSources}</span>
				        			</div>
				        		</Col>
				        	</Row>
			        	</div>
				    </div>
				    <div className={styles.wrap}>
				        <h3>房东信息</h3>
				        <div className={styles.formWrap}>
					        <Row gutter={24} >
				        		<Col xl={8} xxl={8}>
				        			<div className={styles.spans}>
				        				<label>房东姓名&nbsp;:</label>
				        				<span>{this.state.loanDetailData.loanName}</span>
				        			</div>
				        		</Col>
				        		<Col xl={8} xxl={8}>
				        			<div className={styles.spans}>
				        				<label>性别&nbsp;:</label>
				        				<span>{this.state.loanDetailData.sex}</span>
				        			</div>
				        		</Col>
				        		<Col xl={8} xxl={8}>
				        			<div className={styles.spans}>
				        				<label>是否已结婚&nbsp;:</label>
				        				<span>{this.state.loanDetailData.spouseMarriage}</span>
				        			</div>
				        		</Col>
				        		<Col xl={8} xxl={8}>
				        			<div className={styles.spans}>
				        				<label>身份证&nbsp;:</label>
				        				<span>{this.state.loanDetailData.cardId}</span>
				        			</div>
				        		</Col>
				        		<Col xl={8} xxl={8}>
				        			<div className={styles.spans}>
				        				<label>居住地址&nbsp;:</label>
				        				<span>{this.state.loanDetailData.oftenPlace}</span>
				        			</div>
				        		</Col>
				        	</Row>
				        </div>
				    </div>
				    <div className={styles.wrap}>
				    	<h3>房东职业性息</h3>
				    	<div className={styles.formWrap}>
							<OccupationalInformations info={this.state.occupational} ajax_disabled={this.state.disabled} />
			    		</div>
				    </div>
				    <div className={styles.wrap}>
				    	<h3>配偶信息</h3>
				    	<div className={styles.formWrap}>
							<SpousalInformations info={this.state.spousal} ajax_disabled={this.state.disabled} />
				    	</div>
				    </div>
				    <div className={styles.wrap}>
				    	<h3>附件信息</h3>
				    	<div className={styles.formWrap}>
							<Enclosures setloading = {staut => this.setloading(staut)} dis={this.state.disableds}  updateObj={this.state.updateObj}  updateModal={(flag,saveFlag) => this.updateModal(flag,saveFlag)} sendThis={that => this.sendThis(that)} />
			    		</div>
				    </div>
				     <div className={styles.wrap}>
				    	<h3>借款评估</h3>
				    	<div className={styles.formWrap}>
							<LoanAssessment info={this.state.LoanAssessments} />
			    		</div>
				    </div>
				     <div className={styles.wrap}>
				    	<h3>审核记录</h3>
				    	<div className={styles.formWrap}>
								<LoanAuditRecords infos={this.state.LoanAuditRecords} />
			    		</div>
				    </div>
				     <div className={styles.wrap}>
				    	<LoanToExamines orderid={this.state.updateObj} />
				    </div>
				</Spin>
		    </div>
	    )
		
	}	  
};

export default loanDetail;



//房东职业信息
class OccupationalInformation extends React.Component{
	constructor(props) {
    	super(props);
		this.state = {
		    add: 1,
		    valuess:{
		    	oneForm:0,
		    	twoForm:0
		    },
		    data:'',
		};
	}

  componentDidMount(e) {
    // 组件装载完成以后声明一个自定义事件
//  emitter.addListener('formSave', (valuess) => {
//	    this.props.form.validateFields((err, valuess) => {
//	      if (!err) {
//			emitter.emit( 'formSaveOne',valuess );
//	      }
//	    });
//  });
}

componentWillUnmount() {
	emitter.removeAllListeners();
}
	render() {
		const  {getFieldValue,getFieldDecorator,setFields} = this.props.form;
		return (
			<div style={{marginTop:'20px'}}>
			<Form className="ant-advanced-search-form"  >
	        	<Row gutter={24}>
	        		<Col xl={8} xxl={8}>
		          		<FormItem {...formItemLayout} label="工作单位" style={{height:'40px',marginBottom:'23px'}}  >
			     			{getFieldDecorator('workUnit',{
				     			initialValue:this.props.info.workUnits, 
			     			})(
	              				<Input placeholder="请输入工作单位" disabled={this.props.ajax_disabled} />
	          				)}
		    			</FormItem>
	        		</Col> 
					<Col xl={8} xxl={8}>
		          		<FormItem {...formItemLayout} label="单位地址" style={{height:'40px',marginBottom:'23px'}}  >
			     			{getFieldDecorator('unitAddress',{
				     			initialValue:this.props.info.unitAddress, 
			     			})(
	              				<Input placeholder="请输入单位地址" disabled={this.props.ajax_disabled} />
	          				)}
		    			</FormItem>
	        		</Col> 
				 	<Col xxl={8} xl={8}>
					    <FormItem {...formItemLayout} label="所属行业"  >
						    {getFieldDecorator('industry',{initialValue : this.props.info.industry})(
						      <Input placeholder="请输入所属行业" disabled={this.props.ajax_disabled} />
						    )}  
					    </FormItem>
				    </Col>
				 	<Col xxl={8} xl={8}>
					    <FormItem {...formItemLayout} label="工作部门"  >
						    {getFieldDecorator('workDepartment',{initialValue : this.props.info.department})(
						      <Input placeholder="请输入工作部门" disabled={this.props.ajax_disabled} />
						    )}  
					    </FormItem>
				    </Col>
				 	<Col xxl={8} xl={8}>
					    <FormItem {...formItemLayout} label="职位级别"  >
						    {getFieldDecorator('positionLevel',{initialValue : this.props.info.jobLevel})(
						        <Input placeholder="请输入职位级别" disabled={this.props.ajax_disabled}  />
						    )}   
					    </FormItem>
				    </Col>
				    <Col xxl={8} xl={8}>
					    <FormItem {...formItemLayout} label="单位电话"  >
						    {getFieldDecorator('workTelephone',{initialValue : this.props.info.unitPhone})(
						        <Input placeholder="请输入单位电话" disabled={this.props.ajax_disabled}  />
						    )}   
					    </FormItem>
				    </Col>
				    <Col xxl={8} xl={8}>
					    <FormItem {...formItemLayout} label="月薪资"  >
						    {getFieldDecorator('monthlySalary',{initialValue : this.props.info.monthlySalary})(
						        <Input placeholder="请输入月薪资" disabled={this.props.ajax_disabled}  />
						    )}   
					    </FormItem>
				    </Col>
				     <Col xxl={8} xl={8}>
					    <FormItem {...formItemLayout} label="其他收入来源"  >
						    {getFieldDecorator('otherSources',{initialValue : this.props.info.otherIncomeSources})(
						        <Input placeholder="请输入其他收入来源" disabled={this.props.ajax_disabled}  />
						    )}   
					    </FormItem>
				    </Col>
				     <Col xxl={8} xl={8}>
					    <FormItem {...formItemLayout} label="其他收入金额"  >
						    {getFieldDecorator('otherIncome',{initialValue : this.props.info.otherIncome})(
						        <Input placeholder="请输入其他收入金额" disabled={this.props.ajax_disabled}  />
						    )}   
					    </FormItem>
				    </Col>
		        </Row>
		    </Form>
        </div>
	);
  }
}
const OccupationalInformations = Form.create()(OccupationalInformation);


//房东职业信息
class SpousalInformation extends React.Component{
	constructor(props) {
    super(props);
		this.state = {
		    add: 1,
		    valuess:{
		    	oneForm:0,
		    	twoForm:0
		    },
		    data:'',
		    
		};
	}

  componentDidMount(e) {
    // 组件装载完成以后声明一个自定义事件
//  emitter.addListener('formSave', (valuess) => {
//	    this.props.form.validateFields((err, valuess) => {
//	      if (!err) {
//			emitter.emit( 'formSaveOne',valuess );
//	      }
//	    });
//  });
   
}

componentWillUnmount() {
	emitter.removeAllListeners();
}
	render() {
		const  {getFieldValue,getFieldDecorator,setFields} = this.props.form;
		return (
			<div style={{marginTop:'20px'}}>
			<Form className="ant-advanced-search-form"  >
	        	<Row gutter={24}>
	        		<Col xl={8} xxl={8}>
		          		<FormItem {...formItemLayout} label="姓名" style={{height:'40px',marginBottom:'23px'}}  >
			     			{getFieldDecorator('name',{
				     			initialValue:this.props.info.spouseName, 
			     			})(
	              				<Input placeholder="请输入姓名" disabled={this.props.ajax_disabled} />
	          				)}
		    			</FormItem>
	        		</Col> 
					<Col xl={8} xxl={8}>
		          		<FormItem {...formItemLayout} label="性别" style={{height:'40px',marginBottom:'23px'}}  >
			     			{getFieldDecorator('sex' , {
						    	initialValue :this.props.info.spouseSex
						    })(
						      <Select placeholder="请选择性别" disabled={this.props.ajax_disabled} >
						        <Option value={1}>男</Option>
						        <Option value={2}>女</Option>
						      </Select>
						    )}  
		    			</FormItem>
	        		</Col> 
				 	<Col xxl={8} xl={8}>
					    <FormItem {...formItemLayout} label="身份证号"  >
						    {getFieldDecorator('industry',{initialValue : this.props.info.spouseCardId})(
						      <Input placeholder="请输入身份证号" disabled={this.props.ajax_disabled} />
						    )}  
					    </FormItem>
				    </Col>
				 	<Col xxl={8} xl={8}>
					    <FormItem {...formItemLayout} label="社保公积金"  >
						    {getFieldDecorator('workDepartment',{initialValue : this.props.info.spouseAccumulationFundLines })(
						      <Input placeholder="请输入社保公积金" disabled={this.props.ajax_disabled} />
						    )}  
					    </FormItem>
				    </Col>
				 	<Col xxl={8} xl={8}>
					    <FormItem {...formItemLayout} label="婚姻"  >
						   {getFieldDecorator('sex' , {
						    	initialValue :this.props.info.spouseMarriage
						    })(
						      <Select placeholder="请选择婚姻" disabled={this.props.ajax_disabled} >
						        <Option value={1}>已婚</Option>
						        <Option value={2}>未婚</Option>
						        <Option value={3}>离异</Option>
						      </Select>
						    )}    
					    </FormItem>
				    </Col>
				    <Col xxl={8} xl={8}>
					    <FormItem {...formItemLayout} label="学历"  >
						    {getFieldDecorator('workTelephone',{initialValue : this.props.info.spouseEducationalBackground})(
						        <Input placeholder="请输入学历" disabled={this.props.ajax_disabled}  />
						    )}   
					    </FormItem>
				    </Col>
				    <Col xxl={8} xl={8}>
					    <FormItem {...formItemLayout} label="户籍住址"  >
						    {getFieldDecorator('monthlySalary',{initialValue : this.props.info.spouseNativePlace})(
						        <Input placeholder="请输入户籍住址" disabled={this.props.ajax_disabled}  />
						    )}   
					    </FormItem>
				    </Col>
				     <Col xxl={8} xl={8}>
					    <FormItem {...formItemLayout} label="移动电话"  >
						    {getFieldDecorator('otherSources',{initialValue : this.props.info.spousePhone})(
						        <Input placeholder="请输入移动电话" disabled={this.props.ajax_disabled}  />
						    )}   
					    </FormItem>
				    </Col>
				     <Col xxl={8} xl={8}>
					    <FormItem {...formItemLayout} label="居住地址"  >
						    {getFieldDecorator('otherIncome',{initialValue : this.props.info.spouseOftenPlace })(
						        <Input placeholder="请输入居住地址" disabled={this.props.ajax_disabled}  />
						    )}   
					    </FormItem>
				    </Col>
		        </Row>
		    </Form>
        </div>
	);
  }
}
const SpousalInformations = Form.create()(SpousalInformation);

class Enclosure extends React.Component{
	constructor(props) {
			super(props);
			this.contentInputValue = 5;
			this.state = {
				marginT:'',
				width:'',
				height:'',
				visible:false,
				img_url:'',
				dataSource:[
					{
			      id:0,
				  	fileName: '',
				  	fileType:'5',
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
			  		render:( text,record,index ) => {
			  				let name = '';
			  				switch(record.fileType)
							{
							case '1':
							  name = '身份证正面';
							  break;
							case '2':
							  name = '身份证反面';
							  break;
							case '3':
							  name = '房产证';
							  break;
							case '4':
							  name = '租赁合同';
							  break;
							case '5':
							  name = '房屋托管合同';
							  break;
							case '6':
							  name = '代偿合同';
							  break;
							case '7':
							  name = '担保合同';
							  break;
							default:
							  name = '';
							}
			  			return (
			  				<div>
				  				{record.fileName == '' ? <Select
				          			style={{ width: '90%' }}
				          			placeholder = '请选择附件类型'
				          			defaultValue="房屋托管合同"
				          			onChange={(e,recode,num) => this.onChangeSelect(e,record,index)}
				        		>
				          			<Option value={5}>房屋托管合同</Option>
				          			<Option value={6}>代偿合同</Option>
				          			<Option value={7}>担保合同</Option>
				        		</Select>  :<div>{name}</div>	}
			  			</div> 
			  		)}
				}, {
			  		title: '附件名称',
			  		width:'25%',
			  		render:( text, record)=>(
			  			<div>
		  					{record.id ? <span>{record.fileName?record.fileName:''}</span> : (record.progress?<Progress percent={record.progress} status="active" />:'')}
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
				}],
			currentObj:{},
			currentIndex:'',
			accountId:'',
			loading:false,
		};
		this.onChange = this.onChange.bind(this);
		this.onChangeSelect = this.onChangeSelect.bind(this);
		this.picParameter = {};
		this.close = this.close.bind(this);
		this.openImg = this.openImg.bind(this);
	}
	componentWillReceiveProps(nextProps){
		console.log(nextProps);
		if( nextProps.dis == false ){
			this.setState({
				dataSource:[]
			})
		}
			

	}
	componentWillMount() {
		this.props.sendThis(this)
		if(window.sessionStorage.getItem('loginMsg')){
			let userObj = JSON.parse(window.sessionStorage.getItem('loginMsg'));
			this.setState({
				accountId:userObj.id
			})
			let sendObj = {
				orderId:this.props.updateObj.orderid,
				accountId:userObj.id
			};
			this.getList(sendObj)
		}
	}
	close(){
		this.setState({
	      visible: false,
	   });
	}
	/*进入页面时获取图片列表*/
	getList = (obj) => {
		this.setState({loading:true})
		let _this = this;
		API.attachList(obj)
		.then(res => {
			this.setState({loading:false})
			if(res.data.success){
				let list = res.data.data;
				if(list){
					const newData = {
					  	id:0,
					  	fileName:'' ,
					  	filePath:'',
					  	fileType:'5',
					  	progress:0,
				    };
				    list.push(newData)
						_this.setState({
							dataSource:list
						})
				}
			}else{
				//message.error(res.data.msg?res.data.msg:'请求出错了',3)
				
				_this.setState({loading:false})
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
		  	fileType:'4',
		  	progress:0,
	    };
	    let _this = this;
	    this.setState({
	      dataSource: [...dataSource, newData],
	    });
	}
	componentDidMount(){
		
	}
	onChangeSelect(e,obj,index){
		this.contentInputValue = e;
	}
	getKey = (e,obj,index) => {
		this.refs.file_list.click();
		this.setState({
			currentObj:obj,
			currentIndex:index
		})
	}
	/*删除图片*/
	delete = (e,obj,index) => {
		e.preventDefault();
		this.setState({uploading:true});
		let _this = this;
		let response = {
			attachId:obj.id,
			type:_this.contentInputValue,
			contractRentId:_this.props.updateObj.id
		};
		API.delAttach(response).then(res =>{
			this.setState({uploading:false});
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
			this.setState({uploading:false});
		});
	}
	openImg = (event,obj) => {  
		let _this = this;
		let responseObj = {
			id:obj.id
		};
		this.setState({uploading:true});
		API.lookAttach(responseObj).then(res =>{
			this.setState({uploading:false});
			if(res.data.success){
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
				    },()=>{
				    	_this.props.setloading(false);
				    });
				};
			}else{
				message.error(res.data.msg?res.data.msg:'请求出错了',3)
			}
		}).catch( error => {
			this.setState({uploading:false});
		});
	}
	onChange = () => {
		let _this = this;
		let index = this.state.currentIndex;
		this.state.dataSource[index].progress = 1;
		const picobj ={
			type:this.contentInputValue
		};
		this.token(index)	 
  	}
  	/*上传图片后把信息传给后台*/
  	sendInfo = (index,obj) => {
  		let _this = this;
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
				
				setTimeout(()=>{
					let poress = this.state.dataSource;
					poress[index].progress = 0;
					//let file = _this.refs.file_list.files[0]; //获取图片资源
					//let filename = file.name;
					poress[index].fileName = data.fileName;
					// poress[index].fileName = filename;
					poress[index].filePath = data.filePath;
					poress[index].id = data.id;
					this.setState({
						dataSource:poress
					}, () => {
						_this.refs.file_list.value = '';
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
  		OSS.urllib.request("http://192.168.1.11:2002/file/getToken",
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
			    	type:_this.contentInputValue,
			    	contractRentId:_this.props.updateObj.id
			    };
	        	_this.sendInfo(index,params)
        	}else{
        		_this.setState({loading:false})
        	}
      	}).catch(function (err) {
        	_this.setState({loading:false})
      	});
  	}
	render(){
		return (
			<div style={{marginTop:'20px',marginBottom:'20px'}}>
				<div className={styles.show_img} style={{display:this.state.visible ? 'block' : 'none'}}>
					<div className={styles.close} onClick={this.close}></div>
		          <img src={this.state.img_url} style={{marginTop:this.state.marginT,width:this.state.width,height:this.state.height}} />
		      </div>
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
const Enclosures = Form.create()(Enclosure);




//借款评估
class LoanAssessment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
		    loading: false,
			  data:[]
		};
    this.columns = [{
      title: '月租金估价(元)',
      dataIndex: 'monthlyRent',
      align:'center',
      key:'monthlyRent'
    },
    {
      title: '委托月数',
      dataIndex: 'entrustMonths',
      align:'center',
      key:'entrustMonths'
    },
    {
      title: '总借款金额(万元)',
      dataIndex: 'totalBorrowingAmount',
      align:'center',
      key:'totalBorrowingAmount'
    },
    {
      title: '审核人	',
      dataIndex: 'auditAccount',
      align:'center',
      key:'auditAccount'
    }];
    
  }

  componentDidMount(){

  }
  componentWillUnmount () {  
    //当组件将要卸载的时候，退订信息  
  };  
	componentWillMount (){

	}
	componentWillReceiveProps(nextProps){
		this.setState({
			data:nextProps.info
		})
	}
  render() {
      return  (
      	<Table
		        size="small"
						bordered
						loading={this.state.loading}
							dataSource={this.state.data}
							pagination={false}
    					columns={this.columns} 
				/>
      )
  }
}


class LoanAuditRecord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
		    loading: false,
				data:[]
		};
    this.columns = [{
      title: '审核人',
      dataIndex: 'auditAccount',
      align:'center',
      key:'auditAccount'
    },
    {
      title: '角色',
      dataIndex: 'roleCode',
      align:'center',
      key:'roleCode'
    },
    {
      title: '审核时间',
      dataIndex: 'createTime',
      align:'center',
      key:'createTime'
    },
    {
      title: '审核结果',
      dataIndex: 'operation',
      align:'center',
      key:'operation'
    },{
      title: '描述',
      dataIndex: 'remark',
      align:'center',
      key:'remark'
    }];
  }

  componentDidMount(){
  }
  componentWillUnmount () {  
    //当组件将要卸载的时候，退订信息  
  };  
	componentWillMount (){
	}
	componentWillReceiveProps(nextProps){
		this.setState({
			data:nextProps.infos
		})
	}


  render() {
    return  <Table 
    			size="small"
    			bordered
    			pagination={false} 
    			loading={this.state.loading}
				  dataSource={this.state.data}
		    	columns={this.columns} 
	    	/>;
  }
}
const LoanAuditRecords = LoanAuditRecord;

class LoanToExamine extends React.Component {
  	constructor(props) {
    	super(props);
	    this.state = {
	      	accountId:'',
	      	loading:false,
	    };
	    this.handleSubmit = this.handleSubmit.bind(this);
	}
	componentWillMount(){
		if(window.sessionStorage.getItem('loginMsg')){
			let userObj = JSON.parse(window.sessionStorage.getItem('loginMsg'));
			this.setState({
				accountId:userObj.id
			})	
		}
	}
  	
  	handleSubmit(){
  		console.log(this.props.orderid)
  		let obj ={};
  		obj.targetId = this.props.orderid.targetId;
//		obj.roleType = this.props.orderid.
//		let picThis = _this.state.childThis;
//		let arr = picThis.state.dataSource;
//		let attachIdList = [];
//		arr.map((item,index) => {
//			if((item.id) && (item.fileType == 3)){
//				attachIdList.push(item.id)
//			}
//		})
//		if(!attachIdList.length){
//			message.error('请先上传房产证图片',3)
//			return ;
//		}
//		let arrStr = attachIdList.join(',');
//		this.props.form.validateFields((err, values) => {
//	      	if (!err) {
//	      		this.setState({
//	      			loading:true
//	      		})
//	      		let obj = values;
//	      		obj.accountId = this.state.accountId;
//	      		obj.taskId = _this.props.location.state.taskId; //任务id
//	      		obj.id = _this.props.location.state.id; //房源id
//	      		obj.attachId = arrStr;//房产证id集合
//	      		API.HouseCheck(obj)
//	        	.then(res => {
//		            this.setState({
//		      			loading:false
//		      		})
//		            if((res.status == 200) && (res.data.success)){
//		            	Modal.confirm({
//						    title: '提示',
//						    content: res.data.msg,
//						    okText: '确认',
//						    cancelText: '取消',
//						    onOk:() => {
//						    	_this.props.history.push({
//						  			pathname:'/home/work/working',
//						  		})
//						    }
//						});  	
//		            }else{
//		            	message.error(res.data.msg?res.data.msg:'请求出错了',3)
//		            } 
//		        }).catch(error => {
//		        	this.setState({
//		      			loading:false
//		      		})
//		        	
//		        })
//	      	}
//	    });
  	}
  	
  	render() {
  		const  {getFieldValue,getFieldDecorator,setFields} = this.props.form;
  		const formItemLayout = {
	      	labelCol: { span: 2 },
	      	wrapperCol: { span: 8 },
	    };
  		return (
		      	<Form
		      		layout="horizontal"
		        	className={styles.form}
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
				            <TextArea  autosize={{ minRows: 6, maxRows: 6 }} />
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
const LoanToExamines = Form.create()(LoanToExamine);