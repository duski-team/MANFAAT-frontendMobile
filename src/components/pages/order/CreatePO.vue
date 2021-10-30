<template>
  <base-layout page-title="Buat PO" page-default-back-link="/tabs/order">
    <template v-slot:actions-end>
      <ion-button v-if="listBarang.length" @click="savePO">
        <ion-icon slot="icon-only" :icon="save"></ion-icon>
      </ion-button>
      <ion-button v-else disabled>
        <ion-icon slot="icon-only" :icon="save"></ion-icon>
      </ion-button>
    </template>

    <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>

    <div v-if="dataToko">
      <ion-list>
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-list-header>
                <ion-label>
                  <p>Toko</p>
                  <h2 class="nama_toko">{{ dataToko.namaToko }}</h2>
                </ion-label>
              </ion-list-header>
            </ion-col>
            <ion-col>
              <ion-list-header>
                <ion-label v-model="tanggal" class="sisi_kanan">
                  <p>Tanggal</p>
                  <h3>{{ hari }}</h3>
                  <h4>{{ tanggal }}</h4>
                </ion-label>
              </ion-list-header>
            </ion-col>
          </ion-row>
        </ion-grid>

        <ion-card>
          <ion-card-content>
            <ion-item>
              <ion-label>
                <h2>No. PO :</h2>
              </ion-label>
              <ion-input v-model="noPO" readonly class="ion-text-end">
                <h3 class="ion-text-end"></h3>
              </ion-input>
            </ion-item>
            <ion-item>
              <ion-label>Total Nominal:</ion-label>
              <ion-input v-model="totalNominal" readonly class="ion-text-end">
                <h3 class="ion-text-end"></h3>
              </ion-input>
            </ion-item>
            <ion-item lines="none">
              <ion-label>Total Pesanan:</ion-label>
              <ion-input v-model="totalPesanan" readonly class="ion-text-end">
                <h3 class="ion-text-end"></h3>
              </ion-input>
            </ion-item>
          </ion-card-content>
        </ion-card>
      </ion-list>

      <ion-list>
        <ion-list-header>
          <ion-label color="primary">
            <h2 class="ion-text-center">
              <ion-button expand="full" disabled>
                List Barang
              </ion-button>
            </h2>
          </ion-label>
        </ion-list-header>
        <ion-item lines="full">
          <ion-grid>
            <ion-row class="header-row">
              <ion-col size="6">PRODUK</ion-col>
              <ion-col class="ion-text-center ion-text-uppercase" size="3"
                >Jumlah</ion-col
              >
              <ion-col class="ion-text-center" size="3">SATUAN</ion-col>
              <!-- <ion-col class="ion-text-center" size="2">AKSI</ion-col> -->
            </ion-row>
          </ion-grid>
        </ion-item>
      </ion-list>

      <ion-list v-if="listBarang.length">
        <ion-item-sliding
          v-for="(listBarang, index) in listBarang"
          :key="index"
        >
          <ion-item lines="full" class="(i % 2 == 0) ? 'odd' : 'even'">
            <ion-grid>
              <ion-row>
                <ion-col size="6">
                  {{ listBarang.namaBarang }}
                </ion-col>
                <ion-col class="ion-text-center" size="3">
                  {{ listBarang.jumlahBarang }}
                </ion-col>
                <ion-col class="ion-text-center" size="3">
                  {{ listBarang.harga }}
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option
              color="danger"
              @click="deleteBarang(listBarang.namaBarang)"
              >Hapus</ion-item-option
            >
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
      <ion-list v-else>
        <!-- <ion-item lines="full"> -->
        <ion-grid>
          <ion-row>
            <ion-col class="ion-text-center ion-padding" size="12">
              <p class="isi-tabel">Silahkan Tambah Barang</p>
              <!-- <ion-textarea readonly rows="5">Silahkan Tambah Barang</ion-textarea> -->
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-list>
    </div>

    <div v-else>
      <h1>Loading...</h1>
    </div>

    <template v-slot:button-float>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="addBarang">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </template>
  </base-layout>
</template>

<script>
import {
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  //   IonToggle,
  //   IonRadio,
  //   IonCheckbox,
  modalController,
  IonCard,
  IonCardContent,
  IonList,
  IonListHeader,
  IonGrid,
  IonRow,
  IonCol,
  // IonNote,
  // IonTextarea,
  IonFab,
  IonFabButton,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonRefresher,
  IonRefresherContent,
  alertController,
} from "@ionic/vue";
import { save, add, trash } from "ionicons/icons";
import { Storage } from "@capacitor/storage";
import { ipConfig } from "@/config";
import { useRouter } from "vue-router";
import axios from "axios";
import modalBarang from "../order/ModalBarang.vue";
import moment from "moment";
import "moment/locale/id";
import mixinFunct from "../../../mixins/mixinFunct";

