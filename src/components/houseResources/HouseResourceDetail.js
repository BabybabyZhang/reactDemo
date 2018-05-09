/* eslint-disable */
import React from 'react';
import { Form, Row, Col, Input, Button,Table,Select,message,Spin } from 'antd';
import API from '../../api';
import HouseInfo from './houseInfo'
import HouseAdminInfo from './houseAdminInfo'
import HouseCheck from './houseCheck'
import UpdatePic from './updatePic'
import styles from './house.css';

class HouseResourceDetail extends React.Component{
	constructor(props) {
    	super(props);
	    this.state = {
	      	data:'',
			accountId:'',//登录的id
			disable:true,
			childThis:'',
			loading:true,
	    };
	}
	componentWillMount(){
		if(window.sessionStorage.getItem('loginMsg')){
			let userObj = JSON.parse(window.sessionStorage.getItem('loginMsg'));
			let obj = {
				resourceId:this.props.location.state.id,
				accountId:userObj.id
			};
			this.setState({loading:true})
			this.getInfo(obj)
		}
	}
	componentDidUpdate(){

	}
	getInfo(obj){
		let _this = this;
    	API.HouseReDeatil(obj)
        .then(res => {
        	this.setState({loading:false})
            if((res.status == 200) && (res.data.success)){
            	this.setState({
            		data:res.data.data
            	})
            }else{
            	message.error(res.data.msg?res.data.msg:'请求出错了',3)
            }
        }).catch(error => {
        	this.setState({loading:false})
        })
	}
	sendThis = (that) => {
		this.setState({
			childThis:that
		})
	}
	render(){
		if(this.state.data){
			return (<div className={styles.divWrap}>
		    	<div className={styles.wrap}>
			        <h3>房源基本信息</h3>
			        <div className={styles.formWrap}>
			        	{this.state.data
			        	?(<HouseInfo houseInfo={this.state.data}/>)
			        	:''
			        	}
			        </div>
			    </div>
			    <div className={styles.wrap}>
			        <h3>房源照片</h3>
			        <div className={styles.formWrap}>
			        	{this.state.data.resourcePicture.map((item,index) => {
				        	return <div className={styles.imgItem} key={index}><img src={item.pictureUrl} /></div>
				        })}
			        </div>
			    </div>
			    <div className={styles.wrap}>
			    	<h3>房东信息</h3>
			    	<div className={styles.formWrap}>
			    		{this.state.data
			    		?(<HouseAdminInfo landlordInfo={this.state.data} />)
			    		:''
			    		}
		    		</div>
			    </div>
			    <div className={styles.wrap}>
			    	<h3>其他信息</h3>
			    	<div className={styles.formWrap}>
			    		<Row gutter={24}>
			    			<Col xl={6} xxl={8}>
			    				<div className={styles.item}><p>是否已出租：</p><span>{this.state.data.isRent?'是':'否'}</span></div>
			    			</Col>
			    			<Col xl={6} xxl={8}>
			    				<div className={styles.item}><p>是否预收房租中：</p><span>{this.state.data.isLoan?'是':'否'}</span></div>
			    			</Col>
			    			<Col xl={6} xxl={8}>
			    				<div className={styles.item}><p>是否已安装门锁：</p><span>{this.state.data.isInstallLock?'是':'否'}</span></div>
			    			</Col>
			    		</Row>
			    	</div>
			    </div>
			    <div className={styles.wrap}>
			    	<h3>附件信息</h3>
			    	<div className={styles.formWrap}>
			    		{this.state.data
			    		?(<UpdatePic sendThis={that => this.sendThis(that)} houseId={this.props.location.state.id} taskId={this.props.location.state.taskId} />)
			    		:''
			    		}
		    		</div>
			    </div>
			    {
			    	this.props.location.state.taskId?
			    	(<div className={styles.wrap}>
				    	<h3>审核信息</h3>
				    	<div className={styles.formWrap}>
				    		<HouseCheck that={this} />
			    		</div>
				    </div>):''
			    }
		    </div>)
		}else{
			return <div className={styles.divWrap}>
				<div className={this.state.loading?styles.loading:styles.hide}><Spin spinning={this.state.loading} tip="Loading..." /></div>
			</div>;
		}
	}	  
};

export default HouseResourceDetail;