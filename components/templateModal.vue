<template>
  <v-dialog persistent v-model="value" max-width="500">
    <v-card>
      <v-card-title>
        Tambah SKU baru
      </v-card-title>
      <v-card-text v-if="item">
        {{ item }}
      </v-card-text>
      <v-card-text class="text-xs-center" v-else>
        <v-progress-circular indeterminate color="primary"/>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="hideFn">Tutup</v-btn>
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
