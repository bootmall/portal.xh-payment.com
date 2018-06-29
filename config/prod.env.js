var path = require('path')
let api = '"https://portal-api.gd95516.com/api/v1"'
if (process.argv[2]) api = '"'+process.argv[2]+'"'
module.exports = {
    NODE_ENV: '"production"',
    ENV_CONFIG: '"prod"',
    API_BASE_URL: api,
    BASE_PATH: '"/"',
};