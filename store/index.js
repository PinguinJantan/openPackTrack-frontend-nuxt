import Vuex from "vuex";

const createStore = () => {
  return new Vuex.Store({
    state: {
      notification: {
        color: 'error',
        active: false,
        message: ''
      }
    },
    mutations: {
      SET_NOTIFICATION(state, payload) {
        state.notification.active = !state.notification.active
        state.notification.message = payload.message
        state.notification.color = payload.type
      }
    },
    actions: {
      notify(vuexCtx, payload) {
        vuexCtx.commit('SET_NOTIFICATION', payload)
      }
    },
    getters: {
      alert: state => state.alert,
    }
  });
};

export default createStore;
