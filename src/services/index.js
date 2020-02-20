import {
    get,
    post,
    del,
    update,
    uploadFile
} from '../utils/index'
let ipandport = 'http://2622536c3m.zicp.vip:16591' //liziyuan 'http://29i2k99452.zicp.vip' //xiangzige 


export async function test(params) {
    return post(`${ipandport}/test/query`, params);
}

export async function login(params) {
    return post(`${ipandport}/sysAccount/applogin`, params);
}

export async function logout(params) {
    return post(`${ipandport}/sysAccount/applogout`, params);
}

//Info-device
export async function infodevice(params) {
    return post(`${ipandport}/equipment/queryList`, params);
}

export async function infodevicedetail(params) {
    return post(`${ipandport}/equipment/queryById`, params);
}

export async function userlist(params) {
    return post(`${ipandport}/sysUser/queryList`, params);
}























































