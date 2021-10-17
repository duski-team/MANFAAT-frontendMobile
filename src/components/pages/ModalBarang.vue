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
                @ionChange="pilih"
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

            <ion-item>
              <ion-label>Jumlah Barang</ion-label>
              <ion-input
                v-model="pilihBarang.jumlahBarang"
                placeholder="masukkan jumlah"
                class="ion-text-right spinner_kit"
                type="number"
              ></ion-input>
            </ion-item>
            <ion-item lines="none">
              <ion-grid>
                <ion-row>
                  <ion-col>
                    <ion-button
                      expand="block"
                      class="tombol-simpan"
                      @click="simpanBarang(this.pilihBarang)"
                      >Simpan</ion-button
                    >
                    <!-- <ion-button
                      expand="block"
                      class="tombol-simpan"
                      @click="simpanBarang(this.pilihBarang)"
                      >Simpan</ion-button
                    > -->
                  </ion-col>
                <!-- </ion-row>
              </ion-grid>
              <ion-grid>
                <ion-row> -->
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
  loadingController,
} from "@ionic/vue";
// import { close } from "ionicons/icons";
import { ipConfig } from "@/config";
import { Storage } from "@capacitor/storage";
import axios from "axios";

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
  methods: {
    simpanBarang() {
      this.listBarang.forEach((el) => {
        if (this.pilihBarang.namaBarang == el.namaBarang) {
          this.pilihBarang.hargatokoid = el.hargatokoid;
          this.pilihBarang.harga = el.harga;
          this.pilihBarang.harga2 = el.harga2;
          this.pilihBarang.harga3 = el.harga3;
          this.pilihBarang.masterBarangId = el.masterBarangId;
          this.pilihBarang.totalHarga =
            el.harga * Number(this.pilihBarang.jumlahBarang);
          // this.pilihBarang.totalNominal = el.harga * el.jumlahBarang
        }
      });
      // console.log(this.pilihBarang, "<<<");
      // console.log(JSON.stringify(this.pilihBarang, "<<<"));
      modalController.dismiss(
        {
          dataBarang: this.pilihBarang,
          // role: "confirm"
        },
        { role: "confirm " }
      );
      // console.log(this.pilihBarang, "simpan");
    },

    pilih() {
      // console.log(this.pilihBarang.namaBarang);
    },

    jumlah() {
      // console.log(this.pilihBarang.jumlahBarang);
    },

    async getAkun() {
      try {
        const loading = await loadingController.create({
          spinner: "circles",
          message: "Mohon Tunggu...",
          translucent: true,
        });
        await loading.present();

        let vm = this;
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
        loading.dismiss();
      } catch (err) {
        console.log("TIDAAK!", err);
      }
    },

    async getToko() {
      try {
        let vm = this;
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
        // console.log("barangnya", vm.listBarang);
      } catch (err) {
        console.log(err, "catchnya jon");
      }
    },
    async doRefresh(ev) {
      // console.log(ev);
      await this.getToko();

      if (this.listBarang) {
        ev.target.complete();
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
