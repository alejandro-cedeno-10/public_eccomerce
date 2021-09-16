export default {
  namespaced: true,
  state () {
    return {
      modos_pago: [],
      mensajeError: null,
      isLoading: false
    }
  },
  getters: {},
  mutations: {
    setModosPago: (state, modosPagos) => {
      state.modos_pago = modosPagos
    },
    setMensajeError: (state, mensaje) => {
      state.mensajeError = mensaje
    },
    setLoading: (state, val) => {
      state.isLoading = val
    }
  },
  actions: {
    registrarModoPago: ({ commit }, { axios, modoPago }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.post('/modo_pago/create', {
          id_tipo: modoPago.id_tipo,
          pago: modoPago.pago,
          detalles: modoPago.detalles
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
    actualizarModoPago: ({ commit }, { axios, modoPago }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.put('/modo_pago/actualizar', {
          id: modoPago.id,
          pago: modoPago.pago,
          detalles: modoPago.detalles
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
    eliminarModoPago: ({ commit }, { axios, id }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.delete('/modo_pago/eliminar/' + id)
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
    listarModosPago: ({ commit }, axios) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.get('/modo_pago')
          .then(function (response) {
            commit('setLoading', false)
            commit('setModosPago', response.data)
            resolve(response)
          })
          .catch(function (error) {
            commit('setMensajeError', error.response.data.message)
            reject(error.response)
          })
      })
    },
    getModoPago: ({ commit }, { axios, id }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.get('/modo_pago/buscar/' + id)
          .then(function (response) {
            commit('setLoading', false)
            // commit('setmodos_pago', response.data)
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
