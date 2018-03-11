export default function(context) {
  console.log('middleware auth')
  context.store.dispatch('initAuth', context.req)
}