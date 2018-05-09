import { routerRedux } from 'dva/router';
import { message } from 'antd';
import API from '../api';
export default {
  	namespace: 'login',
  	state: {

  	},
  	subscriptions:{
  		
  	},
  	reducers: {
    	
  	},
  	effects: {
     	 // 路由跳转
  		  * logining({ payload },{select,call, put}){
            let {obj} = payload;
            API.Login(payload.obj)
            .then(res => {
                if((res.status == 200) && (res.data.success)){
                  window.sessionStorage.setItem('loginMsg',JSON.stringify(res.data.data))
                  //window.location.replace('/')
                  //yield put(routerRedux.replace('/'))
              }else{
                  message.error(res.data.msg?res.data.msg:'请求出错了',3)
              } 
          }).catch(error => {

          })
      		  /*if (window.sessionStorage.getItem('loginMsg')){

            }else{
                yield put(routerRedux.push({
                      pathname: '/login',
                      state: {
                          id: '33',
                      },
                  })
              );
            }*/
    	   }
  	}
};