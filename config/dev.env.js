let api = '"http://dev.portal-api.xh-payment.com/api/v1"'
if (process.argv[2]) api = '"'+process.argv[2]+'"'

module.exports = {
    NODE_ENV: '"development"',
    ENV_CONFIG: '"dev"',
    API_BASE_URL: api,
    BASE_PATH: '"/"'
}
