import { loadingController } from "@ionic/vue";
export default {
  methods: {
    async presentLoading() {
      const loading = await loadingController.create({
        spinner: "circles",
        // message: "Mohon Tunggu...",
        translucent: true,
      });
      await loading.present();
    },

    async discardLoading() {
      await loadingController.dismiss()
      console.log("dismiss");
      // await setTimeout(() => {
      //   loadingController.dismiss();
      // }, 500);
    },
  },
};
