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

      <ion-segment v-model="selectedSegment" @ionChange="segmentChanged($event)">
        <ion-segment-button value="1">Buat PO</ion-segment-button>
        <ion-segment-button value="2">List PO</ion-segment-button>
      </ion-segment>

      <ion-slides :options="slideOptions">
        <ion-slide v-if="selectedSegment == '1'">
          <ion-grid v-if="viewAll">
            <ion-row>
              <ion-col size="12">
                <ion-list>
                  <ion-searchbar type="text" debounce="500" @ionChange="searchToko($event)"></ion-searchbar>

                  <ion-list v-if="isItemAvailable">
                    <ion-item
                      v-for="(item, index) in items"
                      :key="index"
                      @click="openCreatePO(item.id)"
                      lines="full"
                      detail
                    >
                      <ion-note slot="start">{{ index + 1 }}</ion-note>
                      <ion-label>
                        <h2>{{ item.namaToko }}</h2>
                        <p>{{ item.namaWilayah }}</p>
                      </ion-label>
                    </ion-item>
                  </ion-list>
                  <ion-list v-else>
                    <ion-item
                      v-for="(elm, idx) in listToko"
                      :key="idx"
                      @click="openCreatePO(elm.id)"
                      lines="full"
                      detail
                    >
                      <ion-note slot="start">{{ idx + 1 }}</ion-note>
                      <ion-label>
                        <h2>{{ elm.namaToko }}</h2>
                        <p>{{ elm.namaWilayah }}</p>
                      </ion-label>
                    </ion-item>
                  </ion-list>

                  <ion-button expand="block" @click="viewAllToko">
                    Few Store
                  </ion-button>
                </ion-list>
              </ion-col>
            </ion-row>
          </ion-grid>

          <ion-grid v-else>
            <ion-row v-if="list_toko_mobile.length > 0">
              <ion-col size="12">
                <ion-item lines="none">
                  <ion-label position="floating">Nama Toko</ion-label>
                  <ion-input debounce="500" v-model="search_var.namaToko" @ionChange="searchVarToko"></ion-input>
                </ion-item>
              </ion-col>
              <ion-col size="12">
                <ion-item lines="none">
                  <ion-select
                    class="select-full-width"
                    interface="action-sheet"
                    placeholder="Pilih Wilayah"
                    v-model="search_var.wilayahId"
                    @ionChange="searchVarWilayah"
                    @ionCancel="resetSearchVar"
                  >
                    <ion-select-option v-for="elm in option_wilayah" :key="elm" :value="elm.wilayahId">{{
                      elm.namaWilayah
                    }}</ion-select-option>
                  </ion-select>
                </ion-item>
              </ion-col>
              <ion-col size="12">
                <ion-list>
                  <ion-item
                    v-for="elm in list_toko_mobile"
                    :key="elm.nomor"
                    @click="openCreatePO(elm)"
                    lines="full"
                    detail
                  >
                    <ion-note slot="start">{{ elm.nomor }}</ion-note>
                    <ion-label>
                      <h2>{{ elm.namaToko }}</h2>
                      <p>{{ elm.namaWilayah }}</p>
                    </ion-label>
                  </ion-item>
                </ion-list>

                <ion-grid>
                  <ion-row class="group_button">
                    <ion-col class="start_button">
                      <ion-button class="ion-margin-end" @click="viewAllToko">
                        All Store
                      </ion-button>
                    </ion-col>
                    <ion-col class="end_button">
                      <ion-button @click="previousPage" :disabled="isInFirstPage">
                        <ion-icon :icon="caretBack"></ion-icon>
                      </ion-button>
                      <ion-button @click="nextPage" :disabled="isInLastPage">
                        <ion-icon :icon="caretForward"></ion-icon>
                      </ion-button>
                    </ion-col>
                  </ion-row>
                </ion-grid>
              </ion-col>
            </ion-row>
            <ion-row v-else>
              <ion-col size="12">
                <ion-item lines="none">
                  <ion-label position="floating">Cari Toko</ion-label>
                  <ion-input debounce="500" v-model="search_var.namaToko" @ionChange="searchVarToko"></ion-input>
                </ion-item>
              </ion-col>
              <ion-col size="12">
                <ion-item lines="none">
                  <ion-select
                    class="select-full-width"
                    interface="action-sheet"
                    placeholder="Pilih Wilayah"
                    v-model="search_var.wilayahId"
                    @ionChange="searchVarWilayah"
                  >
                    <ion-select-option v-for="elm in option_wilayah" :key="elm" :value="elm.wilayahId">{{
                      elm.namaWilayah
                    }}</ion-select-option>
                  </ion-select>
                </ion-item>
              </ion-col>
              <ion-col size="12">
                <ion-list>
                  <div class="ion-text-center" lines="none">
                    <p><i>no data</i></p>
                  </div>
                  <!-- <ion-button class="ion-margin-end" @click="getDataToko">
                    Reset
                  </ion-button> -->
                </ion-list>
                <ion-button expand="block" fill="outline" class="ion-margin-end" @click="resetSearchVar">
                  Reset
                </ion-button>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-slide>

        <ion-slide v-else-if="selectedSegment == '2'">
          <ion-grid>
            <ion-row>
              <ion-col size="12">
                <ion-card>
                  <ion-grid>
                    <ion-row>
                      <ion-col size="12">
                        <ion-item lines="inset">
                          <ion-label position="stacked">Nomor PO</ion-label>
                          <ion-input clearInput="true" clearOnEdit="true" debounce="1000" v-model="search_var_po.noPO" @ionChange="searchVarPO" placeholder="Input No. PO"></ion-input>
                        </ion-item>
                      </ion-col>
                      <ion-col size="12">
                        <ion-item lines="none">
                          <ion-datetime
                            v-model="tanggal_awal"
                            locale="id-ID"
                            placeholder="Input Tanggal Awal"
                          ></ion-datetime>
                        </ion-item>
                      </ion-col>
                      <ion-col size="12">
                        <ion-item lines="none">
                          <ion-datetime
                            v-model="tanggal_akhir"
                            locale="id-ID"
                            placeholder="Input Tanggal Akhir"
                            :min="tanggal_awal"
                          ></ion-datetime>
                        </ion-item>
                      </ion-col>
                      <ion-col size="12" class="btn-reset">
                        <ion-button fill="outline" @click="resetSearchVarPO">Reset</ion-button>
                        <ion-button @click="searchVarTanggal">Kirim Tanggal</ion-button>
                      </ion-col>
                    </ion-row>
                  </ion-grid>
                </ion-card>
              </ion-col>

              <ion-col size="12">
                <ion-list>
                  <ion-item
                    v-for="(list_po_mobile, index) in list_po_mobile"
                    :key="index"
                    lines="full"
                    @click="openlistPO(list_po_mobile.noPO)"
                    detail
                  >
                    <ion-label>
                      <h2>PO: {{ list_po_mobile.noPO }}</h2>
                      <h3>Jumlah Pesanan - {{ list_po_mobile.jumlahPesanan }}</h3>
                      <p>{{ list_po_mobile.tanggalPesan }}</p>
                    </ion-label>
                  </ion-item>
                </ion-list>

                <ion-grid>
                  <ion-row class="group_button">
                    <ion-col class="end_button">
                      <ion-button @click="previousPagePO" :disabled="isInFirstPagePO">
                        <ion-icon :icon="caretBack"></ion-icon>
                      </ion-button>
                      <ion-button @click="nextPagePO" :disabled="isInLastPagePO">
                        <ion-icon :icon="caretForward"></ion-icon>
                      </ion-button>
                    </ion-col>
                  </ion-row>
                </ion-grid>
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
  IonButton,
  IonIcon,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonCard,
} from "@ionic/vue";
import { caretBack, caretForward } from "ionicons/icons";
import { useRouter } from "vue-router";
import { Storage } from "@capacitor/storage";
import { ipConfig } from "../config";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";
import mixinFunct from "../mixins/mixinFunct";
// import { ref } from "vue";

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
    IonButton,
    IonIcon,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonDatetime,
    IonCard,
  },

  mixins: [mixinFunct],

  data() {
    return {
      list_toko_mobile: [],
      listToko: [],
      list_po_mobile: [],
      isItemAvailable: false,
      items: [],
      searchWilayah: "",
      option_wilayah: [],
      hari: "",
      tanggal: "",
      waktu: "",
      tanggalPesan: "",
      selectedSegment: "1",
      viewAll: false,
      
      // pagination
      currentPage: 1,
      totalPages: 1,
      pageCount: 10,
      
      currentPagePO: 1,
      totalPagesPO: 1,
      pageCountPO: 10,

      // search
      search_var: {},
      search_var_po: {},
      tanggal_awal: "",
      tanggal_akhir: "",
    };
  },

  setup() {
    const router = useRouter();
    const slideOptions = {
      initialSlide: 0,
      speed: 500,
    };

    return {
      router,
      slideOptions,
      caretBack,
      caretForward,
    };
  },

  async ionViewWillEnter() {
    await this.presentLoading();
    this.selectedSegment = "1"
    if (!this.listToko.length) {
      await this.dataToko();
      await this.getDataToko();
      await this.getDataWilayah();
    }
    if (!this.tanggal && !this.waktu) {
      await this.testMoment();
    }
    await this.discardLoading();
  },

  watch: {
    selectedSegment: function() {
      if (this.selectedSegment == 2) {
        // this.presentLoading();
        this.getDataPO();
      } else if (this.selectedSegment == 1) {
        // this.presentLoading();
        this.dataToko();
      }
      // this.discardLoading();
    },
  },

  computed: {
    isInFirstPage() {
      return this.currentPage === 1;
    },
    isInLastPage() {
      return this.currentPage === this.totalPages;
    },
    isInFirstPagePO() {
      return this.currentPagePO === 1;
    },
    isInLastPagePO() {
      return this.currentPagePO === this.totalPagesPO;
    },
  },

  methods: {
    viewAllToko() {
      this.viewAll = !this.viewAll;
    },
    previousPage() {
      if (this.currentPage - 1 !== 0) {
        this.currentPage -= 1;
        this.getDataToko(this.currentPage, this.search_var);
      }
    },
    nextPage() {
      if (this.currentPage + 1 <= this.totalPages) {
        this.currentPage += 1;
        this.getDataToko(this.currentPage, this.search_var);
      }
    },
    previousPagePO() {
      if (this.currentPagePO - 1 !== 0) {
        this.currentPagePO -= 1;
        this.getDataPO(this.currentPagePO, this.search_var_po);
      }
    },
    nextPagePO() {
      if (this.currentPagePO + 1 <= this.totalPagesPO) {
        this.currentPagePO += 1;
        this.getDataPO(this.currentPagePO, this.search_var_po);
      }
    },
    searchVarToko() {
      this.currentPage = 1;
      this.getDataToko(this.currentPage, this.search_var);
    },
    searchVarWilayah() {
      this.currentPage = 1;
      this.getDataToko(this.currentPage, this.search_var);
    },
    resetSearchVar() {
      this.search_var = {};
      this.getDataToko();
      this.getDataWilayah();
    },
    searchVarPO() {
      this.currentPagePO = 1;
      this.getDataPO(this.currentPagePO, this.search_var_po);
    },
    searchVarTanggal() {
      this.search_var_po = {}
      this.currentPage = 1;
      if (this.tanggal_awal) {
        this.search_var_po.tanggalAwal = new Date(new Date(this.tanggal_awal).setHours(0, 0, 0, 0));
      }
      if (this.tanggal_akhir) {
        this.search_var_po.tanggalAkhir = new Date(new Date(this.tanggal_akhir).setHours(23, 59, 0, 0));
      }
      this.getDataPO(this.currentPagePO, this.search_var_po);
    },
    resetSearchVarPO() {
      this.search_var_po = {};
      this.getDataPO();
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
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getDataPO(halaman, searchVar) {
      let vm = this;
      let kirim = {};
      if (searchVar) {
        kirim = searchVar;
      }
      if (halaman) {
        kirim.halaman = halaman;
      } else {
        kirim.halaman = vm.currentPage;
      }
      console.log(kirim, "kirimannya PO");
      try {
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.post(ipConfig + "/mobile/listPOBySales", kirim, {
          headers: {
            token: dataToken.value,
          },
        });
        let hasil = dataResult.data.data;
        hasil.forEach((el) => {
          el.tanggalPesan = moment(el.tanggalPesan).format("dddd, L");
        });
        vm.list_po_mobile = await hasil.sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0));
        vm.totalPagesPO = Math.ceil(dataResult.data.count / 10);
        vm.totalPagesPO = vm.totalPagesPO == 0 ? 1 : vm.totalPagesPO
      } catch (err) {
        console.log(err, "errornya getDataPO");
      }
    },
    async getDataToko(halaman, searchVar) {
      let vm = this;
      let kirim = {};
      if (searchVar) {
        kirim = searchVar;
      }
      if (halaman) {
        kirim.halaman = halaman;
      } else {
        kirim.halaman = vm.currentPage;
      }
      console.log(kirim, "kirimannya Toko");
      try {
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.post(ipConfig + "/mobile/listTokoBySalesMobile", kirim, {
          headers: {
            token: dataToken.value,
          },
        });
        console.log(dataResult.data.data);
        vm.list_toko_mobile = dataResult.data.data;
        for (let i = 0; i < vm.list_toko_mobile.length; i++) {
          const elToko = vm.list_toko_mobile[i];
          elToko.nomor = (kirim.halaman - 1) * 10 + (i + 1);
        }
        vm.totalPages = Math.ceil(dataResult.data.count / 10);
      } catch (err) {
        console.log(err);
      }
    },
    async dataToko() {
      try {
        let vm = this;
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.get(ipConfig + "/masterToko/listByUserLogin", {
          headers: {
            token: dataToken.value,
          },
        });
        vm.listToko = dataResult.data.sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0));
      } catch (err) {
        console.log(err, "errornya datatoko");
      }
    },
    initializeItems() {
      this.items = this.list_toko_mobile;
    },
    async openCreatePO(paramsnya) {
      console.log(paramsnya);
      // await Storage.set({ key: "tokoId", value: paramsnya.toString() });
      // await this.$router.push("/tabs/order/details");
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
      // await this.clockInterval();
      await this.getDataPO();
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
.group_button {
  display: flex;
  justify-content: space-between;
}
.start_button {
  display: flex;
  justify-content: flex-start;
}
.end_button {
  display: flex;
  justify-content: flex-end;
}
.select-full-width {
  max-width: 100% !important;
  width: 100% !important;
  padding-left: 0 !important;
}
.btn-reset {
  display: flex;
  justify-content: space-between;
}
</style>
