/* eslint-disable */
import React from 'react';
import { Form, Icon, Input, Button, Checkbox,message } from 'antd';
import styles from './login.css';
import API from '../../api';
import topImg from '../../assets/img/login-logo.png';
import loginTopImg from '../../assets/img/logo.png';
import { Link } from 'dva/router';
const FormItem = Form.Item;


class NormalLoginForm extends React.Component {
	constructor(props) {
    	super(props);
	    this.state = {
	    	user:'',
	    	pwd:''
	    };
	}
	componentWillMount(){
        if(window.sessionStorage.getItem('loginMsg')&&window.sessionStorage.getItem('token')){
        	this.props.history.replace('/')
        };
        let getTime = window.sessionStorage.getItem('saveTime');
        let newTime = (new Date()).getTime();
        let time = 15*24*60*60*1000;
        //判断是否存有时间戳
        if(getTime){
        	//判断时间是否超了15天
        	if((newTime-getTime)<time){
	        	let session = window.sessionStorage.getItem('remember_suer');
		        if( session != null && session != 'null' ){
		        	this.setState({
		        		user:JSON.Parse(session).user,
		        		pwd:JSON.Parse(session).pass,
		        	});
		        }
	        }else{
	        	window.localStorage.removeItem('remember_user');
	        	window.localStorage.removeItem('saveTime');
	        }
        }    
        document.removeEventListener("keydown",this.handleEenterKey);
    }
	 componentDidMount(){
	     document.addEventListener("keydown",this.handleEnterKey);
    }
   handleEnterKey = (e) => {
   		if(e.keyCode == 13){
   			this.handleSubmit();
   		};
   		
   }
	handleSubmit = () => {
	    this.props.form.validateFields((err, values) => {
	      if (!err) {
	      	if( values.remember == true ){
	      		var user_pass = {
	      			user:values.account,
	      			pass:values.pwd
	      		};
	      		window.localStorage.setItem('remember_user',JSON.stringify(user_pass));
	      		window.localStorage.setItem('saveTime',(new Date()).getTime())
	      	}else{
	      		if(window.sessionStorage.getItem('remember_suer')){
	      			window.localStorage.removeItem('remember_user');
	      		}
	      		if(window.sessionStorage.getItem('saveTime')){
	      			window.localStorage.removeItem('saveTime');
	      		}
	      	}
	      	API.Login(values)
	        .then(res => {
	            if((res.status == 200) && (res.data.success)){
	            	window.sessionStorage.setItem('loginMsg',JSON.stringify(res.data.data))
	            	window.sessionStorage.setItem('token',res.data.data.token)
		        	this.props.history.replace('/')
	            }else{
	            	message.error(res.data.msg?res.data.msg:'请求出错了',3)
	            } 
	        }).catch(error => {
	        	
	        })
	      }
	    });
	}
	render() {
	    const { getFieldDecorator } = this.props.form;
	    return (
		    <div className={styles.main}>
		    	<div style={{width:'100%',background: '#fff'}}>
			    	<div className={styles.top}>
			    		<img src={topImg} />
			    	</div>
		    	</div>
		    	<div className={styles.content}>
			    	<div className={styles.content_main}>
				    	<div className={styles.login}>
				    		<img src={loginTopImg} className={styles.login_img} />

						    <Form className="login-form" >
						        <FormItem>
							        {getFieldDecorator('account',{initialValue:this.state.user}, {
							            rules: [{ required: true, message: '请输入用户名!' }],
							        })(
							            <Input size='large' prefix={<Icon type="user"  style={{ color: '#0f78fe' ,fontSize:'20px' }} />} placeholder="用户名" />
							        )}
						        </FormItem>
						        <FormItem>
							        {getFieldDecorator('pwd', {initialValue:this.state.pwd},{
							            rules: [{ required: true, message: '请输入密码!' }],
							        })(
							            <Input size='large' prefix={<Icon type="lock" style={{ color: '#0f78fe',fontSize:'20px' }} />} type="password" placeholder="密码" />
							        )}
						        </FormItem>
						        <div className={styles.btnWrap}>
							        <Button type="primary" onClick={this.handleSubmit} style={{width:'100%'}} size='large' >
							            登录
							        </Button>
						        </div>
						        <FormItem>
							        {getFieldDecorator('remember', {
							            valuePropName: 'checked',
							            initialValue: true,
							        })(
							            <Checkbox className={styles.chenck} size='large' >记住帐号</Checkbox>
							        )}
							        
						        </FormItem>
						    </Form>
						    <div className={styles.hello}>Hello&nbsp;&nbsp;!&nbsp;&nbsp;&nbsp; 欢迎来到安逸客后台管理</div>
					    </div>
					    
				    </div>
		    	</div>
		    </div>
	    );
	}
}

const Login = Form.create()(NormalLoginForm);


export default Login;