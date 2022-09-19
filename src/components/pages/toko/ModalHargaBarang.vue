<template>
  <base-layout translucent-base="true" page-title="Cari Toko">
    <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>

    <ion-grid>
      <ion-row>
        <ion-col>
          <ion-item lines="none">
            <ion-label>
              <h2>Nama Produk <b>{{ barangs.namaBarang }}</b></h2>
            </ion-label>
          </ion-item>
          <!-- <ion-item lines="none">
            <ion-label>
              <h2>{{ barangs.hargatokoid }}</h2>
            </ion-label>
          </ion-item> -->
          <ion-list>
            <ion-item>
              <ion-label position="fixed">Harga 1</ion-label>
              <ion-input v-model="items.harga"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="fixed">Harga 2</ion-label>
              <ion-input v-model="items.harga2"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="fixed">Harga 3</ion-label>
              <ion-input v-model="items.harga3"></ion-input>
            </ion-item>

            <ion-item lines="none">
              <ion-grid>
                <ion-row>
                  <ion-col>
                    <ion-button
                      expand="block"
                      class="tombol-simpan"
                      @click="simpanHarga"
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
  // IonSelect,
  // IonSelectOption,
  IonInput,
  modalController,
  IonRefresher,
  IonRefresherContent,
onIonViewDidEnter,
} from "@ionic/vue";
// import { close } from "ionicons/icons";
import { ipConfig } from "@/config";
import { Storage } from "@capacitor/storage";
import axios from "axios";
import mixinFunct from "../../../mixins/mixinFunct";

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
  props: ["barangs"],
  mixins: [mixinFunct],
  data() {
    return {
      // close,
      // pilihan: "",
      items: this.barangs,
    };
  },
  setup() {
    const closeModal = () => {
      // console.log("modal dismiss");
      modalController.dismiss(null, "cancel");
    };
    onIonViewDidEnter(() => {
      console.log('Home page did enter');
    });
    return { closeModal };
  },
  async ionViewDidEnter() {
    console.log(this.barangs);
    await this.getHargaBarang();
  },
  methods: {
    async getHargaBarang() {
        console.log(this.barangs);
        this.items = this.barangs
    },
    async simpanHarga() {
        let vm = this;
        try {
        await vm.presentLoading();
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.post(
          ipConfig + "/hargaToko/update/" + vm.items.hargatokoid,
          {
            harga: vm.items.harga,
            harga2: vm.items.harga2,
            harga3: vm.items.harga3,
          },
          {
            headers: {
              token: dataToken.value,
            },
          }
        );
        console.log("result modal", dataResult.data);
        if (dataResult.status == 200) {
            modalController.dismiss()
            console.log("berhasil");
        }
        await vm.discardLoading();
      } catch (err) {
        console.log(err, "catchnya jon");
        await this.discardLoading();
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
      await this.presentLoading();
      console.log(p);
      await Storage.set({ key: "tokoId", value: p.toString() });
      await this.$router.push("/detailToko");
      await modalController.dismiss();
      await this.discardLoading();
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
