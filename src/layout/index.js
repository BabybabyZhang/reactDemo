import React, { Component } from 'react';
import { Layout} from 'antd';
import Silder from './silder/';
import Head from './header/';
import Main from './main/';
import styles from './index.css';

import { connect } from 'dva';
const { Header, Sider, Content } = Layout;


/*export default class Maincontain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }
    componentWillMount(){
       
        if(window.sessionStorage.getItem('loginMsg')){

        }else{
            //routerRedux.push('/login', {name: 'dkvirus', age: 20})
            routerRedux.push({
                pathname: '/login',
                query: {
                    page: 2,
                },
            });
        }
    }
    componentDidMount(){
    }
    render() {
        return (
            <div>
                <Layout className={styles.wrap}>
                  <Header className={styles.header} >
                      <Head></Head>
                  </Header>
                  <Layout>
                    <Sider className={styles.sider}>
                        <Silder></Silder>
                    </Sider>
                    <Content>
                        <div>
                            <Main ></Main>
                        </div>
                    </Content>
                  </Layout>
                </Layout>
            </div>
        );
    }
}*/
class Maincontain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }
    componentWillMount(){
    }
    componentDidMount(){
    }
    render() {
        return (
            <div>
                <Layout className={styles.wrap}>
                  <Header className={styles.header} >
                      <Head></Head>
                  </Header>
                  <Layout>
                    <Sider className={styles.sider}>
                        <Silder></Silder>
                    </Sider>
                    <Content>
                        <div>
                            <Main ></Main>
                        </div>
                    </Content>
                  </Layout>
                </Layout>
            </div>
        );
    }
}
export default connect(({ layout }) => ({
  layout,
}))(Maincontain);