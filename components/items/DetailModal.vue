<template>
  <v-dialog persistent v-model="value" max-width="500">
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Detail
      </v-card-title>
      <v-card-text v-if="item">
        <v-layout pb-2>
          <span class="title">Item</span>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs5 md5 lg5 pr-3>
            <v-text-field
              label="Barcode"
              v-model="item.barcode"
              readonly/>
          </v-flex>
          <v-flex xs5 md5 lg5 pr-3>
            <v-text-field
              label="Kode"
              v-model="item.code"
              readonly/>
          </v-flex>
          <v-flex xs2 md2 lg2>
            <v-text-field
              label="Ukuran"
              v-model="item.size.name"
              readonly/>
          </v-flex>
        </v-layout>
        <v-layout row wrap pb-3>
          <v-flex xs6 md6 lg6 pr-3>
            <v-text-field
              label="Dibuat"
              :value="$moment(item.createdAt).format('D MMMM YYYY h:mm:ss')"
              readonly/>
          </v-flex>
          <v-flex xs6 md6 lg6>
            <v-text-field
              label="Diupdate"
              :value="$moment(item.updatedAt).format('D MMMM YYYY h:mm:ss')"
              readonly/>
          </v-flex>
        </v-layout>
        <v-layout pb-2>
          <span class="title">SKU</span>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs5 md5 lg5 pr-3>
            <v-text-field
              label="Kode"
              v-model="item.sku.code"
              readonly/>
          </v-flex>
          <v-flex xs5 md5 lg5 pr-3>
            <v-text-field
              label="Nama"
              v-model="item.sku.name"
              readonly/>
          </v-flex>
          <v-flex xs2 md2 lg2>
            <v-text-field
              label="Gender"
              v-model="item.sku.gender.name"
              readonly/>
          </v-flex>
        </v-layout>
        <v-layout row wrap pb-3>
          <v-flex xs6 md6 lg6 pr-3>
            <v-text-field
              label="Warna"
              v-model="item.sku.color.name"
              readonly/>
          </v-flex>
          <v-flex xs6 md6 lg6>
            <v-text-field
              label="Kategori"
              v-model="item.sku.category.name"
              readonly/>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-text class="text-xs-center" v-else>
        <v-progress-circular indeterminate color="primary"/>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="hideFn">Tutup</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: true,
    },
    item: {
      type: Function,
      default: function() {},
    },
  },
  methods: {
    hideFn() {
      this.$emit('input', false);
    },
  },
};
</script>
