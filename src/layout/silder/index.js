/* eslint-disable */
import React, { Component } from 'react';
import {Menu, Icon } from 'antd';
import {Link} from 'react-router-dom'
import API from '../../api';
import styles from '../index.css';
import '../../assets/font/iconfont.css';
import css from '../../index.less'
const SubMenu = Menu.SubMenu;



export default class Silder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            openKeys:[],
            current: '14',
            openItemKeys:[]
        }
        this.rootSubmenuKeys = [];
    }
    componentWillMount(){
        /*判断是否登录*/
        if(window.sessionStorage.getItem('loginMsg')){
            /*若已获取菜单接口，则去本地数据*/
            if(window.sessionStorage.getItem('MenuList')){
                let list = JSON.parse(window.sessionStorage.getItem('MenuList'));
                this.setState({
                    data:list
                })
                this.setRootSubmenuKeys(list)
            }else{
                let obj = JSON.parse(window.sessionStorage.getItem('loginMsg'));
                let userObj = {
                    userId:obj.id
                }
                this.getList(userObj)
            }
            if(window.sessionStorage.getItem('openKeys')){
                this.setState({
                    openKeys:JSON.parse(window.sessionStorage.getItem('openKeys'))
                })
            }
            if(window.sessionStorage.getItem('openItemKeys')){
                this.setState({
                    openItemKeys:JSON.parse(window.sessionStorage.getItem('openItemKeys'))
                },)
            }     
        }   
    }
    
    /*获取菜单数量*/
    setRootSubmenuKeys = (arr) => {
        this.rootSubmenuKeys = [];
        let len = arr.length;
        for(let i = 0; i < len; i++){
            this.rootSubmenuKeys.push(arr[i].id);
        }
    }
    /*获取菜单接口*/
    getList = (obj) => {
      let _this = this;
      API.MenuList(obj)
        .then(res => {
            if((res.status == 200) && (res.data.success)){
              let list = res.data.data;
              _this.setState({
                data:list
              })
              this.setRootSubmenuKeys(list)
              window.sessionStorage.setItem('MenuList',JSON.stringify(list))
            }
        }).catch(error => {
			
        })
    }
    onOpenChange = (openKeys) => {
    	
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        //菜单打开时，latestOpenKey有值
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys });
        }else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        };
        if(latestOpenKey){
            let arr = [];
            arr.push(latestOpenKey)
            window.sessionStorage.setItem('openKeys',JSON.stringify(arr))
        }
    }
    handleClick = (e) => {
	    this.setState({
	      current: e.key,
	    },()=>{
	    	//console.log(this.state);
	    });
	}
    select = (item, key, selectedKeys) => {
        this.setState({
            openItemKeys:item.key?[item.key]:[]
        })
        let arr = [];
        arr.push(item.key)
        window.sessionStorage.setItem('openItemKeys',JSON.stringify(arr))
    }

    /*设置菜单*/
    setMenu(arr){
        return  arr.map((item) => {
            if(item.leaf) {
              return ( <Menu.Item key={item.id} style={{height:'60px',lineHeight:'60px',fontSize:'16px'}} className={styles.item} ><Icon className = {styles.itemIcon} type = '' /><Link to={`/home${item.path}`}>{item.name}</Link></Menu.Item> )
            }else{
              return ( <SubMenu key={item.id} className={styles.menus} style={{borderRadius:'4px'}}
                          title={<span><Icon className = {styles[item.iconcls]} type = '' /><span>{item.name}</span></span>}>
                          {this.setMenu(item.children)}
                </SubMenu> )
            }
        })
    }
    render() {
        return (
            <Menu
                mode="inline"
                openKeys={this.state.openKeys}
                onOpenChange={this.onOpenChange}
                onClick={this.handleClick}
                className = {css.customSelect}
                onSelect={this.select}
                defaultOpenKeys={this.state.openKeys}
                defaultSelectedKeys={this.state.openItemKeys}
            >
            {
                this.setMenu(this.state.data)
            }
            </Menu>
      );
  }
}