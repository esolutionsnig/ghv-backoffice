<template>
  <div>
    <app-navbar></app-navbar>
    <v-main class="grey lighten-3" style="min-height: 700px">
      <div
        class="fill-height white ma-6"
        style="border-radius: 30px 30px 0 0 !important"
      >
        <router-view></router-view>
      </div>
    </v-main>
    <app-footer></app-footer>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
export default {
  components: {
    "app-navbar": Navbar,
    "app-footer": Footer
  }
};
</script>

<style lang="scss" scoped></style>
