export const state = () => ({})

export const mutations = {}

export const actions = {
  async createSku (_, { name, code, category, color, gender }) {
    let result

    try {
      result = await this.$axios.$post('/api/sku/create', { code, name, category, color, gender })
      return result.sku
    } catch (err) {
      throw err
    }
  },
  async detailItem (_, { code }) {
    let result
    try {
      result = await this.$axios.$get(`/api/item/${code}`)
      return result.item
    } catch (err) {
      throw err
    }
  },

  async deleteItem (_, { id }) {
    let result
    try {
      result = await this.$axios.$delete(`/api/item/delete/${id}`)
      return result
    } catch (err) {
      throw err
    }
  }
}

export const getters = {}
