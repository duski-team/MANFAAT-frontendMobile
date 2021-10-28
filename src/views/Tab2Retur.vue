<template>
  <base-layout page-title="MANFA'AT">
    <template v-slot:actions-end>
      <ion-button router-link="/tabs/retur/create">
        <ion-icon slot="icon-only" :icon="add"></ion-icon>
      </ion-button>
    </template>

    <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>

    <ion-progress-bar v-if="showLoader" :value="testValue"></ion-progress-bar>

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
    <ion-grid>
      <ion-row>
        <ion-col>
          <ion-list v-if="!listRetur.length">
            <ion-list-header>
              <ion-label color="primary">
                <h1>List Retur</h1>
              </ion-label>
            </ion-list-header>

            <ion-item lines="none">
              <ion-label class="ion-text-center isi-tabel">
                <p>Tidak ada retur</p>
              </ion-label>
            </ion-item>
          </ion-list>
          <ion-list v-else>
            <ion-list-header>
              <ion-label color="primary">
                <h1>List Retur</h1>
              </ion-label>
            </ion-list-header>

            <ion-item
              v-for="(listRetur, index) in listRetur"
              :key="index"
              @click="openDetailRetur(listRetur.noPO)"
              lines="full"
              detail
            >
              <ion-label>
                <h2>No. PO: {{ listRetur.noPO }}</h2>
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
  IonItem,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonListHeader,
  IonButton,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonProgressBar,
  loadingController,
} from "@ionic/vue";
import { add } from "ionicons/icons";
import { useRouter } from "vue-router";
import { Storage } from "@capacitor/storage";
import { ipConfig } from "../config";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";

export default {
  name: "ReturOrder",
  components: {
    IonItem,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonListHeader,
    IonButton,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    IonProgressBar,
  },
  data() {
    return {
      add,
      listRetur: [],
      hari: "",
      tanggal: "",
      waktu: "",
      testValue: 0,
      showLoader: false,
    };
  },
  setup() {
    const router = useRouter();
    const currentDate = new Date();
    return { router, currentDate };
  },
  async ionViewDidEnter() {
    await this.getRetur();
    await this.testMoment();
  },
  methods: {
    async getRetur() {
      try {
        await this.presentLoading();

        let vm = this;
        // this.runDeterminateProgress()
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.get(
          ipConfig + "/retur/listByUsersLogin",
          {
            headers: {
              token: dataToken.value,
            },
          }
        );
        // console.log("list retur", dataResult.data);

        if (dataResult.data.length) {
          vm.listRetur = dataResult.data.sort((a, b) =>
            a.id > b.id ? 1 : b.id > a.id ? -1 : 0
          );
        } else {
          vm.listRetur = dataResult.data;
        }

        if (vm.listRetur) {
          await this.discardLoading();
        }
      } catch (err) {
        console.log(err, "errornya listRetur");
        await this.discardLoading();
      }
    },

    async openDetailRetur(p) {
      console.log(`detail retur`, p);
      // console.log(`detail retur ${noPO}`);
    },

    async doRefresh(ev) {
      // console.log(ev);
      await this.getRetur();
      await this.testMoment();

      if (this.listRetur) {
        ev.target.complete();
      }
    },

    async testMoment() {
      this.hari = await moment().format("dddd");
      this.tanggal = await moment().format("LL");
      this.waktu = await moment().format("LT");
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
<style scoped>
.isi-tabel {
  font-style: italic;
}
</style>
