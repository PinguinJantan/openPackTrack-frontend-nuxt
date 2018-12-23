<template>
  <v-dialog persistent v-model="value" max-width="500">
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title v-if="mode === 'detail'">
        <span >Detail</span>
      </v-card-title>
      <v-card-title class="headline red lighten-1" primary-title v-else>
        <v-layout column>
          <span class="title white--text">Hapus</span>
          <span class="subheading white--text">Apakah anda ingin menghapus item berikut?</span>
        </v-layout>
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
              :value="dayjs(item.createdAt).format('D MMMM YYYY h:mm:ss')"
              readonly/>
          </v-flex>
          <v-flex xs6 md6 lg6>
            <v-text-field
              label="Diupdate"
              :value="dayjs(item.updatedAt).format('D MMMM YYYY h:mm:ss')"
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
        <v-btn v-if="mode === 'detail'" color="primary" @click="hideFn">Tutup</v-btn>
        <template v-else>
          <v-btn color="primary" :disabled="loading" @click="hideFn">Batal</v-btn>
          <v-spacer/>
          <v-btn color="error" :disabled="!item || loading" @click="deleteFn">
            <v-progress-circular v-if="loading" indeterminate size="20"/>
            Hapus
          </v-btn>
        </template>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import dayjs from 'dayjs';
import { mapActions } from 'vuex';
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: function() {
        return {};
      },
    },
    mode: {
      type: String,
      default: 'detail',
    },
    refresh: {
      type: Function,
      default: function() {},
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    ...mapActions({
      deleteItem: 'item/deleteItem',
    }),
    hideFn() {
      this.$emit('input', false);
    },
    deleteFn(id) {
      this.loading = true;
      this.deleteItem({ id: this.item.id }).then(() => {
        this.loading = false;
        this.refresh();
        this.hideFn();
      });
    },
  },
  created() {
    this.dayjs = dayjs;
  },
};
</script>
