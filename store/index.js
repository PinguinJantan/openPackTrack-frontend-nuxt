export const state = () => ({
  roleResources: []
})

export const mutations = {
  SET_ROLE_RESOURCES (state, resources) {
    state.roleResources = resources
  }
}

export const actions = {
  async nuxtServerInit ({ dispatch }) {
    await dispatch('fetchResourceRoles')
  },
  async fetchResourceRoles ({ commit, state }) {
    if (!state.auth.loggedIn) return
    // get role resources
    try {
      const result = await this.$axios.get(`/api/user/role/${state.auth.user.roles[0]}`)
      commit('SET_ROLE_RESOURCES', result.data.role.resources)
    } catch (error) {
      console.log('error :', error)
    }
  }
}

export const getters = {
  roleResources: state => state.roleResources
}
