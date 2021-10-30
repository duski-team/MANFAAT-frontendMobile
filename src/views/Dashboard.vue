<template>
  <base-layout page-title="MANFA'AT" screen-content="true">
    <template v-slot:actions-end>
      <ion-button @click="signout">
        <ion-icon slot="icon-only" :icon="exit"></ion-icon>
      </ion-button>
    </template>

    <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
      <ion-refresher-content
        :pulling-icon="chevronDownCircleOutline"
        refreshing-spinner="null"
      ></ion-refresher-content>
    </ion-refresher>

    <ion-grid v-if="profileSales">
      <ion-row>
        <ion-col>
          <ion-item lines="none">
            <ion-grid>
              <ion-row>
                <ion-col size="6">
                  <ion-label>
                    <h2>{{ hari }}</h2>
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
                <ion-list>
                  <ion-list-header>
                    <ion-label>
                      <h4>Sugeng Rawuh,</h4>
                      <h1>{{ profileSales.nama }}</h1>
                    </ion-label>

                    <ion-label class="ion-text-end ion-margin-end">
                      <h5>Wilayah</h5>
                      <h2>{{ wilayahSales }}</h2>
                    </ion-label>
                  </ion-list-header>

                  <ion-card v-if="performanceSales">
                    <ion-card-header>
                      <ion-card-title>
                        Performance Page
                      </ion-card-title>
                    </ion-card-header>

                    <ion-card-content class="ion-no-padding ion-no-margin">
                      <ion-item lines="none">
                        <ion-grid>
                          <ion-row>
                            <ion-col>
                              <ion-label>
                                <h1>Toko</h1>
                              </ion-label>
                            </ion-col>
                            <ion-col>
                              <ion-label class="ion-text-end" readonly>
                                <h3>{{ tokoSales.length }} - Toko Terdaftar</h3>
                              </ion-label>
                            </ion-col>
                          </ion-row>
                        </ion-grid>
                      </ion-item>

                      <ion-item lines="none">
                        <ion-grid>
                          <ion-row>
                            <ion-col>
                              <ion-label>
                                <h1>Penjualan</h1>
                              </ion-label>
                            </ion-col>
                            <ion-col class="ion-text-end">
                              <ion-label>
                                <h3>{{ orderSales.jumlahPO }} - PO Terbuat</h3>
                                <h3>
                                  Rp.{{ orderSales.totalHargaPO }} - Total
                                  Nominal
                                </h3>
                              </ion-label>
                            </ion-col>
                          </ion-row>
                        </ion-grid>
                      </ion-item>

                      <ion-item lines="none">
                        <ion-grid>
                          <ion-row>
                            <ion-col>
                              <ion-label>
                                <h1>Retur</h1>
                              </ion-label>
                            </ion-col>
                            <ion-col class="ion-text-end">
                              <ion-label>
                                <h3>
                                  {{
                                    returSales.totalRetur
                                      ? returSales.totalRetur
                                      : "0"
                                  }}
                                  - Retur Terbuat
                                </h3>
                              </ion-label>
                            </ion-col>
                          </ion-row>
                        </ion-grid>
                      </ion-item>

                      <ion-item lines="none">
                        <ion-grid>
                          <ion-row>
                            <ion-col size="4">
                              <ion-label>
                                <h1>Barang</h1>
                              </ion-label>
                            </ion-col>
                            <ion-col size="8">
                              <ion-item lines="none" class="ion-text-end">
                                <ion-label>
                                  <h2>
                                    {{ jumlahTotalBarang }} - Total Barang
                                  </h2>
                                </ion-label>
                              </ion-item>
                            </ion-col>
                          </ion-row>
                          <ion-row>
                            <ion-col>
                              <ion-item
                                v-for="(barangSales, index) in barangSales"
                                :key="index"
                                lines="none"
                              >
                                <!-- <ion-label class="ion-text-start">
                                  <h3>{{ barangSales.namaBarang }}</h3>
                                </ion-label> -->
                                <ion-label class="ion-text-end">
                                  <h3>
                                    {{ barangSales.namaBarang }} -
                                    {{ barangSales.totalBarang }}
                                  </h3>
                                </ion-label>
                              </ion-item>
                            </ion-col>
                          </ion-row>
                        </ion-grid>
                      </ion-item>
                    </ion-card-content>
                  </ion-card>

                  <ion-card v-else>
                    <ion-item>
                      <h1>loading...</h1>
                    </ion-item>
                  </ion-card>
                </ion-list>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-col>
      </ion-row>
    </ion-grid>

    <ion-grid v-else>
      <ion-row>
        <ion-col>
          <h1>Loading...</h1>
        </ion-col>
      </ion-row>
    </ion-grid>
  </base-layout>
