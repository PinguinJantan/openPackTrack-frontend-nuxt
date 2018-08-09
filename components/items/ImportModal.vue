<template>
  <v-dialog v-model="show" persistent max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Import Item</span>
      </v-card-title>
      <v-card-text class="text-xs-center">
        <v-progress-circular v-if="isSaving" 
                             indeterminate 
                             :width="3" 
                             color="green"/>
        <input v-if="isInitial || isFailed" 
               type="file" 
               accept="text/csv, .csv" 
               @change="handleFileUpload($event.target.files)">

        <h3 v-if="isSuccess">Data telah masuk kedalam database</h3> 
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="blue darken-1" flat @click.native="close">Tutup</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions } from 'vuex';

const STATUS_INITIAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3;
export default {
  name: 'ImportModal',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: null,
      currentStatus: STATUS_INITIAL,
    };
  },
  computed: {
    isInitial() {
      return this.currentStatus === STATUS_INITIAL;
    },
    isSaving() {
      return this.currentStatus === STATUS_SAVING;
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS;
    },
    isFailed() {
      return this.currentStatus === STATUS_FAILED;
    },
  },
  methods: {
    ...mapActions(['notify']),
    close() {
      this.$emit('close');
    },
    handleFileUpload(files) {
      if (files.length === 0) return;

      const formData = new FormData();

      const file = files[0]; // we only need a file

      formData.append('ItemCSV', file, file.name);

      this.upload(formData);
    },
    upload(formData) {
      this.currentStatus = STATUS_SAVING;

      this.$axios.setHeader('Content-Type', 'multipart/form-data');

      this.$axios
        .$post('/api/item/import', formData)
        .then(res => {
          if (res.success) {
            this.currentStatus = STATUS_SUCCESS;
          } else {
            this.currentStatus = STATUS_FAILED;
            this.notifyError(res.message);
          }
        })
        .catch(err => {
          this.currentStatus = STATUS_FAILED;
          this.notifyError(err.message);
        });
    },
    notifyError(message) {
      this.notify({ type: 'error', message: `upload gagal karena ${message}` });
    },
  },
};
</script>
