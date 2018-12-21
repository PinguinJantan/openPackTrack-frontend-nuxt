<template>
  <v-card class="pa-2">
    <v-layout column>
      <v-flex>
        <h3>Tipe: {{ profile.type }}</h3>
        <h3 v-if="profile.type === 'mix'">Jumlah: {{ profile.mixAmount }}</h3>
      </v-flex>
      <v-flex v-if="profile.type !== 'mix'">
        <v-data-table disable-initial-sort :headers="headers" hide-actions :items="profile.profileItem">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.item.sku.name }}</td>
            <td>{{ props.item.item.size.name }}</td>
            <td>{{ props.item.amount }}</td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-card>
</template>
<script>
export default {
  props: {
    profile: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      headers: [
        { text: 'SKU', value: 'sku' },
        { text: 'Ukuran', value: 'size' },
        { text: 'Jumlah', value: 'amount' },
      ],
    };
  },
};
</script>
