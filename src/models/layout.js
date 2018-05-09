import { routerRedux } from 'dva/router';
export default {
  	namespace: 'layout',
  	state: {
  		
  	},
  	subscriptions:{
  		setup({ dispatch, history }) {
      		history.listen(location => {
        		if (location.pathname.includes('home')) {
          			dispatch({
            			type: 'loginhook',
          			});
        		}
      		});
    	},
  	},
  	reducers: {
    	
  	},
  	effects: {
     	 // 路由跳转
  		  * loginhook({ payload },{select,call, put}){
      		  if (window.sessionStorage.getItem('loginMsg')){
                
            }else{
                yield put(routerRedux.push({
                      pathname: '/login',
                      /*state: {
                          id: '33',
                      },*/
                  })
              );
            }
    	   }
  	}
};