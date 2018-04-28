<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8>
      <v-btn color="primary" to="/users/create" class="text-xs-left mt-3">
        Buat Pengguna Baru
      </v-btn>
      <v-card-title>
        Semua Pengguna 
        <v-spacer/>
        <v-text-field
          append-icon="search"
          label="Cari Pengguna"
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
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.username }}</td>
          <td>
            <v-chip v-for="role in props.item.roles" 
                    :key="role" 
                    color="primary" 
                    text-color="white">{{ role }}</v-chip>
          </td>
          <td>
            <v-btn outline :to="{ name: 'users-username', params: { username: props.item.username}}">Lihat</v-btn>
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
  </v-layout>
</template>
<script>
import { mapActions } from 'vuex';

export default {
  data: () => {
    return {
      searchKeyword: '',
      totalItems: 0,
      loading: true,
      pagination: {
        rowPerPage: 10,
        totalItems: 0,
        page: 1,
      },
      items: [],
      headers: [
        { text: 'Nama', value: 'name' },
        { text: 'Username', value: 'username' },
        { text: 'Peran', value: 'roles' },
      ],
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
        .$get(`/api/user/all?page=${page}&search=${keyword}`)
        .then(response => {
          this.loading = false;
          if (response.success) {
            this.items = response.users;
            this.pagination.page = page;
            this.pagination.totalItems = response.pagination.total;
            this.totalItems = response.pagination.pageCount;
          }
        })
        .catch(err => {
          this.notify({ type: 'error', message: err.message });
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
  },
  watch: {
    searchKeyword(keyword) {
      this.fetchItems(1, keyword);
    },
  },
};
</script>
