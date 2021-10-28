<template>
  <base-layout page-title="MANFA'AT">
    <template v-slot:actions-end>
      <ion-button router-link="/tabs/toko/tambah/">
        <ion-icon slot="icon-only" :icon="add"></ion-icon>
      </ion-button>
    </template>

    <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>

    <ion-item lines="none">
      <ion-grid>
        <ion-row>
          <ion-col size="6">
            <ion-label>
              <h3>{{ hari }}</h3>
              <h3>{{ tanggal }}</h3>
            </ion-label>
          </ion-col>
          <ion-col class="ion-text-end" size="6">
            <ion-label>
              <h1>{{ waktu }}</h1>
            </ion-label>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-item>
    <ion-list v-if="listToko != undefined" class="ion-padding-end">
      <ion-list-header>
        <ion-label color="primary">
          <h1>Daftar Toko</h1>
        </ion-label>
        <ion-label class="ion-text-end">
          <h5>Wilayah</h5>
          <h2>{{ namaWilayah }}</h2>
        </ion-label>
      </ion-list-header>
      <ion-item
        v-for="(listToko, index) in listToko"
        :key="index"
        @click="detailToko(listToko.id)"
        detail
      >
        <ion-label>
          <h2>{{ listToko.namaToko }}</h2>
          <h3>{{ listToko.alamatToko }}</h3>
          <p>{{ listToko.namaWilayah }}</p>
        </ion-label>
      </ion-item>
    </ion-list>
    <ion-list v-else>
      <p>
        Loading...
      </p>
    </ion-list>

    <template v-slot:button-float>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="searchToko">
          <ion-icon :icon="search"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </template>
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
  IonButton,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonFabButton,
  loadingController,
  modalController,
} from "@ionic/vue";
import { add, search } from "ionicons/icons";
import { ipConfig } from "../config";
import { Storage } from "@capacitor/storage";
import { useRouter } from "vue-router";
import modalToko from "@/components/pages/toko/ModalToko.vue";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";

export default {
  name: "DaftarToko",
  components: {
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonListHeader,
    IonLabel,
    IonItem,
    IonButton,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    IonFab,
    IonFabButton,
  },
  data() {
    return {
      add,
      search,
      listToko: [],
      namaWilayah: "",
      hari: "",
      tanggal: "",
      waktu: "",
    };
  },

  setup() {
    const router = useRouter();
    return { router };
  },

  async ionViewDidEnter() {
    await this.dataToko();
    await this.testMoment();
  },

  methods: {
    async dataToko() {
      try {
        await this.presentLoading();

        let vm = this;
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.get(
          ipConfig + "/masterToko/listByUserLogin",
          {
            headers: {
              token: dataToken.value,
            },
          }
        );
        vm.listToko = dataResult.data.sort((a, b) =>
          a.id > b.id ? 1 : b.id > a.id ? -1 : 0
        );
        vm.namaWilayah = vm.listToko[0].namaWilayah;
        // console.log(vm.listToko);
        if (vm.listToko) {
          await this.discardLoading();
        }
      } catch (err) {
        console.log(err, "errornya datatoko");
        await this.discardLoading();
      }
    },

    async detailToko(p) {
      await Storage.set({ key: "tokoId", value: p.toString() });
      await this.$router.push("/detailToko");
    },

    async doRefresh(ev) {
      await this.dataToko();
      await this.testMoment();

      if (this.listToko) {
        ev.target.complete();
      }
    },

    async testMoment() {
      this.hari = await moment().format("dddd");
      this.tanggal = await moment().format("LL");
      this.waktu = await moment().format("LT");
    },

    async searchToko() {
      const modal = await modalController.create({
        component: modalToko,
      });
      return await modal.present();
    },

    async presentLoading() {
      const loading = await loadingController.create({
        spinner: "circles",
        message: "Mohon Tunggu...",
        translucent: true,
      });
      await loading.present();
    },

    async discardLoading() {
      await setTimeout(() => {
        loadingController.dismiss();
      }, 1000);
    },
  },
};
</script>
