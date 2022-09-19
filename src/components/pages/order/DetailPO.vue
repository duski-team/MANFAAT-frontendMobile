<template>
  <base-layout page-title="Purchase Order" page-default-back-link="/tabs/order">
    <template v-slot:actions-end>
      <!-- <ion-button router-link="/tabs/toko/tambah/"> -->
      <ion-button @click="saveFotoPO">
        <ion-icon slot="icon-only" :icon="save"></ion-icon>
      </ion-button>
    </template>

    <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>

    <ion-grid v-if="itemPO.length">
      <ion-row>
        <ion-col class="ion-padding">
          <div class="ion-margin-bottom">
            <div v-if="previewPhoto" style="text-align: center;">
              <img height="300" :src="previewPhoto" />
            </div>
            <div v-else style="text-align: center;">
              <img height="300" src="../../../../public/assets/file-image.png" />
            </div>
          </div>
          <ion-list>
            <ion-list-header>
              <ion-label class="ion-text-start">
                <h3>No PO</h3>
                <h2>{{ dataPO.noPO }}</h2>
              </ion-label>
              <ion-label class="ion-text-end ion-margin-end">
                <h3>Driver</h3>
                <h2>{{ dataPO.namaDriver }}</h2>
              </ion-label>
            </ion-list-header>
            <ion-list-header>
              <ion-label class="ion-text-start">
                <h3>Sales</h3>
                <h2>{{ dataPO.namaSales }}</h2>
              </ion-label>
              <ion-label class="ion-text-end ion-margin-end">
                <h3>Helper</h3>
                <h2>{{ dataPO.namaHelper }}</h2>
              </ion-label>
            </ion-list-header>
            <ion-item lines="none" class="ion-text-start">
              <ion-label>
                <h5>Nama Toko</h5>
                <h2>{{ dataPO.namaToko }}</h2>
              </ion-label>
            </ion-item>
            <ion-item lines="none">
              <ion-label>
                <h5>Jumlah Pesanan</h5>
                <h2>{{ dataPO.jumlahPesanan }}</h2>
              </ion-label>
            </ion-item>
            <ion-item lines="none">
              <ion-label>
                <h5>Tanggal Pemesanan</h5>
                <h2>{{ dataPO.tanggalPemesanan }}</h2>
              </ion-label>
            </ion-item>
            <ion-item lines="none">
              <ion-label>
                <h5>Total Harga</h5>
                <h2>{{ dataPO.totalnya }}</h2>
              </ion-label>
            </ion-item>
            <ion-item lines="none">
              <ion-label>
                <h5>Jenis Pembayaran</h5>
                <h2>{{ dataPO.jenisPembayaran }}</h2>
              </ion-label>
            </ion-item>

            <ion-card>
              <ion-card-content class="ion-no-margin ion-no-padding">
                <ion-list lines="none">
                  <ion-item v-for="(itemPO, index) in itemPO" :key="index">
                    <ion-label>
                      <h2>
                        Produk <b>{{ itemPO.namaBarang }}</b>
                      </h2>
                      <h3>Jumlah Barang - {{ itemPO.jumlahBarang }}</h3>
                      <h4>Harga Satuan {{ itemPO.hargaBarang }}</h4>
                    </ion-label>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>
          </ion-list>
        </ion-col>
      </ion-row>
    </ion-grid>

    <ion-grid v-else>
      <ion-row>
        <ion-col>
          <ion-list>
            <ion-list-header>
              <ion-label class="ion-text-start">
                <h3>
                  <ion-skeleton-text animated style="width: 20%"></ion-skeleton-text>
                </h3>
                <h2>
                  <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
                </h2>
              </ion-label>
              <ion-label class="ion-text-end ion-margin-end">
                <h3>
                  <ion-skeleton-text animated style="width: 20%"></ion-skeleton-text>
                </h3>
                <h2>
                  <ion-skeleton-text animated style="width: 40%"></ion-skeleton-text>
                </h2>
              </ion-label>
            </ion-list-header>
            <ion-item lines="none" class="ion-text-start">
              <ion-label>
                <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
                <ion-skeleton-text animated style="width: 80%"></ion-skeleton-text>
              </ion-label>
            </ion-item>
            <ion-item lines="none">
              <ion-label>
                <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
                <ion-skeleton-text animated style="width: 80%"></ion-skeleton-text>
              </ion-label>
            </ion-item>
            <ion-item lines="none">
              <ion-label>
                <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
                <ion-skeleton-text animated style="width: 80%"></ion-skeleton-text>
              </ion-label>
            </ion-item>

            <ion-card>
              <ion-card-content class="ion-no-margin ion-no-padding">
                <ion-list lines="none">
                  <ion-item>
                    <ion-label>
                      <ion-skeleton-text animated style="width: 40%"></ion-skeleton-text>
                      <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
                      <ion-skeleton-text animated style="width: 80%"></ion-skeleton-text>
                    </ion-label>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>
          </ion-list>
        </ion-col>
      </ion-row>
    </ion-grid>

    <template v-slot:button-float>
      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button @click="ambilFoto">
          <ion-icon :icon="camera"></ion-icon>
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
  IonCard,
  IonCardContent,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText,
  IonFab,
  IonFabButton,
  IonIcon,
  IonButton,
} from "@ionic/vue";
import { ipConfig } from "@/config";
import { Storage } from "@capacitor/storage";
import { useRouter } from "vue-router";
import { camera, save } from "ionicons/icons";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import axios from "axios";
import mixinFunct from "@/mixins/mixinFunct";
import mixinFormat from "@/mixins/mixinFormat";
import moment from "moment";
import "moment/locale/id";

