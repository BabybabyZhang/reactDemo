import React from 'react';
import { Router, Route,Redirect } from 'dva/router';
import Home from './layout';
import {
	loanDetail,
	LoanList,
	HouseList,
	HouseExamineList,
	HouseExamine,
	Login,
	Working,
	Worked,
	MyWork,
	UserList,
	RoleList,
	HouseResourceList,
	HouseResourceDetail,
	RentList,
	RentTable,
	RenterList
} from './components';

export default ({history}) => {
    return (
      <Router history={history}>
          <div>
              <Route path="/login"  component={Login} />
              <Route path="/home"  component={Home}  >
                  <Route path='/houseAdministration/houseList/:id' component={HouseList} />
                   <Route path='/houseAdministration/houseExamineList/:id' component={HouseExamineList} />
                  <Route path='/work/working' component={Working} />
                  <Route path='/work/worked' component={Worked} />
                  <Route path='/work/mywork' component={MyWork} />
                  <Route path='/os/roleList' component={RoleList} />
                  <Route path='/os/userList' component={UserList} />
                  <Route path='/houseResources/houseResourceList' component={HouseResourceList} />
                  <Route path='/houseResources/houseResourceDetail' component={HouseResourceDetail} />
                  <Route path='/rent/rentTable' component={RentTable} />
                  <Route path='/rent/rentList' component={RentList} />
                  <Route path='/renter/renterList' component={RenterList} />
                  <Route path='/houseAdministration/houseExamine' component={HouseExamine} />
                  <Route path='/loan/loanList' component={LoanList} />
                  <Route path='/loan/loanDetail' component={loanDetail} />
              </Route>
              <Route exact path="/" render={() => (<Redirect to="/home"/>)}></Route>
          </div>
      </Router>
    );
}