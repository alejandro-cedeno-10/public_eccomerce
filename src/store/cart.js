export default {
  namespaced: true,
  state () {
    return {
      productos: [],
      total: 0
    }
  },
  mutations: {
    addProducto: (state, prod) => {
      const p = state.productos.find(e => (e.id_producto === prod.id_producto && e.id_presentacion === prod.id_presentacion))
      if (p) {
        p.cantidad += prod.cantidad
      } else {
        state.productos.push(prod)
      }
    },
    restProducto: (state, prod) => {
      console.log(prod)
      const p = state.productos.find(e => (e.id_producto === prod.id_producto && e.id_presentacion === prod.id_presentacion))
      if (p) {
        p.cantidad -= prod.cantidad
        if (p.cantidad <= 0) {
          state.productos = state.productos.filter(e => !(e.id_producto === prod.id_producto && e.id_presentacion === prod.id_presentacion))
        }
      } else {
        state.productos.push(prod)
      }
    },
    removeProducto: (state, id) => {
      state.productos = state.productos.filter(e => e.id === id)
    },
    addCantProducto: (state, { id, cant }) => {
      const prod = state.productos.find(e => e.id === id)
      prod.cantidad += cant
    },
    restCantProducto: (state, { id, cant }) => {
      const prod = state.productos.find(e => e.id === id)
      prod.cantidad -= cant
    }
  },
  actions: {
    addCompra: ({ commit }, { prod, cant }) => {
      const prodc = {
        id_presentacion: prod.id_presentacion,
        id_producto: prod.id_producto,
        cantidad: cant,
        nombre: prod.nombre,
        descripcion: prod.descripcion,
        presentacion: prod.presentacion,
        precio: prod.precio,
        img: prod.img
      }
      commit('addProducto', prodc)
    },
    restCompra: ({ commit }, { prod, cant }) => {
      const prodc = {
        id_presentacion: prod.id_presentacion,
        id_producto: prod.id_producto,
        cantidad: cant
      }
      commit('restProducto', prodc)
    },
    eliminarCompra: ({ commit }, prod) => {
      const prodc = {
        id_presentacion: prod.id_presentacion,
        id_producto: prod.id_producto,
        cantidad: prod.cantidad
      }
      commit('restProducto', prodc)
    },
    enviarPedido: ({ commit }, { id }) => {
      // commit('removeProducto', id)
    }
  }
}
