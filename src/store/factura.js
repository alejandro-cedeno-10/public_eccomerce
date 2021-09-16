export default {
  namespaced: true,
  state () {
    return {
      factura: null,
      mensajeError: null,
      isLoading: false
    }
  },
  getters: {},
  mutations: {
    setFactura: (state, factura) => {
      state.factura = factura
    },
    setMensajeError: (state, mensaje) => {
      state.mensajeError = mensaje
    },
    setLoading: (state, val) => {
      state.isLoading = val
    }
  },
  actions: {
    registrarFacturas: ({ commit }, { axios, facturas }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.post('/factura/create', {
          id_user: facturas.id_user,
          num_pago: facturas.num_pago,
          fecha: facturas.fecha
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
    actualizarFacturas: ({ commit }, { axios, facturas }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.put('/factura/actualizar', {
          id: facturas.id,
          fecha: facturas.fecha
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
    eliminarFacturas: ({ commit }, { axios, id }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.delete('/factura/eliminar/' + id)
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
        axios.get('/factura')
          .then(function (response) {
            commit('setLoading', false)
            commit('setFactura', response.data)
            resolve(response)
          })
          .catch(function (error) {
            commit('setMensajeError', error.response.data.message)
            reject(error.response)
          })
      })
    },
    getFacturas: ({ commit }, { axios, id }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.get('/factura/buscar/' + id)
          .then(function (response) {
            commit('setLoading', false)
            // commit('setfactura', response.data)
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
