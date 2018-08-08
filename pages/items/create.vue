<template>
  <v-layout align-left justify-center>
    <v-flex xs12
            sm6
            md6
            text-xs-center
            mt-5>
      <h3>Buat Item Baru</h3>
      <item-form/>
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
