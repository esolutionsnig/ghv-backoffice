<template>
  <div>
    <v-footer>
      <span class="mlf"
        >&copy; {{ new Date().getFullYear() }} {{ ownedBy }}
        {{ copyRight }}</span
      >
      <v-spacer></v-spacer>
      <div>
        {{ developerIntro }}<a :href="developerUrl">{{ developedBy }}</a>
      </div>
    </v-footer>
  </div>
</template>

<script>
export default {
  data: () => ({
    developerIntro: "Powered By: ",
    developedBy: "Etech Data Services",
    developerUrl: "https://etech-ng.web.app/",
    ownedBy: "Great Hayden Vineyard Services Limited.",
    copyRight: "All right reserved"
  })
};
</script>

<style lang="scss" scoped></style>
