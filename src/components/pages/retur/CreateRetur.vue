<template>
  <base-layout page-title="Buat Retur" page-default-back-link="/tabs/retur">
    <template v-slot:actions-end>
      <ion-button v-if="dataPO.length" @click="createRetur">
        <ion-icon slot="icon-only" :icon="save"></ion-icon>
      </ion-button>
      <ion-button v-else disabled fill="clear"></ion-button>
    </template>

    <!-- <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
      <ion-refresher-content
        :pulling-icon="chevronDownCircleOutline"
        refreshing-spinner="null"
      ></ion-refresher-content>
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
              <ion-label>Toko: {{ namaToko }}</ion-label>
              <ion-label class="ion-text-end"
                >Jumlah Pesanan: {{ jumlahPesanan }}</ion-label
              >
              <!-- <ion-input
                class="ion-text-end"
                readonly
                v-model="namaToko"
              ></ion-input> -->
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
                  <!-- <ion-input
                    slot="end"
                    @click="addBarangRetur(dataPO)"
                    ><span>Retur</span></ion-input
                  > -->
                  <ion-checkbox
                    slot="end"
                    @click="isChecked($event, dataPO)"
                  ></ion-checkbox>
                </ion-item>
              </ion-card-content>
            </ion-card>

            <ion-item lines="none">
              <ion-label>Retur: {{ jumlahRetur }}</ion-label>
              <ion-label class="ion-text-end"
                >Total: Rp{{ jumlahHargaRetur }},00</ion-label
              >
              <!-- <ion-input class="ion-text-end" v-model="jumlahRetur"></ion-input> -->
            </ion-item>
            <!-- <ion-item lines="none">
              <ion-label>Jumlah Harga Retur</ion-label>
              <ion-input
                class="ion-text-end"
                v-model="jumlahHargaRetur"
              ></ion-input>
            </ion-item> -->

            <ion-card v-if="subRetur.length" class="ion-no-padding">
              <ion-card-header class="ion-no-padding">
                <ion-item lines="full">
                  <h5>List Retur</h5>
                </ion-item>
              </ion-card-header>
              <ion-card-content class="ion-no-padding">
                <ion-list
                  v-for="(subRetur, index) in subRetur"
                  :key="index"
                  lines="none"
                  class="ion-no-padding ion-no-margin"
                >
                  <ion-item lines="full">
                    <ion-grid>
                      <ion-row>
                        <ion-col>
                          <ion-item>
                            <ion-label>
                              <h3>{{ subRetur.namaBarang }}</h3>
                            </ion-label>
                          </ion-item>
                        </ion-col>
                        <ion-col>
                          <ion-item>
                            <ion-label class="ion-text-start">
                              <h4>Jumlah Barang</h4>
                            </ion-label>
                            <ion-select
                              class="ion-text-end"
                              v-model="subRetur.jumlahBarangRetur"
                              @ionChange="testHargaRetur(subRetur)"
                              interface="action-sheet"
                            >
                              <ion-select-option
                                v-for="(n, i) in subRetur.jumlahBarang + 1"
                                :key="i"
                                :value="i"
                              >
                                {{ i }}
                              </ion-select-option>
                            </ion-select>
                          </ion-item>
                          <!-- <ion-item>
                            <ion-label class="ion-text-start">
                              <h4>Harga Barang</h4>
                            </ion-label>
                            <ion-input
                              class="ion-text-end"
                              v-model="subRetur.hargaRetur"
                            ></ion-input>
                          </ion-item> -->
                        </ion-col>
                      </ion-row>
                    </ion-grid>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>

            <ion-card v-else class="ion-no-padding">
              <ion-card-header class="ion-no-padding">
                <ion-item lines="none">
                  <h5>List Retur</h5>
                </ion-item>
              </ion-card-header>
            </ion-card>
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
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCheckbox,
  IonSelect,
  IonSelectOption,
} from "@ionic/vue";
import { save, chevronDownCircleOutline } from "ionicons/icons";
import { useRouter } from "vue-router";
import { Storage } from "@capacitor/storage";
import { ipConfig } from "@/config";
import { defineComponent } from "vue";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";
import mixinFunct from "../../../mixins/mixinFunct";

export default defineComponent({
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
    IonSelect,
    IonSelectOption,
  },

  mixins: [mixinFunct],

  setup() {
    const router = useRouter();
    return { router };
  },

  data() {
    return {
      save,
      chevronDownCircleOutline,
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
      jumlahHargaRetur: 0,
      // jumlahBarangRetur: "",
      // hargaRetur: 0,
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
        console.log(err, "errornya listPO");
        await this.discardLoading();
      }
    },
    async createRetur() {
      console.log("pencet retur");
      try {
        // noPO, jumlahRetur, bulk
        // bulk = { jumlahBarangRetur, hargaBarangRetur, totalHargaRetur, kualitasRetur, masterReturId, masterBarangId }
        let vm = this;
        await vm.presentLoading();
        let penampung1 = {};
        let penampungBulk = [];
        vm.subRetur.forEach((elm) => {
          penampung1.jumlahBarangRetur = elm.jumlahBarangRetur;
          penampung1.hargaBarangRetur = elm.hargaBarang;
          penampung1.totalHargaRetur = elm.hargaRetur;
          penampung1.masterBarangId = elm.masterBarangId;
          penampungBulk.push(penampung1);
          penampung1 = {};
        });
        console.log(penampungBulk, "penampungBulk");
        console.log(this.subRetur);

        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.post(
          ipConfig + "/retur/bulkRegister",
          {
            noPO: vm.noPO,
            jumlahRetur: vm.jumlahRetur,
            bulk: penampungBulk,
          },
          {
            headers: {
              token: dataToken.value,
            },
          }
        );
        console.log(dataResult, "create retur");
        await vm.discardLoading();
        if (dataResult.statusText == "OK") {
          await vm.$router.replace("/tabs/retur");
        }
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

    async isChecked(ev, p) {
      if (ev.target.checked == false) {
        this.jumlahRetur += 1;
        this.subRetur.push(p);
      } else {
        this.jumlahRetur -= 1;
        if (p.hargaRetur != 0) {
          this.jumlahHargaRetur -= p.hargaRetur;
        }
        // this.p.jumlahBarangRetur = 0
        this.subRetur.forEach((el, id) =>
          el.masterBarangId == p.masterBarangId
            ? this.subRetur.splice(id, 1)
            : "kosong"
        );
      }
      // console.log(this.subRetur, "jumlahRetur");
    },

    testHargaRetur(p) {
      this.subRetur.forEach((elm, idx) => {
        if (elm.namaBarang == p.namaBarang) {
          elm.hargaRetur = p.jumlahBarangRetur * p.hargaBarang;
          // console.log(p.jumlahBarangRetur, "<<<");
          // console.log(p.hargaRetur, "<<<");
        } else {
          console.log("sama");
        }
        // console.log(idx);
        if (idx > 0) {
          this.jumlahHargaRetur += this.subRetur[idx].hargaRetur;
        } else {
          this.jumlahHargaRetur = this.subRetur[idx].hargaRetur;
        }
      });
    },
  },
});
</script>

<style>
ion-card {
  border: 1px solid white;
}
</style>
