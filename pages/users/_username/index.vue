<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 class="text-xs-center">
      <form v-cloak>
        <v-text-field
          v-model="user.name"
          label="Nama"
          :error-messages="errors.collect('name')"
          v-validate="'required'"
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
        <v-select
          :items="roleOptions"
          v-model="selectedRole"
          label="Peran"
          item-text="name"
          item-value="id"
          :disabled="!isEditMode"
          required
        />
        <div v-if="isEditMode">
          <v-btn color="primary" @click="edit">Simpan</v-btn>
          <v-btn flat @click="cencelToEdit">batal edit</v-btn>
        </div>
        <v-btn v-else outline @click="isEditMode = !isEditMode">Edit</v-btn>
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
  name: 'UserDetail',
  data() {
    return {
      name: '',
      user: {
        username: '',
        email: '',
        identityNumber: '',
        roles: [],
      },
      userBeforeEdit: {},
      isEditMode: false,
      roleOptions: [],
      selectedRole: '',
    };
  },
  mounted() {
    this.fetchRoles().then(() => this.fetchUser());
  },
  methods: {
    ...mapActions(['notify']),
    fetchUser() {
      this.$axios.$get(`/api/user/${this.$route.params.username}`).then(res => {
        if (res.success) {
          const user = Object.assign(this.user, res.user);
          this.user = user;
          // for reset button purpose, we need to temporary save it
          this.userBeforeEdit = JSON.parse(JSON.stringify(user));
        }
      });
    },
    fetchRoles() {
      return new Promise((resolve, reject) => {
        this.$axios
          .$get('/api/user/role/all')
          .then(res => {
            if (res.success) {
              this.roleOptions = res.roles;
              resolve(true);
            } else {
              resolve(false);
            }
          })
          .catch(err => {
            this.notify({ type: 'error', message: err.message });
          });
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
    assignUserToRoles(userId, role) {
      if (role) {
        // notify user role is empty
        this.notify({ type: 'error', message: 'Peran tidak boleh kosong' });
        this.fetchUser();
      }
    },
    cencelToEdit() {
      this.user = this.userBeforeEdit;
      this.isEditMode = !this.isEditMode;
    },
  },
};
</script>
