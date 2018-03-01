import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      token: null,
    },
    mutations: {
      setToken(state, token) {
        state.token = token;
      },
      clearToken(state) {
        state.token = null;
      }
    },
    actions: {
      initAuth(vuexContext, req) {
        let token;

        if (req) {
          if (!req.headers.cookie) {
            return;
          }
        }
      },
      login(vuexContext, authData) {
        this.$axios.$post('/auth/login', authData).then(result => {
          console.log('the result : ', result)
        }).catch(err => {
          console.log('the errors : ', err)
        })
        console.log('trying to login')
      }
    }
  })
}

export default createStore;