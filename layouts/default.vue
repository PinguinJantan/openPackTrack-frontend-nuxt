<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" fixed width="250" app>
      <v-list>
        <v-list-tile router :to="menu.to" :key="i" v-for="(menu, i) in menus" exact>
          <v-list-tile-action>
            <v-icon v-html="menu.icon" />
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="menu.title" />
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          v-if="isLoggedIn"
          router
          :to="menu.to"
          :key="menu.title"
          v-for="menu in dynamicMenus"
          exact
        >
          <v-list-tile-action>
            <v-icon v-html="menu.icon" />
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="menu.title" />
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="!isLoggedIn" router :to="'/login'" exact>
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
      <v-toolbar-side-icon @click="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-navigation-drawer temporary :right="right" v-model="rightDrawer" fixed>
      <v-list>
        <v-list-tile @click.native="right = !right">
          <v-list-tile-action>
            <v-icon light>compare_arrows</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';

const modelMenus = [
  { icon: 'folder', title: 'Item', to: '/items', name: 'item' },
  { icon: 'account_box', title: 'Pengguna', to: '/users', name: 'user' },
];

const loggedInMenus = [{ icon: 'play_for_work', title: 'Input', to: '/input' }];

const isMenuAvailable = (modelMenu, modelResources) =>
  !!modelResources.find(modelResource => modelResource.name === modelMenu.name);

const inputMenu = {
  icon: 'input',
  title: 'Input',
  to: '/input',
  name: 'input',
};

const roleCanAccessInput = ['admin', 'basic'];

export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      menus: [{ icon: 'apps', title: 'Beranda', to: '/' }],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Open PackTrack',
    };
  },
  computed: {
    ...mapGetters(['roleResources']),
    isLoggedIn() {
      return this.$auth.loggedIn;
    },
    dynamicMenus() {
      const shouldShowInputMenu =
        this.$auth.user &&
        !!this.$auth.user.roles.find(role => {
          return roleCanAccessInput.includes(role);
        });
      const additionalMenu = shouldShowInputMenu ? [inputMenu] : [];

      return [
        ...additionalMenu,
        ...modelMenus.filter(menu => isMenuAvailable(menu, this.roleResources)),
      ];
    },
  },
  methods: {
    logout() {
      this.$auth.logout().then(() => {
        this.$router.push({
          name: 'index',
        });
      });
    },
  },
};
</script>
