<template>
  <base-layout page-title="Tambah Toko" page-default-back-link="/tabs/toko">
    <template v-slot:actions-end>
      <ion-button
        v-if="pilihWilayah && namaToko && alamatToko"
        @click="saveToko"
      >
        <ion-icon slot="icon-only" :icon="save"></ion-icon>
      </ion-button>
      <ion-button v-else disabled>
        <ion-icon slot="icon-only" :icon="save"></ion-icon>
      </ion-button>
    </template>

    <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>

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
                v-model="pilihWilayah.id"
              >
                <ion-select-option :value="listWilayah.id">
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
  IonRefresher,
  IonRefresherContent,
  toastController,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { Storage } from "@capacitor/storage";
import { ipConfig } from "@/config";
import { useRouter } from "vue-router";
import { save } from "ionicons/icons";
import axios from "axios";
import mixinFunct from "../../../mixins/mixinFunct";

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
    IonRefresher,
    IonRefresherContent,
  },

  mixins: [mixinFunct],

  data() {
    return {
      save,
      listWilayah: [],
      pilihWilayah: {},
      namaToko: "",
      alamatToko: "",
      noHpToko: "",
      noKTPToko: "",
      note: "",
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
    async getWilayah() {
      try {
        let vm = this;
        await vm.presentLoading();

        const dataWilayah = await Storage.get({ key: "namaWilayah" })
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.get(ipConfig + "/wilayah/list", {
          headers: {
            token: dataToken.value,
          },
        });
        dataResult.data.forEach(el => {
          if (el.namaWilayah == dataWilayah.value) {
            console.log(el);
            vm.listWilayah = el
          }
        })
        // vm.listWilayah = dataResult.data.sort((a, b) =>
        //   a.id > b.id ? 1 : b.id > a.id ? -1 : 0
        // );
        await vm.discardLoading();
      } catch (err) {
        console.log(err);
        await this.discardLoading();
      }
    },
    async saveToko() {
      try {
        let vm = this;
        await vm.presentLoading();
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
        let responseData = dataResult.data;
        if (responseData.message == "sukses") {
          vm.note = "Toko Berhasil Ditambahkan";
          await vm.discardLoading();
          await vm.presentToast();
          await this.$router.push("/tabs/toko");
        } else {
          await vm.discardLoading();
          vm.note = await responseData.message;
          await vm.presentToast();
        }
        await toastController.dismiss();
      } catch (err) {
        console.log(err);
      }
    },
    async doRefresh(ev) {
      await this.getWilayah();

      if (this.listWilayah) {
        ev.target.complete();
      }
    },
    async presentToast() {
      const toast = await toastController.create({
        message: this.note,
        durations: 2500,
        position: "top",
      });
      return await toast.present();
    },
  },
});
</script>

<style></style>
