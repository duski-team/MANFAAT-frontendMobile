<template>
  <base-layout page-title="Purchase Order" page-default-back-link="/tabs/order">
    <ion-grid>
      <ion-row>
        <ion-col class="ion-padding">
          <ion-list>
            <ion-list-header>
              <ion-label class="ion-text-start">
                <h3>No PO</h3>
                <h1>{{ dataPO.noPO }}</h1>
              </ion-label>
            </ion-list-header>
            <ion-item lines="full" class="ion-text-start">
              <ion-label>
                <h4>Nama Toko</h4>
                <h2>{{ dataPO.namaToko }}</h2>
              </ion-label>
            </ion-item>
            <ion-item lines="full">
              <ion-label>
                <h4>Jumlah Pesanan</h4>
                <h2>{{ dataPO.jumlahPesanan }}</h2>
              </ion-label>
            </ion-item>
            <ion-item lines="full">
              <ion-label>
                <h4>Tanggal Pesan</h4>
                <h2>{{ dataPO.tanggalPesan }}</h2>
              </ion-label>
            </ion-item>
            <!-- <ion-item lines="full">
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
            </ion-item> -->
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
//   loadingController,
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
      dataPO: [],
    };
  },
  async ionViewDidEnter() {
    await this.getDataPO();
  },
  methods: {
    async getDataPO() {
      try {
        // const loading = await loadingController.create({
        //   spinner: "circles",
        //   message: "Loading...",
        //   translucent: true,
        // });
        // await loading.present();

        let vm = this;
        const noPO = await Storage.get({ key: "noPO" });
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.get(
          ipConfig + "/masterPO/listByNoPO/" + noPO.value,
          {
            headers: {
              token: dataToken.value,
            },
          }
        );

        // console.log("resultnya", JSON.stringify(dataResult))  ;
        vm.dataPO = dataResult.data[0];
        console.log(vm.dataPO, "<<<");
        console.log(vm.dataPO.noPO, ">>>");
        // await loadingController.dismiss();
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
