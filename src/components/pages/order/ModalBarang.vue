<template>
  <base-layout translucent-base="true" page-title="Detail Barang">
    <!-- <template v-slot:actions-end>
      <ion-button @click="closeModal">
        <ion-icon slot="icon-only" :icon="close"></ion-icon>
      </ion-button>
    </template> -->

    <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>

    <ion-grid>
      <ion-row>
        <ion-col>
          <ion-item lines="none">
            <ion-label>
              <h2>Masukkan barang dan jumlah</h2>
            </ion-label>
          </ion-item>
          <ion-list>
            <ion-item>
              <ion-label>Nama Barang</ion-label>
              <ion-select
                placeholder="pilih barang"
                interface="action-sheet"
                v-model="pilihBarang.namaBarang"
              >
                <ion-select-option
                  v-for="(listBarang, index) in listBarang"
                  :key="index"
                  :value="listBarang.namaBarang"
                >
                  {{ listBarang.namaBarang }}
                </ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item v-if="pilihBarang.namaBarang">
              <ion-label>Harga Satuan</ion-label>
              <ion-input readonly class="ion-text-right" :value="computedHarga.harga" style="padding-right: 5px;"></ion-input>
            </ion-item>
            <ion-item v-else>
              <ion-label>Harga Satuan</ion-label>
              <ion-input readonly class="ion-text-right" value="-"></ion-input>
            </ion-item>

            <ion-item>
              <ion-label>Jumlah Barang</ion-label>
              <ion-input
                v-model="pilihBarang.jumlahBarang"
                placeholder="masukkan jumlah"
                class="ion-text-right spinner_kit"
                type="number"
              ></ion-input>
            </ion-item>

            <ion-item v-if="pilihBarang.jumlahBarang">
              <ion-label>Harga Satuan</ion-label>
              <ion-input readonly class="ion-text-right" :value="computedHarga.totalHarga" style="padding-right: 5px;"></ion-input>
            </ion-item>
            <ion-item v-else>
              <ion-label>Harga Satuan</ion-label>
              <ion-input readonly class="ion-text-right" value="-"></ion-input>
            </ion-item>

            <ion-item lines="none" class="ion-no-margin">
              <ion-grid>
                <ion-row>
                  <ion-col>
                    <ion-button
                      expand="block"
                      class="tombol-simpan"
                      @click="simpanBarang(this.pilihBarang)"
                      >Simpan</ion-button
                    >
                  </ion-col>
                  <ion-col>
                    <ion-button
                      expand="block"
                      fill="outline"
                      @click="closeModal"
                      >Batal</ion-button
                    >
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-item>
          </ion-list>
        </ion-col>
      </ion-row>
    </ion-grid>
  </base-layout>
</template>

<script>
import {
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonList,
  // IonIcon,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
  modalController,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/vue";
// import { close } from "ionicons/icons";
import { ipConfig } from "@/config";
import { Storage } from "@capacitor/storage";
import axios from "axios";
import mixinFunct from "../../../mixins/mixinFunct";

export default {
  name: "ModalBarang",
  // props: {
  //   dataBarang: this.pilihBarang
  // },
  components: {
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonList,
    // IonIcon,
    IonLabel,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonRefresher,
    IonRefresherContent,
  },
  mixins: [mixinFunct],
  data() {
    return {
      // close,
      // pilihan: "",
      listBarang: [],
      pilihBarang: {},
    };
  },
  setup() {
    const closeModal = () => {
      // console.log("modal dismiss");
      modalController.dismiss(null, "cancel");
    };
    return { closeModal };
  },
  async mounted() {
    // await this.getAkun();
    await this.getToko();
  },
  computed: {
    computedHarga() {
      this.listBarang.forEach((el) => {
        if (this.pilihBarang.namaBarang == el.namaBarang) {
          this.pilihBarang.hargatokoid = el.hargatokoid;
          this.pilihBarang.harga = el.harga;
          this.pilihBarang.harga2 = el.harga2;
          this.pilihBarang.harga3 = el.harga3;
          this.pilihBarang.masterBarangId = el.masterBarangId;
          this.pilihBarang.totalHarga =
            el.harga * Number(this.pilihBarang.jumlahBarang);
        }
      });
      return this.pilihBarang
    }
  },
  methods: {
    simpanBarang() {
      modalController.dismiss(
        {
          dataBarang: this.pilihBarang,
          // role: "confirm"
        },
        { role: "confirm " }
      );
    },

    async getAkun() {
      try {
        let vm = this;
        await vm.presentLoading();
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.get(ipConfig + "/akun/list", {
          headers: {
            token: dataToken.value,
          },
        });
        dataResult.data.forEach((el) => {
          if (el.kodeAkun[0] == "4") {
            vm.listBarang.push(el);
          }
        });
        // console.log("listBarang", vm.listBarang);
        await vm.discardLoading();
      } catch (err) {
        console.log("TIDAAK!", err);
        await this.discardLoading();
      }
    },

    async getToko() {
      try {
        let vm = this;
        await vm.presentLoading();
        const idToko = await Storage.get({ key: "tokoId" });
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.get(
          ipConfig + "/masterToko/listById/" + idToko.value,
          {
            headers: {
              token: dataToken.value,
            },
          }
        );
        // console.log("result modal", dataResult.data);
        vm.listBarang = dataResult.data[1];
        await vm.discardLoading();
        // console.log("barangnya", vm.listBarang);
      } catch (err) {
        console.log(err, "catchnya jon");
        await this.discardLoading();
      }
    },
    async doRefresh(ev) {
      // console.log(ev);
      await this.getToko();

      if (this.listBarang) {
        await ev.target.complete();
      }
    },
  },
};
</script>

<style scoped>
.tombol-simpan {
  --color: black;
  /* --border-color: white; */
}
.spinner_kit,
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  margin: 0;
}
</style>
