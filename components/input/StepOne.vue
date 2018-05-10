<template>
  <v-layout>
    <v-flex md6 offset-md3>
      <v-card class="my-2">
        <v-card-text>
          <h3 class="headline">Profil Karton Box</h3>
          <v-select
            :items="optionSelectProfile"
            v-model="formModel.selectedProfile"
            data-vv-as="Profile Karton"
            :error-messages="errors.collect('profile')"
            v-validate="'required'"
            data-vv-name="profile"
            :loading="loadingProfile"
            item-text="type"
            return-object
            label="Select"
            single-line
            bottom />

          <h3 class="headline">Kode Karton Box</h3>
          <v-text-field
            class="pt-0"
            name="input-1-3"
            v-model="formModel.cartonCode"
            data-vv-as="Kode Karton"
            :error-messages="errors.collect('code')"
            v-validate="'required'"
            data-vv-name="code"
            single-line />
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn :loading="btnLoading" color="primary" @click.native="goToNextStep()">Continue</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      formModel: {
        selectedProfile: '',
        cartonCode: '',
      },
      optionSelectProfile: [],
      loadingProfile: false,
      btnLoading: false,
    };
  },
  methods: {
    goToNextStep() {
      this.$emit('next-step');
    },
    fetchListProfile() {
      this.loadingProfile = true;
      this.$axios
        .$get(`/api/profile/list`)
        .then(response => {
          this.loadingProfile = false;
          if (response.success) {
            this.optionSelectProfile = response.profile;
          }
        })
        .catch(err => {
          this.loadingProfile = false;
          this.$store.dispatch('notify', { type: 'error', message: err.message });
        });
    },
    validateStep() {
      return new Promise((resolve, reject) => {
        this.$validator.validateAll().then(valid => {
          if (valid) {
            this.btnLoading = true;
            this.$axios
              .$get(`/api/carton/ping/${this.formModel.cartonCode}`)
              .then(response => {
                if (!response.exist) {
                  this.btnLoading = false;
                  resolve({ valid: valid, model: this.formModel });
                } else {
                  this.btnLoading = false;
                  this.$store.dispatch('notify', {
                    type: 'error',
                    message: `karton kode ${this.formModel.cartonCode} sudah digunakan`,
                  });
                }
              })
              .catch(err => {
                this.$store.dispatch('notify', { type: 'error', message: err.message });
              });
          }
        });
      });
    },
  },
  created() {
    this.fetchListProfile();
  },
};
</script>