</template>

<script>
import {
  IonRefresher,
  IonRefresherContent,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { exit, chevronDownCircleOutline } from "ionicons/icons";
import { Storage } from "@capacitor/storage";
import { ipConfig } from "../config";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";
import mixinFunct from "../mixins/mixinFunct";

export default defineComponent({
  components: {
    IonRefresher,
    IonRefresherContent,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    // IonInput,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
  },
  mixins: [mixinFunct],

  data() {
    return {
      exit,
      chevronDownCircleOutline,
      close,
      hari: "",
      tanggal: "",
      waktu: "",
      profileSales: "",
      wilayahSales: "",
      watchInterval: "",
      performanceSales: false,
      orderSales: [],
      barangSales: [],
      jumlahTotalBarang: 0,
      tokoSales: [],
      returSales: [],
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },

  async ionViewWillEnter() {
    // await this.getProfile()
    if (!this.profileSales) {
      await this.getProfile();
      await this.getPerformance();
    }
    if (!this.tanggal && !this.waktu) {
      await this.runMoment();
      await this.clockInterval();
    }
  },
  methods: {
    async getProfile() {
      try {
        await this.presentLoading();
        let vm = this;
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.get(ipConfig + "/users/profile", {
          headers: {
            token: dataToken.value,
          },
        });
        vm.profileSales = dataResult.data.respon[0];
        if (vm.profileSales.wilayah.namaWilayah) {
          vm.wilayahSales = vm.profileSales.wilayah.namaWilayah;
        } else {
          vm.wilayahSales = "-";
        }
        await this.discardLoading();
      } catch (err) {
        console.log(err, "errornya profile");
        await this.discardLoading();
      }
    },

    async getPerformance() {
      try {
        let vm = this;
        await vm.presentLoading();
        const dataUserId = await Storage.get({ key: "idUser" });
        const dataToken = await Storage.get({ key: "token" });
        const reqOne = await axios.get(
          ipConfig + "/masterPO/jumlahBySales/" + dataUserId.value,
          {
            headers: {
              token: dataToken.value,
            },
          }
        );
        const reqTwo = axios.get(
          ipConfig + "/masterPO/totalJualBySales/" + dataUserId.value,
          {
            headers: {
              token: dataToken.value,
            },
          }
        );
        const reqThree = axios.get(
          ipConfig + "/masterToko/listTokoBaruBySalesLogin/",
          {
            headers: {
              token: dataToken.value,
            },
          }
        );
        const reqFour = axios.get(
          ipConfig + "/retur/totalReturBySales/" + dataUserId.value,
          {
            headers: {
              token: dataToken.value,
            },
          }
        );

        const dataResult = await axios.all([reqOne, reqTwo, reqThree, reqFour]);
        // console.log(dataResult, "hasil request");
        vm.orderSales = dataResult[0].data;
        // console.log(this.orderSales, "hasil order");

        vm.barangSales = dataResult[1].data.data;
        vm.barangSales.forEach((el) => {
          vm.jumlahTotalBarang += Number(el.totalBarang);
        });
        // console.log(this.barangSales, "hasil barang");

        vm.tokoSales = dataResult[2].data.data;
        // console.log(this.tokoSales, "hasil toko");

        vm.returSales = dataResult[3].data.data[0];
        // console.log(this.returSales.totalRetur, "hasil retur");

        vm.performanceSales = true;
        await this.discardLoading();
      } catch (err) {
        console.log(err, "errornya performance");
        await this.discardLoading();
      }
    },

    async runMoment() {
      this.hari = await moment().format("dddd");
      this.tanggal = await moment().format("LL");
      this.waktu = await moment().format("LT");
      console.log("moment", this.waktu);
    },

    // async nextPage() {
    //   this.$router.push("/tabs/order");
    // },

    async clockInterval() {
      this.watchInterval = await setInterval(() => {
        this.runMoment();
        console.log("clockInterval");
      }, 10000);
    },

    async doRefresh(ev) {
      await this.getProfile();
      await this.getPerformance();
      await this.runMoment();
      await this.clockInterval();
      await setInterval(() => {
        ev.target.complete();
      }, 1000);
    },

    async signout() {
      await this.presentLoading();
      await Storage.clear();
      await clearInterval(this.watchInterval);
      await this.$router.replace("/");
      await this.discardLoading();
    },
  },
});
</script>

<style></style>
