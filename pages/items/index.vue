<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm12>
      <v-btn color="primary mb-3" to="/items/create">Buat Item Baru</v-btn>
      <v-btn outline class="mb-3" @click="toggleImportModal = !toggleImportModal">Import Item</v-btn>
      <v-btn outline class="mb-3" @click="exportItems()">Export Item</v-btn>
      <v-card-title>
        Semua Item
        <v-spacer/>
        <v-text-field
          append-icon="search"
          label="Cari"
          single-line
          hide-details
          v-model="searchKeyword"
        />
      </v-card-title>
      <v-data-table
        :headers="headers"
        :pagination.sync="pagination"
        :total-items="totalItems"
        :loading="loading"
        :search="searchKeyword"
        :items="items"
        hide-actions
        class="elevation-1">
        <template slot="items" slot-scope="props">
          <td>{{ props.item.code }}</td>
          <td>{{ props.item.size }}</td>
          <td>{{ props.item.sku.code }}</td>
          <td>{{ props.item.sku.name }}</td>
          <td>{{ props.item.sku.category }}</td>
          <td>{{ props.item.sku.color }}</td>
          <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click="editItem(props.item)">
              <v-icon color="teal">edit</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
      <div class="text-xs-center pt-2">
        <v-pagination v-model="pagination.page" 
                      :length="pages" 
                      @next="fetchItems(pagination.page, searchKeyword)" 
                      @previous="fetchItems(pagination.page, searchKeyword)" 
                      @input="fetchItems(pagination.page, searchKeyword)"/>
      </div>
    </v-flex>
    <import-modal :show="toggleImportModal" @close="handleCloseModal"/>
  </v-layout>
</template>
<script>
import { mapState, mapActions } from 'vuex';

import ImportModal from '@/components/items/ImportModal';

export default {
  components: {
    ImportModal,
  },
  data: () => {
    return {
      searchKeyword: '',
      totalItems: 0,
      loading: true,
      pagination: {
        rowPerPage: 10,
      },
      items: [],
      headers: [
        { text: 'Kode', value: 'code' },
        { text: 'Ukuran', value: 'size' },
        { text: 'SKU', value: 'sku.code' },
        { text: 'Nama', value: 'sku.name' },
        { text: 'Kategori', value: 'sku.category' },
        { text: 'Warna', value: 'sku.color' },
      ],
      toggleImportModal: false,
    };
  },
  created() {
    this.fetchItems(1);
  },
  methods: {
    ...mapActions(['notify']),
    fetchItems(page = 1, keyword = '') {
      this.loading = true;
      this.$axios
        .$get(`/api/item/all?page=${page}&search=${keyword}`)
        .then(response => {
          this.loading = false;
          if (response.success) {
            this.items = response.item;
            this.pagination.page = page;
            this.pagination.totalItems = response.pagination.total;
            this.totalItems = response.pagination.pageCount;
          }
        })
        .catch(err => {
          this.notify({ type: 'error', message: err.message });
        });
    },
    handleCloseModal() {
      this.toggleImportModal = false;
      this.fetchItems;
    },
    exportItems() {
      const win = window.open(
        `${process.env.baseUrl}/api/item/export?accessToken=${this.token}`,
        '_blank',
      );
      win.focus();
    },
    editItem(item) {},
  },
  computed: {
    ...mapState(['token']),
    pages() {
      if (this.pagination.rowPerPage == null || this.pagination.totalItems == null) {
        return 0;
      }

      return Math.ceil(this.pagination.totalItems / this.pagination.rowPerPage);
    },
  },
  watch: {
    searchKeyword(keyword) {
      this.fetchItems(1, keyword);
    },
  },
};
</script>
