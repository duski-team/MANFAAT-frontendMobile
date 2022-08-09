<template>
  <base-layout page-title="MANFA'AT" screen-content="true">
    <template v-slot:actions-end>
      <ion-button @click="signoutAlert">
        <ion-icon slot="icon-only" :icon="exit"></ion-icon>
      </ion-button>
    </template>

    <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
      <ion-refresher-content :pulling-icon="chevronDownCircleOutline" refreshing-spinner="null"></ion-refresher-content>
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
                      <h1>{{ profileSales.username }}</h1>
                    </ion-label>

                    <ion-label class="ion-text-end ion-margin-end">
                      <h5>Wilayah</h5>
                      <h2 v-for="(elm, idx) in wilayahSales" :key="idx">{{ elm.namaWilayah }}</h2>
                    </ion-label>
                  </ion-list-header>

                  <ion-card v-if="performanceSales">
                    <ion-card-header>
                      <ion-card-title>
                        Performance Page
                      </ion-card-title>
                    </ion-card-header>

                    <ion-card-content class="ion-no-padding ion-no-margin">
                      <ion-list lines="full">
                        <ion-item>
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

                        <ion-item>
                          <ion-grid>
                            <ion-row>
                              <ion-col>
                                <ion-label>
                                  <h1>Order</h1>
                                </ion-label>
                              </ion-col>
                              <ion-col class="ion-text-end">
                                <ion-label>
                                  <h3>{{ orderSales.jumlahPO }} - PO Terbuat</h3>
                                  <h3>{{ totalHargaPOFormat }} - Total Nominal</h3>
                                </ion-label>
                              </ion-col>
                            </ion-row>
                          </ion-grid>
                        </ion-item>

                        <ion-item>
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
                                    {{ returSales }}
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
                              <ion-col size="12">
                                <ion-label>
                                  <h1>Barang</h1>
                                </ion-label>
                              </ion-col>
                              <ion-col v-if="jumlahTotalBarang">
                                <ion-item lines="none" class="ion-text-end">
                                  <ion-label>
                                    <h2>{{ jumlahTotalBarang }} - Total Barang</h2>
                                  </ion-label>
                                  <ion-button slot="end" fill="clear" v-if="dropDown" @click="dropDown = false">
                                    <ion-icon slot="icon-only" :icon="caretForwardOutline"></ion-icon>
                                  </ion-button>
                                  <ion-button slot="end" fill="clear" v-else @click="dropDown = true">
                                    <ion-icon slot="icon-only" :icon="caretDownOutline"></ion-icon>
                                  </ion-button>
                                </ion-item>
                              </ion-col>
                              <ion-col v-else>
                                <ion-item lines="none" class="ion-text-end">
                                  <ion-label>
                                    <h2>
                                      0 - Total Barang
                                    </h2>
                                  </ion-label>
                                </ion-item>
                              </ion-col>
                            </ion-row>
                          </ion-grid>
                        </ion-item>
                        <ion-grid v-if="!dropDown">
                          <ion-row>
                            <ion-col>
                              <ion-item lines="none">
                                <ion-label>
                                  <p>List Barang</p>
                                </ion-label>
                              </ion-item>
                            </ion-col>
                            <ion-col>
                              <ion-item v-for="(barangSales, index) in barangSales" :key="index" lines="none">
                                <ion-label>{{ barangSales.namaBarang }}</ion-label>
                                <ion-input readonly class="ion-text-end" v-model="barangSales.totalBarang"></ion-input>
                              </ion-item>
                            </ion-col>
                          </ion-row>
                        </ion-grid>
                        <ion-grid v-else>
                          <ion-row>
                            <ion-col>
                              <ion-item lines="none">
                                <ion-label>
                                  <p>List Barang</p>
                                </ion-label>
                              </ion-item>
                            </ion-col>
                          </ion-row>
                        </ion-grid>
                      </ion-list>
                      <ion-list>
                        <ion-grid>
                          <ion-row>
                            <ion-col>
                              <ion-item lines="none">
                                <ion-label>
                                  <h1>Penjualan</h1>
                                </ion-label>
                              </ion-item>
                            </ion-col>
                            <ion-col>
                              <ion-item lines="full" class="ion-text-end">
                                <ion-label>
                                  <h2>
                                    {{ totalHargaPOFormat }} /
                                    {{ targetPenjualanFormat }}
                                  </h2>
                                </ion-label>
                              </ion-item>
                              <ion-item lines="none" class="ion-text-end">
                                <ion-label>
                                  <h2>{{ persentaseTarget }}% dari target</h2>
                                </ion-label>
                              </ion-item>
                            </ion-col>
                          </ion-row>
                        </ion-grid>
                      </ion-list>
                    </ion-card-content>
                  </ion-card>

                  <performance-page-loader v-else />
                </ion-list>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-col>
      </ion-row>
    </ion-grid>

    <dashboard-loader v-else />
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
  IonInput,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  alertController,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import {
  exit,
  chevronDownCircleOutline,
  caretForwardOutline,
  caretDownOutline,
} from "ionicons/icons";
import { Storage } from "@capacitor/storage";
import { ipConfig } from "../config";
import accounting from "accounting-js";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";
import mixinFunct from "../mixins/mixinFunct";
import DashboardLoader from "../components/pages/dashboard/DashboardLoader.vue";
import PerformancePageLoader from "../components/pages/dashboard/PerformancePageLoader.vue";

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
    IonInput,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    DashboardLoader,
    PerformancePageLoader,
  },

  mixins: [mixinFunct],

  data() {
    return {
      dropDown: true,
      hari: "",
      tanggal: "",
      waktu: "",
      profileSales: "",
      wilayahSales: [],
      watchInterval: "",
      performanceSales: false,
      orderSales: {},
      barangSales: [],
      jumlahTotalBarang: 0,
      tokoSales: [],
      returSales: "",
      totalHargaPOFormat: "",
      targetPenjualanFormat: "",
      persentaseTarget: 0,
    };
  },

  setup() {
    const router = useRouter();
    return {
      router,
      exit,
      chevronDownCircleOutline,
      caretForwardOutline,
      caretDownOutline,
    };
  },

  async ionViewWillEnter() {
    await this.presentLoading();
    if (!this.profileSales) {
      await this.getProfile();
      await this.getPerformance();
    }
    if (!this.tanggal && !this.waktu) {
      await this.runMoment();
      // await this.clockInterval();
    }
    await this.percentageCount();
    await this.discardLoading();
  },

  methods: {
    async getProfile() {
      try {
        let vm = this;
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.get(ipConfig + "/users/profile", {
          headers: {
            token: dataToken.value,
          },
        });
        console.log(dataResult.data[0]);
        vm.profileSales = dataResult.data[0];
        vm.targetPenjualanFormat = accounting.formatMoney(
          vm.profileSales.targetPenjualan,
          {
            symbol: "Rp",
            precicsion: 2,
            thousand: ".",
            decimal: ",",
            format: {
              pos: "%s %v",
              neg: "%s (%v)",
              zero: "-",
            },
          }
        );
        // console.log(vm.profileSales.wilayah);

        if (vm.profileSales.wilayah.length > 0) {
          
          let dataWilayahId = ""
          vm.profileSales.wilayah.forEach((el, id) => {
            // console.log(el, "<<<<");
            vm.wilayahSales.push(el)
            if (id == vm.profileSales.wilayah.length - 1) {
              dataWilayahId += el.wilayahId
            }
            else {
              dataWilayahId += el.wilayahId
              dataWilayahId += ", "
            }
          });

          Storage.set({
            key: "wilayahId",
            value: dataWilayahId,
          });
        } else {
          vm.wilayahSales = "-";
        }
      } catch (err) {
        console.log(err, "errornya profile");
      }
    },
    async getPerformance() {
      try {
        let vm = this;
        const dataUserId = await Storage.get({ key: "idUser" });
        const dataToken = await Storage.get({ key: "token" });
        const getDataPerfomance = await axios.get( ipConfig + "/mobile/performanceSales/" + dataUserId.value, { headers: { token: dataToken.value } })
        // const reqOne = await axios.get(
        //   ipConfig + "/masterPO/jumlahBySales/" + dataUserId.value,
        //   {
        //     headers: {
        //       token: dataToken.value,
        //     },
        //   }
        // );
        // const reqTwo = axios.get(
        //   ipConfig + "/masterPO/totalJualBySales/" + dataUserId.value,
        //   {
        //     headers: {
        //       token: dataToken.value,
        //     },
        //   }
        // );
        // const reqThree = axios.get(
        //   ipConfig + "/masterToko/listTokoBaruBySalesLogin/",
        //   {
        //     headers: {
        //       token: dataToken.value,
        //     },
        //   }
        // );
        // const reqFour = axios.get(
        //   ipConfig + "/retur/totalReturBySales/" + dataUserId.value,
        //   {
        //     headers: {
        //       token: dataToken.value,
        //     },
        //   }
        // );
        // const dataResult = await axios.all([reqOne, reqTwo, reqThree, reqFour]);
        // console.log(getDataPerfomance);
        if (getDataPerfomance) {
          // order
          vm.orderSales.jumlahPO = getDataPerfomance.data.jumlahPO;
          vm.orderSales.totalHargaPO = getDataPerfomance.data.totalHargaPO;
          vm.totalHargaPOFormat = accounting.formatMoney(
            getDataPerfomance.data.totalHargaPO,
            {
              symbol: "Rp",
              precicsion: 2,
              thousand: ".",
              decimal: ",",
              format: {
                pos: "%s %v",
                neg: "%s (%v)",
                zero: "-",
              },
            }
          );
          // barang
          vm.barangSales = getDataPerfomance.data.totalBarang;
          vm.barangSales.forEach((el) => {
            vm.jumlahTotalBarang += Number(el.totalBarang);
          });
          //toko
          vm.tokoSales = getDataPerfomance.data.tokoBaru;
          // retur
          vm.returSales = getDataPerfomance.data.totalRetur;
          vm.performanceSales = true;
        } else {
          vm.performanceSales = false;
        }
      } catch (err) {
        console.log(err, "errornya performance");
      }
    },
    async percentageCount() {
      let vm = this;
      vm.persentaseTarget =
        (await (Number(vm.orderSales.totalHargaPO) /
          Number(vm.profileSales.targetPenjualan))).toFixed(2) * 100;
    },
    async runMoment() {
      this.hari = await moment().format("dddd");
      this.tanggal = await moment().format("LL");
      this.waktu = await moment().format("LT");
      console.log("moment", this.waktu);
    },
    
    // async clockInterval() {
    //   console.log("a");
      // this.watchInterval = await setInterval(() => {
      //   this.runMoment();
      //   console.log("clockInterval");
      // }, 10000);
    // },

    async doRefresh(ev) {
      await this.getProfile();
      await this.getPerformance();
      // await this.clockInterval();
      await setInterval(() => {
        ev.target.complete();
      }, 1000);
    },
    async signoutAlert() {
      const alert = await alertController.create({
        header: "Perhatian!",
        message: "Apakah anda yakin ingin keluar?",
        buttons: [
          {
            text: "Tidak",
            role: "cancel",
          },
          {
            text: "Iya",
            handler: () => {
              this.signout();
            },
          },
        ],
      });
      return alert.present();
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
