export const state = () => ({
  test: 'test'
})

export const mutations = {
}

export const actions = {
  async createSku({ dispatch }, data) {
    let result

    try {
      result = await this.$axios.$post('/api/sku/create', {
        code: data.code,
        name: data.name,
        category: data.category,
        color: data.color,
        gender: data.gender
      })
      if (result.success) {
        return result.sku
      } else {
        dispatch.notify({ type: 'error', message: result.message })
      }
    } catch (err) {
      dispatch.notify({ type: 'error', message: err.message })
    }
  }
}

export const getters = {
}
