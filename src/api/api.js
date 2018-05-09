import Http from '../utils/request';


/*--登录--*/
export const Login = (params) => {
	return Http.post('/login',params)
};
/*--获取菜单--*/
export const MenuList = (params) => {
	return Http.post('/menu/queryLeftMenu',params)
};
/*--------------------------我的工作---------------------------------*/
//我发起的工作
export const myTaskList = (params) => {
	return Http.post('/tasks/myInitQueryList',params)
};
//代办工作列表
export const todoTaskList = (params) => {
	return Http.post('/tasks/todoTasksList',params)
};
//房东列表
export const landlordList = (params) => {
	return Http.post('/landlordUser/landlordList',params)
};

//获取OSS上传图片参数
export const picUpload = (params) => {
	
	return Http.post('/upload/picUpload',params)
};
//上传OSS图片保存到数据库
export const addAttach = (params) => {
	return Http.post('/upload/addAttach',params)
};
//查看图片
export const lookAttach = (params) => {
	return Http.post('/upload/lookAttach',params)
};
//删除图片
export const delAttach = (params) => {
	return Http.post('/upload/delAttach',params)
};
//新增房东信息
export const addLandlordUser = (params) => {
	return Http.post('/landlordUser/addLandlordUser',params)
};
//房东失效
export const delLandlord = (params) => {
	return Http.post('/landlordUser/delLandlord',params)
};
//房东详情
export const landlordDetail = (params) => {
	return Http.post('/landlordUser/landlordDetail',params)
};
//验证手机号是否注册
export const isRegister = (params) => {
	return Http.post('/landlord/isRegister',params)
};


/*--------------------------系统管理---------------------------------*/
//用户管理列表
export const UserList = (params) => {
	return Http.post('/sysUser/querySysUserList',params)
};
//获取角色名称
export const RoleName = (params) => {
	return Http.post('/role/queryRoleName',params)
};
// 用户删除
export const UserDelete = (params) => {
	return Http.post('/sysUser/deleteSysUser',params)
};
// 用户修改和添加
export const UserUpdate = (params) => {
	return Http.post('/sysUser/saveSysUser',params)
};
//角色管理列表
export const RoleList = (params) => {
	return Http.post('/role/queryRoleList',params)
};
//角色删除
export const RoleDelete = (params) => {
	return Http.post('/role/deleteRole',params)
};
//角色修改添加
export const RoleUpdate = (params) => {
	return Http.post('/role/saveRole',params)
};

/*--------------------------房源管理---------------------------------*/
//房源列表
export const HouseReList = (params) => {
	return Http.post('/houseResource/resourceList',params)
};
//房源详情
export const HouseReDeatil = (params) => {
	return Http.post('/houseResource/resourceInfo',params)
};
//房源审核
export const HouseCheck = (params) => {
	return Http.post('/houseResource/auditResource',params)
};
//房源审核列表
export const HouseCheckList = (params) => {
	return Http.post('/houseResource/auditResourceList',params)
};
//房源附件列表
export const AttachList = (params) => {
	return Http.post('/houseResource/houseResourceAttachList',params)
};
//房源租房合同
export const HouseRend = (params) => {
	return Http.post('/houseResource/countListByResourceId',params)
};

/*------------------------租赁合同管理-------------------------------*/
//合同列表
export const RentList = (params) => {
	return Http.post('/rentCon/rentLandList',params)
};
//根据合同id查询合同图片列表
export const RentPicList = (params) => {
	return Http.post('/rentCon/rentAttachList',params)
};
//合同图片列表保存
export const RentPicSave = (params) => {
	return Http.post('/rentCon/saveRentAttach',params)
};

/*------------------------租客管理-------------------------------*/
//租客列表
export const RenterList = (params) => {
	return Http.post('/clientUser/userList',params)
};

/*------------------------房东贷款-------------------------------*/
//房东贷款详情
export const orderDetail = (params) => {
	return Http.post('/audit/orderDetail',params)
};
//获取附件图片
export const attachList = (params) => {
	return Http.post('/audit/attachList',params)
};