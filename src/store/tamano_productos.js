export default {
  namespaced: true,
  state () {
    return {
      tamano_productos: [],
      mensajeError: null,
      isLoading: false
    }
  },
  getters: {},
  mutations: {
    setTamanoProductos: (state, prods) => {
      state.tamano_productos = prods
    },
    setMensajeError: (state, mensaje) => {
      state.mensajeError = mensaje
    },
    setLoading: (state, val) => {
      state.isLoading = val
    }
  },
  actions: {
    registrarTamanoProducto: ({ commit }, { axios, tamanoProducto }) => {
      console.log(tamanoProducto)
      return new Promise((resolve, reject) => {
        const datos = new FormData()
        datos.append('id_tamano', tamanoProducto.id_tamano)
        datos.append('id_producto', tamanoProducto.id_producto)
        datos.append('precio', tamanoProducto.precio)
        datos.append('stock', tamanoProducto.stock)

        if (tamanoProducto.url_imagen) {
          datos.append('url_imagen', tamanoProducto.url_imagen)
        }

        commit('setLoading', true)

        axios.post('/tamano_producto/create', datos)
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
    actualizarTamanoProducto: ({ commit }, { axios, tamanoProducto }) => {
      console.log(tamanoProducto)
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        console.log({
          id_tamano: tamanoProducto.id_tamano,
          id_producto: tamanoProducto.id_producto,
          precio: tamanoProducto.precio,
          stock: tamanoProducto.stock,
          url_imagen: tamanoProducto.url_imagen
        })
        axios.post('/tamano_producto/actualizar', {
          id_tamano: tamanoProducto.id_tamano,
          id_producto: tamanoProducto.id_producto,
          precio: tamanoProducto.precio,
          stock: tamanoProducto.stock,
          url_imagen: tamanoProducto.url_imagen
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
    eliminarTamanoProducto: ({ commit }, { axios, idTamano, idProducto }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.delete('/tamano_producto/eliminar/' + idTamano + '/' + idProducto)
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
    listarTamanoProductos: ({ commit }, axios) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.get('/tamano_producto')
          .then(function (response) {
            commit('setLoading', false)
            commit('setTamanoProductos', response.data)
            resolve(response)
          })
          .catch(function (error) {
            commit('setMensajeError', error.response.data.message)
            reject(error.response)
          })
      })
    },
    getTamanosDe: ({ commit }, { axios, id }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.get('tamano_producto/lista_tamano/' + id)
          .then(function (response) {
            console.log(response)
            commit('setLoading', false)
            resolve(response)
          })
          .catch(function (error) {
            commit('setMensajeError', error.response.data.message)
            reject(error.response)
          })
      })
    },
    getTamanoProducto: ({ commit }, { axios, id }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.get('/tamano_producto/buscar/' + id)
          .then(function (response) {
            commit('setLoading', false)
            // commit('settamano_productos', response.data)
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
