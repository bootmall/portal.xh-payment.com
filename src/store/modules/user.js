import { loginByUsername, logout, getUserInfo,loginVerifyKey } from '@/api/login'
import common from '@/utils/common'

const user = {
  state: {
    user: {},
    status: '',
    code: '',
    token: common.getToken(),
    username: '',
    id: '',
    nickname: '',
    avatar: '',
    introduction: '',
    roles: [],
    permissions: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_USER: (state, user) => {
      // console.log('set user',user);
      common.setPermissions(user.permissions)
        state.user = user
    },
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    },
    SET_NICKNAME: (state, nickname) => {
      state.username = nickname
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      // console.log('SET_PERMISSIONS', permissions)
      state.permissions = permissions
      common.setPermissions(permissions)
    },
  },

  actions: {
    setPermissions({ commit }, permissions) {
      commit('SET_PERMISSIONS', data.permissions)
    },
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginByUsername(userInfo).then(response => {
          const data = response.data
          commit('SET_USER', data)
          commit('SET_ROLES', data.role)
          commit('SET_PERMISSIONS', data.permissions)
          commit('SET_NICKNAME', data.nickname==''?data.username:data.nickname)
          commit('SET_USERNAME', data.username)
          commit('SET_ID', data.id)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', '')
          commit('SET_TOKEN', data.access_token)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        if(!state.token){
          reject('未登录')
          return;
        }
        getUserInfo(state.token).then(response => {
          if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject('error')
          }
          const data = response.data
          commit('SET_USER', data)
          commit('SET_ROLES', data.role)
          commit('SET_NICKNAME', data.nickname==''?data.username:data.nickname)
          commit('SET_USERNAME', data.username)
          commit('SET_PERMISSIONS', data.permissions)
          commit('SET_ID', data.id)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', '')

          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        if(state.token){
          let token = state.token
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          common.removeToken()
          common.setPermissions([])

          logout(token).then(() => {
            resolve()
          }).catch(error => {
            reject(error)
          })
        }

      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        common.removeToken()
        common.setPermissions([])
        resolve()
      })
    },
  }
}

export default user
