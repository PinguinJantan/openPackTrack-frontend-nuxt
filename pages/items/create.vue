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
import { mapActions } from 'vuex';
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
  },
  methods: {
    ...mapActions(['notify']),
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
              this.notify({ type: 'info', message: res.message });
            })
            .catch(err => {
              this.notify({ type: 'error', message: err.message });
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

          this.notify({ type: 'error', message: res.message });
        })
        .catch(err => {
          this.notify({ type: 'error', message: err.message });
        });
    },
  },
};
</script>

<style scoped>
</style>
