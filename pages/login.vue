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
        />
        <v-text-field
          v-model="password"
          label="Kata Sandi"
          :counter="10"
          :error-messages="errors.collect('password')"
          v-validate="'required'"
          data-vv-name="password"
          type="password"
          @keyup.enter="login"
          required
        />
        <v-btn color="primary" @click="login">Login</v-btn>
      </form>
    </v-flex>
  </v-layout>
</template>
<script>
import { mapActions } from 'vuex';

export default {
  $_veeValidate: {
    validator: 'new',
  },
  auth: false,
  data: () => ({
    password: '',
    username: '',
  }),
  methods: {
    ...mapActions(['notify']),
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
              return this.$router.push('/dashboard');
            })
            .catch(err => {
              this.notify({ type: 'error', message: err });
            });
        }
      });
    },
  },
};
</script>
