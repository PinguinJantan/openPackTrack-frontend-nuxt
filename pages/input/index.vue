<template>
  <v-stepper class="pt-stepper elevation-0" v-model="step">
    <v-layout>
      <v-flex md6 offset-md3>
        <v-stepper-header class="elevation-0">
          <v-stepper-step step="1" :complete="step > 1">Pilih Profil karton</v-stepper-step>
          <v-divider/>
          <v-stepper-step step="2" :complete="step > 2">Inputkan Inner Box</v-stepper-step>
        </v-stepper-header>
      </v-flex>
    </v-layout>

    <v-stepper-items>
      <v-stepper-content step="1">
        <step-one ref="step1" @next-step="goToStepTwo()" />
      </v-stepper-content>
      <v-stepper-content step="2">
        <v-layout>
          <v-flex md3>
            <v-container>
              <v-card flat color="transparent">
                <section>
                  <div class="subheading">Profil</div>
                  <div class="headline">{{ 'selectedProfile.type' }}</div>
                </section>
                <section>
                  <div class="subheading">Kode Box</div>
                  <div class="headline">{{ 'cartonCode' }}</div>
                </section>
                <section>
                  <h3 class="title">Kode Produk</h3>
                  <v-text-field
                    ref="inputItemType"
                    class="pt-0"
                    name="input-1-3"
                    v-validate="'required'"
                    v-model="itemInput.type"
                    single-line />
                  <h3 class="title">Kode Unik</h3>
                  <v-text-field
                    class="pt-0"
                    name="input-1-3"
                    v-validate="'required'"
                    v-model="itemInput.code"
                    single-line />
                  <v-btn color="primary"
                         :disabled="isAddBtnDisabled"
                         @click="pushItem()"
                         block>Tambahkan Sepatu</v-btn>
                </section>
                <section class="text-xs-center">
                  <div class="title">Sudah diinputkan</div>
                  <div class="display-4">{{ itemsAdded }}</div>
                </section>
              </v-card>
            </v-container>
          </v-flex>
          <v-flex md9>
            <v-card class="table-input mb-5" flat>
              <v-container>
                <v-btn color="secondary" @click="items = []" outline>Kosongkan Inputan</v-btn>
                <v-data-table
                  class="table-narrow"
                  :headers="headers"
                  :items="items"
                  hide-actions>
                  <template slot="headers" slot-scope="props">
                    <tr>
                      <th v-for="header in props.headers"
                          :key="header.text"
                          class="column sortable text-xs-left" >
                        {{ header.text }}
                      </th>
                    </tr>
                  </template>
                  <template slot="items" slot-scope="props" class="bababa">
                    <td class="text-xs-left">{{ props.item.type }}</td>
                    <td class="text-xs-left">{{ props.item.size }}</td>
                    <td class="text-xs-left">{{ props.item.code }}</td>
                  </template>
                  <template slot="no-data">
                    <v-alert :value="true" color="info" icon="warning">
                      Inputan Kosong
                    </v-alert>
                  </template>
                </v-data-table>
                <v-card-actions>
                  <v-spacer/>
                  <v-btn color="primary" :disabled="isSaveBtnDisabled">Simpan</v-btn>
                </v-card-actions>
              </v-container>
            </v-card>
          </v-flex>
        </v-layout>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import _find from 'lodash/find';
import { mapActions } from 'vuex';

import StepOne from '@/components/input/StepOne';

export default {
  data() {
    return {
      step: 1,
      inputModel: {},
      itemInput: {
        type: 'initype',
        size: 39,
        code: 'inicode',
      },

      headers: [
        { text: 'Kode Produk', value: 'kodeProduk' },
        { text: 'Ukuran', value: 'ukuran' },
        { text: 'Kode Unik', value: 'kodeUnik' },
      ],
      items: [],
    };
  },
  computed: {
    itemsAdded() {
      return this.items.length;
    },
    isAddBtnDisabled() {
      if (this.items.length >= 12) {
        return true;
      }
    },
    isSaveBtnDisabled() {
      if (this.items.length < 1) return true;
    },
  },
  methods: {
    ...mapActions(['notify']),
    pushItem() {
      this.$validator.validateAll().then(isFormValid => {
        if (this.errors.any()) {
          alert(this.errors.all());
        } else {
          // ngecek dulu yang mau diinput sudah diinput apa belum
          let arrayItems = _find(this.items, { code: this.itemInput.code });
          if (arrayItems == undefined) {
            this.items.push({
              type: this.itemInput.type,
              size: this.itemInput.size,
              code: this.itemInput.code,
            });
          } else {
            this.notify({ type: 'error', message: `Sudah memasukan kode ${this.itemInput.code}` });
          }

          // kosongkan inputan
          for (var props in this.itemInput) {
            if (this.itemInput.hasOwnProperty(props)) {
              this.itemInput[props] = null;
            }
          }
        }
        this.$refs.inputItemType.focus();
      });
    },
    goToStepTwo() {
      this.$refs.step1.validateStep().then(({ valid, model }) => {
        if (valid) {
          console.log(valid, model, 'mamama');
          this.inputModel = { ...this.inputModel, ...model };
          this.step = 2;
        } else {
          console.log(valid, model, 'false mamama');
        }
      });
    },
  },
  components: { StepOne },
};
</script>

<style lang="stylus" >
.pt-stepper
  section
    margin-bottom 1rem
  .card
    &.table-input
      min-height 50vh
      border 1px solid #becece
      border-radius 3px

  .stepper__content
    padding-top 0
  .stepper__step
    padding-top 12px
    padding-bottom 12px
  .stepper__step__step
    height 32px
    width 32px

  table.table
    thead tr
      height 36px
    tbody td
      height 34px
      padding .25em .5em
      font-size 16px
      line-height 1.5

.container
  padding 0 16px
</style>
