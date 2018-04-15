<template>
  <v-layout align-center justify-center>
    <v-flex xs12 
            sm4 
            md4 
            class="text-xs-center mt-5">
      <v-btn small 
             outline 
             class="text-xs-left ma-3" 
             to="/users">
        <v-icon small>arrow_back</v-icon>
        kembali
      </v-btn>
      <h3>Buat User Baru</h3>
      <form>
        <v-text-field
          v-model="name"
          label="Name"
          :error-messages="errors.collect('name')"
          v-validate="'required'"
          data-vv-name="name"
          required
        />
        <v-text-field
          v-model="username"
          label="Username"
          :error-messages="errors.collect('username')"
          v-validate="'required'"
          data-vv-name="username"
          required
        />
        <v-text-field
          v-model="email"
          label="email"
          :error-messages="errors.collect('email')"
          v-validate="'required|email'"
          data-vv-name="email"
          required
        />
        <v-text-field
          v-model="identityNumber"
          label="Nomor identitas KTP / SIM"
          :error-messages="errors.collect('identityNumber')"
          v-validate="'required|numeric'"
          data-vv-name="identityNumber"
          required
        />
        <v-text-field
          v-model="password"
          label="Kata Sandi"
          type="password"
          :error-messages="errors.collect('password')"
          v-validate="'required'"
          data-vv-name="password"
          required
        />
        <v-select
          :items="roleOptions"
          v-model="selectedRole"
          label="Pilih Peran Pengguna"
        />
        <v-btn color="primary" @click="createUser">Buat Pengguna Baru</v-btn>
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
  data() {
    return {
      name: '',
      email: '',
      username: '',
      password: '',
      identityNumber: '',
      roleOptions: [],
      selectedRole: '',
    };
  },
  mounted() {
    this.fetchRoles();
  },
  methods: {
    ...mapActions(['notify']),
    createUser() {
      this.$validator.validateAll().then(isFormValid => {
        if (isFormValid) {
          this.$axios
            .$post('/api/user/create', {
              name: this.name,
              email: this.email,
              username: this.username,
              password: this.password,
              identityNumber: this.identityNumber,
            })
            .then(res => {
              if (res.success) {
                this.assignUserToRole(res.user.id, this.selectedRole).then(() => {
                  this.goToUsers();
                });
                return;
              }

              this.notify({ type: 'error', messsage: res.messsage });
            })
            .catch(err => {
              this.notify({ type: 'error', messsage: err.messsage });
            });
        }
      });
    },
    assignUserToRole(userId, roleName) {
      return new Promise((resolve, reject) => {
        this.$axios
          .$post('/api/user/role/assign', {
            userId,
            role: roleName,
          })
          .then(res => {
            if (res.success) {
              resolve(true);
              return;
            }

            this.notify({ type: 'error', messsage: res.messsage });
          })
          .catch(err => {
            this.notify({ type: 'error', messsage: err.messsage });
            reject(err);
          });
      });
    },
    fetchRoles() {
      // create user
      this.$axios
        .get('/api/user/role/all')
        .then(res => {
          if (res.data.success) {
            this.roleOptions = res.data.roles;
            return;
          }

          this.notify({ type: 'error', messsage: res.messsage });
        })
        .catch(err => {
          this.notify({ type: 'error', messsage: err.messsage });
        });
    },
    goToUsers() {
      this.$router.push({
        name: 'users',
      });
    },
  },
};
</script>
