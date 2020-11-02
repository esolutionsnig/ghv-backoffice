<template>
  <div v-if="!loaded">
    <v-container>
      <v-row>
        <v-col cols="12" md="4" v-for="index in 3" :key="index">
          <v-skeleton-loader type="card-avatar, article, actions">
          </v-skeleton-loader>
        </v-col>
      </v-row>
    </v-container>
  </div>
  <div v-else>
    <v-container>
      <v-layout>
        <v-row>
          <v-col cols="12" sm="5" md="5">
            <v-card :elevation="4">
              <v-card-title class="primary-color text-uppercase bottom-border"
                ><v-icon color="primary" class="mr-2">fa fa-plus</v-icon> Add
                New Office Location</v-card-title
              >
              <v-card-text>
                <v-form lazy-validation ref="addForm" @submit.prevent="addItem">
                  <v-text-field
                    v-model="title"
                    :rules="titleRules"
                    label="Office Title"
                    required
                    outlined
                  ></v-text-field>

                  <v-text-field
                    v-model="address"
                    :rules="addressRules"
                    label="Office Address"
                    required
                    outlined
                  ></v-text-field>

                  <v-text-field
                    v-model="phoneNumber"
                    :rules="phoneNumberRules"
                    label="Office Phone Number"
                    required
                    outlined
                  ></v-text-field>

                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="E-mail"
                    required
                    outlined
                  ></v-text-field>

                  <v-autocomplete
                    name="Country"
                    :items="countries"
                    :rules="[
                      v => !!v || 'Office location (Country) is required'
                    ]"
                    item-text="name"
                    v-model="country"
                    label="Office Location (Country)"
                    required
                    outlined
                    @change="getStates"
                  ></v-autocomplete>

                  <v-autocomplete
                    name="State"
                    :disabled="!countryAdded"
                    :items="states"
                    :rules="[v => !!v || 'Office location (State) is required']"
                    item-text="name"
                    v-model="state"
                    label="Office Location (State)"
                    required
                    outlined
                    @change="getCities"
                  ></v-autocomplete>

                  <v-autocomplete
                    name="City"
                    :disabled="!stateAdded"
                    :items="cities"
                    :rules="[v => !!v || 'Office location (City) is required']"
                    item-text="name"
                    v-model="city"
                    label="Office Location (City)"
                    required
                    outlined
                  ></v-autocomplete>

                  <v-row justify="space-around" align="center">
                    <v-col cols="12" sm="6">
                      {{ weekdaysOpeningText }}
                      <v-time-picker
                        color="primary"
                        width="200"
                        v-model="weekdaysOpening"
                        elevation="5"
                        ampm-in-title
                      ></v-time-picker>
                    </v-col>
                    <v-col cols="12" sm="6">
                      {{ weekdaysClosingText }}
                      <v-time-picker
                        color="secondary"
                        width="200"
                        v-model="weekdaysClosing"
                        elevation="5"
                        ampm-in-title
                      ></v-time-picker>
                    </v-col>
                  </v-row>

                  <v-divider class="my-3"></v-divider>

                  <v-row justify="space-around" align="center">
                    <v-col cols="12" sm="6">
                      {{ weekendsOpeningText }}
                      <v-time-picker
                        color="primary"
                        width="200"
                        v-model="weekendsOpening"
                        elevation="5"
                        ampm-in-title
                      ></v-time-picker>
                    </v-col>
                    <v-col cols="12" sm="6">
                      {{ weekendsClosingText }}
                      <v-time-picker
                        color="secondary"
                        width="200"
                        v-model="weekendsClosing"
                        elevation="5"
                        ampm-in-title
                      ></v-time-picker>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn large color="warning" text @click="reset">
                  <v-icon>refresh</v-icon>
                  Reset
                </v-btn>
                <v-spacer></v-spacer>
                <span v-if="processing">
                  <v-progress-linear
                    indeterminate
                    color="primary"
                    height="15"
                  ></v-progress-linear>
                  {{ processingTitle }}</span
                >
                <span v-else>
                  <v-btn
                    :disabled="processing"
                    v-if="userProfileId"
                    color="primary"
                    dark
                    rounded
                    large
                    @click="addItem(userProfileId)"
                  >
                    <v-icon left v-if="!processing">save</v-icon>
                    <v-icon left v-else>fa-spinner fa-spin</v-icon>
                    {{ processing ? processingTitle : processingBtn }}
                  </v-btn>
                </span>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" sm="7" md="7">
            <v-card flat>
              <v-card-title class="primary-color text-uppercase bottom-border">
                <v-icon color="primary" class="mr-2">fa fa-store</v-icon>
                Office Locations
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                    v-for="item in data"
                    :key="item.index"
                  >
                    <contactCard
                      :title="item.title"
                      :address="item.address"
                      :weekdaysClosing="item.weekdaysClosing"
                      :weekendsClosing="item.weekendsClosing"
                      :email="item.email"
                      :weekdaysOpening="item.weekdaysOpening"
                      :weekendsOpening="item.weekendsOpening"
                      :phoneNumber="item.phoneNumber"
                      :phoneNumberDial="item.phoneNumberDial"
                      :country="item.country"
                      :state="item.state"
                      :city="item.city"
                      @callOffice="callOffice(item.phoneNumberDial)"
                      @emailOffice="emailOffice(item.email)"
                      @editItem="editItem(item.id)"
                      @deleteItem="deleteItem(item.id)"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-snackbar
            rounded
            :timeout="msgTimeout"
            :color="msgColor"
            v-model="snackbar"
            :multi-line="multiLine"
          >
            <v-icon>{{ msgIcon }}</v-icon>
            {{ msg }}
          </v-snackbar>
        </v-row>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import ContactCard from "@/components/contactUs/ContactCard.vue";
import methods from "@/components/contactUs/methods";
import mounted from "@/components/contactUs/mounted";
export default {
  created() {
    document.title = "Contact Us Information";
  },
  name: "ContactUs",

  components: {
    ContactCard
  },
  data() {
    return {
      userProfileId: null,
      res: null,
      processingBtn: "Save Office",
      processing: false,
      loaded: false,
      countryAdded: false,
      stateAdded: false,
      weekdaysOpeningText: "Week days Opening Time",
      weekdaysClosingText: "Week days Closing Time",
      weekendsOpeningText: "Weekends Opening Time",
      weekendsClosingText: "Weekends Closing Time",
      data: [],
      title: "",
      address: "",
      weekdaysClosing: "",
      weekendsClosing: "",
      email: "",
      weekdaysOpening: "",
      weekendsOpening: "",
      phoneNumber: "",
      phoneNumberDial: "",
      city: "",
      state: "",
      country: "",
      countries: [],
      states: [],
      cities: [],
      titleRules: [v => !!v || "Office title is required"],
      addressRules: [v => !!v || "Office address is required"],
      phoneNumberRules: [v => !!v || "Office phone number is required"],
      emailRules: [
        v => !!v || "Office e-mail address is required",
        v => /.+@.+\..+/.test(v) || "Office e-mail must be valid"
      ],
      cityRules: [v => !!v || "Office city is required"],
      snackbar: false,
      multiLine: true,
      msgTimeout: 4000,
      msgColor: "primary",
      msgIcon: "done_all",
      msg: ""
    };
  },
  mixins: [methods, mounted]
};
</script>

<style lang="scss" scoped></style>
