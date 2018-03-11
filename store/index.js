import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      token: null,
      alert: {
        show: false,
        content: ''
      }
    },
    mutations: {
      setToken(state, token) {
        state.token = token;
      },
      clearToken(state) {
        state.token = null;
      },
      setAlert(state, content) {
        state.alert.show = true;
        state.alert.content = content;
      },
      clearAlert(state) {
        state.alert.show = false;
        state.alert.content = '';
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
      },
      alert(state) {
        return state.alert;
      },
    } 
  })
}

export default createStore;