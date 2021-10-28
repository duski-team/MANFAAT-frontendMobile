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
                  <ion-button expand="block" @click="kirimAbsen"
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
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { defineComponent } from "vue";
import { Storage } from "@capacitor/storage";
import { ipConfig } from "@/config";
import axios from "axios";

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

  created() {
    console.log("ini photo", this.previewPhoto.src);
    // console.log("ini kirim", JSON.stringify(this.sendPhoto));
  },

  setup() {
    const router = useRouter();
    return { router };
  },

  methods: {
    async kirimAbsen() {
      console.log("kirim");
      let vm = this;
      const idToko = await Storage.get({ key: "tokoId" });
      const dataToken = await Storage.get({ key: "token" });
      const formData = new FormData();
    //   console.log("ini sendPhoto",JSON.stringify(vm.sendPhoto));
      formData.append("foto1", vm.sendPhoto);
      formData.append("tanggalAbsensi", vm.tanggal);
      formData.append("masterTokoId", idToko.value);

      const dataResult = await axios.post(
        ipConfig + "/absensiSales/register",
        formData,
        {
          headers: {
            token: dataToken.value,
            "Content-Type": "multipart/form-data"
          },
        }
      );
      console.log(dataResult);
    },

    async batalAbsen() {
      await modalController.dismiss();
      console.log("batal");
    },
  },
});
</script>

<style></style>
