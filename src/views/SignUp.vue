<template>
  <base-layout page-title="MANFAAT">
    <ion-grid>
      <ion-row>
        <ion-col class="ion-padding">
          <div class="signInPage">
            <h3>Silahkan Daftar</h3>
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
                <ion-label position="floating">Email</ion-label>
                <ion-input type="text" required v-model="email" />
              </ion-item>
              <ion-item>
                <ion-label position="floating">Kata Sandi</ion-label>
                <ion-input type="password" required v-model="password" />
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
          <ion-button class="lowercase" fill="clear" @click="toSignIn">Masuk</ion-button>
        </ion-col>
      </ion-row>
    </ion-grid>
  </base-layout>
</template>

<script>
import BaseLayout from "../components/base/BaseLayout.vue";
import { IonGrid, IonRow, IonCol,IonList, IonItem, IonLabel, IonInput, IonButton } from "@ionic/vue";
import { ipConfig } from "../config";
import axios from "axios";
import { Storage } from "@capacitor/storage";
import { useRouter, useRoute } from 'vue-router';

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
  },
  data() {
    return {
      username: "",
      email: "",
      password: "",
    };
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const toSignIn = () => {
      router.replace('/signin')
    }

    return { router, route, toSignIn }
  },
  methods: {
    async signin() {
      let vm = this;
      await axios
        .post(ipConfig + "/users/login", {
          username: vm.username,
          password: vm.password,
        })
        .then((res) => {
          console.log(res.data, "<<---- res data");
          if (res.data[0].token) {
            Storage.set({
              key: "token",
              value: res.data[0].token,
            }).then(() => {
              vm.$router.push("/tabs/order");
              vm.username = "";
              vm.password = "";
            });
          } else {
            console.log(res.data[0].message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
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
