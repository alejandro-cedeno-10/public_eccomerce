import FormData from 'form-data'

export default {
  namespaced: true,
  state () {
    return {
      categorias: [],
      mensajeError: null,
      isLoading: false,
      loadingCategorias: false
    }
  },
  getters: {},
  mutations: {
    setCategorias: (state, prods) => {
      state.categorias = prods
    },
    setMensajeError: (state, mensaje) => {
      state.mensajeError = mensaje
    },
    setLoading: (state, val) => {
      state.isLoading = val
    },
    setLoadingCategorias: (state, val) => {
      state.isLoadingCategorias = val
    }
  },
  actions: {
    registrarCategoria: ({ commit }, { axios, categoria }) => {
      return new Promise((resolve, reject) => {
        const data = new FormData()
        data.append('nombre', categoria.nombre)
        data.append('descripcion', categoria.descripcion)
        if (categoria.img) {
          data.append('url_imagen', categoria.img)
        }

        commit('setLoading', true)
        axios.post('/categoria/create', data)
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
    registrarCategoriaJSON: ({ commit }, { axios, categoria }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.post('/categoria/create', {
          nombre: categoria.nombre,
          descripcion: categoria.descripcion
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
    actualizarCategoria: ({ commit }, { axios, categoria }) => {
      return new Promise((resolve, reject) => {
        const datos = new FormData()
        datos.append('id', categoria.id)
        datos.append('nombre', categoria.nombre)
        datos.append('descripcion', categoria.descripcion)

        commit('setLoading', true)

        if (categoria.nuevaImg) {
          datos.append('url_imagen', categoria.nuevaImg)
        }
        axios.post('/categoria/actualizar', datos)
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
    actualizarCategoriaJSON: ({ commit }, { axios, categoria }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.put('/categoria/actualizar', {
          id: categoria.id,
          nombre: categoria.nombre,
          descripcion: categoria.descripcion
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
    eliminarCategoria: ({ commit }, { axios, id }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.delete('/categoria/eliminar/' + id)
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
    listarCategorias: ({ commit }, axios) => {
      return new Promise((resolve, reject) => {
        commit('setLoadingCategorias', true)
        axios.get('/categoria')
          .then(function (response) {
            // console.log(response)
            commit('setLoadingCategorias', false)
            commit('setCategorias', response.data)
            resolve(response)
          })
          .catch(function (error) {
            commit('setMensajeError', error.response.data.message)
            reject(error.response)
          })
      })
    },
    listarCategoriasAdmin: ({ commit }, axios) => {
      return new Promise((resolve, reject) => {
        commit('setLoadingCategorias', true)
        axios.get('/categoria/adminCategoria')
          .then(function (response) {
            console.log(response)
            commit('setLoadingCategorias', false)
            commit('setCategorias', response.data)
            resolve(response)
          })
          .catch(function (error) {
            commit('setMensajeError', error.response.data.message)
            reject(error.response)
          })
      })
    },
    getCategoria: ({ commit }, { axios, id }) => {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.get('/categoria/buscar/' + id)
          .then(function (response) {
            commit('setLoading', false)
            // commit('setCategorias', response.data)
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
