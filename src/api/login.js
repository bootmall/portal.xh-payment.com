import axios from '@/utils/http'
import common from '@/utils/common'

export function loginByUsername(userInfo) {
  return new Promise((resolve, reject) => {
    // console.log('api login........', data);
    var url = '/user/login';
    axios.post(url, userInfo).then(
      response => {
        if (response.code == 0) {
          console.log('axios post success.', response);
          common.setStorage('access_token',response.data.access_token)
          common.setPermissions('access_token',response.data.permissions)
          resolve(response);
        } else {
          reject(response);
        }
      },
      response => {
        console.log('axios post err.', response);
        reject(response);
      }
    ).catch((error) => {
      console.log('axios post err catch.', error);
      reject(error);
    });
  });
}

export function logout() {
  return new Promise((resolve, reject) => {
    console.log('api logout........');
    var url = '/user/logout';
    axios.post(url).then(
      response => {
        if (response.code == 0) {
          console.log('axios post success.', response);
          resolve(response);
        } else {
          reject(response);
        }
      }, response => {
        console.log('axios post err.', response);
        reject(response);
      }
    ).catch((error) => {
      console.log('axios post err catch.', error);
      reject(error);
    });
  });
}

export function getUserInfo(token) {
  return new Promise((resolve, reject) => {
    // console.log('api getUserInfo........', token);
    var url = '/user/profile';
    axios.post(url, token).then(
      response => {
        if (response.code == 0) {
          console.log('getUserInfo axios post success.', response);
          resolve(response);
        } else {
          reject(response);
        }
      }, response => {
        console.log('getUserInfo axios post err.', response);
        reject(response);
      }
    ).catch((error) => {
      console.log('getUserInfo axios post err catch.', error);
      reject(error);
    });
  });
}
// export function loginVerifyKey(userId,key_2fa) {
//     const data = {
//         userId,
//         key_2fa
//     }
//     return new Promise((resolve, reject) => {
//         // console.log('api login........', data);
//         var url = '/user/verify-key';
//         axios.post(url, data).then(
//             response => {
//                 if (response.code == 0) {
//                     common.setStorage('access_token',response.data.access_token)
//                     common.setPermissions('access_token',response.data.permissions)
//                     resolve(response);
//                 } else {
//                     reject(response);
//                 }
//             }, response => {
//                 reject(response);
//             }
//         ).catch((error) => {
//             reject(error);
//         });
//     });
// }

