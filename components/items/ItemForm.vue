<template>
  <div>
    <form>
      <div style="display: flex; margin-bottom: 8px">
        <v-flex text-xs-left>
          <vue-multiselect
            :options="skuOptions"
            v-model="sku"
            label="name"
            track-by="name"
            placeholder="Pilih SKU yang sudah ada"
            select-label="Pilih"
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
        <v-layout align-center justify-center row fill-height style="height: 50px;">
          <v-flex>atau</v-flex>
        </v-layout>
        <v-btn color="grey lighten-1" large @click="showAddSku = true">
          Buat SKU baru
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
      <v-text-field
        v-model="barcode"
        label="Barcode"
        :error-messages="errors.collect('barcode')"
        v-validate="'required'"
        data-vv-name="barcode"
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
          select-label="Pilih"
          :allow-empty="false"
          tag-position="bottom"
          @tag="addSizeTag"
          :taggable="true"
          v-validate="'required'"
          data-vv-as="Ukuran"
          data-vv-name="ukuran"/>
        <div class="field-error v-messages error--text">{{ errors.has('ukuran') ? errors.first('ukuran') : '' }}</div>
      </v-flex>
      <v-btn color="primary" @click="submit">{{ actionButtonText }}</v-btn>
    </form>
    <add-sku v-model="showAddSku" @success="onSuccessAddSku"/>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import AddSku from '@/components/items/addSku';
import vueMultiselect from 'vue-multiselect';

const CREATE = 'create';
const EDIT = 'edit';

export default {
  name: 'ItemForm',
  $_veeValidate: {
    validator: 'new',
  },
  components: {
    AddSku,
    vueMultiselect,
  },
  props: {
    mode: {
      type: String,
      validator: value => [CREATE, EDIT].includes(value),
      default: () => CREATE,
    },
    item: {
      type: Object,
      default: () => {
        return {};
      }, // empty object indicate this is on create mode
    },
  },
  data() {
    return {
      code: '',
      barcode: '',
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

    if (this.mode === EDIT) {
      this.code = this.item.code;
      this.barcode = this.item.barcode;
      this.size = this.item.size;
      this.sku = this.item.sku || '';
    }
  },
  computed: {
    actionButtonText() {
      return this.mode === CREATE ? 'Buat Item Baru' : 'Edit Item';
    },
  },
  methods: {
    ...mapActions(['notify']),
    submit() {
      this.$validator.validateAll().then(isFormValid => {
        if (isFormValid) {
          const endpoint = this.mode === CREATE ? '/api/item/create' : '/api/item/update';
          const payload = {
            id: this.item.id || null,
            size: this.size.name,
            code: this.code,
            skuId: this.sku.id,
            barcode: this.barcode,
          };
          this.send(endpoint, payload);
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
    send(endpoint, payload) {
      this.$axios
        .$post(endpoint, payload)
        .then(res => {
          if (res.success) {
            this.goToItemPage();
            return;
          }
          this.notify({ type: 'info', message: res.message });
        })
        .catch(err => {
          return this.notify({ type: 'error', message: err.message });
        });
    },
    goToItemPage() {
      if (this.mode === CREATE) {
        this.$router.push({
          name: 'items',
        });
      } else {
        this.$router.go(this.$router.currentRoute);
      }
    },
  },
};
</script>
