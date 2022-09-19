<template>
  <base-layout
    page-title="Profile Toko"
    page-default-back-link="/tabs/toko"
    screen-content="true"
  >
    <template v-slot:actions-end>
      <!-- <ion-button router-link="/tabs/toko/tambah/"> -->
      <ion-button @click="saveToko">
        <ion-icon slot="icon-only" :icon="save"></ion-icon>
      </ion-button>
    </template>

    <ion-refresher
      slot="fixed"
      pull-factor="0.5"
      pull-min="100"
      pull-max="300"
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
            <ion-item class="imageContainer" v-if="fotoToko" lines="none">
              <!-- <ion-thumbnail> -->
                <ion-img class="marginContainer" :src="fotoToko"></ion-img>
              <!-- </ion-thumbnail> -->
              <!-- <span>{{ fotoToko }}</span> -->
            </ion-item>
            <ion-item v-else lines="none">
              <ion-thumbnail class="ion-text-center">
                <ion-icon size="large" :icon="person"></ion-icon>
              </ion-thumbnail>
            </ion-item>
            <ion-item>
              <ion-label class="ion-text-start" position="fixed">
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
              <ion-input v-model="namaWilayah"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label class="ion-text-start" position="fixed">
                Longitude
              </ion-label>
              <ion-input disabled v-model="long"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label class="ion-text-start" position="fixed">
                Latitude
              </ion-label>
              <ion-input disabled v-model="lat"></ion-input>
            </ion-item>
          </ion-list>

          <ion-list>
            <ion-card>
              <!-- <ion-card-header>
               <ion-card-subtitle>List Harga Barang</ion-card-subtitle>
              </ion-card-header> -->
              <!-- <ion-card-content> -->
              <ion-item lines="none">
                <ion-label>
                  <h5>List Harga Barang</h5>
                </ion-label>
              </ion-item>
              <ion-item v-for="(el, id) in hargaToko" :key="id" detail @click="editHargaBarang(el)">
                <ion-label>
                  <h2>{{ el.namaBarang }}</h2>
                  <p>Harga 1: {{ el.harga }} (0 - 10)</p>
                  <p>Harga 2: {{ el.harga2 }} (11 - 99)</p>
                  <p>Harga 3: {{ el.harga3 }} (> 99)</p>
                </ion-label>
                <!-- <ion-label class="ion-text-start">{{ el.namaBarang }}</ion-label>
                <ion-input class="ion-text-end" v-model="el.harga"></ion-input>
                <ion-input class="ion-text-end" v-model="el.harga2"></ion-input>
                <ion-input class="ion-text-end" v-model="el.harga3"></ion-input> -->
              </ion-item>
              <!-- </ion-card-content> -->
            </ion-card>
          </ion-list>
          <!-- <ion-item lines="none">
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
          </ion-item> -->
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
  IonCard,
  // IonCardHeader,
  // IonCardSubtitle,
  // IonCardContent,
  IonInput,
  IonImg,
  IonButton,
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonThumbnail,
  alertController,
  modalController,
} from "@ionic/vue";
import { ipConfig } from "@/config";
import { Storage } from "@capacitor/storage";
import { useRouter } from "vue-router";
import { chevronDownCircleOutline, camera, person, save } from "ionicons/icons";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import modalHargaBarang from "@/components/pages/toko/ModalHargaBarang.vue";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";
import mixinFunct from "../../../mixins/mixinFunct";

export default {
  components: {
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonLabel,
    IonItem,
    IonCard,
    // IonCardContent,
    // IonCardHeader,
    // IonCardSubtitle,
    IonInput,
    IonImg,
    IonButton,
    IonRefresher,
    IonRefresherContent,
    IonFab,
    IonFabButton,
    IonIcon,
    IonThumbnail,
  },
  mixins: [mixinFunct],
  data() {
    return {
      hargaToko: [],
      namaToko: "",
      fotoToko: "",
      alamatToko: "",
      noHpToko: "",
      noKTPToko: "",
      namaWilayah: "",
      wilayahId: "",
      long: "",
      lat: "",
      previewPhoto: "",
      sendPhoto: "",
      note: "",
    };
  },
  setup() {
    const router = useRouter();
    return { router, chevronDownCircleOutline, camera, person, save };
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
        console.log("resultnya", dataResult)  ;
        let x = dataResult.data
        // console.log("resultnya", JSON.stringify(dataResult))  ;
        vm.namaToko = x[0][0].namaToko;
        vm.alamatToko = x[0][0].alamatToko;
        vm.noHpToko = x[0][0].noHpToko;
        vm.noKTPToko = x[0][0].noKTPToko;
        vm.namaWilayah = x[0][0].namaWilayah;
        vm.wilayahId = x[0][0].wilayahId;
        vm.long = x[0][0].long;
        vm.lat = x[0][0].lat;
        vm.fotoToko = x[0][0].fotoToko ? `${ipConfig}/${x[0][0].fotoToko}` : null;
        vm.hargaToko = x[1];
        console.log(vm.hargaToko, "<<<");
        await vm.discardLoading();
      } catch (err) {
        console.log(err, "catchnya jon");
        await this.discardLoading();
      }
    },

    async saveToko() {
      let vm = this;
      const idToko = await Storage.get({ key: "tokoId" });
      const dataToken = await Storage.get({ key: "token" });
      const formData = new FormData()

      formData.append("file1", vm.sendPhoto);
      formData.append("namaToko", vm.namaToko);
      formData.append("alamatToko", vm.alamatToko);
      formData.append("noHpToko", vm.noHpToko);
      formData.append("noKTPToko", vm.noKTPToko);
      formData.append("wilayahId", vm.wilayahId);

      try {
        await vm.presentLoading();
        // namaToko, alamatToko, noHpToko, noKTPToko, wilayahId
        // const idUser = await Storage.get({ key: "idUser" });
        const dataResult = await axios.post(
          ipConfig + "/mobile/updateToko/" + idToko.value,
          formData,
          {
            headers: {
              token: dataToken.value,
            },
          }
        );
        console.log(dataResult);
        if (dataResult.status == 200) {
          vm.note = "Toko Berhasil di Update";
        }
        // vm.note.toLowerCase().replace(/\w/, firstLetter => firstLetter.toUpperCase());
        console.log(vm.note);

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
        source: CameraSource.Camera,
        quality: 30,
        saveToGallery: true,
        allowEditing: false,
      });
      let x = await fetch(`${cameraPhoto.webPath}`).then((y) => y.blob());
      console.log(x);

      vm.previewPhoto = cameraPhoto.webPath;
      vm.sendPhoto = x;
      vm.fotoToko = vm.previewPhoto
      // const modal = await modalController.create({
      //   component: modalFotoToko,
      //   componentProps: {
      //     previewPhoto: vm.previewPhoto,
      //     sendPhoto: vm.sendPhoto,
      //   },
      // });
      // await modal.present();
    },

    async editHargaBarang(barangs) {
      console.log("barangs", barangs);
      const modal = await modalController.create({
        component: modalHargaBarang,
        componentProps: {
          barangs
        },
      });
      await modal.present();
    },

    async gaJadi() {
      await this.$router.push("/tabs/toko");
    },

    async runMoment() {
      this.tanggal = await moment().format("YYYY-MM-DD");
      this.waktu = await moment().format("LT");
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
        message: this.note,
        buttons: ["Ok"],
      });
      await alert.present();
    },
  },
};
</script>

<style>
.imageContainer {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.marginContainer {
  margin: auto;
}
</style>
