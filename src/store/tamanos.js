export default {
  namespaced: true,
  state () {
    return {
      tamanos: [],
      mensajeError: null,
      loadingTamanos: false
    }
  },
  getters: {},
  mutations: {
    setTamanos: (state, prods) => {
      state.tamanos = prods
    },
    setMensajeError: (state, mensaje) => {
      state.mensajeError = mensaje
    },
    setLoading: (state, val) => {
      state.loadingTamanos = val
    }
  },
  actions: {
    registrarTamano: ({ commit }, { axios, tamano }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.post('/tamano/create', {
          nombre: tamano.nombre
        })
          .then(function (response) {
            commit('setLoading', false)
            resolve(response)
          })
          .catch(function (error) {
            commit('setMensajeError', error.response.data.message)
            reject(error.response)
          })
      })
    },
    actualizarTamano: ({ commit }, { axios, tamano }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.put('/tamano/actualizar', {
          id: tamano.id,
          nombre: tamano.nombre
        })
          .then(function (response) {
            commit('setLoading', false)
            resolve(response)
          })
          .catch(function (error) {
            commit('setMensajeError', error.response.data.message)
            reject(error.response)
          })
      })
    },
    eliminarTamano: ({ commit }, { axios, id }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.delete('/tamano/eliminar/' + id)
          .then(function (response) {
            commit('setLoading', false)
            resolve(response)
          })
          .catch(function (error) {
            commit('setMensajeError', error.response.data.message)
            reject(error.response)
          })
      })
    },
    listarTamanos: ({ commit }, axios) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.get('/tamano')
          .then(function (response) {
            commit('setLoading', false)
            commit('setTamanos', response.data)
            resolve(response)
          })
          .catch(function (error) {
            commit('setMensajeError', error.response.data.message)
            reject(error.response)
          })
      })
    },
    getTamano: ({ commit }, { axios, id }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.get('/tamano/buscar/' + id)
          .then(function (response) {
            commit('setLoading', false)
            // commit('settamanos', response.data)
            resolve(response)
          })
          .catch(function (error) {
            commit('setMensajeError', error.response.data.message)
            reject(error.response)
          })
      })
    }
  }
}
