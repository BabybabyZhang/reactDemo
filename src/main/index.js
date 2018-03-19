import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link,Route } from 'dva/router'

import IndexPage from '../routes/IndexPage';
import Products from '../routes/Products';
const { Header, Content, Footer, Sider } = Layout;

export default class MainContainer extends Component {

  state={
    name:'wei',
  }

  render() {

    return (
      <div>
        <h2>TOP</h2>
        <Layout>
		    <Sider
		      breakpoint="lg"
		      collapsedWidth="0"
		      onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
		    >
		      <div className="logo" />
		      <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
		        <Menu.Item key="1">
		          <Icon type="user" />
		          <span className="nav-text"><Link to="products">菜单一1</Link></span>
		        </Menu.Item>
		        <Menu.Item key="2">
		          <Icon type="video-camera" />
		          <span className="nav-text"><Link to="products">菜单一2</Link></span>
		        </Menu.Item>
		        <Menu.Item key="3">
		          <Icon type="upload" />
		          <span className="nav-text"><Link to="products">菜单一3</Link></span>
		        </Menu.Item>
		        <Menu.Item key="4">
		          <Icon type="user" />
		          <span className="nav-text"><Link to="products">菜单一4</Link></span>
		        </Menu.Item>
		      </Menu>
		    </Sider>
		    <Layout>
		      <Header style={{ background: '#fff', padding: 0 }} />
		      <Content style={{ margin: '24px 16px 0' }}>
		        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
		          <Route pattern="/" exactly component={IndexPage} />
		          <Route pattern="/products" component={Products} />
		        </div>
		      </Content>
		      <Footer style={{ textAlign: 'center' }}>
		        Ant Design ©2016 Created by Ant UED
		      </Footer>
		    </Layout>
		</Layout>

      </div>
    );
  }
}