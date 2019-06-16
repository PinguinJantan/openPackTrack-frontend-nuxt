export const state = () => ({
  roleResources: []
})

export const mutations = {
  SET_ROLE_RESOURCES (state, resources) {
    state.roleResources = resources
  }
}

export const actions = {
  async nuxtServerInit ({ commit }, ctx) {
    try {
      // @TODO
      // const result = await ctx.$axios.get(`/api/user/role/admin/resource`)
      const result = {
        data: [
          {
            name: 'item'
          },
          {
            name: 'user'
          }
        ]
      }
      commit('SET_ROLE_RESOURCES', result.data)
    } catch (error) {
      console.log('error :', error.message)
    }
  }
}

export const getters = {
  roleResources: state => state.roleResources
}
