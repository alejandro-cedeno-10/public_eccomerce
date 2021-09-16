export default {
  namespaced: true,
  state () {
    return {
      token: localStorage.getItem('token') || '',
      user: null,
      mensajeError: null,
      isLoading: false
    }
  },
  getters: {
    isLoggedIn: state => {
      if (state.token !== '' || state.token) {
        return true
      }
      return false
    },
    getUsuario: state => {
      return state.user
    },
    getMensajeError: state => {
      return state.mensajeError
    }
  },
  mutations: {
    setToken: (state, tok) => {
      state.token = tok
    },
    setUsuario: (state, user) => {
      state.user = user
    },
    setMensajeError: (state, mensaje) => {
      state.mensajeError = mensaje
    },
    setLoading: (state, val) => {
      state.isLoading = val
    }
  },
  actions: {
    login: ({ commit }, { axios, loginData }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.post('/oauth/token', {
          email: loginData.email,
          password: loginData.password,
          remember_me: loginData.remember_me
        })
          .then(function (response) {
            commit('setLoading', false)
            // console.log(response)
            commit('setToken', response.data.access_token)
            localStorage.setItem('token', response.data.access_token)
            axios.defaults.headers.common.Authorization = 'Bearer ' + response.data.access_token
            resolve()
          })
          .catch(function (error) {
            commit('setLoading', false)
            commit('setMensajeError', error.response.data.message)
            reject(error.response)
          })
      })
    },
    register: ({ commit }, { axios, user }) => {
      return new Promise((resolve, reject) => {
        axios({ url: '/oauth/token/signup', data: user, method: 'POST' })
          .then(resp => {
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    logout: ({ commit }, axios) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.get('/session/logout')
          .then(function (response) {
            commit('setLoading', false)
            // console.log(response)
            commit('setToken', '')
            commit('setUsuario', null)
            localStorage.removeItem('token')
            delete axios.defaults.headers.common.Authorization
            resolve()
          })
          .catch(function (error) {
            commit('setLoading', false)
            commit('setMensajeError', error.response.data.message)
            reject(error.response)
          })
      })
    },
    getUsuario: ({ commit, state }, axios) => {
      const token = state.token
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        const options = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + state.token
          }
        }
        axios.get(process.env.API_URL + '/api/user', options)
          .then(function (response) {
            commit('setLoading', false)
            commit('setUsuario', response.data)
            axios.defaults.headers.common.Authorization = 'Bearer ' + token
            resolve(response.data)
          })
          .catch(function (error) {
            commit('setLoading', false)
            commit('setToken', '')
            localStorage.removeItem('token')
            delete axios.defaults.headers.common.Authorization
            commit('setMensajeError', error.response.data.message)
            reject(error.response)
          })
      })
    },
    actualizarDatos: ({ commit }, { axios, datos }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.put('/users/actualizar', datos)
          .then(function (response) {
            commit('setLoading', false)
            resolve()
          })
          .catch(function (error) {
            commit('setLoading', false)
            commit('setMensajeError', error.response.data.message)
            reject(error.response)
          })
      })
    },
    cambiarPass: ({ commit }, { axios, datos }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.put('/users/actualizar', datos)
          .then(function (response) {
            commit('setLoading', false)
            resolve()
          })
          .catch(function (error) {
            commit('setLoading', false)
            commit('setMensajeError', error.response.data.message)
            reject(error.response)
          })
      })
    }
  }
}
