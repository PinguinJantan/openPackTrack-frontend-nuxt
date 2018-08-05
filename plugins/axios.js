export default function ({ $axios, store, $auth }) {
  $axios.onRequest(config => {
    if (store.state.token) {
      config.headers.common['Authorization'] = `Bearer ${store.state.token}`
    }
  })
}