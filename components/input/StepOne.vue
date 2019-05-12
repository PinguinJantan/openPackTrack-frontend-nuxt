<template>
  <v-layout>
    <v-flex md6 offset-md3>
      <v-card class="my-2">
        <v-card-text>
          <v-flex>
            <h3 class="headline">Profil Karton Box</h3>
            <v-select
              :items="optionSelectProfile"
              v-model="formModel.selectedProfile"
              data-vv-as="Profile Karton"
              :error-messages="errors.collect('profile')"
              v-validate="'required'"
              data-vv-name="profile"
              :loading="loadingProfile"
              item-text="name"
              return-object
              label="Select"
              single-line
              menu-props="bottom"
              id="profileInput"
            />
          </v-flex>
          <v-flex v-if="formModel.selectedProfile" class="pb-4">
            <detail :profile="formModel.selectedProfile" />
          </v-flex>
          <v-flex>
            <h3 class="headline">Kode Karton Box</h3>
            <v-text-field
              ref="cartonCodeField"
              class="pt-0"
              name="input-1-3"
              v-model="formModel.cartonCode"
              data-vv-as="Kode Karton"
              :error-messages="errors.collect('code')"
              v-validate="'required'"
              data-vv-name="code"
              @focus="$event.target.select()"
              @keyup.enter="goToNextStep()"
              single-line
              id="codeInput"
            />
          </v-flex>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :loading="btnLoading"
            color="primary"
            @click.native="goToNextStep()"
            id="stepOneNextButton"
          >Lanjut</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import Detail from '@/components/profile/Detail.vue';
export default {
  components: { Detail },
  props: {
    clear: {
      type: Boolean,
      default: false,
    },
    currentStep: {
      type: Number,
      default: 1,
    },
  },
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
            this.optionSelectProfile = response.profiles.map(element => {
              // element.type = `${element.type} - ${element.mixAmount}`;
              return element;
            });
          }
        })
        .catch(err => {
          this.loadingProfile = false;
          this.$toast.error(err.message);
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
                  this.$toast.error(`karton kode ${this.formModel.cartonCode} sudah digunakan`);
                }
              })
              .catch(err => {
                this.$toast.error(err.message);
              });
          }
        });
      });
    },
  },
  created() {
    this.fetchListProfile();
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.cartonCodeField.focus();
      console.log('created', this.$refs.cartonCodeField);
    });
  },
  watch: {
    clear(newRecord) {
      if (newRecord) {
        this.formModel.cartonCode = '';
      }
    },
    currentStep(step) {
      if (step == 1) {
        setTimeout(() => {
          this.$refs.cartonCodeField.focus();
        }, 500);
      }
    },
  },
};
</script>
