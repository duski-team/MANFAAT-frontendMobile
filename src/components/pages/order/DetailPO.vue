<template>
  <base-layout page-title="Purchase Order" page-default-back-link="/tabs/order">
    <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>

    <ion-grid v-if="!itemPO.length">
      <ion-row>
        <ion-col class="ion-padding">
          <ion-list>
            <ion-list-header>
              <ion-label class="ion-text-start">
                <h3>No PO</h3>
                <h2>{{ dataPO.noPO }}</h2>
              </ion-label>
              <ion-label class="ion-text-end ion-margin-end">
                <h3>Sales</h3>
                <h2>{{ dataPO.namaSales }}</h2>
              </ion-label>
            </ion-list-header>
            <ion-item lines="none" class="ion-text-start">
              <ion-label>
                <h4>Nama Toko</h4>
                <h2>{{ dataPO.namaToko }}</h2>
              </ion-label>
            </ion-item>
            <ion-item lines="none">
              <ion-label>
                <h4>Jumlah Pesanan</h4>
                <h2>{{ dataPO.jumlahPesanan }}</h2>
              </ion-label>
            </ion-item>
            <ion-item lines="none">
              <ion-label>
                <h4>Tanggal Pesan</h4>
                <h2>{{ dataPO.tanggalPesan }}</h2>
              </ion-label>
            </ion-item>

            <ion-card>
              <ion-card-content class="ion-no-margin ion-no-padding">
                <ion-list lines="none">
                  <ion-item v-for="(itemPO, index) in itemPO" :key="index">
                    <ion-label>
                      <h2>{{ itemPO.namaBarang }}</h2>
                      <h3>Jumlah Barang - {{ itemPO.jumlahBarang }}</h3>
                      <h4>Harga Barang Rp.{{ itemPO.hargaBarang }},00</h4>
                    </ion-label>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>
            <!-- <ion-card v-if="!itemPO.length">
              <ion-card-content class="ion-no-margin ion-no-padding">
                <h2>loading...</h2>
                <ion-list>
                  <ion-item>

                    <ion-skeleton-text animated style="width: 80%"></ion-skeleton-text>
                    <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
                    <ion-skeleton-text animated style="width: 40%"></ion-skeleton-text>
                    <ion-skeleton-text animated style="width: 20%"></ion-skeleton-text>
                    <ion-skeleton-text animated></ion-skeleton-text>

                    <ion-label>
                      <h3>
                        <ion-skeleton-text animated style="width: 80%"></ion-skeleton-text>
                      </h3>
                      <h2>
                       <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
                      </h2>
                      <ion-skeleton-text animated style="width: 40%"></ion-skeleton-text>
                      <ion-skeleton-text animated style="width: 20%"></ion-skeleton-text>
                      <ion-skeleton-text animated></ion-skeleton-text>
                    </ion-label>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card> -->
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
                <h4>Nama Toko</h4>
                <h2>{{ dataPO.namaToko }}</h2>
              </ion-label>
            </ion-item>
            <ion-item lines="none">
              <ion-label>
                <h4>Jumlah Pesanan</h4>
                <h2>{{ dataPO.jumlahPesanan }}</h2>
              </ion-label>
            </ion-item>
            <ion-item lines="none">
              <ion-label>
                <h4>Tanggal Pesan</h4>
                <h2>{{ dataPO.tanggalPesan }}</h2>
              </ion-label>
            </ion-item>

            <ion-card>
              <ion-card-content class="ion-no-margin ion-no-padding">
                <ion-list lines="none">
                  <ion-item v-for="(itemPO, index) in itemPO" :key="index">
                    <ion-label>
                      <h2>{{ itemPO.namaBarang }}</h2>
                      <h3>Jumlah Barang - {{ itemPO.jumlahBarang }}</h3>
                      <h4>Harga Barang Rp.{{ itemPO.hargaBarang }},00</h4>
                    </ion-label>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>
          </ion-list>
          <h2>loading...</h2>
          <ion-skeleton-text animated style="width: 80%"></ion-skeleton-text>
          <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
          <ion-skeleton-text animated style="width: 40%"></ion-skeleton-text>
          <ion-skeleton-text animated style="width: 20%"></ion-skeleton-text>
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
  IonLabel,
  IonItem,
  IonCard,
  IonCardContent,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText,
  loadingController,
} from "@ionic/vue";
import { ipConfig } from "@/config";
import { Storage } from "@capacitor/storage";
import { useRouter } from "vue-router";
import axios from "axios";

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
  },
  data() {
    return {
      dataPO: [],
      itemPO: [],
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  async ionViewDidEnter() {
    await this.getDataPO();
  },
  methods: {
    async getDataPO() {
      try {
        const loading = await loadingController.create({
          spinner: "circles",
          message: "Loading...",
          translucent: true,
        });
        await loading.present();

        let vm = this;
        const noPO = await Storage.get({ key: "noPO" });
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.get(
          ipConfig + "/masterPO/listByNoPO/" + noPO.value,
          {
            headers: {
              token: dataToken.value,
            },
          }
        );

        vm.dataPO = dataResult.data[0];
        vm.itemPO = dataResult.data;
        await loading.dismiss();
      } catch (err) {
        console.log(err, "catchnya jon");
        await loadingController.dismiss();
      }
    },
    async doRefresh(ev) {
      // console.log(ev);
      await this.getDataPO();

      if (this.dataPO) {
        ev.target.complete();
      }
    },
  },
};
</script>

<style>
ion-card {
  border: 1px solid white;
}
ion-skeleton-text {
  --background: var(--ion-color-primary);
  --background-rgb: var(--ion-color-primary-rgb);
  /* --background: primary
  var(--background-rgb) */
}
</style>
