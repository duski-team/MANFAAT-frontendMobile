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
                <ion-input type="password" required v-model="password">
                <!-- <ion-icon :icon="eye" slot="end"></ion-icon> -->

                </ion-input>
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
          <ion-button class="lowercase" fill="clear" @click="toSignUp"
            ><span>Buat akun</span></ion-button
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
  // IonIcon,
} from "@ionic/vue";
import { ipConfig } from "../config";
import { Storage } from "@capacitor/storage";
import { useRouter } from "vue-router";
// import { eye } from "ionicons/icons";
import axios from "axios";

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
    // IonIcon
  },
  setup() {
    const router = useRouter()
    const toSignUp = () => {
      router.replace('/signup')
    }
    return { router, toSignUp }
  },
  data() {
    return {
      username: "",
      password: "",
      // eye,
    };
  },
  methods: {
    async signin() {
      try {
        let vm = this;
        let dataSent = await axios.post(ipConfig + "/users/login", {
          username: vm.username,
          password: vm.password,
        });
        // console.log(JSON.stringify(dataSent));
        // console.log(dataSent);
        if (dataSent.data[0].token) {
          await Storage.set({
            key: "token",
            value: dataSent.data[0].token,
          })
          await Storage.set({
            key: "idUser",
            value: dataSent.data[1].id,
          });
          vm.$router.push("/tabs/order");
        } else {
          vm.note = dataSent.data.message;
        }
      } catch (err) {
        console.log(err);
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
</style>
