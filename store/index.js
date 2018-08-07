import authUtil from "~/utils/auth";

export const state = () => ({
  token: null,
  notification: {
    color: 'error',
    active: false,
    message: ''
  }
})

export const mutations = {
  setToken(state, token) {
    state.token = token;
  },
  clearToken(state) {
    state.token = null;
  },
  SET_NOTIFICATION(state, payload) {
    state.notification.active = !state.notification.active
    state.notification.message = payload.message
    state.notification.color = payload.type
  }
}

export const actions = {
  nuxtServerInit(vuexContext, { req }) {
    vuexContext.dispatch("initAuth", req);
  },
  initAuth(vuexContext, req) {
    let token;

    if (req) {
      if (!req.headers.cookie) {
        return;
      }

      const jwtCookie = req.headers.cookie
        .split(";")
        .find(c => c.trim().startsWith("jwt="));

      if (!jwtCookie) {
        return;
      }

      token = jwtCookie.split("=")[1];
    } else {
      token = localStorage.getItem("token");
    }

    vuexContext.commit("setToken", token);
  },
  login(vuexContext, authData) {
    this.$axios
      .$post("/auth/login", authData)
      .then(result => {
        if (result.success) {
          vuexContext.commit("setToken", result.user.token);
          authUtil.setToken(result.user.token);
        } else {
          vuexContext.dispatch('notify', { type: 'error', message: result.message })
        }
      })
      .catch(err => {
        vuexContext.dispatch('notify', { type: 'error', message: result.message })
      });
  },
  logout(vuexContext) {
    vuexContext.commit("clearToken");
    if (process.client) {
      authUtil.unsetToken();
    }
  },
  notify(vuexCtx, payload) {
    vuexCtx.commit('SET_NOTIFICATION', payload)
  }
}

export const getters = {
  isLogedIn(state) {
    return state.token !== null ? true : false;
  },
  alert(state) {
    return state.alert;
  }
}
