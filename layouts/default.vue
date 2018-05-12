<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      width=250
      app>
      <v-list>
        <v-list-tile
          router
          :to="menu.to"
          :key="i"
          v-for="(menu, i) in menus"
          exact>
          <v-list-tile-action>
            <v-icon v-html="menu.icon"/>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="menu.title"/>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="!isLogedIn" 
                     router 
                     :to="'/login'" 
                     exact>
          <v-list-tile-action>
            <v-icon>account_box</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              Masuk
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-else @click="logout" exact>
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              Keluar
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed 
               color="primary" 
               flat 
               dark 
               dense 
               app>
      <v-toolbar-side-icon @click="drawer = !drawer"/>
      <v-toolbar-title v-text="title" />
      <v-spacer/>
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-navigation-drawer
      temporary
      :right="right"
      v-model="rightDrawer"
      fixed>
      <v-list>
        <v-list-tile @click.native="right = !right">
          <v-list-tile-action>
            <v-icon light>compare_arrows</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-snackbar
      :color="notification.color"
      multi-line
      v-model="snackbarMessage">{{ notification.message }}
      <v-btn dark flat @click="notificationToggle">Close</v-btn>
    </v-snackbar>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      menus: [
        { icon: 'apps', title: 'Beranda', to: '/' },
        { icon: 'folder', title: 'Item', to: '/items' },
        { icon: 'play_for_work', title: 'Input', to: '/input' },
        { icon: 'account_box', title: 'Pengguna', to: '/users' },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Open PackTrack',
    };
  },
  computed: {
    ...mapState(['notification']),
    snackbarMessage: {
      get() {
        return this.notification.active;
      },
      set(val) {
        this.notificationToggle();
      },
    },
    isLogedIn() {
      return this.$store.getters.isLogedIn;
    },
    alert() {
      return this.$store.getters.alert;
    },
  },
  methods: {
    ...mapActions(['notify']),
    notificationToggle() {
      this.notify({ type: 'error', message: '' });
    },
    logout() {
      this.$store.dispatch('logout');
      this.$router.push({
        name: 'index',
      });
    },
    dismissAlert() {
      this.$store.commit('clearAlert');
    },
  },
};
</script>
