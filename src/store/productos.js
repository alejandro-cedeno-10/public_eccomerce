import FormData from 'form-data'

export default {
  namespaced: true,
  state () {
    return {
      combos: [],
      productos: [],
      productosAdmin: [],
      productoSeleccionado: null,
      productosSeleccionados: [],
      mensajeError: null,
      isLoading: false
    }
  },
  getters: {},
  mutations: {
    setProductos: (state, prods) => {
      state.productos = prods
    },
    setCombos: (state, prods) => {
      state.combos = prods
    },
    setMensajeError: (state, mensaje) => {
      state.mensajeError = mensaje
    },
    setLoading: (state, val) => {
      state.isLoading = val
    },
    setProductoSeleccionado: (state, val) => {
      state.productoSeleccionado = val
    },
    setProductosSeleccionados: (state, val) => {
      state.productosSeleccionados = val
    }
  },
  actions: {
    setProductoSeleccionado: ({ commit }, prod) => {
      commit('setProductoSeleccionado', prod)
    },
    setProductosSeleccionados: ({ commit }, prods) => {
      console.log(prods)
      commit('setProductosSeleccionados', prods)
    },
    registrarProducto: ({ commit }, { axios, producto }) => {
      return new Promise((resolve, reject) => {
        // commit('setLoading', true)
        const data = new FormData()
        data.append('id_categoria', producto.id_categoria)
        data.append('nombre', producto.nombre)
        data.append('descripcion', producto.descripcion)
        if (producto.img) {
          data.append('url_imagen', producto.img)
        }

        axios.post('/producto/create', data)
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
    registrarProductoJSON: ({ commit }, { axios, producto }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.post('/producto/create', {
          id_categoria: producto.id_categoria,
          nombre: producto.nombre,
          descripcion: producto.descripcion ? producto.descripcion : ' ',
          url_imagen: producto.url_imagen
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
    actualizarProducto: ({ commit }, { axios, producto }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.put('/producto/actualizar', {
          id: producto.id,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          url_imagen: producto.url_imagen
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
    eliminarProducto: ({ commit }, { axios, id }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.delete('/producto/eliminar/' + id)
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
    listarProductosCategoriaAdmin: ({ commit }, { axios, idCategoria }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.get('/producto/adminProductos_categoria/' + idCategoria)
          .then(function (response) {
            // console.log(response.data)
            commit('setLoading', false)
            commit('setProductos', response.data)
            resolve(response)
          })
          .catch(function (error) {
            commit('setMensajeError', error.response.data.message)
            reject(error.response)
          })
      })
    },
    listarProductos: ({ commit }, axios) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.get('/producto')
          .then(function (response) {
            // console.log(response.data)
            commit('setLoading', false)
            commit('setProductos', response.data)
            resolve(response)
          })
          .catch(function (error) {
            commit('setMensajeError', error.response.data.message)
            reject(error.response)
          })
      })
    },
    listarCombos: ({ commit }, axios) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.get('/categorias/combo')
          .then(function (response) {
            // console.log(response.data)
            commit('setLoading', false)
            commit('setCombos', response.data)
            resolve(response)
          })
          .catch(function (error) {
            commit('setMensajeError', error.response.data.message)
            reject(error.response)
          })
      })
    },
    productosDeCategoria: ({ commit }, { axios, id }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.get('/producto/productos_categoria/' + id)
          .then(function (response) {
            // console.log(response.data)
            commit('setLoading', false)
            resolve(response)
          })
          .catch(function (error) {
            commit('setMensajeError', error.response.data.message)
            reject(error.response)
          })
      })
    },
    getProducto: ({ commit }, { axios, id }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.get('/producto/buscar/' + id)
          .then(function (response) {
            commit('setLoading', false)
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
