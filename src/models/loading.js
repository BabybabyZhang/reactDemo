/* eslint-disable */
export default {
  namespace: 'loading',
  state: {
  	loading:false,
  	tableLoading:false,
    url:'http://192.168.1.11:2002'
  },
  reducers: {
    'update'(state, action) {
      return {...state,loading:action.loading};
    },
    'updateTable'(state, action) {
      return {...state,tableLoading:action.tableLoading};
    },
  },
};