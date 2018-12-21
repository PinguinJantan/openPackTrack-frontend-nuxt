<template>
  <v-layout align-left justify-center>
    <v-flex xs12
            sm8
            md8
            text-xs-center
            mt-5>
      <h2 class="mb-3">Buat Item Baru</h2>
      <v-card ma3>
        <v-card-text>
          <item-form/>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import ItemForm from '@/components/items/ItemForm';
import vueMultiselect from 'vue-multiselect';
import addSku from '@/components/items/addSku.vue';
export default {
  name: 'CreateItem',
  components: { ItemForm },
  data() {
    return {
      code: '',
      sizeOptions: [],
      size: '',
      skuOptions: [],
      sku: '',
      showAddSku: false,
    };
  },
  mounted() {
    this.fetchOptions('size');
    this.fetchOptions('sku');
  },
  methods: {
    showSkuModal() {
      this.showAddSku = true;
    },
    create() {
      this.$validator.validateAll().then(isFormValid => {
        if (isFormValid) {
          this.$axios
            .$post('/api/item/create', {
              code: this.code,
              size: this.size.name,
              skuId: this.sku.id,
            })
            .then(res => {
              if (res.success) {
                this.$router.push({
                  name: 'items',
                });
                return;
              }
              this.$toast.show(res.message);
            })
            .catch(err => {
              this.$toast.error(err.message);
            });
        }
      });
    },
    fetchOptions(option) {
      this.$axios
        .$get(`/api/${option}/list`)
        .then(res => {
          if (res.success) {
            this[`${option}Options`] = res[`${option}s`];
            return;
          }

          this.$toast.error(res.message);
        })
        .catch(err => {
          this.$toast.error(err.message);
        });
    },
    addSizeTag(newTag) {
      this.sizeOptions.push({ name: newTag });
      this.size = { name: newTag };
    },
    addSkuTag(newTag) {
      this.sizeOptions.push(newTag);
      this.size = newTag;
    },
    onSuccessAddSku(data) {
      this.sku = data.sku;
      this.fetchOptions('sku');
    },
  },
};
</script>

<style scoped>
</style>
