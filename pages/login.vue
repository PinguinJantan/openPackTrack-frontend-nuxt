<template>
  <v-layout align-center justify-center>
    <v-flex xs12 
            sm4 
            md4 
            text-xs-center 
            mt-5>
      <h3>Masuk kedalam sistem PackTrack</h3>
      <form>
        <v-text-field
          v-model="username"
          label="Username"
          :error-messages="errors.collect('username')"
          v-validate="'required'"
          data-vv-name="username"
          @keyup.enter="login"
          required
          id="username"
        />
        <v-text-field
          v-model="password"
          label="Kata Sandi"
          :error-messages="errors.collect('password')"
          v-validate="'required'"
          data-vv-name="password"
          type="password"
          @keyup.enter="login"
          required
          id="password"
        />
        <v-btn color="primary" @click="login" id="login-button">Login</v-btn>
      </form>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  $_veeValidate: {
    validator: 'new',
  },
  auth: false,
  mounted() {
    if (this.$auth.loggedIn) this.goToDashboard();
  },
  data: () => ({
    password: '',
    username: '',
  }),
  methods: {
    login() {
      let self = this;
      this.$validator.validateAll().then(isFormValid => {
        if (isFormValid) {
          this.$auth
            .loginWith('local', {
              data: {
                username: this.username,
                password: this.password,
              },
            })
            .then(res => {
              return this.goToDashboard();
            })
            .catch(err => {
              this.$toast.error(err.message);
            });
        }
      });
    },
    goToDashboard() {
      this.$router.push({ name: 'dashboard' });
    },
  },
};
</script>
