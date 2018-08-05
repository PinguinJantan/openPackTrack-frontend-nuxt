export default {
  createSku (axios, name, code, category, color, gender) {
    return axios.$post('/api/sku/create', {
      code: code,
      name: name,
      category: category,
      color: color,
      gender: gender
    })
    .then(res => {
      if (res.success) {
        return res.sku
      }
      else {
        this.notify({ type: 'error', message: res.message });
      }
    })
    .catch(err => {
      this.notify({ type: 'error', message: err.message });
    })
  }
}