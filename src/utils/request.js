import axios from 'axios'
// import qs from 'qs'
// import {Toast} from 'antd'

axios.defaults.baseURL = 'http://192.168.1.11:2002';

// 拦截请求
axios.interceptors.request.use(function (config) {
  // Toast.loading('加载中', 0);
  return config
});

// 拦截相应
axios.interceptors.response.use(function (config) {
  // Toast.hide();
  return config
});

export default class Http {
  static get(url, params) {
    return new Promise((resolve, reject) => {
      axios.get(url, {
        params: params
      }).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  }

  static post(url, params) {
    return new Promise((resolve, reject) => {
      axios.post(url, JSON.stringify(params), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      ).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  }
}
