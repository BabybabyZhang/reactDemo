import React, { Component } from 'react';
import {Menu, Icon } from 'antd';
import {Link} from 'react-router-dom'

const SubMenu = Menu.SubMenu;
// import IndexPage from '../routes/IndexPage';
// import Products from '../routes/Products';

export default class Silder extends Component {
  rootSubmenuKeys = ['0', '1', '2','3','4','5','6','7'];
  state = {
    openKeys: ['0'],
    navArr:[
      {
          "path":"/one",
          "name":"用户管理",
          "component":"User",
          "iconCls":'el-icon-user',
          "iconImg":"",
          "leaf":true,//说明没有子菜单
          'hidden':false,
          'id':'0'
      },
      {
          "path":"/two",
          "name":"房源管理",
          "component":"FangyuanList",
          "iconCls":'el-icon-fangyuan',
          "iconImg":"",
          "leaf":true,
          'id':'1'
      },
      {
          "path":"/three",
          "name":"租赁管理",
          "component":"ZujinList",
          "iconCls":'el-icon-zujin',
          "iconImg":"",
          "leaf":true,
          'id':'2'
      },
      {
          "path":"/",
          "name":"房东管理",
          "iconCls":'el-icon-daikuan',
          "iconImg":"",
          "leaf":false,
          'id':'3',
          "children":[
              {
                  "path":"/houseAdministration/houseList",
                  "component":"ShenheOrder",
                  "leaf":true,
                  "name":"房东表单",
                  'id':'30'
              },
              {
                  "path":"/houseAdministration/houseExamineList",
                  "component":"TongguoOrder",
                  "leaf":true,
                  "name":"房东审核表单",
                  'id':'31'
              },
              {
                  "path":"/notongguoorder",
                  "component":"NotongguoOrder",
                  "leaf":true,
                  "name":"未通过列表",
                  'id':'32'
              },
              {
                  "path":"/fangkuanorder",
                  "component":"FangkuanOrder",
                  "leaf":true,
                  "name":"放款列表",
                  'id':'33'
              },
              {
                  "path":"/huankuanorder",
                  "component":"HuankuanOrder",
                  "leaf":true,
                  "name":"还款列表",
                  'id':'34'
              },
              {
                  "path":"/yuqiorder",
                  "component":"YuqiOrder",
                  "leaf":true,
                  "name":"逾期列表",
                  'id':'35'
              }
          ]
      },
      {
          "path":"/",
          "name":"我的工作",
          "iconCls":'el-icon-yunying',
          "iconImg":"",
          "leaf":false,
          'id':'4',
          "children":[
              {
                  "path":"/work/working",
                  "component":"",
                  "leaf":true,
                  "name":"代办的工作",
                  'id':'40'
              },
              {
                  "path":"/work/worked",
                  "component":"",
                  "leaf":true,
                  "name":"已完成的工作",
                  'id':'41'
              },
              {
                  "path":"/work/mywork",
                  "component":"",
                  "leaf":true,
                  "name":"我发起的工作",
                  'id':'42'
              }
          ]
      },
      {
          "path":"/finance",
          "name":"财务管理",
          "component":"Finance",
          "iconCls":'el-icon-caiwu',
          "iconImg":"",
          "leaf":true,
          'hidden':false,
          'id':'5'
      },
      {
          "path":"/datacount",
          "name":"数据统计",
          "component":"DataCount",
          "iconCls":'el-icon-data',
          "iconImg":"",
          "leaf":true,
          'id':'6'
      },
      {
          "path":"/",
          "iconCls":'el-icon-os',
          "iconImg":"",
          "name":"系统管理",
          "leaf":false,
          'id':'7',
          "children":[
              {
                  "path":"/rolelist",
                  "component":"RoleList",
                  "leaf":true,
                  "name":"人员管理",
                  'id':'70'
              },
              {
                  "path":"/role",
                  "component":"Role",
                  "leaf":true,
                  "name":"角色管理",
                  'id':'71'
              }
          ]
      }
    ],
  };
  onOpenChange = (openKeys) => {
      const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.setState({ openKeys });
      } else {
        this.setState({
          openKeys: latestOpenKey ? [latestOpenKey] : [],
        });
      }
  }
  setMenu(navArr){
    return  navArr.map((item) => {
        if(item.leaf) {
          return ( <Menu.Item key={item.id}><Link to={`/home${item.path}`}>{item.name}</Link></Menu.Item> )
        }else{
          return ( <SubMenu key={item.id}
                          title={<span><Icon type="appstore"/><span>{item.name}</span></span>}>
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
        //style={{ width: 256 }}
      >
        {
          this.setMenu(this.state.navArr)
        }
      </Menu>
    );
  }
}



// <div>
//  <ul>
//    <li><Link to='/home/one'>第一个菜单</Link></li>
//    <li><Link to='/home/two'>第二个菜单</Link></li>
//    <li><Link to='/home/three'>第三个菜单</Link></li>
//    <li><Link to='/home/four'>第四个菜单</Link></li>
//  </ul>
// </div>

// <SubMenu key="sub1" title={<span><Icon type="mail" /><span>Navigation One</span></span>}>
//           <Menu.Item key="1">Option 1</Menu.Item>
//           <Menu.Item key="2">Option 2</Menu.Item>
//           <Menu.Item key="3">Option 3</Menu.Item>
//           <Menu.Item key="4">Option 4</Menu.Item>
//         </SubMenu>
//         <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Navigation Two</span></span>}>
//           <Menu.Item key="5">Option 5</Menu.Item>
//           <Menu.Item key="6">Option 6</Menu.Item>
//           <SubMenu key="sub3" title="Submenu">
//             <Menu.Item key="7">Option 7</Menu.Item>
//             <Menu.Item key="8">Option 8</Menu.Item>
//           </SubMenu>
//         </SubMenu>
//         <SubMenu key="sub4" title={<span><Icon type="setting" /><span>Navigation Three</span></span>}>
//           <Menu.Item key="9">Option 9</Menu.Item>
//           <Menu.Item key="10">Option 10</Menu.Item>
//           <Menu.Item key="11">Option 11</Menu.Item>
//           <Menu.Item key="12">Option 12</Menu.Item>
//         </SubMenu>