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
        return result;
      }
    } catch (err) {
      return err
    }
  }
}

export const getters = {
}
