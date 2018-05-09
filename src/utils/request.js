/* eslint-disable */
import axios from 'axios'
import qs from 'qs'
import {message } from 'antd';
import { Link } from 'dva/router';
//开发环境
axios.defaults.baseURL = 'http://192.168.1.10:2002';//萌萌
//axios.defaults.baseURL = 'http://192.168.1.124:2002';//琼瑶
//测试环境
//axios.defaults.baseURL = 'http://192.168.1.19:2002';

//正式环境
// axios.defaults.baseURL = 'https://app.5izhujia.com';
// 拦截请求
axios.interceptors.request.use(
  // Toast.loading('加载中', 0);
    config => {
        let authToken = window.sessionStorage.getItem('token');
        if (authToken) {
            config.headers.token = authToken;
        }
        return config
    },
    err => {
        return Promise.reject(err)
    }
);

// 拦截相应
axios.interceptors.response.use(
  response => {
  	if(response.data.code == 111){
      message.error('未登录',3);
      window.location.href='/';
  	}else{
  			return response;
  	}
  },
  err => {
      message.error('加载超时',3)
      return err
    }
);

export default class Http {
  static get(url, params) {
    return new Promise((resolve, reject) => {
      axios.get(url, {
        params: params
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }

  static post(url, params) {
    return new Promise((resolve, reject) => {
      axios.post(url+'?= '+new Date().getTime()+'', qs.stringify(params), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      ).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
}
