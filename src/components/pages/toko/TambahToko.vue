<template>
  <base-layout page-title="Tambah Toko" page-default-back-link="/tabs/toko">
    <template v-slot:actions-end>
      <ion-button v-if="daftarToko.wilayahId && daftarToko.namaToko && daftarToko.alamatToko" @click="saveToko">
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
          <ion-item class="imageContainer" v-if="daftarToko.fotoToko" lines="none">
                <ion-img :src="daftarToko.fotoToko"></ion-img>
            </ion-item>
            <ion-item v-else lines="none">
              <ion-thumbnail>
                <ion-icon size="large" :icon="person"></ion-icon>
              </ion-thumbnail>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Nama Toko</ion-label>
              <ion-input v-model="daftarToko.namaToko" placeholder="Silahkan Isi Nama Toko" required></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Alamat Toko</ion-label>
              <ion-input v-model="daftarToko.alamatToko" placeholder="Silahkan Isi Alamat Toko" required></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">No. Handphone</ion-label>
              <ion-input
                v-model="daftarToko.noHpToko"
                placeholder="Silahkan Isi No. Handphone"
                type="number"
              ></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Pemilik Toko</ion-label>
              <ion-input v-model="daftarToko.namaPemilikToko" placeholder="Silahkan Isi Nama Pemilik"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">No. KTP</ion-label>
              <ion-input v-model="daftarToko.noKTPToko" placeholder="Silahkan Isi No. KTP" type="number"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Wilayah</ion-label>
              <ion-select placeholder="Pilih Wilayah" interface="action-sheet" v-model="daftarToko.wilayahId">
                <ion-select-option v-for="elm in listWilayah" :key="elm.id" :value="elm.id">
                  {{ elm.namaWilayah }}
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
  IonFab,
  IonFabButton,
  IonImg,
  IonThumbnail,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { Storage } from "@capacitor/storage";
import { ipConfig } from "@/config";
import { useRouter } from "vue-router";
import { camera, save, person } from "ionicons/icons";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Geolocation } from "@capacitor/geolocation";
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
    IonFab,
    IonFabButton,
    IonImg,
    IonThumbnail,
  },
  mixins: [mixinFunct],
  data() {
    return {
      listWilayah: [],
      pilihWilayah: {},
      daftarToko: {
        namaToko: "",
        alamatToko: "",
        noHpToko: "",
        noKTPToko: "",
        wilayahId: "",
      },
      note: "",
      fotoToko: "",
      previewPhoto: "",
      sendPhoto: "",
      long: "",
      lat: ""
    };
  },

  setup() {
    const router = { useRouter };
    return { router, camera, save, person };
  },

  async ionViewWillEnter() {
    await this.getWilayah();
  },

  methods: {
    async ambilFoto() {
      let vm = this;

      try {
        const cameraPhoto = await Camera.getPhoto({
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera,
          quality: 30,
          saveToGallery: true,
          allowEditing: false,
        });
        let x = await fetch(`${cameraPhoto.webPath}`).then((y) => y.blob());
        await this.getCurrentPosition()
        console.log(x);

        vm.previewPhoto = cameraPhoto.webPath;
        vm.sendPhoto = x;
        vm.daftarToko.fotoToko = vm.previewPhoto;
      } catch (err) {
        console.log("cancelled");
      }
    },
    async getCurrentPosition() {
      let _vm = this
      try {
        const coordinates = await Geolocation.getCurrentPosition();
        console.log("Current", coordinates);
        console.log("Long", coordinates.coords.longitude);
        console.log("Lat", coordinates.coords.latitude);

        _vm.long = coordinates.coords.longitude
        _vm.lat = coordinates.coords.latitude

        console.log("Long", _vm.long);
        console.log("Lat", _vm.lat);
      } catch (err) {
        console.log("getCurrentPosition", err);
      }
    },
    async getWilayah() {
      try {
        let vm = this;
        await vm.presentLoading();
        const dataToken = await Storage.get({ key: "token" });
        const idUser = await Storage.get({ key: "idUser" });
        // console.log(idUser.value);
        const dataResult = await axios.get(ipConfig + "/poolWilayah/listBySalesId/" + `${idUser.value}`, {
          headers: {
            token: dataToken.value,
          },
        });
        // console.log(wilayah);
        console.log(dataResult.data.data[0], "<<<<<");
        let dataWilayah = dataResult.data.data[0];
        dataWilayah.forEach((el) => {
          vm.listWilayah.push(el);
        });
        console.log(vm.listWilayah);
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
      let vm = this;
      const dataToken = await Storage.get({ key: "token" });
      const formData = new FormData()

      formData.append("file1", vm.sendPhoto);
      formData.append("namaToko", vm.daftarToko.namaToko);
      formData.append("alamatToko", vm.daftarToko.alamatToko);
      formData.append("noHpToko", vm.daftarToko.noHpToko);
      formData.append("noKTPToko", vm.daftarToko.noKTPToko);
      formData.append("wilayahId", vm.daftarToko.wilayahId);
      formData.append("namaPemilikToko", vm.daftarToko.namaPemilikToko);
      // formData.append("salesId", vm.daftarToko.salesId);
      formData.append("long", vm.long);
      formData.append("lat", vm.lat);

      console.log(formData);

      try {
        await vm.presentLoading();
        const dataResult = await axios.post(
          ipConfig + "/masterToko/register", formData,
          {
            headers: {
              token: dataToken.value,
            },
          },
        );
        let responseData = dataResult.data;
        if (responseData.message == "sukses") {
          vm.daftarToko = {};
          vm.listWilayah = [];
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
