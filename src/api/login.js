import axios from '@/utils/http'
import common from '@/utils/common'

export function loginByUsername(userInfo) {
  return new Promise((resolve, reject) => {
    var url = '/user/login';
    axios.post(url, userInfo).then(
      response => {
        if (response.code == 0) {
          common.setPermissions('access_token',response.data.permissions)
          resolve(response);
        } else {
          reject(response);
        }
      },
      response => {
        reject(response);
      }
    ).catch((error) => {
      reject(error);
    });
  });
}

export function logout() {
  return new Promise((resolve, reject) => {
    var url = '/user/logout';
    axios.post(url).then(
      response => {
        if (response.code == 0) {
          resolve(response);
        } else {
          reject(response);
        }
      }, response => {
        reject(response);
      }
    ).catch((error) => {
      reject(error);
    });
  });
}

export function getUserInfo(token) {
  return new Promise((resolve, reject) => {
    var url = '/user/profile';
    axios.post(url, token).then(
      response => {
        if (response.code == 0) {
          resolve(response);
        } else {
          reject(response);
        }
      }, response => {
        reject(response);
      }
    ).catch((error) => {
      reject(error);
    });
  });
}