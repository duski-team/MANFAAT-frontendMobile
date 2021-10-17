<template>
  <base-layout translucent-base="true" page-title="Detail Barang">
    <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>

    <ion-grid>
      <ion-row>
        <ion-col>
          <ion-item lines="none">
            <ion-label>
              <h2>Silahkan Masukkan Nama Toko</h2>
            </ion-label>
          </ion-item>
          <ion-list>
            <ion-item>
              <ion-label position="floating">Nama Toko</ion-label>
              <ion-input v-model="namaToko"></ion-input>
            </ion-item>

            <ion-item lines="none">
              <ion-grid>
                <ion-row>
                  <ion-col>
                    <ion-button
                      expand="block"
                      class="tombol-simpan"
                      @click="cariToko"
                      >Cari</ion-button
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

            <ion-item
              v-for="(dataToko, index) in dataToko"
              :key="index"
              @click="detailToko(dataToko.id)"
            >
              <ion-label>
                <h2>{{ dataToko.namaToko }}</h2>
                <h3>{{ dataToko.alamatToko }}</h3>
                <p>{{ dataToko.namaWilayah }}</p>
              </ion-label>
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
  // IonSelect,
  // IonSelectOption,
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
  components: {
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonList,
    // IonIcon,
    IonLabel,
    IonItem,
    // IonSelect,
    // IonSelectOption,
    IonInput,
    IonRefresher,
    IonRefresherContent,
  },
  data() {
    return {
      // close,
      // pilihan: "",
      namaToko: "",
      dataToko: [],
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
  // async mounted() {
  //   // await this.getAkun();
  //   // await this.getToko();
  // },
  methods: {
    async cariToko() {
      try {
        const loading = await loadingController.create({
          spinner: "circles",
          message: "Loading...",
          translucent: true,
        });
        await loading.present();

        let vm = this;
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.post(
          ipConfig + "/masterToko/listByName",
          {
            namaToko: vm.namaToko,
          },
          {
            headers: {
              token: dataToken.value,
            },
          }
        );
        // console.log("result modal", dataResult.data);
        vm.dataToko = dataResult.data;
        // console.log("barangnya", vm.listBarang);
        await loading.dismiss();
      } catch (err) {
        console.log(err, "catchnya jon");
        await loadingController.dismiss();
      }
    },
    async doRefresh(ev) {
      // console.log(ev);
      // await this.getToko();
      ev.target.complete();

      // if (this.listBarang) {
      //   ev.target.complete();
      // }
    },
    async detailToko(p) {
      const loading = await loadingController.create({
        spinner: "circles",
        message: "Loading...",
        translucent: true,
      });
      await loading.present();
      await Storage.set({ key: "tokoId", value: p.toString() })
      await this.$router.push("/detailToko");
      await modalController.dismiss();
      await loading.dismiss();
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
