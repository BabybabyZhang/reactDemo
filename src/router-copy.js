import React from 'react';
import { Router, Route,Redirect, } from 'dva/router';
import IndexPage from './routes/IndexPage';
import Products from './routes/Products';
import Home from './layout';
import {One,Two,Three,Four,HouseList,HouseExamineList,Login,Working,Worked,MyWork} from './components';

const checkLogin = (nextState,repalce) => {
    //let loginMsg = window.sessionStorage.getItem('loginMsg');
    console.log('nextState',nextState)
    /*if(!loginMsg){
      replace('/login')
    }else{
    
    }*/
}
/*const RouterConfig = ({history}) => {
    return (
      <Router history={history}>
          <div>
              <Route path="/login"  component={Login} />
              <Route onEnter={checkLogin} path="/home"  component={Home}>
                  <Route path="/products" component={Products} />
                  <Route path="/indexPage" component={IndexPage} />
                  <Route path='/one' component={One}/>
                  <Route path='/two' component={Two}/>
                  <Route path='/three' component={Three}/>
                  <Route path='/four' component={Four}/>
                  <Route path='/houseAdministration/houseList' component={HouseList} />
                  <Route path='/houseAdministration/houseExamineList' component={HouseExamineList} />
              </Route>
              <Route exact onEnter={checkLogin} path="/" render={() => (<Redirect to="/home"/>)}></Route>
          </div>
      </Router>
  );
}
export default RouterConfig*/
// <Route exact path="/" render={() => (<Redirect to="/home"/>)}></Route>


export default ({history}) => {
    const checkLogin = (nextState,repalce) => {
        //let loginMsg = window.sessionStorage.getItem('loginMsg');
        console.log('nextState',nextState)
        /*if(!loginMsg){
          replace('/login')
        }else{
        
        }*/
    };
    return (
      <Router history={history}>
          <div>
              <Route path="/login"  component={Login} />
              <Route onEnter={checkLogin} path="/home"  component={Home}>
                  <Route path="/products" component={Products} />
                  <Route path="/indexPage" component={IndexPage} />
                  <Route path='/one' component={One}/>
                  <Route path='/two' component={Two}/>
                  <Route path='/three' component={Three}/>
                  <Route path='/four' component={Four}/>
                  <Route path='/houseAdministration/houseList' component={HouseList} />
                  <Route path='/work/working' component={Working} />
                  <Route path='/work/worked' component={Worked} />
                  <Route path='/work/mywork' component={MyWork} />
              </Route>
              <Route exact onEnter={checkLogin} path="/" render={() => (<Redirect to="/home"/>)}></Route>
          </div>
      </Router>
    );
}