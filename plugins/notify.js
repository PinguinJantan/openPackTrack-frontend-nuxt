import Vue from 'vue'

export default ({ app }) => {
  Vue.prototype.$notify = (string, options) => notify(app, { string, ...options })
  Vue.prototype.$notifyError = (string, options) => notify(app, { type: 'error', string, ...options })
}

function notify (app, { type='show', prefix='', string='' }) {
  return app.$toast[type](`${prefix} ${string}`)
}
