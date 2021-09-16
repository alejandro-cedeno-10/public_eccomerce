export default {
  namespaced: true,
  state () {
    return {
      tipos_pago: [],
      mensajeError: null,
      isLoading: false
    }
  },
  getters: {},
  mutations: {
    setTiposPago: (state, tiposPagos) => {
      state.tipos_pago = tiposPagos
    },
    setMensajeError: (state, mensaje) => {
      state.mensajeError = mensaje
    },
    setLoading: (state, val) => {
      state.isLoading = val
    }
  },
  actions: {
    registrarTipoPago: ({ commit }, { axios, tipoPago }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.post('/tipo_pago/create', {
          tipo_pago: tipoPago.tipo_pago
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
    actualizarTipoPago: ({ commit }, { axios, tipoPago }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.put('/tipo_pago/actualizar', {
          id: tipoPago.id,
          tipo_pago: tipoPago.tipo_pago
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
    eliminarTipoPago: ({ commit }, { axios, id }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.delete('/tipo_pago/eliminar/' + id)
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
    listarTiposPago: ({ commit }, axios) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.get('/tipo_pago')
          .then(function (response) {
            commit('setLoading', false)
            commit('setTiposPago', response.data)
            resolve(response)
          })
          .catch(function (error) {
            commit('setMensajeError', error.response.data.message)
            reject(error.response)
          })
      })
    },
    getTipoPago: ({ commit }, { axios, id }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.get('/tipo_pago/buscar/' + id)
          .then(function (response) {
            commit('setLoading', false)
            // commit('settipos_pago', response.data)
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
