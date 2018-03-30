import Vuex from "vuex";

import authUtil from "~/utils/auth";

const createStore = () => {
  return new Vuex.Store({
    state: {
      token: null,
      alert: {
        show: false,
        content: ""
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
        state.alert.content = "";
      }
    },
    actions: {
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
            console.log("the result : ", result);
            if (result.success) {
              vuexContext.commit("setToken", result.user.token);
              authUtil.setToken(result.user.token);
            } else {
              vuexContext.commit("setAlert", result.message);
            }
          })
          .catch(err => {
            console.log("the errors : ", err);
            vuexContext.commit("setAlert", err.message);
          });
        console.log("trying to login");
      },
      logout(vuexContext) {
        vuexContext.commit("clearToken");
        if (process.client) {
          authUtil.unsetToken();
        }
      }
    },
    getters: {
      isLogedIn(state) {
        return state.token !== null ? true : false;
      },
      alert(state) {
        return state.alert;
      }
    }
  });
};

export default createStore;
