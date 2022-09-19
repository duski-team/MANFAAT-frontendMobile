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

            <ion-grid>
              <ion-row>
                <ion-col size="12">
                  <ion-item lines="none">
                    <ion-datetime v-model="tanggal_awal" locale="id-ID" placeholder="Input Tanggal Awal"></ion-datetime>
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
                  <ion-button fill="outline" @click="resetSearchVar">Reset</ion-button>
                  <ion-button @click="searchVarTanggal">Kirim Tanggal</ion-button>
                </ion-col>
              </ion-row>
            </ion-grid>

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

            <ion-grid>
              <ion-row>
                <ion-col size="12">
                  <ion-item lines="none">
                    <ion-datetime v-model="tanggal_awal" locale="id-ID" placeholder="Input Tanggal Awal"></ion-datetime>
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
                  <ion-button fill="outline" @click="resetSearchVar">Reset</ion-button>
                  <ion-button @click="searchVarTanggal">Kirim Tanggal</ion-button>
                </ion-col>
              </ion-row>
            </ion-grid>

            <ion-item
              v-for="(listRetur, index) in listRetur"
              :key="index"
              @click="openDetailRetur(listRetur.id)"
              lines="full"
              detail
            >
              <ion-label>
                <h2>No. PO: {{ listRetur.noPO }}</h2>
                <h3>Toko - {{ listRetur.namaToko }}</h3>
              </ion-label>
            </ion-item>
            <ion-grid>
              <ion-row class="group_button">
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
  IonDatetime,
} from "@ionic/vue";
import { add, caretBack, caretForward } from "ionicons/icons";
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
    IonDatetime,
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

      // pagination
      currentPage: 1,
      totalPages: 1,
      pageCount: 10,

      // search
      search_var: {},
      tanggal_awal: "",
      tanggal_akhir: "",
    };
  },

  setup() {
    const router = useRouter();
    const currentDate = new Date();
    return { router, currentDate, caretBack, caretForward };
  },

  async ionViewDidEnter() {
    await this.presentLoading();
    await this.getRetur();
    await this.testMoment();
    await this.discardLoading();
  },

  computed: {
    isInFirstPage() {
      return this.currentPage === 1;
    },
    isInLastPage() {
      return this.currentPage === this.totalPages;
    },
  },

  methods: {
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
    searchVarTanggal() {
      this.search_var = {};
      this.currentPage = 1;
      if (this.tanggal_awal) {
        this.search_var.tanggalAwal = new Date(new Date(this.tanggal_awal).setHours(0, 0, 0, 0));
      }
      if (this.tanggal_akhir) {
        this.search_var.tanggalAkhir = new Date(new Date(this.tanggal_akhir).setHours(23, 59, 0, 0));
      }
      this.getRetur(this.currentPage, this.search_var);
    },
    resetSearchVar() {
      this.search_var = {};
      this.tanggal_awal = ""
      this.tanggal_akhir = ""
      this.getRetur();
    },
    async getRetur(halaman, searchVar) {
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
      console.log(kirim, "kirimannya Retur");
      try {
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.post(ipConfig + "/mobile/listReturByUsersLogin", kirim, {
          headers: {
            token: dataToken.value,
          },
        });
        console.log(dataResult);
        if (dataResult.data.status == 200) {
          // vm.listRetur = dataResult.data.data.sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0));
          vm.listRetur = dataResult.data.data;
          vm.totalPages = Math.ceil(dataResult.data.count / 10);
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
.group_button {
  display: flex;
  justify-content: space-between;
}
.end_button {
  display: flex;
  justify-content: flex-end;
}
.btn-reset {
  display: flex;
  justify-content: space-between;
}
</style>
