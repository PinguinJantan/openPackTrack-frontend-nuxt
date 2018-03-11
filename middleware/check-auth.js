export default function({ store, req }) {
  console.log('terpanggil')
  store.dispatch('initAuth', req);
}