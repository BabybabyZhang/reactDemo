import React from 'react';
import { Router, Route,Redirect, } from 'dva/router';
import IndexPage from './routes/IndexPage';
import Products from './routes/Products';
import Home from './layout';
import {One,Two,Three,Four,HouseList,HouseExamineList,Login,Working,Worked,MyWork} from './components';

export default ({history}) => {
    return (
      <Router history={history}>
          <div>
              <Route path="/login"  component={Login} />
              <Route path="/home"  component={Home}>
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
              <Route exact path="/" render={() => (<Redirect to="/home"/>)}></Route>
          </div>
      </Router>
    );
}