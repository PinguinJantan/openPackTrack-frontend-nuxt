<template>
  <v-stepper class="pt-stepper elevation-0" v-model="step">
    <v-layout>
      <v-flex md3 sm3>
        <div
          v-if="step == 2"
          style="display: flex; justify-content: center; align-items: center; height: 100%;"
        >
          <v-btn @click="goToStepOne()"> <v-icon>keyboard_arrow_left</v-icon> Kembali </v-btn>
        </div>
      </v-flex>
    </v-layout>

    <v-stepper-items>
      <v-stepper-content step="1">
        <step-one ref="step1" @next-step="goToStepTwo()" :clear="newRecord" :current-step="step" />
      </v-stepper-content>
      <v-stepper-content step="2">
        <v-layout>
          <v-flex md3 sm3>
            <v-container>
              <v-card flat color="transparent">
                <section>
                  <div class="subheading">Profil</div>
                  <div class="headline">
                    {{ selectedProfile.name }}
                    <v-btn icon @click="showProfileDetail = true">
                      <v-icon>help</v-icon>
                    </v-btn>
                  </div>
                </section>
                <section>
                  <div class="subheading">Kode Box</div>
                  <div class="headline">{{ cartonCode }}</div>
                </section>
                <section>
                  <h3 class="title ma-0">Kode Produk</h3>
                  <v-text-field
                    ref="inputItemType"
                    class="pt-0"
                    name="input-1-3"
                    data-vv-as="Kode Produk"
                    v-validate="'required'"
                    v-model="itemCode"
                    @keyup.enter="focusToInnerCode()"
                    single-line
                    id="itemCodeInput"
                  />
                  <h3 class="title">Kode Inner</h3>
                  <v-text-field
                    ref="inputInnerCode"
                    class="pt-0"
                    name="input-1-3"
                    data-vv-as="Kode Inner"
                    v-validate="'required'"
                    v-model="innerCode"
                    @keyup.enter="handleAddItem()"
                    single-line
                    id="innerCodeInput"
                  />
                  <v-btn
                    color="primary"
                    :disabled="isAddBtnDisabled"
                    @click="handleAddItem()"
                    :loading="addBtnLoading"
                    block
                  >Tambahkan Sepatu</v-btn
                  >
                </section>
                <section class="text-xs-center">
                  <div class="title">Jumlah</div>
                  <div class="display-4">{{ itemsAdded }}</div>
                </section>
              </v-card>
            </v-container>
          </v-flex>
          <v-flex md9>
            <v-layout column>
              <v-flex style="max-height: 80vh;">
                <v-card class="table-input mb-5" flat>
                  <v-container>
                    <v-data-table
                      class="table-narrow big-text-table"
                      :headers="headers"
                      :items="items"
                      hide-actions
                    >
                      <template slot="headers" slot-scope="props">
                        <tr>
                          <th
                            v-for="header in props.headers"
                            :key="header.text"
                            class="column sortable text-xs-left"
                          >
                            {{ header.text }}
                          </th>
                        </tr>
                      </template>
                      <template slot="items" slot-scope="props">
                        <td class="text-xs-left">{{ props.item.type }}</td>
                        <td class="text-xs-left">{{ props.item.size }}</td>
                        <td class="text-xs-left">{{ props.item.code }}</td>
                        <td class="text-xs-left">
                          <v-btn
                            color="error"
                            icon
                            @click="removeItemFromTable(props.index)"
                            class="delete-input"
                          >
                            <v-icon small>delete</v-icon>
                          </v-btn>
                        </td>
                      </template>
                      <template slot="no-data">
                        <v-alert :value="true" color="info" icon="warning">
                          Inputan Kosong
                        </v-alert>
                      </template>
                    </v-data-table>
                  </v-container>
                </v-card>
              </v-flex>
              <v-flex>
                <v-layout row class="actions">
                  <v-spacer />
                  <v-btn color="secondary" 
                         @click="items = []" 
                         outline 
                         class="clear-input"
                  >Kosongkan Inputan</v-btn
                  >
                  <v-btn
                    @click="onSaveInputScan()"
                    color="primary"
                    id="saveInputButton"
                    ref="saveInput"
                    :disabled="!isAddBtnDisabled"
                  >Simpan</v-btn
                  >
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-stepper-content>
    </v-stepper-items>
    <v-dialog v-model="showProfileDetail" max-width="500px">
      <v-card>
        <detail :profile="inputModel.selectedProfile" />
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="showProfileDetail = false">
            Tutup
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-stepper>
</template>

<script>
import Detail from '@/components/profile/Detail.vue';
import _find from 'lodash/find';
import _filter from 'lodash/filter';
import StepOne from '@/components/input/StepOne';

