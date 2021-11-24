import jwtDecode from 'jwt-decode'

export const state = {
  auth: {
    sub: 'Martin Nacimiento',
    scopes: [],
  },
  is_dark_mode: false,
}

export const getters = {
  isAuth: (state) => {
    return !!state.auth
  },
  can: (state) => (permission) => {
    if (permission === '*') return true
    return state.auth?.scopes.find((p) => p === permission)
  },
}

export const mutations = {
  setIsAuth(state, auth) {
    state.auth = auth
  },
  setBooks(state, books) {
    state.books = books
  },
  setIsDarkMode(state, status) {
    // localStorage.setItem('is_dark_mode', status)
    state.is_dark_mode = status
  },
  setScopes(state, scopes) {
    state.auth.scopes = scopes
  },
}

export const actions = {
  async get_token({ commit }, credentials) {
    try {
      // eslint-disable-next-line camelcase
      const { access_token } = await this.$axios.$post(
        'login',
        {},
        { auth: credentials }
      )
      this.$axios.setToken(access_token, 'Bearer')
      const auth = jwtDecode(access_token)
      const { permissions } = await this.$axios.$get('permisos/token')
      commit('setIsAuth', auth)
      commit('setScopes', permissions)
    } catch (error) {
      commit('setIsAuth', null)
    }
  },

  delete_token({ commit }) {
    this.$axios.setToken(false)
    commit('setIsAuth', null)
    this.$router.push('/')
  },
}
