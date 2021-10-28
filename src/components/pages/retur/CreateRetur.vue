<template>
  <base-layout page-title="Buat Retur" page-default-back-link="/tabs/retur">
    <template v-slot:actions-end>
      <ion-button v-if="dataPO.length" @click="createRetur">
        <ion-icon slot="icon-only" :icon="save"></ion-icon>
      </ion-button>
      <ion-button v-else disabled fill="clear"></ion-button>
    </template>

    <!-- <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher> -->

    <ion-grid>
      <ion-row>
        <ion-col>
          <ion-list v-if="!dataPO.length">
            <ion-card>
              <ion-card-content>
                <ion-item lines="none">
                  <ion-label>No. PO</ion-label>
                  <ion-input v-model="noPO"></ion-input>
                  <ion-button slot="end" @click="searchPO">Cari</ion-button>
                </ion-item>
              </ion-card-content>
            </ion-card>

            <ion-card class="card1">
              <ion-card-content class="ion-no-padding">
                <ion-item
                  v-for="(listPO, index) in listPO"
                  :key="index"
                  lines="full"
                  @click="openPO(listPO.noPO)"
                  detail
                >
                  <ion-label>
                    <h2>PO: {{ listPO.noPO }}</h2>
                    <h3>{{ listPO.namaToko }}</h3>
                    <p>{{ listPO.tanggalPesan }}</p>
                  </ion-label>
                </ion-item>
              </ion-card-content>
            </ion-card>
          </ion-list>

          <ion-list v-else>
            <ion-list-header>
              <!-- <ion-item lines="none"> -->
              <ion-label>
                <h4>No. PO</h4>
                <h2>{{ noPO }}</h2>
              </ion-label>
              <ion-label class="ion-text-end ion-margin-end">
                <h4>Sales</h4>
                <h2>{{ namaSales ? namaSales : "kosong" }}</h2>
              </ion-label>
            </ion-list-header>
            <ion-item>
              <ion-label>Toko</ion-label>
              <ion-input
                class="ion-text-end"
                readonly
                v-model="namaToko"
              ></ion-input>
            </ion-item>
            <ion-item>
              <ion-label>Jumlah Pesanan</ion-label>
              <ion-input class="ion-text-end" readonly v-model="jumlahPesanan">
                <!-- <h4 class="ion-text-right"></h4> -->
              </ion-input>
            </ion-item>
            <ion-item lines="none">
              <ion-label>Driver</ion-label>
              <ion-input class="ion-text-end" v-model="namaDriver"></ion-input>
            </ion-item>

            <ion-card class="ion-no-padding">
              <ion-card-header class="ion-no-padding">
                <ion-item lines="full">
                  <h5>List Pesanan</h5>
                </ion-item>
              </ion-card-header>
              <ion-card-content class="ion-no-padding">
                <ion-item
                  v-for="(dataPO, index) in dataPO"
                  :key="index"
                  lines="full"
                >
                  <ion-label>
                    <h3>{{ dataPO.namaBarang }}</h3>
                    <h4>Jumlah Barang - {{ dataPO.jumlahBarang }}</h4>
                    <h4>Harga Rp.{{ dataPO.hargaBarang }},00</h4>
                  </ion-label>
                  <ion-input
                    v-model="jumlahBarangRetur"
                    slot="end"
                    @click="addBarangRetur(dataPO)"
                    ><span>Retur</span></ion-input
                  >
                  <ion-checkbox
                    slot="end"
                    @click="isChecked($event)"
                    @ionChange="pilihBarang(dataPO)"
                  ></ion-checkbox>
                </ion-item>
              </ion-card-content>
            </ion-card>

            <ion-item lines="none">
              <ion-label>Jumlah Retur</ion-label>
              <ion-input class="ion-text-end" v-model="jumlahRetur"></ion-input>
            </ion-item>
            <ion-item lines="none">
              <ion-label>Jumlah Harga Retur</ion-label>
              <ion-input class="ion-text-end" v-model="jumlahHargaRetur"
                ><span>Rp. </span></ion-input
              >
            </ion-item>
          </ion-list>
        </ion-col>
      </ion-row>
    </ion-grid>
  </base-layout>
</template>

<script>
import {
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonInput,
  loadingController,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCheckbox,
  modalController,
} from "@ionic/vue";
import { save } from "ionicons/icons";
import { useRouter } from "vue-router";
import { Storage } from "@capacitor/storage";
import { ipConfig } from "@/config";
import axios from "axios";
import modalRetur from "../retur/ModalRetur.vue";
import moment from "moment";
import "moment/locale/id";
import { defineComponent } from "vue";

