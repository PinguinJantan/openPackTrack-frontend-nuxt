<template>
  <v-app>
    <v-toolbar fixed color="primary" flat dark dense app>
      <v-toolbar-title v-text="title" ></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <v-container fluid class="pt-0">
        <v-alert type="error" :value="alert.show" @input="dismissAlert()" dismissible>
          {{ alert.content }}
        </v-alert>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    data() {
      return {
        menus: [
          { icon: 'apps', title: 'Beranda', to: '/' },
          { icon: 'folder', title: 'Item', to: '/items'}
        ],
        title: 'Open PackTrack'
      }
    },
    computed: {
      isLogedIn() {
        return this.$store.getters.isLogedIn;
      },
      alert() {
        return this.$store.getters.alert;
      }
    },
    methods: {
      logout() {
        this.$store.dispatch('logout');
        this.$router.push({
          name: 'index'
        })
      },
      dismissAlert() {
        this.$store.commit('clearAlert')
      }
    }
  }
</script>