export default {
  name: "DetailPO",
  components: {
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonInput,
    // IonToggle,
    // IonRadio,
    // IonCheckbox,
    IonCard,
    IonCardContent,
    IonList,
    IonListHeader,
    IonGrid,
    IonRow,
    IonCol,
    // IonNote,
    // IonTextarea,
    IonFab,
    IonFabButton,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonRefresher,
    IonRefresherContent,
  },

  mixins: [mixinFunct],

  data() {
    return {
      save,
      add,
      trash,
      tokoId: this.$route.params.id,
      dataToko: [],
      listBarang: [],
      noPO: null,
      totalHarga: 0,
      totalNominal: 0,
      totalPesanan: 0,
      hari: "",
      tanggal: "",
      waktu: "",
      tanggalPesan: "",
    };
  },
  async ionViewDidEnter() {
    await this.getToko();
    await this.testMoment();
    // await this.getAkun();
  },
  setup() {
    const router = useRouter();

    const closeModal = async () => {
      const { data } = await modalController.ionWillDismiss();
      console.log(data);
    };

    return {
      router,
      closeModal,
    };
  },

  methods: {
    async getToko() {
      try {
        let vm = this;
        await vm.presentLoading();
        const idToko = await Storage.get({ key: "tokoId" });
        const dataToken = await Storage.get({ key: "token" });
        // console.log(JSON.stringify(idToko), "<<<<<");
        const dataResult = await axios.get(
          ipConfig + "/masterToko/listById/" + idToko.value,
          {
            headers: {
              token: dataToken.value,
            },
          }
        );
        // console.log("resultnya", JSON.stringify(dataResult))  ;
        // console.log("resultnya", dataResult)  ;
        vm.dataToko = dataResult.data[0][0];
        // vm.noPO = Math.floor(Math.random() * 10000000)
        vm.noPO = moment().format("YYMMDD.ddHHmmss");

        if (vm.dataToko) {
          await vm.discardLoading();
        }
      } catch (err) {
        console.log(err, "catchnya jon");
        await this.discardLoading();
      }
    },

    async addBarang() {
      // const dataAkun = await this.getAkun()
      const modal = await modalController.create({
        component: modalBarang,
        componentProps: { dataBarang: this.listBarang },
      });

      modal
        .onDidDismiss()
        .then((res) => {
          if (res.data == null) {
            console.log("kosong");
          } else {
            // console.log(res.data.dataBarang, ">>>>");
            const dataRespon = res.data.dataBarang;
            this.listBarang.push(dataRespon);
            this.totalNominal +=
              dataRespon.harga * Number(dataRespon.jumlahBarang);
            this.totalPesanan += Number(dataRespon.jumlahBarang);
            // console.log(this.totalNominal, "<<<<");
            console.log(this.listBarang, "<<<<");
          }
        })
        .catch((err) => {
          console.log(err, "diapain ya");
        });

      return await modal.present();
    },

    async savePO() {
      try {
        // const alert = await alertController.create({
        //   header: "Buat Purchase Order",
        //   message: "Apakah data pesanan sudah sesuai?",
        //   buttons: ['Tidak', 'Ya']
        // })
        let vm = this;
        await vm.presentLoading();

        let isi = [];
        let penampung1 = {};
        let penampung2 = {};

        penampung1.totalNominal = vm.totalNominal;
        isi.push(penampung1);
        vm.listBarang.forEach((elm) => {
          penampung2.masterBarangId = elm.masterBarangId;
          penampung2.jumlahBarang = elm.jumlahBarang;
          penampung2.hargaBarang = elm.harga;
          penampung2.totalHarga = elm.totalHarga;
          isi.push(penampung2);
          penampung2 = {};
        });
        // noPO,masterTokoId,jumlahPesanan,tanggalPesan,userId,data
        // data = { jumlahBarang, hargaBarang, totalHarga, masterBarangId }
        const idToko = await Storage.get({ key: "tokoId" });
        const idUser = await Storage.get({ key: "idUser" });
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.post(
          ipConfig + "/transaksi/screeningPO",
          {
            noPO: vm.noPO,
            masterTokoId: idToko.value,
            jumlahPesanan: vm.totalPesanan,
            tanggalPesan: vm.tanggalPesan,
            userId: idUser,
            data: isi,
          },
          {
            headers: {
              token: dataToken.value,
            },
          }
        );
        console.log(dataResult);
        await vm.discardLoading();
        await vm.presentAlert();
        await vm.$router.replace("/tabs/order");
      } catch (err) {
        console.log(err, "katanya 'e' to the 'ror'");
        await this.discardLoading();
      }
    },

    deleteBarang(params) {
      // console.log("kepencet", params);
      let dataId = this.listBarang.findIndex((el) => el.namaBarang == params);
      let dataBarang = this.listBarang.find((el) => el.namaBarang == params);
      // console.log(dataId, dataBarang, "deletenya");
      this.listBarang.splice(dataId, 1);
      this.totalNominal -= dataBarang.totalHarga;
      this.totalPesanan -= Number(dataBarang.jumlahBarang);
    },

    async testMoment() {
      this.hari = await moment().format("dddd");
      this.tanggal = await moment().format("LL");
      this.waktu = await moment().format("LT");
      this.tanggalPesan = await moment();
    },

    async doRefresh(ev) {
      await this.getToko();
      await this.testMoment();

      if (this.dataToko) {
        ev.target.complete();
      }
    },

    async presentAlert() {
      const alert = await alertController.create({
        message: "Purchase Order berhasil ditambahkan",
        buttons: ["Tutup"],
      });
      await alert.present();
    },
  },
};
</script>

<style scoped>
.sisi_kanan {
  margin-right: 15px;
  text-align: end;
}
.nama_toko {
  font-weight: 900;
}
.label1 {
  align-items: flex-start;
  text-align: start;
}
.label2 {
  align-items: center;
  text-align: center;
}
.label3 {
  align-items: flex-end;
  text-align: end;
}

.odd {
  background-color: chartreuse;
  color: aqua;
}
.even {
  background-color: aquamarine;
  color: chartreuse;
}

.isi-tabel {
  font-style: italic;
}
</style>
