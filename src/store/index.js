import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth.js'
import categorias from './categorias.js'
import productos from './productos.js'
import tamanos from './tamanos.js'
import tamanoProductos from './tamano_productos.js'
import cart from './cart.js'
import darkTheme from './dark_theme.js'
import users from './users.js'

Vue.use(Vuex)

const Store = new Vuex.Store({
  modules: {
    users,
    auth,
    categorias,
    productos,
    tamanos,
    tamanoProductos,
    cart,
    darkTheme
  },

  strict: process.env.DEV
})

export default Store
