<template>
  <base-layout page-title="MANFA'AT">
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
        <ion-segment-button value="1">Buat PO</ion-segment-button>
        <ion-segment-button value="2">List PO</ion-segment-button>
      </ion-segment>

      <ion-slides :options="slideOptions">
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
                      detail
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
                      detail
                    >
                      <ion-note slot="start">{{ index + 1 }}</ion-note>
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
                    detail
                  >
                    <ion-label>
                      <h2>PO: {{ listPO.noPO }}</h2>
                      <h3>Jumlah Pesanan - {{ listPO.jumlahPesanan }}</h3>
                      <p>{{ listPO.tanggalPesan }}</p>
                    </ion-label>
                  </ion-item>
                </ion-list>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-slide>
      </ion-slides>
    </ion-list>
  </base-layout>
</template>

<script>
import {
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonGrid,
  IonRow,
  IonCol,
  IonSlide,
  IonSlides,
  IonRefresher,
  IonRefresherContent,
  IonNote,
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { Storage } from "@capacitor/storage";
import { ipConfig } from "../config";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";
import mixinFunct from "../mixins/mixinFunct";

export default {
  name: "Purchase Order",
  components: {
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonGrid,
    IonRow,
    IonCol,
    IonSlide,
    IonSlides,
    IonRefresher,
    IonRefresherContent,
    IonNote,
  },

  mixins: [mixinFunct],

  data() {
    return {
      listToko: [],
      listPO: [],
      isItemAvailable: false,
      items: [],
      hari: "",
      tanggal: "",
      waktu: "",
      tanggalPesan: "",
      selectedSegment: "1",
    };
  },

  setup() {
    const router = useRouter();
    const slideOptions = {
      initialSlide: 0,
      speed: 500,
    };
    return { router, slideOptions };
  },

  async ionViewWillEnter() {
    this.presentLoading();
    if (!this.listToko.length) {
      await this.dataToko();
    }
    if (!this.tanggal && !this.waktu) {
      await this.testMoment();
    }
    this.discardLoading();
  },

  watch: {
    selectedSegment: function() {
      if (this.selectedSegment == 2) {
        this.presentLoading();
        this.dataPO();
      } else if (this.selectedSegment == 1) {
        this.presentLoading()
        this.dataToko()
      }
      this.discardLoading();
    },
  },

  methods: {
    async dataToko() {
      try {
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
      } catch (err) {
        console.log(err, "errornya datatoko");
      }
    },
    async dataPO() {
      try {
        let vm = this;
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.get(
          ipConfig + "/masterPO/listByUserLogin",
          {
            headers: {
              token: dataToken.value,
            },
          }
        );
        let hasil = dataResult.data.data;
        hasil.forEach((el) => {
          el.tanggalPesan = moment(el.tanggalPesan).format("dddd, L");
        });
        vm.listPO = await hasil.sort((a, b) =>
          a.id > b.id ? 1 : b.id > a.id ? -1 : 0
        );
      } catch (err) {
        console.log(err, "errornya dataPO");
      }
    },
    initializeItems() {
      this.items = this.listToko;
    },
    async openDetailPO(paramsnya) {
      await Storage.set({ key: "tokoId", value: paramsnya.toString() });
      await this.$router.push("/tabs/order/details");
    },
    async openlistPO(paramsnya) {
      await Storage.set({ key: "noPO", value: paramsnya.toString() });
      await this.$router.push("/detailListPO");
    },
    async searchToko(ev) {
      // reset
      this.initializeItems();
      const val = ev.detail.value;
      if (val && val.trim() !== "") {
        this.isItemAvailable = true;
        this.items = this.items.filter((item) => {
          return item.namaToko.toLowerCase().indexOf(val.toLowerCase()) > -1;
        });
      } else {
        this.isItemAvailable = false;
      }
    },
    async doRefresh(ev) {
      await this.clockInterval();
      await this.dataPO();
      await this.dataToko();

      if (this.listToko) {
        ev.target.complete();
      }
    },
    async segmentChanged(ev) {
      this.selectedSegment = ev.detail.value;
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
  --color: darkgrey;
}
</style>
