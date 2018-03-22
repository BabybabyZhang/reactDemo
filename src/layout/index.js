import React, { Component } from 'react';
import { Layout} from 'antd';
import Silder from './silder/';
import Head from './header/';
import Main from './main/';
import API from '../api'
const { Header, Footer, Sider, Content } = Layout;


export default class Maincontain extends Component {
  componentWillMount(){
    
    window.location.hash = '/login'
    //this.context.router
  }
  componentDidMount(){
      API.ceshi()
      .then(res => {

      }).catch(error => {

      })
  }
  render() {
    return (
      <div>
        <Layout>
          <Header>
              <Head></Head>
          </Header>
          <Layout>
            <Sider>
                <Silder></Silder>
            </Sider>
            <Content>
                <Main></Main>
            </Content>
          </Layout>
          <Footer>Footer</Footer>
        </Layout>
      </div>
    );
  }
}

// <Head></Head>
// <div>
//  <Silder></Silder>
//  <Main></Main>
// </div>