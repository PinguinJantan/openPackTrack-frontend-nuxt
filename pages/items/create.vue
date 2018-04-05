<template>
  <v-layout align-center justify-center>
    <v-flex xs12 
            sm4 
            md4 
            text-xs-center 
            mt-5>
      <h3>Buat Item Baru</h3>
      <form>
        <v-text-field
          v-model="code"
          label="Code"
          :error-messages="errors.collect('code')"
          v-validate="'required'"
          data-vv-name="code"
          required
        />
        <v-select
          :items="sizeOptions"
          v-model="sizeId"
          label="Pilih Ukuran"
          item-text="name"
          item-value="id"
          autocomplete
        />
        <v-select
          :items="skuOptions"
          v-model="skuId"
          label="Pilih SKU"
          item-text="name"
          item-value="id"
          autocomplete
        />
        <v-btn color="primary" @click="create">Buat Item Baru</v-btn>
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
  data() {
    return {
      code: '',
      sizeOptions: [],
      sizeId: '',
      skuOptions: [],
      skuId: '',
    };
  },
  mounted() {
    this.fetchOptions('size');
    this.fetchOptions('sku');
    this.$validator.localize('id', bahasa);
  },
  methods: {
    create() {
      this.$validator.validateAll().then(isFormValid => {
        if (isFormValid) {
          this.$axios
            .$post('/api/item/create', {
              code: this.code,
              sizeId: this.sizeId,
              skuId: this.skuId,
            })
            .then(res => {
              if (res.success) {
                this.$router.push({
                  name: 'items',
                });
                return;
              }
              this.$store.commit('setAlert', res);
            })
            .catch(err => {
              this.$store.commit('setAlert', err.message);
            });
        }
      });
    },
    fetchOptions(option) {
      this.$axios
        .$get(`/api/${option}/all`)
        .then(res => {
          if (res.success) {
            this[`${option}Options`] = res[`${option}s`];
            return;
          }

          this.$tore.dispatch('setAlert', res.message);
        })
        .catch(err => {
          this.$tore.dispatch('setAlert', err.message);
        });
    },
  },
};
</script>

<style scoped>
</style>