export default {
  data() {
    return {
      step: 1,
      inputModel: {},
      itemCode: '',
      innerCode: '',
      addBtnLoading: false,
      headers: [
        { text: 'Type', value: 'kodeProduk' },
        { text: 'Ukuran', value: 'ukuran' },
        { text: 'Kode Inner', value: 'kodeUnik' },
        { text: ' ', value: ' ' },
      ],
      items: [],
      showProfileDetail: false,
      newRecord: false,
    };
  },
  computed: {
    itemsAdded() {
      return this.items.length;
    },
    isAddBtnDisabled() {
      let amount = 0;
      if (this.inputModel.hasOwnProperty('selectedProfile')) {
        if (this.inputModel.selectedProfile.type === 'mix') {
          amount = this.inputModel.selectedProfile.mixAmount;
        } else {
          this.inputModel.selectedProfile.profileItem.forEach(item => {
            amount += item.amount;
          });
        }
      }
      return this.items.length >= amount;
      // var count = this.inputModel.hasOwnProperty('selectedProfile')
      //   ? this.inputModel.selectedProfile.count
      //   : 12;
      // if (this.items.length >= count) {
      //   return true;
      // }
    },
    // isSaveBtnDisabled() {
    //   if (this.items.length < 1) return true;
    // },
    selectedProfile() {
      return this.inputModel.hasOwnProperty('selectedProfile')
        ? this.inputModel.selectedProfile
        : {};
    },
    cartonCode() {
      return this.inputModel.hasOwnProperty('cartonCode') ? this.inputModel.cartonCode : '';
    },
  },
  methods: {
    clearInput() {
      this.itemCode = '';
      this.innerCode = '';
    },
    pushItem(itemDetail) {
      // ngecek dulu yang mau diinput sudah diinput apa belum
      let arrayItems = _find(this.items, { code: this.innerCode });
      let inProfile = _find(this.inputModel.selectedProfile.profileItem, {
        item: {
          sku: { name: itemDetail.skuName },
          size: { name: itemDetail.size },
        },
      });
      if (arrayItems !== undefined) {
        this.$notifyError(`Sudah memasukan kode ${this.innerCode}`);
      } else if (this.inputModel.selectedProfile.type === 'mix') {
        if (this.items.length < this.inputModel.selectedProfile.mixAmount) {
          this.items.push({
            type: itemDetail.skuName,
            size: itemDetail.size,
            code: this.innerCode,
            itemCode: this.itemCode,
          });
        }
      } else if (inProfile === undefined) {
        this.$notifyError(`Tidak sesuai dengan profile ${this.inputModel.selectedProfile.name}`);
      } else {
        let inItems = _filter(this.items, o => {
          if (o.type === itemDetail.skuName && o.size === itemDetail.size) return o;
        });
        console.log(inItems, inProfile.amount);

        if (inItems && inItems.length >= inProfile.amount) {
          this.$notifyError(`Melebihi jumlah ${itemDetail.skuName} (${inProfile.amount})`);
          return;
        }
        this.items.push({
          type: itemDetail.skuName,
          size: itemDetail.size,
          code: this.innerCode,
          itemCode: this.itemCode,
        });
      }
    },
    focusToItemType() {
      this.$refs.inputItemType.focus();
    },
    focusToInnerCode() {
      this.$refs.inputInnerCode.focus();
    },
    handleAddItem() {
      this.$validator.validateAll().then(isFormValid => {
        if (this.errors.any()) {
          alert(this.errors.all());
        } else {
          this.addBtnLoading = true;
          this.$axios
            .$get(`/api/inner/ping`, {
              params: {
                barcode: this.innerCode,
                itemCode: this.itemCode,
              },
            })
            .then(response => {
              if (!response.exist) {
                if (response.itemDetail) {
                  this.pushItem(response.itemDetail);
                } else {
                  this.$toast.error('Kode produk tidak di temukan di database');
                }
              } else {
                this.$toast.error('Kode inner sudah pernah di gunakan di database');
              }
              this.addBtnLoading = false;
              this.clearInput();
            })
            .catch(err => {
              this.addBtnLoading = false;
              this.$toast.error(err.message);
            });
        }
        this.$refs.inputItemType.focus();
      });
    },
    goToStepOne(newRecord = false) {
      this.step = 1;
      this.items = [];
      this.newRecord = newRecord;
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
    removeItemFromTable(index) {
      this.items.splice(index, 1);
    },
    onSaveInputScan() {
      let innerCodes = [];
      this.items.forEach(item => {
        innerCodes.push({
          barcode: item.code,
          itemCode: item.itemCode,
        });
      });
      console.log('hawaw ', innerCodes);

      this.$axios
        .$post('/api/inner/input-scan', {
          cartonBarcode: this.inputModel.cartonCode,
          profileId: this.inputModel.selectedProfile.id,
          innerCodes: JSON.stringify(innerCodes),
        })
        .then(res => {
          if (res.success) {
            this.$toast.show('Box berhasil di simpan');
            this.goToStepOne(true);
            return;
          }
          this.$toast.show(res.message);
        })
        .catch(err => {
          this.$toast.error(err.message);
        });
    },
  },
  watch: {
    step(value) {
      if (value == 2) {
        setTimeout(() => {
          this.focusToItemType();
        }, 500);
      }
    },
    isAddBtnDisabled(newValue) {
      if (newValue) {
        this.$nextTick(() => {
          this.$refs.saveInput.$el.focus();
        });
      }
    },
  },
  components: { StepOne, Detail },
};
</script>

<style lang="stylus">
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
.actions
  position: fixed;
  right: 10%;
  bottom: 50px;
  background-color: white;
</style>