export default {
  components: {
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonListHeader,
    IonLabel,
    IonItem,
    IonCard,
    IonCardContent,
    IonRefresher,
    IonRefresherContent,
    IonSkeletonText,
    IonFab,
    IonFabButton,
    IonIcon,
    IonButton,
  },
  mixins: [mixinFunct, mixinFormat],
  data() {
    return {
      dataPO: [],
      itemPO: [],
      previewPhoto: "",
      sendPhoto: "",
    };
  },
  setup() {
    const router = useRouter();
    return { router, camera, save };
  },
  async ionViewDidEnter() {
    await this.presentLoading();
    await this.getDataPO();
    await this.discardLoading();
  },
  methods: {
    async ambilFoto() {
      let vm = this;
      const cameraPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 30,
        saveToGallery: true,
        allowEditing: false,
      });
      let x = await fetch(`${cameraPhoto.webPath}`).then((y) => y.blob());
      console.log(x);

      vm.previewPhoto = cameraPhoto.webPath;
      vm.sendPhoto = x;
    },

    async getDataPO() {
      let vm = this;
      try {
        const noPO = await Storage.get({ key: "noPO" });
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.get(ipConfig + "/masterPO/listByNoPO/" + noPO.value, {
          headers: {
            token: dataToken.value,
          },
        });
        vm.dataPO = dataResult.data[0];
        vm.dataPO.tanggalPemesanan = moment(vm.dataPO.tanggalPesan).format("dddd, DD MMMM YYYY");
        vm.dataPO.totalnya = vm.formatHarga(vm.dataPO.totalHarga);
        vm.dataPO.hargaBarang = vm.formatHarga(vm.dataPO.hargaBarang);
        vm.itemPO = dataResult.data;

        console.log(vm.dataPO);
        console.log(vm.itemPO);
      } catch (err) {
        console.log(err, "catchnya jon");
      }
    },

    async saveFotoPO() {
      let _vm = this;
      try {
        const dataToken = await Storage.get({ key: "token" });
        const dataRes = await axios.post(
          ipConfig + "/mobile/editFotoPO",
          { id: _vm.dataPO.id, fotoPO: _vm.sendPhoto },
          { headers: { token: dataToken.value } },
        );
        console.log(dataRes);
      } catch (err) {
        console.log(err);
      }
    },
    async doRefresh(ev) {
      await this.getDataPO();
      if (this.dataPO) {
        ev.target.complete();
      }
    },
  },
};
</script>

<style scoped>
ion-card {
  border: 1px solid white;
}
ion-skeleton-text {
  --background: var(--ion-color-primary);
  --background-rgb: var(--ion-color-primary-rgb);
}
img {
  padding: 10px;
}
</style>
