/* eslint-disable */
import React, { Component } from 'react';
import {Route} from 'dva/router'
import {
	loanDetail,
	LoanList,
	HouseList,
	HouseExamineList,
	HouseExamine,
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
} from '../../components'

export default class Main extends Component {
  render() {
    return (
      	<div>
		      <Route path='/home/houseAdministration/houseExamine' component={HouseExamine} />
		      <Route path='/home/houseAdministration/houseList' component={HouseList} />
		      <Route path='/home/houseAdministration/houseExamineList' component={HouseExamineList} />
      		<Route path='/home/work/working' component={Working} />
          <Route path='/home/work/worked' component={Worked} />
          <Route path='/home/work/mywork' component={MyWork} />
          <Route path='/home/os/roleList' component={RoleList} />
          <Route path='/home/os/userList' component={UserList} />
          <Route path='/home/houseResources/houseResourceList' component={HouseResourceList} />
          <Route path='/home/houseResources/houseResourceDetail' component={HouseResourceDetail} />
          <Route path='/home/rent/rentTable' component={RentTable} />
          <Route path='/home/rent/rentList' component={RentList} />
          <Route path='/home/renter/renterList' component={RenterList} />
          <Route path='/home/loan/loanList' component={LoanList} />
          <Route path='/home/loan/loanDetail' component={loanDetail} />
      	</div>
    );
  }
}
