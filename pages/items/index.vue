<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8>
      <v-data-table
        :headers="headers"
        :pagination.sync="pagination"
        :total-items="totalItems"
        :loading="loading"
        :search="search"
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
        </template>
      </v-data-table>
      <div class="text-xs-center pt-2">
        <v-pagination v-model="pagination.page" :length="pages" @next="fetchItems(pagination.page)" @previous="fetchItems(pagination.page)" @input="fetchItems(pagination.page)"></v-pagination>
      </div>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  middleware: ['auth'],
  data: () => {
    return {
      search: '',
      totalItems: 0,
      loading: true,
      pagination: {
        rowPerPage: 10,
      },
      items: [],
      headers: [
        { text: 'Kode', value: 'code'},
        { text: 'Ukuran', value: 'size'},
        { text: 'SKU', value: 'sku.code'},
        { text: 'Nama', value: 'sku.name'},
        { text: 'Kategori', value: 'sku.category'},
        { text: 'Warna', value: 'sku.color'}
      ],
    }
  },
  created() {
    this.fetchItems(1)
  },
  methods: {
    fetchItems(page) {
      this.loading = true;
      this.$axios.$get(`/api/item/all?page=${page}`).then(response => {
        this.loading = false;
        if (response.success) {
          this.items = response.item;
          this.pagination.page = page
          this.pagination.totalItems = response.pagination.itemTotal;
          this.totalItems = response.pagination.pageCount;
        }
      }).catch(err => {
        this.$store.commit('setAlert', err.message)
      })
    }
  },
  computed: {
    pages() {
      if (this.pagination.rowPerPage == null || this.pagination.totalItems == null) {
        return 0;
      }
      
      return Math.ceil(this.pagination.totalItems / this.pagination.rowPerPage)
    }
  }
}
</script>
