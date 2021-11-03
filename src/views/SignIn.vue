<template>
  <base-layout page-title="MANFAAT">
    <ion-grid>
      <ion-row>
        <ion-col class="ion-padding">
          <div class="signInPage">
            <h3>Silahkan Masuk</h3>
          </div>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col class="ion-padding">
          <form>
            <ion-list>
              <ion-item>
                <ion-label position="floating">Nama Pengguna</ion-label>
                <ion-input type="text" required v-model="username" />
              </ion-item>
              <ion-item>
                <ion-label position="floating">Kata Sandi</ion-label>
                <ion-input
                  v-if="viewClicked == false"
                  type="password"
                  required
                  v-model="password"
                ></ion-input>
                <ion-input
                  v-else
                  type="text"
                  required
                  v-model="password"
                ></ion-input>
              </ion-item>
              <ion-item lines="none" class="ion-item-end">
                <ion-label>Lihat Sandi</ion-label>
                <ion-checkbox
                  class="ion-no-margin ion-margin-end"
                  slot="start"
                  @click="viewPassword($event)"
                ></ion-checkbox>
              </ion-item>
            </ion-list>
          </form>
          <ion-button
            v-if="username && password"
            expand="block"
            @click="signin"
          >
            Submit
          </ion-button>
          <ion-button v-else expand="block" disabled>Submit</ion-button>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col class="ion-padding">
          <ion-button class="lowercase" fill="clear" @click="toSignUp" disabled
            ><span>Buat Akun</span></ion-button
          >
        </ion-col>
      </ion-row>
    </ion-grid>
  </base-layout>
</template>

<script>
import BaseLayout from "../components/base/BaseLayout.vue";
import {
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCheckbox,
  alertController,
} from "@ionic/vue";
import { ipConfig } from "../config";
import { Storage } from "@capacitor/storage";
import { useRouter } from "vue-router";
import { eye } from "ionicons/icons";
import axios from "axios";
import Mixins from "../mixins/mixinFunct";

export default {
  components: {
    BaseLayout,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonCheckbox,
  },

  mixins: [Mixins],

  setup() {
    const router = useRouter();
    const toSignUp = () => {
      router.replace("/signup");
    };
    return { router, toSignUp };
  },

  data() {
    return {
      username: "",
      password: "",
      note: "",
      viewClicked: false,
      eye,
    };
  },

  methods: {
    async signin() {
      try {
        let vm = this;
        await vm.presentLoading();
        let dataSent = await axios.post(ipConfig + "/users/login", {
          username: vm.username,
          password: vm.password,
        });
        if (dataSent.data.message) {
          vm.note = dataSent.data.message;
          await vm.discardLoading();
          await vm.presentAlert();
        } else {
          await Storage.set({
            key: "token",
            value: dataSent.data[0].token,
          });
          await Storage.set({
            key: "idUser",
            value: dataSent.data[1].id + "",
          });
          await Storage.set({
            key: "roleUser",
            value: dataSent.data[2].role,
          });
          vm.$router.push("/tabs/dashboard");
          vm.username = "";
          vm.password = "";
          await vm.discardLoading();
        }
      } catch (err) {
        console.log("errorHandler", err);
        this.note = "Gangguan Jaringan";
        await this.discardLoading();
        await this.presentAlert();
      }
    },
    async presentAlert() {
      const alert = await alertController.create({
        message: this.note,
        buttons: ["Tutup"],
      });
      await alert.present();
    },
    async viewPassword(p) {
      if (p.target.checked == false) {
        this.viewClicked = true;
      } else {
        this.viewClicked = false;
      }
    },
  },
};
</script>

<style>
.signInPage {
  display: flex;
  align-items: center;
  justify-content: center;
}
.lowercase {
  text-transform: none;
}

ion-checkbox {
  --border-color: primary;
}
</style>
