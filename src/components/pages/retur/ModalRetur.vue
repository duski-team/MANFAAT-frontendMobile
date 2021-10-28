<template>
  <base-layout page-title="Modal Retur">
  </base-layout>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
    props: [ "dataModalRetur" ],

    created() {
        console.log("data modal retur", this.dataModalRetur);
    }
})
</script>

<style>

</style>