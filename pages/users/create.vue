<template>
  <v-layout align-center justify-center>
    <v-flex xs12 
            sm4 
            md4 
            class="text-xs-center mt-5">
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
        <v-btn color="primary" @click="createUser">Buat Pengguna Baru</v-btn>
      </form>
    </v-flex>
  </v-layout>
</template>
<script>
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
                this.$router.push({
                  name: 'users',
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
    assignUserToRole() {},
    fetchRoles() {
      this.$axios
        .get('/api/user/roles')
        .then(res => {
          if (res.success) {
            this.roleOptions = res.roles;
            return;
          }

          this.notify({ type: 'error', messsage: res.messsage });
        })
        .catch(err => {
          this.notify({ type: 'error', messsage: err.messsage });
        });
    },
  },
};
</script>