export default defineComponent ({
  components: {
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonInput,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCheckbox,
  },
  setup() {
    const router = useRouter();
    return { router };
  },

  data() {
    return {
      save,
      hari: "",
      tanggal: "",
      waktu: "",
      listPO: [],
      noPO: "",
      dataPO: [],
      idToko: "",
      tanggalKirim: "",
      namaSales: "",
      namaToko: "",
      jumlahPesanan: "",
      namaDriver: "",
      jumlahRetur: 0,
      jumlahBarangRetur: "",
      jumlahHargaRetur: 0,
      subRetur: [],
    };
  },

  async ionViewWillEnter() {
    if (!this.hari && !this.tanggal && !this.waktu) {
      await this.useMoment();
    }
    await this.getPO();
  },

  methods: {
    async useMoment() {
      this.hari = await moment().format("dddd");
      this.tanggal = await moment().format("LL");
      this.waktu = await moment().format("LT");
      this.tanggalPesan = await moment();
    },

    async searchPO() {
      try {
        await this.presentLoading();

        let vm = this;
        // const idUser = await Storage.get({ key: "idUser" });
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.get(
          ipConfig + "/masterPO/listByNoPO/" + vm.noPO,
          {
            headers: {
              token: dataToken.value,
            },
          }
        );
        vm.idToko = dataResult.data[0].masterTokoId;
        vm.tanggalKirim = dataResult.data[0].tanggalKirim;
        vm.namaSales = dataResult.data[0].namaSales;
        vm.namaToko = dataResult.data[0].namaToko;
        vm.jumlahPesanan = dataResult.data[0].jumlahPesanan;
        vm.namaDriver = dataResult.data[0].namaDriver;

        vm.dataPO = dataResult.data;

        await vm.discardLoading();
      } catch (err) {
        console.log("katanya", err);
        await this.discardLoading();
      }
    },
    async getPO() {
      try {
        await this.presentLoading();

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
        // console.log(hasil);
        hasil.forEach((el) => {
          el.tanggalPesan = moment(el.tanggalPesan).format("dddd, L");
        });
        vm.listPO = await hasil.sort((a, b) =>
          a.id > b.id ? 1 : b.id > a.id ? -1 : 0
        );
        await vm.discardLoading();
      } catch (err) {
        console.log(err, "errornya dataPO");
        await this.discardLoading();
      }
    },
    async createRetur() {
      console.log("pencet retur");
      try {
        // noPO, jumlahRetur, bulk
        // bulk = { jumlahBarangRetur, hargaBarangRetur, totalHargaRetur, kualitasRetur, masterReturId, masterBarangId }
        await this.presentLoading();
        let vm = this;

        // const idUser = await Storage.get({ key: "idUser" });
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.post(
          ipConfig + "/retur/bulkRegister",
          {
            noPO: vm.noPO,
            jumlahRetur: vm.jumlahRetur,
          },
          {
            headers: {
              token: dataToken.value,
            },
          }
        );
        console.log(dataResult, "create retur");
        await vm.discardLoading();
      } catch (err) {
        console.log(err, "retur gagal");
        await this.discardLoading();
      }
    },

    async openPO(p) {
      // console.log(p, "ini p");
      this.noPO = p;
      await this.searchPO();
    },

    async addBarangRetur(p) {
      console.log(p);
      const modal = await modalController.create({
        components: modalRetur,
        componentProps: { dataModalRetur: p },
      });

      await modal.present();

      // modal
      //   .onDidDismiss()
      //   .then((res) => {
      //     if (res.data == null) {
      //       console.log("kosong");
      //     } else {
      //       console.log("isinya");
      //     }
      //   })
      //   .catch((err) => {
      //     console.log(err, "diapain ya");
      //   });

    },

    pilihBarang(p) {
      console.log(p);
      this.subRetur = p;
      console.log(this.subRetur, "subRetur");
      console.log(this.subRetur.id, "subRetur");
      console.log(this.subRetur.masterBarangId, "subRetur");
    },

    async isChecked(ev) {
      console.log(ev.target.checked);
      // console.log(ev);
      if (ev.target.checked == false) {
        this.jumlahRetur += 1;
      } else {
        this.jumlahRetur -= 1;
      }
      console.log(this.jumlahRetur, "jumlahRetur");
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
});
</script>

<style>
ion-card {
  border: 1px solid white;
}
</style>
