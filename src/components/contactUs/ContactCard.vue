<template>
  <v-card>
    <v-img :height="bannerHeight" :src="images.office500"></v-img>

    <v-card-text>
      <div class="my-1">
        <small>Address:</small><br />
        {{ address }}
      </div>

      <v-row class="my-1 subtitle-1">
        <v-col cols="12" sm="12" md="12"
          ><small>Phone Number:</small><br />
          {{ phoneNumber }}</v-col
        >
        <v-col cols="12" sm="12" md="12"
          ><small>Email Address:</small><br />
          {{ email }}</v-col
        >
      </v-row>

      <v-row class="my-1 subtitle-1">
        <v-col cols="12" sm="4" md="4"
          ><small>City:</small><br />
          {{ city }}</v-col
        >
        <v-col cols="12" sm="4" md="4"
          ><small>State:</small><br />
          {{ state }}</v-col
        >
        <v-col cols="12" sm="4" md="4"
          ><small>Country:</small><br />
          {{ country }}</v-col
        >
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <small>Week Days:</small><br />{{ weekdaysOpening }} -
          {{ weekdaysClosing }}
        </v-col>
        <v-col cols="12" sm="6"
          ><small>Weekends:</small><br />{{ weekendsOpening }} -
          {{ weekendsClosing }}</v-col
        >
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-btn outlined rounded color="primary" dark @click="emailOffice">
        <v-icon>fas fa-envelope</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn outlined rounded color="cyan darken-2" dark @click="callOffice">
        <v-icon>phone</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn outlined rounded color="red darken-4" dark @click="deleteItem">
        <v-icon class="mr-2">delete</v-icon>
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    bannerHeight: 135,
    images: {
      office500: require("@/assets/office500.jpg")
    }
  }),
  props: [
    "id",
    "title",
    "address",
    "weekdaysClosing",
    "weekendsClosing",
    "email",
    "weekdaysOpening",
    "weekendsOpening",
    "phoneNumber",
    "phoneNumberDial",
    "city",
    "state",
    "country"
  ],
  methods: {
    callOffice() {
      this.$emit("callOffice", "phoneNumberDial");
    },
    emailOffice() {
      this.$emit("emailOffice", "email");
    },
    editItem() {
      this.$emit("editItem", "id");
    },
    deleteItem() {
      this.$emit("deleteItem", "id");
    }
  }
};
</script>

<style lang="scss" scoped></style>
