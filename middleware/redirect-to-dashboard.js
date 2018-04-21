export default function({ store, route, redirect }) {
  // redirect when it's logedin
  const pageNames = ['index', 'login']

  pageNames.forEach(page => {
    if (page === route.name) {
      redirect('/dashboard') 
    }
  })
}