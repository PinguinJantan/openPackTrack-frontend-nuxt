<template>
  <v-dialog persistent v-model="value" max-width="500">
    <v-card>
      <v-card-title>
        Tambah SKU baru
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-card-text class="text-xs-center" v-if="loading">
            <v-progress-circular indeterminate color="primary"/>
          </v-card-text>
          <v-layout wrap v-else>
            <v-layout md12>
              <v-flex xs12 sm6 md6>
                <v-text-field label="Nama"
                              v-model="name"
                              required
                              outline/>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field label="Kode"
                              required
                              v-model="code"
                              outline/>
              </v-flex>
            </v-layout>
            <v-flex md12>
              <vue-multiselect :options="categoryOptions"
                               v-model="category"
                               placeholder="Kategori"
                               :allow-empty="false"
                               tag-position="bottom"
                               @tag="addCategoryTag"
                               :taggable="true"/>
            </v-flex>
            <v-flex md12>
              <vue-multiselect :options="colorOptions"
                               v-model="color"
                               placeholder="Warna"
                               :allow-empty="false"
                               tag-position="bottom"
                               @tag="addColorTag"
                               :taggable="true"/>
            </v-flex>
            <v-flex md12>
              <vue-multiselect :options="genderOptions"
                               v-model="gender"
                               placeholder="Gender"
                               :allow-empty="false"
                               tag-position="bottom"
                               @tag="addGenderTag"
                               :taggable="true"/>
            </v-flex>
          </v-layout>
          <v-layout justify-end row>
            <v-btn large @click="hideFn" :disabled="saving">Batal</v-btn>
            <v-spacer/>
            <v-btn color="primary"
                   large
                   :disabled="saving"
                   @click="saveSku">
              <v-progress-circular size="20"
                                   indeterminate
                                   color="primary"
                                   v-if="saving"/>
              <template v-if="saving">
                Menyimpan
              </template>
              <template v-else>
                Simpan
              </template>
            </v-btn>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'AddSku',
  props: {
    value: {
      type: Boolean,
      default: true,
    },
    addSkuTag: {
      type: Function,
      default: function() {},
    },
  },
  data() {
    return {
      loading: true,
      saving: false,
      name: '',
      code: '',
      category: '',
      color: '',
      gender: '',
      categoryOptions: [],
      colorOptions: [],
      genderOptions: [],
    };
  },
  methods: {
    ...mapActions({
      createSku: 'item/createSku',
    }),
    hideFn() {
      this.$emit('input', false);
    },
    addCategoryTag(newTag) {
      this.categoryOptions.push(newTag);
      this.category = newTag;
    },
    addColorTag(newTag) {
      this.colorOptions.push(newTag);
      this.color = newTag;
    },
    addGenderTag(newTag) {
      this.genderOptions.push(newTag);
      this.gender = newTag;
    },
    fetchOptions(option, optionPlural) {
      return this.$axios
        .$get(`/api/${option}/list`)
        .then(res => {
          if (res.success) {
            this[`${option}Options`] = res[optionPlural].map(item => {
              return item.name;
            });
            return;
          }

          this.notify({ type: 'error', message: res.message });
        })
        .catch(err => {
          this.notify({ type: 'error', message: err.message });
        });
    },
    saveSku() {
      this.saving = true;
      this.createSku({
        code: this.code,
        name: this.name,
        category: this.category,
        color: this.color,
        gender: this.gender,
      }).then(data => {
        this.saving = false;
        this.$emit('success', {
          sku: data,
        });
        this.$emit('input', false);
      });
    },
  },
  mounted() {
    Promise.all([
      this.fetchOptions('category', 'categories'),
      this.fetchOptions('color', 'colors'),
      this.fetchOptions('gender', 'genders'),
    ]).then(() => {
      this.loading = false;
    });
  },
};
</script>
