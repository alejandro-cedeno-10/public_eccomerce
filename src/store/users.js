export default {
  namespaced: true,
  state () {
    return { }
  },
  getters: {},
  mutations: { },
  actions: {
    listarClientes: ({ commit }, axios) => {
      return new Promise((resolve, reject) => {
        axios.get('/users/not_admin')
          .then(function (response) {
            resolve(response)
          })
          .catch(function (error) {
            reject(error.response)
          })
      })
    },
    listarEmpleados: ({ commit }, axios) => {
      return new Promise((resolve, reject) => {
        axios.get('/users/admin')
          .then(function (response) {
            resolve(response)
          })
          .catch(function (error) {
            reject(error.response)
          })
      })
    }
  }
}
