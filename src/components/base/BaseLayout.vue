<template>
  <ion-page>
    <ion-header :translucent="translucentBase">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            :default-href="pageDefaultBackLink"
          ></ion-back-button>
        </ion-buttons>
        <ion-title>{{ pageTitle }}</ion-title>
        <ion-buttons slot="end">
          <slot name="actions-end"></slot>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="screenContent">
      <slot />
    </ion-content>
    <ion-buttons>
      <slot name="button-float"></slot>
    </ion-buttons>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonContent,
  IonBackButton,
  IonButtons,
  // IonFab,
  // IonFabButton,
  // IonIcon,
} from "@ionic/vue";

export default {
  props: ["translucentBase", "pageTitle", "pageDefaultBackLink", "screenContent"],
  components: {
    IonPage,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonContent,
    IonBackButton,
    IonButtons,
    // IonFab,
    // IonFabButton,
    // IonIcon,
  },
};
</script>

<style></style>
