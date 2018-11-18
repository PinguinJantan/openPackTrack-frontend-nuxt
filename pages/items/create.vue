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

export default {
  name: 'CreateItem',
  components: { ItemForm },
  data() {
    return {};
  },
};
</script>

<style scoped>
</style>
