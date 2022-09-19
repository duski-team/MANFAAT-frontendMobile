<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="dashboard" href="/tabs/dashboard">
          <ion-icon :icon="home" />
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="order" href="/tabs/order">
          <ion-icon :icon="document" />
          <ion-label>Purchase</ion-label>
        </ion-tab-button>
          
        <ion-tab-button tab="retur" href="/tabs/retur">
          <ion-icon :icon="backspace" />
          <ion-label>Retur</ion-label>
        </ion-tab-button>
        
        <ion-tab-button tab="toko" href="/tabs/toko">
          <ion-icon :icon="storefront" />
          <ion-label>Store</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script>
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { home, document, storefront, backspace } from 'ionicons/icons';

export default {
  name: 'Tabs',
  components: { IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonRouterOutlet },
  setup() {
    return {
      home,
      document,
      storefront, 
      backspace
    }
  }
}
</script>