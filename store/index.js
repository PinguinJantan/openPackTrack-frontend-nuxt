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
          if (result.success) {
           vuexContext.commit('setToken', result.user.token); 
           localStorage.setItem('token', result.user.token)
          } else {

          }
        }).catch(err => {
          console.log('the errors : ', err)
        })
        console.log('trying to login')
      },
      logout(vuexContext) {
        vuexContext.commit('clearToken')
        if (process.client) {
          localStorage.removeItem('token')
        }
      }
    },
    getters: {
      isLogedIn(state) {
        return state.token !== null ? true : false;
      }
    } 
  })
}

export default createStore;