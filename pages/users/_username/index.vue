<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 class="text-xs-center">
      <form>
        <v-text-field
          v-model="user.name"
          label="Nama"
          :error-messages="errors.collect('name')"
          v-validate="'required|max:10'"
          data-vv-name="name"
          :disabled="!isEditMode"
          required
        />
        <v-text-field
          v-model="user.username"
          label="Username"
          :error-messages="errors.collect('username')"
          v-validate="'required'"
          data-vv-name="username"
          :disabled="!isEditMode"
          required
        />
        <v-text-field
          v-model="user.email"
          label="Email"
          :error-messages="errors.collect('email')"
          v-validate="'required'"
          data-vv-name="email"
          :disabled="!isEditMode"
          required
        />
        <v-text-field
          v-model="user.identityNumber"
          label="Nomor Identitas"
          :error-messages="errors.collect('identityNumber')"
          v-validate="'required'"
          data-vv-name="identityNumber"
          :disabled="!isEditMode"
          required
        />
        <div v-if="isEditMode">
          <v-btn color="primary" @click="edit">Simpan</v-btn>
          <v-btn flat @click="isEditMode = !isEditMode">batal edit</v-btn>
        </div>
        <v-btn v-else outline @click="isEditMode = !isEditMode">Edit</v-btn>
      </form>
    </v-flex>
  </v-layout>
</template>
<script>
import bahasa from 'vee-validate/dist/locale/id';

export default {
  $_veeValidate: {
    validator: 'new',
  },
  name: 'UserDetail',
  data() {
    return {
      user: {
        name: '',
        username: '',
        email: '',
        identityNumber: '',
        roles: [],
      },
      isEditMode: false,
    };
  },
  mounted() {
    this.fetchUser();
    this.$validator.localize('id', bahasa);
  },
  methods: {
    fetchUser() {
      console.log('this routers : ', this.$route);
      this.$axios.$get(`/api/user/${this.$route.params.username}`).then(res => {
        if (res.success) {
          this.user = Object.assign(this.user, res.user);
        }
      });
    },
    edit() {
      // todo: submit to edit endpoint
      this.$validator.validateAll().then(isFormValid => {
        if (isFormValid) {
          this.isEditMode = false;
        }
      });
    },
  },
};
</script>
