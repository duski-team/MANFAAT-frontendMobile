<template>
  <!-- <base-layout> -->
  <ion-grid>
    <ion-row>
      <ion-col>
        <ion-list lines="none">
          <ion-item>
            <ion-label>
              <h1>Absen Toko</h1>
            </ion-label>
          </ion-item>
          <ion-item>
            <!-- <ion-button>
              <ion-icon slot="icon-only" :icon="trash"></ion-icon>
              </ion-button> -->
            <ion-img :src="previewPhoto" />
          </ion-item>
          <ion-item>
            <ion-grid>
              <ion-row>
                <ion-col>
                  <ion-button expand="block" @click="modalPhotoAlert"
                    >Kirim</ion-button
                  >
                </ion-col>
                <ion-col>
                  <ion-button expand="block" fill="outline" @click="batalAbsen"
                    >Batal</ion-button
                  >
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-item>
        </ion-list>
      </ion-col>
    </ion-row>
  </ion-grid>
  <!-- </base-layout> -->
</template>

<script>
import {
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  modalController,
  alertController,
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { defineComponent } from "vue";
import { Storage } from "@capacitor/storage";
import { ipConfig } from "@/config";
import Mixins from "@/mixins/mixinFunct";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";

export default defineComponent({
  components: {
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
  },

  props: ["previewPhoto", "sendPhoto"],
  mixins: [Mixins],

  data() {
    return {
      note: "",
    };
  },

  setup() {
    // 2021-10-29T00:00:00+00:00
    const tanggal = moment().format("YYYY-MM-DD") + "T00:00:00+00:00";
    const router = useRouter();
    return { tanggal, router };
  },

  methods: {
    async kirimAbsen() {
      let vm = this;
      const idToko = await Storage.get({ key: "tokoId" });
      const dataToken = await Storage.get({ key: "token" });
      const formData = new FormData();

      formData.append("file1", vm.sendPhoto);
      formData.append("tanggalAbsensi", vm.tanggal);
      formData.append("masterTokoId", idToko.value);

      try {
        await vm.presentLoading();
        const dataResult = await axios.post(
          ipConfig + "/absensiSales/register",
          formData,
          {
            headers: {
              token: dataToken.value,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(JSON.stringify(dataResult.data, "<<<<"));
        // vm.note = dataResult.data.message
        if (dataResult.data) {
          //   await vm.presentAlert();
          await vm.discardLoading();
          await modalController.dismiss();
        }
      } catch (err) {
        console.log(err);
        // await this.presentAlert();
        await this.discardLoading();
        await modalController.dismiss();
      }
    },

    async batalAbsen() {
      await modalController.dismiss();
      console.log("batal");
    },

    async modalPhotoAlert() {
      const alert = await alertController.create({
        header: "Perhatian!",
        message: "Absen Toko?",
        buttons: [{
            text: "Tidak",
            role: "cancel",
          },
          {
            text: "Iya",
            handler: () => {
              this.kirimAbsen();
            },
          }],
      });
       return await alert.present();
    },
  },
});
</script>

<style></style>
