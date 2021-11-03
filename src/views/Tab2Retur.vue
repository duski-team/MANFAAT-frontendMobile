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
          <ion-list v-if="listRetur.length == 0">
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
              @click="openDetailRetur(listRetur.id)"
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
} from "@ionic/vue";
import { add } from "ionicons/icons";
import { useRouter } from "vue-router";
import { Storage } from "@capacitor/storage";
import { ipConfig } from "../config";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";
import mixinFunct from "../mixins/mixinFunct";

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
  },

  mixins: [mixinFunct],

  data() {
    return {
      add,
      listRetur: [],
      hari: "",
      tanggal: "",
      waktu: "",
      testValue: 0,
    };
  },

  setup() {
    const router = useRouter();
    const currentDate = new Date();
    return { router, currentDate };
  },

  async ionViewDidEnter() {
    await this.presentLoading();
    await this.getRetur();
    await this.testMoment();
    await this.discardLoading();
  },

  methods: {
    async getRetur() {
      try {
        let vm = this;
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.get(
          ipConfig + "/retur/listByUsersLogin",
          {
            headers: {
              token: dataToken.value,
            },
          }
        );
        if (dataResult.data.length) {
          vm.listRetur = dataResult.data.data.sort((a, b) =>
            a.id > b.id ? 1 : b.id > a.id ? -1 : 0
          );
        } else {
          vm.listRetur = dataResult.data.data;
        }
      } catch (err) {
        console.log(err, "errornya listRetur");
      }
    },
    async openDetailRetur(p) {
      console.log(`detail retur`, p);
      
      await Storage.set({ key: "returId", value: p.toString() });
      await this.$router.push("/tabs/retur/details");

      // const dataToken = await Storage.get({ key: "token" });
      // const dataResult = await axios.get(ipConfig + "/retur/listReturById/" + p.id, {
      //   headers: {
      //     token: dataToken.value,
      //   },
      // });
      // console.log(dataResult);
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
  },
};
</script>
<style scoped>
.isi-tabel {
  font-style: italic;
}
</style>
