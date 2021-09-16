export default {
  namespaced: true,
  state () {
    return {
      detalles: [],
      mensajeError: null,
      isLoading: false
    }
  },
  getters: {},
  mutations: {
    setDetalles: (state, detalle) => {
      state.detalles = detalle
    },
    setMensajeError: (state, mensaje) => {
      state.mensajeError = mensaje
    },
    setLoading: (state, val) => {
      state.isLoading = val
    }
  },
  actions: {
    registrarDetalles: ({ commit }, { axios, Detalles }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.post('/detalle/create', {
          id_factura: Detalles.id_factura,
          id_producto: Detalles.id_producto,
          cantidad: Detalles.cantidad,
          precio: Detalles.precio
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
    actualizarDetalles: ({ commit }, { axios, Detalles }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.put('/detalle/actualizar', {
          id_factura: Detalles.id_factura,
          id_producto: Detalles.id_producto,
          cantidad: Detalles.cantidad,
          precio: Detalles.precio
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
    eliminarDetalles: ({ commit }, { axios, idFactura, idProducto }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.delete('/detalle/eliminar/' + idFactura + '/' + idProducto)
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
        axios.get('/detalle')
          .then(function (response) {
            commit('setLoading', false)
            commit('setDetalles', response.data)
            resolve(response)
          })
          .catch(function (error) {
            commit('setMensajeError', error.response.data.message)
            reject(error.response)
          })
      })
    },
    getDetalles: ({ commit }, { axios, id }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.get('/detalle/buscar/' + id)
          .then(function (response) {
            commit('setLoading', false)
            // commit('setdetalle', response.data)
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
