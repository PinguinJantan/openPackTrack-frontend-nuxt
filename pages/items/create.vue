<template>
  <v-layout align-left justify-center>
    <v-flex xs12
            sm6
            md6
            text-xs-center
            mt-5>
      <h3>Buat Item Baru</h3>
      <form>
        <div style="display: flex; margin-bottom: 8px">
          <v-flex text-xs-left>
            <vue-multiselect
              :options="skuOptions"
              v-model="sku"
              label="name"
              track-by="name"
              placeholder="SKU"
              :allow-empty="false"
              tag-position="bottom"
              data-vv-as="SKU"
              data-vv-name="sku"
              v-validate="'required'">
              <template slot="singleLabel" slot-scope="props">
                {{ props.option.code }} ({{ props.option.name }})
              </template>
              <template slot="option" slot-scope="props">
                {{ props.option.code }} ({{ props.option.name }})
              </template>
            </vue-multiselect>
            <div class="field-error v-messages error--text">{{ errors.has('sku') ? errors.first('sku') : '' }}</div>
          </v-flex>
          <v-btn color="green" large @click="showSkuModal">
            <v-icon color="white">add</v-icon>
          </v-btn>
        </div>
        <v-text-field
          v-model="code"
          label="Code"
          :error-messages="errors.collect('code')"
          v-validate="'required'"
          data-vv-name="code"
          required
          outline
        />
        <v-flex text-xs-left>
          <vue-multiselect
            :options="sizeOptions"
            v-model="size"
            label="name"
            track-by="name"
            placeholder="Ukuran"
            :allow-empty="false"
            tag-position="bottom"
            @tag="addSizeTag"
            :taggable="true"
            v-validate="'required'"
            data-vv-as="Ukuran"
            data-vv-name="ukuran"/>
          <div class="field-error v-messages error--text">{{ errors.has('ukuran') ? errors.first('ukuran') : '' }}</div>
        </v-flex>
        <v-btn color="primary" @click="create">Buat Item Baru</v-btn>
      </form>
    </v-flex>
    <add-sku v-model="showAddSku" @success="onSuccessAddSku"/>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex';
import vueMultiselect from 'vue-multiselect';
import addSku from '@/components/items/addSku.vue';
export default {
  name: 'CreateItem',
  $_veeValidate: {
    validator: 'new',
  },
  components: { addSku, vueMultiselect },
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
    ...mapActions(['notify']),
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
        .$get(`/api/${option}/list`)
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
