import dva from 'dva';
import './index.css';
// import loading from 'dva-loading'
// import React, { Component } from 'react'; 
// import { Layout } from './layout';
// import API from './utils/request'

// console.log(API.get('/operator/queryList'));
// 1. Initialize
const app = dva({
  	initialState: {
     	products: [
       		{ name: 'dva', id: 1 },
       		{ name: 'antd', id: 2 },
     	],
   	},
 });

// 2. Plugins
// app.use({});
//app.use(loading())
// 3. Model
// app.model(require('./models/example').default);
app.model(require('./models/product').default)

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

