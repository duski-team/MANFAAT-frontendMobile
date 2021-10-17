<template>
  <base-layout page-title="Profile Toko" page-default-back-link="/tabs/toko">
    <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>

    <ion-grid>
      <ion-row>
        <ion-col class="ion-padding">
          <ion-list>
            <ion-item>
              <ion-label class="ion-text-start" position="stacked">
                Nama Toko
              </ion-label>
              <ion-input v-model="namaToko"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label class="ion-text-start" position="fixed">
                Alamat Toko
              </ion-label>
              <ion-input v-model="alamatToko"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label class="ion-text-start" position="fixed">
                Handphone
              </ion-label>
              <ion-input v-model="noHpToko"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label class="ion-text-start" position="fixed">
                KTP
              </ion-label>
              <ion-input v-model="noKTPToko"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label class="ion-text-start" position="fixed">
                Wilayah
              </ion-label>
              <ion-input v-model="wilayahId"></ion-input>
            </ion-item>
          </ion-list>
          <ion-item lines="none">
              <ion-grid>
                <ion-row>
                  <ion-col>
                    <ion-button
                      expand="block"
                      class="tombol-simpan"
                      @click="saveToko"
                      >Simpan</ion-button
                    >
                    <!-- <ion-button
                      expand="block"
                      class="tombol-simpan"
                      @click="simpanBarang(this.pilihBarang)"
                      >Simpan</ion-button
                    > -->
                  </ion-col>
                <!-- </ion-row>
              </ion-grid>
              <ion-grid>
                <ion-row> -->
                  <ion-col>
                    <ion-button
                      expand="block"
                      fill="outline"
                      href="/tabs/toko"
                      >Batal</ion-button
                    >
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-item>
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
  IonLabel,
  IonItem,
  IonInput,
  IonButton,
  IonRefresher,
  IonRefresherContent,
  loadingController,
  alertController,
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
    IonLabel,
    IonItem,
    IonInput,
    IonButton,
    IonRefresher,
    IonRefresherContent,
  },
  data() {
    return {
      dataToko: [],
      namaToko: "",
      alamatToko: "",
      noHpToko: "",
      noKTPToko: "",
      wilayahId: "",
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  async ionViewDidEnter() {
    await this.getToko();
  },
  methods: {
    async getToko() {
      try {
        const loading = await loadingController.create({
          spinner: "circles",
          message: "Loading...",
          translucent: true,
        });
        await loading.present();

        let vm = this;
        const idToko = await Storage.get({ key: "tokoId" });
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.get(
          ipConfig + "/masterToko/listById/" + idToko.value,
          {
            headers: {
              token: dataToken.value,
            },
          }
        );
        // console.log("resultnya", JSON.stringify(dataResult))  ;
        vm.namaToko = dataResult.data[0][0].namaToko;
        vm.alamatToko = dataResult.data[0][0].alamatToko;
        vm.noHpToko = dataResult.data[0][0].noHpToko;
        vm.noKTPToko = dataResult.data[0][0].noKTPToko;
        vm.wilayahId = dataResult.data[0][0].wilayahId
        // console.log(vm.dataToko, "<<<");
        await loadingController.dismiss();
      } catch (err) {
        console.log(err, "catchnya jon");
      }
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
        // namaToko, alamatToko, noHpToko, noKTPToko, wilayahId
        const idToko = await Storage.get({ key: "tokoId" });
        // const idUser = await Storage.get({ key: "idUser" });
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.post(
          ipConfig + "/masterToko/update/" + idToko.value,
          {
            namaToko: vm.namaToko,
            alamatToko: vm.alamatToko,
            noHpToko: vm.noHpToko,
            noKTPToko: vm.noKTPToko,
            wilayahId: vm.wilayahId,
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

        await loading.dismiss();
        const alert = await alertController.create({
          message: "Data Toko Berhasil Diupdate",
          buttons: ["Ok"],
        });
        await alert.present();

        await this.$router.replace("/tabs/toko");
      } catch (err) {
        console.log(err, "katanya 'e' to the 'ror'");
        await loadingController.dismiss()
      }
    },
    async doRefresh(ev) {
      // console.log(ev);
      await this.getToko();

      if (this.dataToko) {
        ev.target.complete();
      }
    },
  },
};
</script>

<style></style>
