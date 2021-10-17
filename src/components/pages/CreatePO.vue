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
              <ion-col class="ion-text-center ion-text-uppercase" size="3">Jumlah</ion-col>
              <ion-col class="ion-text-center" size="3">SATUAN</ion-col>
              <!-- <ion-col class="ion-text-center" size="2">AKSI</ion-col> -->
            </ion-row>
          </ion-grid>
        </ion-item>
      </ion-list>

      <ion-list v-if="listBarang.length">

        <ion-item-sliding v-for="(listBarang, index) in listBarang" :key="index">
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
                <!-- <ion-col class="ion-text-center" size="2">
                  <ion-fab vertical="center" horizontal="center">
                    <ion-fab-button size="small" color="secondary" @click="deleteBarang(listBarang.namaBarang)">
                      <ion-icon :icon="trash"></ion-icon>
                    </ion-fab-button>
                  </ion-fab>
                </ion-col> -->
              </ion-row>
            </ion-grid>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="danger" @click="deleteBarang(listBarang.namaBarang)">Hapus</ion-item-option>
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
  loadingController,
  alertController
} from "@ionic/vue";
import { save, add, trash } from "ionicons/icons";
import { Storage } from "@capacitor/storage";
import { ipConfig } from "@/config";
import { useRouter } from "vue-router";
import axios from "axios";
import modalBarang from "./ModalBarang.vue";
import moment from "moment";
import "moment/locale/id" 


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
      tanggalPesan: ""
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
      const { data } = await modalController.ionWillDismiss()
      console.log(data);
      // try {
      //   await modalController.dismiss({ dataBarang });

      //   if (dataBarang !== null) {
      //     // dataBarang = modelData.data;
      //     console.log("Modal Data : " + dataBarang);
      //   } else {
      //     console.log(dataBarang + "- kosong");
      //   }
      // } catch (err) {
      //   console.log(err);
      // }
    };

    return {
      router,
      closeModal,
    };
  },
  
  methods: {
    async getToko() {
      try {
        const loading = await loadingController.create({
          spinner: 'circles',
          message: "Loading...",
          translucent: true,
        });

        await loading.present();

        let vm = this;
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
        vm.noPO = moment().format("YYMMDD.ddHHmmss")
        
        if (vm.dataToko) {
          loading.dismiss();
        }
      } catch (err) {
        console.log(err, "catchnya jon");
      }
    },
    async addBarang() {
      // const dataAkun = await this.getAkun()
      const modal = await modalController.create({
        component: modalBarang,
        componentProps: { dataBarang: this.listBarang },
      });
      // modal.present();

      // const { data } = await modal.onWillDismiss()
      // .then(res => {
      //   console.log(res);
      // })
      // .catch(err => {
      //   console.log(err);
      // })
      // console.log(data.dataBarang.namaBarang, ">>>>");
      // this.listBarang.push(data.dataBarang)
      // console.log(this.listBarang[0].namaBarang, "^^^");
      // console.log(this.listBarang[0].jumlahBarang, "****");
      // return this

      modal.onDidDismiss()
        .then((res) => {
          if (res.data == null) {
            console.log("kosong");
          } else {
            // console.log(res.data.dataBarang, ">>>>");
            const dataRespon = res.data.dataBarang
            this.listBarang.push(dataRespon)
            this.totalNominal += dataRespon.harga*Number(dataRespon.jumlahBarang)
            this.totalPesanan += Number(dataRespon.jumlahBarang)
            // console.log(this.totalNominal, "<<<<");
            console.log(this.listBarang, "<<<<");
          }
        })
        .catch((err) => {
          console.log(err, "diapain ya");
        })

        return await modal.present()
    },
    async savePO() {
      try {
        // const alert = await alertController.create({
        //   header: "Buat Purchase Order",
        //   message: "Apakah data pesanan sudah sesuai?",
        //   buttons: ['Tidak', 'Ya']
        // })
        const loading = await loadingController.create({
          spinner: "circles",
          message: "Loading...",
          translucent: true,
        });
        await loading.present()

        let vm = this
        let isi = []
        let penampung1 = {}
        let penampung2 = {}

        penampung1.totalNominal = vm.totalNominal
        isi.push(penampung1)
        vm.listBarang.forEach((elm) => {
          penampung2.masterBarangId = elm.masterBarangId
          penampung2.jumlahBarang = elm.jumlahBarang
          penampung2.hargaBarang = elm.harga
          penampung2.totalHarga = elm.totalHarga
          isi.push(penampung2)
          penampung2 = {}
        })
        // noPO,masterTokoId,jumlahPesanan,tanggalPesan,userId,data
        // data = { jumlahBarang, hargaBarang, totalHarga, masterBarangId }
        const idToko = await Storage.get({ key: "tokoId" });
        const idUser = await Storage.get({ key: "idUser" });
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.post(
          ipConfig + "/transaksi/screeningPO", {
            noPO: vm.noPO,
            masterTokoId: idToko.value,
            jumlahPesanan: vm.totalPesanan,
            tanggalPesan: vm.tanggalPesan,
            userId: idUser,
            data: isi
          },
          {
            headers: {
              token: dataToken.value,
            },
          }
        );
        console.log(dataResult);
        // console.log(idToko);
        // console.log(idUser);
        // console.log(dataToken);
        // console.log(isi);

        await loading.dismiss()
        const alert = await alertController.create({
          message: "Purchase Order berhasil ditambahkan",
          buttons: ['Ok']
        })
        await alert.present()

        await this.$router.replace("/tabs/order");
      } catch (err) {
        console.log(err, "katanya 'e' to the 'ror'");
      }
    },
    deleteBarang(params) {
      console.log("kepencet", params);
      let dataId = this.listBarang.findIndex(el => el.namaBarang == params )
      let dataBarang = this.listBarang.find(el => el.namaBarang == params )
      console.log(dataId, dataBarang);
      this.listBarang.splice(dataId, 1)
      this.totalNominal -= dataBarang.totalHarga
      this.totalPesanan -= Number(dataBarang.jumlahBarang)
    },
    sendDate(x) {
      let y = moment(x).format("YYYY-MM-DD")
      console.log(y);
      return y
    },
    async testMoment() {
      this.hari = await moment().format('dddd')
      this.tanggal = await moment().format('LL')
      this.waktu = await moment().format('LT')
      this.tanggalPesan = await moment()
      // let formatMoment = await moment().format('LLLL')
      // console.log("moment", this.hari);
      // console.log("moment", this.tanggal);
      // console.log("moment", this.waktu);
      // console.log("moment", this.tanggalPesan);
    },
    async doRefresh(ev) {
    await this.getToko();
    await this.testMoment();

      if (this.dataToko) {
        ev.target.complete();
      }
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

.isi-tabel{
  font-style: italic;
}
</style>
