<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm4 md4 text-xs-center mt-5>
      <h3>Masuk kedalam sistem PackTrack</h3>
        <form>
          <v-text-field
            v-model="email"
            label="E-mail"
            :error-messages="errors.collect('email')"
            v-validate="'required|email'"
            data-vv-name="email"
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Kata Sandi"
            :counter="10"
            :error-messages="errors.collect('password')"
            v-validate="'required'"
            data-vv-name="password"
            required
          ></v-text-field>
          <v-btn color="primary" @click="submit">Login</v-btn>
        </form>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  $_veeValidate: {
    validator: 'new'
  },

  data: () => ({
    password: '',
    email: '',
    dictionary: {
      attributes: {
        email: 'Alamat email'
        // custom attributes
      },
      custom: {
        password: {
          required: () => 'Kata sandi tidak boleh kosong',
        },
      }
    }
  }),

  mounted () {
    this.$validator.localize('en', this.dictionary)
  },

  methods: {
    submit () {
      this.$validator.validateAll()
    },
  }
}
</script>
