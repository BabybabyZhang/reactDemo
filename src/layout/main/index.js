import React, { Component } from 'react';
import {Route} from 'dva/router'
import {One,Two,Three,Four,HouseList,HouseExamineList,Working,Worked,MyWork} from '../../components'
export default class Main extends Component {
  render() {
    return (
      	<div>
	      	<Route path='/home/one' component={One} />
		    <Route path='/home/two' component={Two} />
		    <Route path='/home/three' component={Three} />
		    <Route path='/home/four' component={Four} />
		    <Route path='/home/houseAdministration/houseList' component={HouseList} />
		    <Route path='/home/houseAdministration/houseExamineList' component={HouseExamineList} />
      		<Route path='/home/work/working' component={Working} />
            <Route path='/home/work/worked' component={Worked} />
            <Route path='/home/work/mywork' component={MyWork} />
      	</div>
    );
  }
}
