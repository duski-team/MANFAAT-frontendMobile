<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>
        Performance Page
      </ion-card-title>
    </ion-card-header>

    <ion-card-content class="ion-no-padding ion-no-margin">
      <ion-item lines="none">
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-label>
                <h1>Toko</h1>
              </ion-label>
            </ion-col>
            <ion-col>
              <ion-label class="ion-text-end" readonly>
                <p>0 - Toko Terdaftar</p>
              </ion-label>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-item>

      <ion-item lines="none">
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-label>
                <h1>Penjualan</h1>
              </ion-label>
            </ion-col>
            <ion-col class="ion-text-end">
              <ion-label>
                <p>0 - PO Terbuat</p>
                <p>
                  Rp.... - Total Nominal
                </p>
              </ion-label>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-item>

      <ion-item lines="none">
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-label>
                <h1>Retur</h1>
              </ion-label>
            </ion-col>
            <ion-col class="ion-text-end">
              <ion-label>
                <p>
                  0 - Retur Terbuat
                </p>
              </ion-label>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-item>

      <ion-item lines="none">
        <ion-grid>
          <ion-row>
            <ion-col size="4">
              <ion-label>
                <h1>Barang</h1>
              </ion-label>
            </ion-col>
            <ion-col size="8">
              <ion-item lines="none" class="ion-text-end">
                <ion-label>
                  <p>
                    0 - Total Barang
                  </p>
                </ion-label>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-item lines="none">
                <ion-label class="ion-text-end">
                  <p>
                    Nama Barang - Jumlah Barang
                  </p>
                </ion-label>
              </ion-item>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-item>
    </ion-card-content>
  </ion-card>
</template>

<script>
import {
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from "@ionic/vue";
export default {
  components: {
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
  },
};
</script>

<style></style>
