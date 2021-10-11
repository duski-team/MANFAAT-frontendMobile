<template>
  <base-layout page-title="Tambah Toko" page-default-back-link="/tabs/toko">
    <template v-slot:actions-end>
      <ion-button>
        <ion-icon slot="icon-only" :icon="save"></ion-icon>
      </ion-button>
      <!-- <ion-button v-else disabled>
        <ion-icon slot="icon-only" :icon="save"></ion-icon>
      </ion-button> -->
    </template>
    <ion-grid v-if="listWilayah">
      <ion-row>
        <ion-col>
          <ion-list>
            <ion-item>
              <ion-label position="floating">Nama Toko</ion-label>
              <ion-input
                v-model="namaToko"
                placeholder="Silahkan Isi Nama Toko"
                required
              ></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Alamat Toko</ion-label>
              <ion-input
                v-model="alamatToko"
                placeholder="Silahkan Isi Alamat Toko"
                required
              ></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">No. Handphone</ion-label>
              <ion-input
                v-model="noHpToko"
                placeholder="Silahkan Isi No. Handphone"
                type="number"
              ></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">No. KTP</ion-label>
              <ion-input
                v-model="noKTPToko"
                placeholder="Silahkan Isi No. KTP"
                type="number"
              ></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Wilayah</ion-label>
              <ion-select
                placeholder="Pilih Wilayah"
                interface="action-sheet"
                v-model="pilihWilayah.namaWilayah"
                @ionChange="pilih"
              >
                <ion-select-option
                  v-for="(listWilayah, index) in listWilayah"
                  :key="index"
                  :value="listWilayah.namaWilayah"
                >
                  {{ listWilayah.namaWilayah }}
                </ion-select-option>
              </ion-select>
            </ion-item>
          </ion-list>
        </ion-col>
      </ion-row>
    </ion-grid>

    <ion-grid v-else>
      <ion-row>
        <ion-col>
          <h2>Loading...</h2>
        </ion-col>
      </ion-row>
    </ion-grid>
  </base-layout>
</template>

<script>
import {
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  loadingController,
  toastController,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { Storage } from "@capacitor/storage";
import { ipConfig } from "@/config";
import { useRouter } from "vue-router";
import { save } from "ionicons/icons";
import axios from "axios";

export default defineComponent({
  components: {
    IonButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
  },
  data() {
    return {
      save,
      listWilayah: [],
      pilihWilayah: {},
      namaToko: "",
      alamatToko: "",
      noHpToko: "",
      noKTPToko: "",
    };
  },
  setup() {
    const router = { useRouter };
    return { router };
  },
  async ionViewWillEnter() {
    await this.getWilayah();
  },
  methods: {
    async createRetur() {
      // noPO, jumlahRetur, bulk
      // masterReturId (backend)
      // bulk = jumlahBarangRetur, hargaBarangRetur, totalHargaRetur, kualitasRetur, masterBarangId
      console.log("ini create retur");
    },
    async getWilayah() {
      try {
        const loading = await loadingController.create({
          spinner: "circles",
          message: "Mohon Tunggu...",
          translucent: true,
        });
        await loading.present();
        let vm = this;
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.get(ipConfig + "/wilayah/list", {
          headers: {
            token: dataToken.value,
          },
        });
        console.log(dataResult.data);
        vm.listWilayah = dataResult.data.sort((a, b) =>
          a.id > b.id ? 1 : b.id > a.id ? -1 : 0
        );
        await loading.dismiss();
      } catch (err) {
        console.log(err);
      }
    },
    pilih() {
      console.log(this.pilihWilayah);
    },
    async saveToko() {
      try {
        const loading = await loadingController.create({
          spinner: "circles",
          message: "Loading...",
          translucent: true,
        });
        await loading.present();

        let vm = this;
        vm.listWilayah.forEach((el) => {
          if (vm.pilihWilayah.namaWilayah == el.namaWilayah) {
            vm.pilihWilayah.id = el.id;
          }
        });
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.post(
          ipConfig + "/masterToko/register",
          {
            namaToko: vm.namaToko,
            alamatToko: vm.alamatToko,
            noHpToko: vm.noHpToko,
            noKTPToko: vm.noKTPToko,
            wilayahId: vm.pilihWilayah.id,
          },
          {
            headers: {
              token: dataToken.value,
            },
          }
        );
        console.log(dataResult.data);

        await loading.dismiss()
        let responseData = dataResult.data
        const toast = await toastController.create({
          message: "Toko berhasil ditambahkan",
          durations: 2000
        })
        if (responseData.message == "sukses") {
          await loading.dismiss()
          await toast.present()
          await this.$router.push("/tabs/toko");
        }
        else {
          await loading.dismiss()
          toast.message = await responseData.message
          toast.durations = 5000
          await toast.present()
          // await this.$router.push("/tabs/toko");
        }
        await toast.dismiss()
      } catch (err) {
        console.log(err);
      }
    },
  },
});
</script>

<style></style>
