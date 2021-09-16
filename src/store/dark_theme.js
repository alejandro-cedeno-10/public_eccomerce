export default {
  namespaced: true,
  state () {
    return {
      theme: localStorage.getItem('producto_theme') || ''
    }
  },
  getters: {
    //
  },
  mutations: {
    setTheme: (state, theme) => {
      state.theme = theme
    }
  },
  actions: {
    setTheme: ({ commit }, theme) => {
      if (theme === 'dark') {
        localStorage.removeItem('producto_theme')
        localStorage.setItem('producto_theme', 'dark')
        commit('setTheme', 'dark')
      } else if (theme === 'light') {
        localStorage.removeItem('producto_theme')
        localStorage.setItem('producto_theme', 'light')
        commit('setTheme', 'light')
      }
    }
  }
}
