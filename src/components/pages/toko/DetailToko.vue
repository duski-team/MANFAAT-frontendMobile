<template>
  <base-layout
    page-title="Profile Toko"
    page-default-back-link="/tabs/toko"
    screen-content="true"
  >
    <ion-refresher
      slot="fixed"
      pull-factor="0.5"
      pull-min="100"
      pull-max="200"
      @ionRefresh="doRefresh($event)"
    >
      <ion-refresher-content
        :pulling-icon="chevronDownCircleOutline"
        refreshing-spinner="null"
      ></ion-refresher-content>
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
                  <ion-button expand="block" @click="saveToko"
                    >Simpan</ion-button
                  >
                </ion-col>
                <ion-col>
                  <ion-button expand="block" fill="outline" @click="gaJadi"
                    >Batal</ion-button
                  >
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-item>
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
  IonLabel,
  IonItem,
  IonInput,
  IonButton,
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonFabButton,
  IonIcon,
  loadingController,
  alertController,
  modalController,
} from "@ionic/vue";
import { ipConfig } from "@/config";
import { Storage } from "@capacitor/storage";
import { useRouter } from "vue-router";
import { chevronDownCircleOutline, camera } from "ionicons/icons";
import { Camera, CameraResultType } from "@capacitor/camera";
import modalFoto from "@/components/pages/dashboard/ModalPhoto.vue";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";

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
    IonFab,
    IonFabButton,
    IonIcon,
  },
  data() {
    return {
      dataToko: [],
      namaToko: "",
      alamatToko: "",
      noHpToko: "",
      noKTPToko: "",
      wilayahId: "",
      previewPhoto: "",
      sendPhoto: "",
    };
  },
  setup() {
    const router = useRouter();
    return { router, chevronDownCircleOutline, camera };
  },
  async ionViewDidEnter() {
    await this.getToko();
    await this.runMoment();
  },
  methods: {
    async getToko() {
      try {
        let vm = this;
        await vm.presentLoading();
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
        vm.wilayahId = dataResult.data[0][0].wilayahId;
        // console.log(vm.dataToko, "<<<");
        await vm.discardLoading();
      } catch (err) {
        console.log(err, "catchnya jon");
        await this.discardLoading();
      }
    },

    async saveToko() {
      try {
        let vm = this;
        await vm.presentLoading();
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

        await vm.discardLoading();
        await vm.presentAlert();
        await vm.$router.replace("/tabs/toko");
      } catch (err) {
        console.log(err, "katanya 'e' to the 'ror'");
        await this.discardLoading();
      }
    },

    async ambilFoto() {
      let vm = this;
      const cameraPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: false,
        quality: 30,
        saveToGallery: true,
        allowEditing: false,
      });
      // let x = await fetch(`${cameraPhoto.webPath}`).then((e) => {
      //   return e.blob();
      // });

      let x = await fetch(`${cameraPhoto.webPath}`)
      .then(y => y.blob())
      // .then(z => console.log(z))
      console.log(x, "aaaaaaaaaaaaaaa");

      vm.previewPhoto = cameraPhoto.webPath;
      vm.sendPhoto = x
      // console.log(JSON.stringify(vm.sendPhoto));
      // vm[nama] = cameraPhoto.webPath;
      // vm["a" + nama] = x;

      const modal = await modalController.create({
        component: modalFoto,
        componentProps: { previewPhoto: vm.previewPhoto, sendPhoto: vm.sendPhoto },
      });
      await modal.present();
    },

    async gaJadi() {
      await this.$router.push("/tabs/toko");
    },

    async runMoment() {
      this.hari = await new Date();
      this.tanggal = await moment().format("YYYY-MM-DD");
      this.waktu = await moment().format("LT");

      console.log("new Date", this.hari);
      console.log("tanggal", this.tanggal);
      console.log("waktu", this.waktu);
    },

    async doRefresh(ev) {
      // console.log(ev);
      await this.getToko();

      if (this.dataToko) {
        ev.target.complete();
      }
    },

    async presentAlert() {
      const alert = await alertController.create({
        message: "Data Toko Berhasil Diupdate",
        buttons: ["Ok"],
      });
      await alert.present();
    },

    async presentLoading() {
      const loading = await loadingController.create({
        spinner: "circles",
        message: "Mohon Tunggu...",
        translucent: true,
      });
      await loading.present();
    },

    async discardLoading() {
      await setTimeout(() => {
        loadingController.dismiss();
      }, 1000);
    },
  },
};
</script>

<style></style>
