<template>
  <base-layout page-title="MANFA'AT">
    <template v-slot:actions-end>
      <ion-button router-link="/tabs/retur/create">
        <ion-icon slot="icon-only" :icon="add"></ion-icon>
      </ion-button>
    </template>

    <ion-item lines="none">
      <ion-label>{{ currentDate }}</ion-label>
    </ion-item>
    <ion-grid>
      <ion-row>
        <ion-col>
          <ion-list v-if="listRetur">
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
            >
              <ion-label>
                <h2>{{ listRetur.noPO }}</h2>
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
  loadingController,
} from "@ionic/vue";
import { add } from "ionicons/icons";
import { useRouter } from "vue-router";
import { Storage } from "@capacitor/storage";
import { ipConfig } from "../config";
import axios from "axios";

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
  },
  data() {
    return {
      add,
      listRetur: [],
    };
  },
  setup() {
    const router = useRouter();
    const currentDate = new Date();
    return { router, currentDate };
  },
  async ionViewDidEnter() {
    await this.getRetur();
  },
  methods: {
    async getRetur() {
      try {
        const loading = await loadingController.create({
          spinner: "circles",
          message: "Loading...",
          translucent: true,
        });
        await loading.present();

        let vm = this;
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.get(
          ipConfig + "/retur/listReturByAccepted/" + 0,
          {
            headers: {
              token: dataToken.value,
            },
          }
        );
        console.log("list retur", dataResult.data);
        vm.listRetur = dataResult.data.sort((a, b) =>
          a.id > b.id ? 1 : b.id > a.id ? -1 : 0
        );

        if (vm.listRetur) {
          loading.dismiss();
        }
      } catch (err) {
        console.log(err, "errornya listRetur");
      }
    },
  },
};
</script>
<style scoped>
.isi-tabel{
  font-style: italic;
}
</style>