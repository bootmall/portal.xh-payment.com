import axios from '@/utils/http'
import common from '@/utils/common'

export function checkCanRemit(user) {
  return new Promise((resolve, reject) => {
    var url = '/user/check-can-remit';
    axios.post(url,user).then(
      response => {
        if (response.code == 0) {
          resolve(response);
        } else {
          reject(response.message);
        }
      }, response => {
        reject(response);
      }
    ).catch((error) => {
      reject(error);
    });
  });
}
