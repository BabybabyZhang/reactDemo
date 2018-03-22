import React from 'react';
import {browserHistory,Router} from 'dva/router'
const goLogin = () => {
	console.log(this.context);
	/*browserHistory.push({
		path:'/login'
	})*/
}
const One = () => {
	return (
	    <div>
	        111111111111
	        <button onClick={goLogin}>跳转登录页面</button>
	    </div>
	);
};


export default One;