<template>
  <v-layout row justify-center>
    <v-dialog v-model="show" max-width="500" persistent>
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>Edit Item</v-card-title>
        <v-card-text>
          <item-form mode="edit" :item="item"/>
        </v-card-text>
        <v-divider/>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" flat @click="$emit('close')">
            Tutup
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import ItemForm from '@/components/items/ItemForm';

export default {
  name: 'EditItem',
  components: { ItemForm },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: () => {
        return {};
      }, // empty object indicate this is on create mode
    },
  },
};
</script>
