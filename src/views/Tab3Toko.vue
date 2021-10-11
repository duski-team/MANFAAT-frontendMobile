<template>
  <base-layout page-title="MANFA'AT">
    <template v-slot:actions-end>
      <ion-button router-link="/tabs/toko/tambah/">
        <ion-icon slot="icon-only" :icon="add"></ion-icon>
      </ion-button>
    </template>
    <ion-item lines="none">
      <ion-label>{{ currentDate }}</ion-label>
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
      <ion-item v-for="(listToko, index) in listToko" :key="index" @click="detailToko(listToko.id)">
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
  </base-layout>
</template>

<script>
import { 
  IonList,
  IonListHeader,
  IonLabel,
  IonItem,
  IonButton,
  IonIcon,
  loadingController,
} from "@ionic/vue";
import { add } from "ionicons/icons";
import { ipConfig } from "../config";
import { Storage } from "@capacitor/storage";
import { useRouter } from "vue-router";
import axios from "axios";

export default  {
  name: 'DaftarToko',
  components: {
    IonList,
    IonListHeader,
    IonLabel,
    IonItem,
    IonButton,
    IonIcon,
  },
  data() {
    return {
      add,
      listToko: [],
      namaWilayah: ""
    }
  },
  
  setup() {
    const router = useRouter();
    const currentDate = new Date();
    return { router, currentDate }
  },

  async ionViewDidEnter() {
    await this.dataToko();
  },

  methods: {
    async dataToko() {
      try {
        const loading = await loadingController.create({
          spinner: "circles",
          message: "Loading...",
          translucent: true,
        });
        await loading.present();

        let vm = this;
        const dataToken = await Storage.get({ key: "token" });
        // console.log(JSON.stringify(dataToken), "<<<<<");
        const dataResult = await axios.get(ipConfig + "/masterToko/list", {
          headers: {
            token: dataToken.value,
          },
        });
        // console.log("isinya", dataResult.data);
        let penampung = []
        dataResult.data.forEach(el => {
          // console.log(el.wilayahId == "2");
          if (el.wilayahId == "2") {
            penampung.push(el)
          }
        });
        // console.log(penampung);
        vm.namaWilayah = penampung[0].namaWilayah
        vm.listToko = penampung.sort((a, b) =>
          a.id > b.id ? 1 : b.id > a.id ? -1 : 0
        );
        await loadingController.dismiss()
      } catch (err) {
        console.log(err, "errornya");
      }
    },
    async detailToko(p) {
      await Storage.set({ key: "tokoId", value: p.toString() })
      await this.$router.push("/detailToko");
    }
  },
}
</script>