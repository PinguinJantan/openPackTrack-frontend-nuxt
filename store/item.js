export const state = () => ({
  test: 'test'
})

export const mutations = {
}

export const actions = {
  async createSku({ dispatch }, { name, code, category, color, gender }) {
    let result

    try {
      result = await this.$axios.$post('/api/sku/create', {
        code: code,
        name: name,
        category: category,
        color: color,
        gender: gender
      })
      if (result.success) {
        return result.sku
      } else {
        dispatch('notify', { type: 'error', message: result.message }, { root: true })
      }
    } catch (err) {
      dispatch('notify', { type: 'error', message: err.message }, { root: true })
    }
  }
}

export const getters = {
}
