<template>
  <base-layout page-title="Detail Retur" page-default-back-link="/tabs/retur">
    <ion-grid v-if="!detailRetur.length">
      <ion-row>
        <ion-col class="ion-padding">
          <ion-list>
            <ion-card>
              <ion-list-header>
                <ion-label class="ion-text-start">
                  <h3>No PO</h3>
                  <h2>{{ detailRetur.noPO }}</h2>
                </ion-label>
                <ion-label class="ion-text-end ion-margin-end">
                  <h3>Sales</h3>
                  <h2>{{ detailRetur.username }}</h2>
                </ion-label>
              </ion-list-header>
              <ion-item lines="none">
                <ion-label>
                  <h4>Jumlah Pesanan</h4>
                </ion-label>
                <ion-input readonly v-model="detailRetur.jumlahRetur" class="ion-text-end"></ion-input>
              </ion-item>
              <ion-item lines="none">
                <ion-label>
                  <h4>Total Nominal</h4>
                </ion-label>
                <ion-input readonly v-model="totalNominalRetur" class="ion-text-end"></ion-input>
              </ion-item>
              <ion-item lines="none">
                <ion-label>
                  <h4>Tanggal Pesan</h4>
                  <h2>{{ detailRetur.createdAt }}</h2>
                </ion-label>
              </ion-item>
              <ion-item lines="none">
                <ion-label>
                  <h4>Accepted</h4>
                  <h2>
                    {{ detailRetur.acceptedRetur == 0 ? "Belum Acc" : "Sudah Acc" }}
                  </h2>
                </ion-label>
              </ion-item>
            </ion-card>

            <ion-list lines="full">
              <ion-item>
                <ion-label>
                  <h1>List Barang</h1>
                </ion-label>
              </ion-item>
              <ion-item v-for="(itemRetur, index) in itemRetur" :key="index">
                <ion-label>
                  <h2>{{ itemRetur.namaBarang }}</h2>
                  <h3>Jumlah Barang - {{ itemRetur.jumlahBarangRetur }}</h3>
                  <h4>Harga Barang Rp.{{ itemRetur.hargaBarangRetur }},00</h4>
                </ion-label>
              </ion-item>
            </ion-list>
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
              <ion-card-header>
                <ion-card-title>
                  <ion-skeleton-text animated style="width: 40%"></ion-skeleton-text>
                </ion-card-title>
              </ion-card-header>
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
  </base-layout>
</template>

<script>
import { defineComponent } from "vue";
import {
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonListHeader,
  IonLabel,
  IonInput,
  IonItem,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSkeletonText,
} from "@ionic/vue";
import { ipConfig } from "@/config";
import { Storage } from "@capacitor/storage";
import { useRouter } from "vue-router";
import axios from "axios";
import accounting from "accounting-js";
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
    IonLabel,
    IonInput,
    IonItem,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSkeletonText,
  },

  mixins: [mixinFunct],

  data() {
    return {
      detailRetur: [],
      itemRetur: [],
      totalNominalRetur: 0,
    };
  },

  setup() {
    const router = useRouter();
    return { router };
  },

  async ionViewDidEnter() {
    await this.presentLoading();
    await this.getDetailRetur();
    await this.discardLoading();
  },

  methods: {
    async getDetailRetur() {
      try {
        let vm = this;
        const idRetur = await Storage.get({ key: "returId" });
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.get(ipConfig + "/retur/detailReturBySales/" + idRetur.value, {
          headers: {
            token: dataToken.value,
          },
        });
        console.log(dataResult.data.data);
        vm.detailRetur = dataResult.data.data[0];
        vm.detailRetur.createdAt = moment(vm.detailRetur.createdAt).format("LL");
        vm.itemRetur = dataResult.data.data;
        vm.itemRetur.forEach((el) => {
          vm.totalNominalRetur += el.totalHargaRetur;
        });
        vm.totalNominalRetur = accounting.formatMoney(vm.totalNominalRetur, {
          symbol: "Rp",
          precicsion: 2,
          thousand: ".",
          decimal: ",",
          format: {
            pos: "%s %v",
            neg: "%s (%v)",
            zero: "-",
          },
        });
      } catch (err) {
        console.log("errorHandler", err);
      }
    },
  },
});
</script>

<style>
ion-skeleton-text {
  --background: var(--ion-color-primary);
  --background-rgb: var(--ion-color-primary-rgb);
}
</style>
