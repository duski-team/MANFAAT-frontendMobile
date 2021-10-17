<template>
  <base-layout page-title="MANFA'AT">
    <template v-slot:actions-end>
      <ion-button router-link="/tabs/toko/tambah/">
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
  loadingController,
  modalController,
} from "@ionic/vue";
import { add, search } from "ionicons/icons";
import { ipConfig } from "../config";
import { Storage } from "@capacitor/storage";
import { useRouter } from "vue-router";
import modalToko from "@/components/pages/ModalToko.vue";
import axios from "axios";
import moment from "moment";
import "moment/locale/id" 

export default  {
  name: 'DaftarToko',
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
  },
  data() {
    return {
      add,
      search,
      listToko: [],
      namaWilayah: "",
      hari: "",
      tanggal: "",
      waktu: "",
    }
  },
  
  setup() {
    const router = useRouter();
    const currentDate = new Date();
    return { router, currentDate }
  },

  async ionViewDidEnter() {
    await this.dataToko();
    await this.testMoment();
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
    },
    async doRefresh(ev)  {
      // console.log(ev);
      await this.dataToko()
      await this.testMoment();

      if (this.listToko) {
        ev.target.complete()
      }

    },
    async testMoment() {
      this.hari = await moment().format('dddd')
      this.tanggal = await moment().format('LL')
      this.waktu = await moment().format('LT')
      // this.tanggalPesan = await moment().format('YYYY-MM-DD')
      // let formatMoment = await moment().format('LLLL')
      // console.log("moment", this.hari);
      // console.log("moment", this.tanggal);
      // console.log("moment", this.waktu);
      // console.log("moment", this.tanggalPesan);
    },
    async searchToko() {
      // console.log("pencet");
       const modal = await modalController.create({
        component: modalToko,
        // componentProps: { dataBarang: this.listBarang },
      });
      // modal.onDidDismiss()
      //   .then((res) => {
      //     if (res.data == null) {
      //       console.log("kosong");
      //     } else {
      //       // console.log(res.data.dataBarang, ">>>>");
      //       const dataRespon = res.data.dataBarang
      //       this.listBarang.push(dataRespon)
      //       this.totalNominal += dataRespon.harga*Number(dataRespon.jumlahBarang)
      //       this.totalPesanan += Number(dataRespon.jumlahBarang)
      //       // console.log(this.totalNominal, "<<<<");
      //       console.log(this.listBarang, "<<<<");
      //     }
      //   })
      //   .catch((err) => {
      //     console.log(err, "diapain ya");
      //   })

        return await modal.present()
    }
  },
}
</script>