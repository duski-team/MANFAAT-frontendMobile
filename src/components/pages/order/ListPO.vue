<template>
  <ion-grid>
    <ion-row>
      <ion-col size="12">
        <ion-list>
          <h2>asd</h2>
          <ion-item
            v-for="(listPO, index) in listPO"
            :key="index"
            lines="full"
            @click="openlistPO(listPO.noPO)"
            detail
          >
            <ion-label>
              <h2>PO: {{ listPO.noPO }}</h2>
              <h3>{{ listPO.namaToko }}</h3>
              <p>{{ listPO.tanggalPesan }}</p>
            </ion-label>
          </ion-item>
        </ion-list>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script>
import {
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { Storage } from "@capacitor/storage";
import { ipConfig } from "@/config";
import axios from "axios";
import mixinFunct from "../../../mixins/mixinFunct";

export default defineComponent({
  components: {
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonItem,
    IonLabel,
  },

  props: ["segmentProps"],
  mixins: [mixinFunct],

  data() {
    return {
      listPO: [],
    };
  },
  async ionViewWillEnter() {
    await this.dataPO();
    console.log(this.segmentProps);
  },

  watch: {
    segmentProps: function(val) {
      console.log(val);
      if (val == 2) {
        this.dataPO();
      }
    },
  },
  methods: {
    async dataPO() {
      try {
        let vm = this;
        await vm.presentLoading();
        const dataToken = await Storage.get({ key: "token" });
        const dataResult = await axios.get(
          ipConfig + "/masterPO/listByUserLogin",
          {
            headers: {
              token: dataToken.value,
            },
          }
        );
        console.log(dataResult.data, ">>>");
        vm.listPO = await dataResult.data;
        // console.log(this.listPO, "listPO");
        await vm.discardLoading();
      } catch (err) {
        console.log(err, "errornya dataPO");
        await this.discardLoading();
      }
    },
  },
});
</script>

<style></style>
