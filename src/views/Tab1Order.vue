<template>
  <base-layout page-title="MANFA'AT">
    <template v-slot:actions-end>
      <ion-button @click="signout">
        <ion-icon slot="icon-only" :icon="exit"></ion-icon>
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

    <ion-list v-if="listToko">
      <ion-list-header>
        <ion-label class="ion-text-center" color="primary">
          <h1>Purchase Order</h1>
        </ion-label>
      </ion-list-header>

      <ion-segment
        v-model="selectedSegment"
        @ionChange="segmentChanged($event)"
      >
        <ion-segment-button value="1">Tambah</ion-segment-button>
        <ion-segment-button value="2">Daftar</ion-segment-button>
      </ion-segment>

      <ion-slides>
        <ion-slide v-if="selectedSegment == '1'">
          <ion-grid>
            <ion-row>
              <ion-col size="12">
                <ion-list>
            <ion-searchbar
              type="text"
              debounce="500"
              @ionChange="searchToko($event)"
            ></ion-searchbar>
            <ion-list v-if="isItemAvailable">
              <ion-item
                v-for="(item, index) in items"
                :key="index"
                @click="openDetailPO(item.id)"
                lines="full"
              >
                <ion-label>
                  <h2>{{ item.namaToko }}</h2>
                  <p>{{ item.namaWilayah }}</p>
                </ion-label>
              </ion-item>
            </ion-list>
            <ion-list v-else>
              <ion-item
                v-for="(listToko, index) in listToko"
                :key="index"
                @click="openDetailPO(listToko.id)"
                lines="full"
              >
                <ion-label>
                  <h2>{{ listToko.namaToko }}</h2>
                  <p>{{ listToko.namaWilayah }}</p>
                </ion-label>
              </ion-item>
            </ion-list>
          </ion-list>
              </ion-col>
            </ion-row>
          </ion-grid>
          
        </ion-slide>

        <ion-slide v-else-if="selectedSegment == '2'">
          <ion-grid>
            <ion-row>
              <ion-col size="12">
          <ion-list>
              <ion-item
                v-for="(listPO, index) in listPO"
                :key="index"
                lines="full"
                @click="openlistPO(listPO.noPO)"
              >
                <ion-label>
                  <h2>PO: {{ listPO.noPO }}</h2>
                  <h3>{{ listPO.namaToko}}</h3>
                  <p>{{ listPO.tanggalPesan }}</p>
                </ion-label>
              </ion-item>
            </ion-list>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-slide>
      </ion-slides>

      <!-- </ion-toolbar> -->
      <!-- <div v-if="listToko"> -->
    </ion-list>
  </base-layout>
</template>

