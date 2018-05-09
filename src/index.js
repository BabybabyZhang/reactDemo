/* eslint-disable */
import dva from 'dva';
import './index.css';
import createHistory from 'history/createBrowserHistory';
import './assets/antd_important.less'

// 1. Initialize
const app = dva({
	history: createHistory(),
  	initialState: {
     	products: [
       		{ name: 'dva', id: 1 },
       		{ name: 'antd', id: 2 },
     	],
   	}
 });
// 2. Plugins
// 3. Model
// app.model(require('./models/example').default);
app.model(require('./models/product').default)
app.model(require('./models/layout').default)
app.model(require('./models/loading').default)
//app.model(require('./models/login').default)

// 4. Router
app.router(require('./router').default);
//app.redux(require('./redux').default);

// 5. Start
app.start('#root');