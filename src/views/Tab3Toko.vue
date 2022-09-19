<template>
  <base-layout page-title="MANFA'AT">
    <template v-slot:actions-end>
      <!-- <ion-button router-link="/tabs/toko/tambah/"> -->
      <ion-button @click="tambahToko">
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
          <h2 v-for="el in option_wilayah" :key="el">{{ el.namaWilayah }}</h2>
        </ion-label>
      </ion-list-header>

      <ion-item v-for="(elm, idx) in showToko" :key="idx" @click="detailToko(elm.id)" detail>
        <ion-label>
          <h2>{{ elm.namaToko }}</h2>
          <h3>{{ elm.alamatToko }}</h3>
          <p>{{ elm.namaWilayah }}</p>
        </ion-label>
      </ion-item>

      <ion-item lines="none">
        <ion-infinite-scroll
          threshold="100px"
          :disabled="showLoader"
          id="infinite-scroll"
          @ionInfinite="scrolling($event)"
        >
          <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data..." />
        </ion-infinite-scroll>
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
  modalController,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from "@ionic/vue";
import { add, search } from "ionicons/icons";
import { ipConfig } from "../config";
import { Storage } from "@capacitor/storage";
import { useRouter } from "vue-router";
import modalCariToko from "@/components/pages/toko/ModalCariToko.vue";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";
import mixinFunct from "../mixins/mixinFunct";

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
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  },

  mixins: [mixinFunct],

  data() {
    return {
      add,
      search,
      listToko: [],
      showToko: [],
      pageToko: 10,
      namaWilayah: "",
      idWilayah: "",
      hari: "",
      tanggal: "",
      waktu: "",
      showLoader: false,
      option_wilayah: [],
    };
  },

  setup() {
    const router = useRouter();

    return { router };
  },

  async ionViewDidEnter() {
    await this.dataToko();
    await this.getDataWilayah();
    await this.testMoment();
    this.pageToko = 10
  },

  methods: {
    async dataToko() {
      try {
        await this.presentLoading();

        let vm = this;
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.get(ipConfig + "/masterToko/listByUserLogin", {
          headers: {
            token: dataToken.value,
          },
        });
        vm.listToko = dataResult.data.sort((a, b) => (a.id > b.id ? -1 : b.id > a.id ? 1 : 0));
        vm.pushToko();

        vm.namaWilayah = vm.listToko[0].namaWilayah;
        vm.idWilayah = vm.listToko[0].wilayahId;
        if (vm.listToko) {
          await this.discardLoading();
        }
      } catch (err) {
        console.log(err, "errornya datatoko");
        await this.discardLoading();
      }
    },

    async pushToko() {
      let vm = this;
      vm.showToko = vm.listToko.slice(0, vm.pageToko);
      // console.log(vm.showToko);
    },

    async scrolling(e) {
      try {
        // console.log(e);
        let vm = this;

        if (vm.pageToko >= vm.listToko.length) {
          e.target.disabled = true;
        } else {
          await setTimeout(function() {
            vm.pageToko += 5;
            vm.pushToko();
            console.log("Done");
            e.target.complete();
          }, 750);
        }
      } catch (err) {
        console.log("Error", err);
      }
    },

    async detailToko(p) {
      console.log(p);
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

    async getDataWilayah() {
      let vm = this;
      vm.option_wilayah = [];
      try {
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.get(ipConfig + "/mobile/wilayahByUserLogin", {
          headers: { token: dataToken.value },
        });
        if (dataResult.data.status == 200) {
          for (let i = 0; i < dataResult.data.data.length; i++) {
            const elWilayah = dataResult.data.data[i];
            let x = {};
            x.wilayahId = elWilayah.wilayahId;
            x.namaWilayah = elWilayah.namaWilayah;
            vm.option_wilayah.push(x);
          }
          console.log(vm.option_wilayah);
        }
      } catch (err) {
        console.log(err);
      }
    },

    async testMoment() {
      this.hari = await moment().format("dddd");
      this.tanggal = await moment().format("LL");
      this.waktu = await moment().format("LT");
    },

    async searchToko() {
      const modal = await modalController.create({
        component: modalCariToko,
      });
      return await modal.present();
    },

    async tambahToko() {
      await Storage.set({ key: "namaWilayah", value: this.namaWilayah });
      await this.$router.push("/tabs/toko/tambah");
    },
  },
};
</script>