<script>
import { ref } from "vue";
import {
  // IonCard,
  // IonCardContent,
  // IonCardTitle,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  // IonSelect,
  // IonSelectOption,
  IonIcon,
  IonButton,
  // IonModal,
  // modalController,
  // onIonViewWillEnter,
  IonSearchbar,
  // IonToolbar,
  IonSegment,
  IonSegmentButton,
  loadingController,
  IonGrid,
  IonRow,
  IonCol,
  IonSlide,
  IonSlides,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { exit } from "ionicons/icons";
import { Storage } from "@capacitor/storage";
import { ipConfig } from "../config";
import axios from "axios";
import DetailPO from "../components/pages/CreatePO.vue";
// import ModalPO from "../components/sales/ModalPO.vue";
import moment from "moment";
import "moment/locale/id" 

export default {
  name: "Purchase Order",
  components: {
    // IonCard,
    // IonCardContent,
    // IonCardTitle,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    // IonSelect,
    // IonSelectOption,
    IonIcon,
    IonButton,
    // IonModal,
    IonSearchbar,
    // IonToolbar,
    IonSegment,
    IonSegmentButton,
    IonGrid,
    IonRow,
    IonCol,
    IonSlide,
    IonSlides,
    IonRefresher,
    IonRefresherContent,
  },
  data() {
    return {
      exit,
      listToko: [],
      listPO: [],
      isItemAvailable: false,
      items: [],
      hari: "",
      tanggal: "",
      waktu: "",
      tanggalPesan: "",
      // dateTime: {},
      selectedSegment: "1",
      
    };
  },
  setup() {
    const router = useRouter();
    const isOpenRef = ref(false);
    const setOpen = (state) => (isOpenRef.value = state);
    // const currentDate = new Date();
    const slideOptions = {
      initialSlide: 0,
      speed: 500,
    };

    return { router, isOpenRef, setOpen, DetailPO, slideOptions };
  },

  async ionViewWillEnter() {
    await this.dataToko();
    await this.dataPO();
    // await this.currentDate();
    // await this.setDateTime();
    await this.testMoment()
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
        vm.listToko = dataResult.data.sort((a, b) =>
          a.wilayahId > b.wilayahId ? 1 : b.wilayahId > a.wilayahId ? -1 : 0
        );

        if (vm.listToko) {
          loading.dismiss();
        }
      } catch (err) {
        console.log(err, "errornya datatoko");
      }
    },
    async dataPO(){
      try {
        const loading = await loadingController.create({
          spinner: "circles",
          message: "Loading...",
          translucent: true,
        });
        await loading.present();

        let vm = this;
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.get(ipConfig + "/masterPO/listUnaccepted", {
          headers: {
            token: dataToken.value,
          },
        });
        // console.log(dataResult.data);
        // let penampung = []
        // dataResult.data.forEach(el => {
        //   console.log(el.tanggalPesan, "<<<");
        //     if (el.tanggalPesan == this.tanggalPesan) {
        //       penampung.push(el.tanggalPesan)
        //     }
        // }) 
        // console.log(penampung, ">>>");
        vm.listPO = await dataResult.data.sort((a, b) =>
          a.id > b.id ? 1 : b.id > a.id ? -1 : 0
        );
        loading.dismiss()
        // if (vm.listPO) {
        //   loading.dismiss();
        // }
        // console.log(vm.listPO);
      } catch (err) {
        console.log(err, "errornya dataPO");
      }     
    },
    async signout() {
      let vm = this;
      await Storage.set({
        key: "token",
        value: "",
      });
      await Storage.set({
        key: "idUser",
        value: null,
      });
      await Storage.set({
        key: "tokoId",
        value: null,
      });
      // console.log("token deleted");
      vm.$router.replace("/");
    },
    initializeItems() {
      this.items = this.listToko;
    },
    async openDetailPO(paramsnya) {
      // console.log(paramsnya);
      await Storage.set({ key: "tokoId", value: paramsnya.toString() });
      await this.$router.push("/tabs/order/details");
      // await this.initializeItems()
    },

    async openlistPO(paramsnya) {
      console.log("ini", paramsnya);
      await Storage.set({ key: "noPO", value: paramsnya.toString() });
      await this.$router.push("/detailListPO");
    },
    async searchToko(ev) {
      // reset
      this.initializeItems();

      // console.log(ev.detail.value);
      const val = ev.detail.value;

      if (val && val.trim() !== "") {
        this.isItemAvailable = true;
        this.items = this.items.filter((item) => {
          // console.log(item);
          return item.namaToko.toLowerCase().indexOf(val.toLowerCase()) > -1;
        });
      } else {
        this.isItemAvailable = false;
      }
    },

    async doRefresh(ev)  {
      console.log(ev);
      await this.dataToko()
      await this.dataPO()
      await this.testMoment()

      if (this.listToko) {
        ev.target.complete()
      }
    },

    async segmentChanged(ev) {
      // console.log("segment changed", ev.detail.value);
      this.selectedSegment = ev.detail.value;
    },
    
    sendDate(x) {
      let y = moment(x).format("YYYY/MM/DD")
      console.log(y);
      return y
    },

    async testMoment() {
      this.hari = await moment().format('dddd')
      this.tanggal = await moment().format('LL')
      this.waktu = await moment().format('LT')
      this.tanggalPesan = await moment().format('YYYY-MM-DD')
      // let formatMoment = await moment().format('LLLL')
      // console.log("moment", this.hari);
      // console.log("moment", this.tanggal);
      // console.log("moment", this.waktu);
      console.log("moment", this.tanggalPesan);
    },
  },
};
</script>
<style scoped>
.margin-edit {
  margin: -10px -10px;
}
.slidesnya {
  margin: -10px;
  padding: 100px;
}
.slidenya {
  margin: 0;
  padding: 0;
}

ion-segment-button {
  /* color: green; */
  --color: darkgrey;
  /* --background-unchecked: darkgrey; */
  /* --text-color: darkgrey */
}
</style>