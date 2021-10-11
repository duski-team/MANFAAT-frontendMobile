<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="order" href="/tabs/order">
          <ion-icon :icon="document" />
          <ion-label>Purchase Order</ion-label>
        </ion-tab-button>
          
        <ion-tab-button tab="retur" href="/tabs/retur">
          <ion-icon :icon="menu" />
          <ion-label>Retur Order</ion-label>
        </ion-tab-button>
        
        <ion-tab-button tab="toko" href="/tabs/toko">
          <ion-icon :icon="storefront" />
          <ion-label>Daftar Toko</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script>
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { document, menu, storefront } from 'ionicons/icons';

export default {
  name: 'Tabs',
  components: { IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonRouterOutlet },
  setup() {
    return {
      document,
      menu, 
      storefront, 
    }
  }
}
</script>