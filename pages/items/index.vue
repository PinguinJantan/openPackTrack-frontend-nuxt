<template>
  <v-layout justify-center>
    <v-flex xs10 sm10 mb-4>
      <v-btn color="primary mb-3" to="/items/create">Buat Item Baru</v-btn>
      <v-btn outline class="mb-3" @click="toggleImportModal = !toggleImportModal">Import Item</v-btn>
      <v-btn outline class="mb-3" @click="exportItems()">Export Item</v-btn>
      <v-card-title>
        Semua Item
        <v-spacer/>
        <v-text-field append-icon="search" 
                      label="Cari" 
                      single-line 
                      hide-details
                      clearable
                      v-model="searchKeyword" />
      </v-card-title>
      <v-data-table :headers="headers" 
                    :pagination.sync="pagination" 
                    :total-items="totalItems" 
                    :loading="loading" 
                    :search="searchKeyword" 
                    :items="items" 
                    hide-actions 
                    class="elevation-1">
        <template slot="items" slot-scope="props">
          <td class="clickable" @click="showDetail(props.item.code)">{{ props.item.code }}</td>
          <td class="clickable" @click="showDetail(props.item.code)">{{ props.item.size }}</td>
          <td class="clickable" @click="showDetail(props.item.code)">{{ props.item.sku.code }}</td>
          <td class="clickable" @click="showDetail(props.item.code)">{{ props.item.sku.name }}</td>
          <td class="clickable" @click="showDetail(props.item.code)">{{ props.item.sku.category }}</td>
          <td class="clickable" @click="showDetail(props.item.code)">{{ props.item.sku.color }}</td>
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
                      @next="fetchItems(pagination.page, searchKeyword, pagination.sortBy || 'code', pagination.descending)" 
                      @previous="fetchItems(pagination.page, searchKeyword, pagination.sortBy || 'code', pagination.descending)" 
                      @input="fetchItems(pagination.page, searchKeyword, pagination.sortBy || 'code', pagination.descending)" />
      </div>
    </v-flex>
    <import-modal :show="toggleImportModal" @close="handleCloseModal" />
    <edit-modal v-if="isAnyItemSelected" 
                :show="isAnyItemSelected" 
                @close="selectedItem = {}" 
                :item="selectedItem" />
    <detail-modal v-model="isShowDetail" :item="detail" />
  </v-layout>
</template>
<script>
import { mapState, mapActions } from 'vuex';

import ImportModal from '@/components/items/ImportModal';
import EditModal from '@/components/items/EditModal.vue';
import DetailModal from '@/components/items/DetailModal.vue';
import _ from 'lodash';
export default {
  components: {
    ImportModal,
    EditModal,
    DetailModal,
  },
  data: () => {
    return {
      searchKeyword: '',
      detail: null,
      isShowDetail: false,
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
      selectedItem: {},
    };
  },
  created() {
    this.fetchItems(1);
    this.debouncedFetchItems = _.debounce(this.fetchItems, 10000);
  },
  methods: {
    ...mapActions({
      notify: 'notify',
      detailItem: 'item/detailItem',
    }),
    fetchItems(page = 1, keyword = '', sortBy = 'code', descending = false) {
      this.loading = true;
      this.$axios
        .$get(
          `/api/item/all?page=${page}&search=${keyword || ''}&sortBy=${sortBy}&sortDirection=${
            descending ? 'DESC' : 'ASC'
          }`,
        )
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
      // suppose to be just this.$auth.token , but it doesn't work
      const token = this.$auth.$storage.getState('_token.local').split(' ')[1];

      const win = window.open(
        `${process.env.baseUrl}/api/item/export?accessToken=${token}`,
        '_blank',
      );
      win.focus();
    },
    editItem(item) {
      var procItem = {
        id: item.id,
        barcode: item.barcode,
        code: item.code,
        sku: {
          id: item.sku.id,
          code: item.sku.code,
          name: item.sku.name,
        },
        size: {
          name: item.size,
        },
      };
      this.selectedItem = Object.assign({}, procItem);
    },
    showDetail(code) {
      this.detail = null;
      this.isShowDetail = true;
      this.detailItem({ code }).then(result => {
        this.detail = result;
      });
    },
  },
  computed: {
    pages() {
      if (this.pagination.rowPerPage == null || this.pagination.totalItems == null) {
        return 0;
      }

      return Math.ceil(this.pagination.totalItems / this.pagination.rowPerPage);
    },
    isAnyItemSelected() {
      return Object.keys(this.selectedItem).length > 0;
    },
  },
  watch: {
    searchKeyword(keyword) {
      this.debouncedFetchItems(1, keyword, this.pagination.sortBy, this.pagination.descending);
    },
    pagination(ob) {
      this.fetchItems(
        this.pagination.page,
        this.searchKeyword,
        this.pagination.sortBy,
        this.pagination.descending,
      );
    },
  },
};
</script>
