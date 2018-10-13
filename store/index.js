export const state = () => ({
  notification: {
    color: 'error',
    active: false,
    message: ''
  }
})

export const mutations = {
  SET_NOTIFICATION(state, payload) {
    state.notification.active = !state.notification.active
    state.notification.message = payload.message
    state.notification.color = payload.type
  }
}

export const actions = {
}

export const getters = {
  isLogedIn(state) {
    return state.token !== null ? true : false;
  },
  alert(state) {
    return state.alert;
  }
}
