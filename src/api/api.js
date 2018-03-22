import Http from '../utils/request';

export const ceshi = (params) => {
	return Http.get('/operator/queryList',params)
			.then(res=>{

			}).catch(error => {

			})
};
export const ceshiPost = (params) => {
	return Http.post('/operator/queryList',params)
			.then(res=>{

			}).catch(error => {

			})
};