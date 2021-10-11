<template>
  <base-layout page-title="Profile Toko" page-default-back-link="/tabs/toko">
    <ion-grid>
      <ion-row>
        <ion-col class="ion-padding">
          <ion-list>
            <ion-list-header>
              <ion-label class="ion-text-start">
                <h3>Nama Toko</h3>
                <h1>{{ dataToko.namaToko }}</h1>
              </ion-label>
            </ion-list-header>
            <ion-item lines="full" class="ion-text-start">
              <ion-label>
                <h4>Alamat</h4>
                <h2>{{ dataToko.alamatToko }}</h2>
              </ion-label>
            </ion-item>
            <ion-item lines="full">
              <ion-label>
                <h4>Nomor HP</h4>
                <h2>{{ dataToko.noHpToko }}</h2>
              </ion-label>
            </ion-item>
            <ion-item lines="full">
              <ion-label>
                <h4>Nomor KTP</h4>
                <h2>{{ dataToko.noKTPToko }}</h2>
              </ion-label>
            </ion-item>
            <ion-item lines="full">
              <ion-label>
                <h4>ID Wilayah</h4>
                <h2>{{ dataToko.wilayahId }}</h2>
              </ion-label>
            </ion-item>
            <ion-item lines="full">
              <ion-label>
                <h4>Wilayah</h4>
                <h2>{{ dataToko.namaWilayah }}</h2>
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
  IonList,
  IonListHeader,
  IonLabel,
  IonItem,
  loadingController,
} from "@ionic/vue";
import { ipConfig } from "@/config";
import { Storage } from "@capacitor/storage";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  components: {
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonListHeader,
    IonLabel,
    IonItem,
  },
  data() {
    return {
      dataToko: [],
    };
  },
  async ionViewDidEnter() {
    await this.getToko();
  },
  methods: {
    async getToko() {
      try {
        const loading = await loadingController.create({
          spinner: "circles",
          message: "Loading...",
          translucent: true,
        });
        await loading.present();

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
        // console.log("resultnya", JSON.stringify(dataResult))  ;
        vm.dataToko = dataResult.data[0][0];
        console.log(vm.dataToko, "<<<");
        await loadingController.dismiss();
      } catch (err) {
        console.log(err, "catchnya jon");
      }
    },
  },
  setup() {
    const router = useRouter();
    return { router };
  },
};
</script>

<style></style>
