/* eslint-disable */
import React, { Component } from 'react';
import {Modal,message} from 'antd';
import API from '../../api';
import Logo from '../../assets/img/logo.png'
import styles from '../index.css';
// import { Layout, Menu, Icon } from 'antd';
// import { Link,Route } from 'dva/router'


export default class Head extends Component {
	constructor(props) {
    	super(props);
	    this.state = {
			accountId:'',//登录的id
			userName:''
	    };
	}
	componentWillMount(){
        if(window.sessionStorage.getItem('loginMsg')){
        	let userObj = JSON.parse(window.sessionStorage.getItem('loginMsg'));
			this.setState({
				accountId:userObj.id,
				userName:userObj.userName
			})
        }
    }
    LoginOut = () => {
    	Modal.confirm({
		    title: '提示',
		    content: '确认要退出登录吗',
		    okText: '确认',
		    cancelText: '取消',
		    onOk:() => {
		    	window.sessionStorage.clear()
		    	window.location.hash= '/login';
		    }
		});
    }
  	render() {
    	return (
      		<div className={styles.headWrap}>
		   		<div className={styles.logo}>
		   			<img src={Logo} />
		   		</div>
		   		<div className={styles.info}>
		   			<p>账号：{this.state.userName}</p>
		   			<button onClick={this.LoginOut}>退出</button>
		   		</div>
      		</div>
    	);
  	}
}