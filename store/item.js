export const state = () => ({
})

export const mutations = {
}

export const actions = {
  async createSku({ dispatch }, { name, code, category, color, gender }) {
    let result

    try {
      result = await this.$axios.$post('/api/sku/create', { code, name, category, color, gender })
      if (result.success) {
        return result.sku
      } else {
        dispatch('notify', { type: 'error', message: result.message }, { root: true })
      }
    } catch (err) {
      dispatch('notify', { type: 'error', message: err.message }, { root: true })
    }
  },
  async detailItem({ dispatch }, { code }) {
    let result
    try {
      result = await this.$axios.$get(`/api/item/${code}`)
      if (result.success) {
        return result.item
      } else {
        dispatch('notify', { type: 'error', message: result.message }, { root: true })
      }
    } catch(err) {
      dispatch('notify', { type: 'error', message: err.message }, { root: true })
    }
  },
  async deleteItem({ dispatch }, { id }) {
    let result
    try {
      result = await this.$axios.$delete(`/api/item/delete/${id}`)
      if (result.success) {
        dispatch('notify', { type: 'teal', message: result.message }, { root: true })
        return result
      } else {
        dispatch('notify', { type: 'error', message: result.message }, { root: true })
      }
    } catch(err) {
      dispatch('notify', { type: 'error', message: err.message }, { root: true })
    }
  }
}

export const getters = {
}
