<template>
  <div>
    <v-container>
      <v-layout>
        <v-row style="min-height: 700px">
          <v-col cols="12">
            <v-card flat>
              <v-card-title>
                <h2 class="font-weight-light primary--text text-uppercase">
                  {{ tableTitle }}
                </h2>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-card-text>
                <v-data-table
                  v-model="selected"
                  :search="search"
                  :headers="headers"
                  :items="data"
                  item-key="name"
                  show-select
                  class="elevation-1"
                  :loading="loading"
                  loading-text="Loading... Please wait"
                >
                  <template v-slot:item="row">
                    <tr>
                      <td>
                        <v-checkbox
                          v-model="selected"
                          :value="row.item.id"
                          hide-details
                        />
                      </td>
                      <td>{{ row.item.companyName }}</td>
                      <td>{{ row.item.companyAddress }}</td>
                      <td>{{ row.item.pickupCity }}</td>
                      <td>{{ row.item.pickupState }}</td>
                      <td>{{ row.item.deliveryCity }}</td>
                      <td>{{ row.item.deliveryState }}</td>
                      <td>
                        <v-btn
                          class="mx-2"
                          dark
                          small
                          outlined
                          rounded
                          color="blue-grey"
                          @click="loadItem(row.item)"
                        >
                          <v-icon left dark>fas fa-eye</v-icon>
                          View
                        </v-btn>
                        <v-chip
                          v-if="row.item.status == 'Processed'"
                          class="ma-2 px-4 py-4 text-uppercase"
                          color="teal"
                          text-color="white"
                        >
                          <v-avatar left>
                            <v-icon size="17">thumb_up</v-icon>
                          </v-avatar>
                          {{ row.item.status }}
                        </v-chip>
                        <v-chip
                          v-else
                          class="ma-2 px-4 py-4 text-uppercase"
                          color="error"
                          text-color="white"
                        >
                          <v-avatar left>
                            <v-icon size="17">thumb_down</v-icon>
                          </v-avatar>
                          {{ row.item.status }}
                        </v-chip>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  class="mx-2"
                  dark
                  large
                  color="secondary"
                  @click="markAsUnprocessed()"
                >
                  <v-icon left dark>email</v-icon>
                  Mark {{ selected.length }} As Unprocessed
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  class="mx-2"
                  dark
                  large
                  color="primary"
                  @click="markAsProcessed()"
                >
                  <v-icon left dark>email</v-icon>
                  Mark {{ selected.length }} As Processed
                </v-btn>
              </v-card-actions>
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
            </v-card>
          </v-col>
        </v-row>

        <v-dialog v-model="dialog" width="700px">
          <div ref="pickupService">
            <v-card>
              <v-card-title class="primary white--text" dark>
                <div>
                  <span class="headline text-uppercase">{{ itemTitle }}</span>
                  <h4 class="font-weight-thin text-center">{{ appTitle }}</h4>
                </div>
                <v-spacer></v-spacer>
                <v-btn
                  outlined
                  rounded
                  large
                  color="white"
                  @click="generatePdf"
                >
                  <v-icon color="white" left>cloud_download</v-icon>
                  Download
                </v-btn>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <div class="mt-3 pa-3">
                  <h3 class="text-uppercase font-weight-light">
                    {{ senderInfo }}
                  </h3>
                </div>
                <v-list two-line>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-list-item>
                        <v-list-item-avatar>
                          <v-icon>fas fa-hotel</v-icon>
                        </v-list-item-avatar>

                        <v-list-item-content>
                          <v-list-item-title>{{
                            item.companyName
                          }}</v-list-item-title>
                          <v-list-item-subtitle
                            >Company Name</v-list-item-subtitle
                          >
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-list-item>
                        <v-list-item-avatar>
                          <v-icon>fas fa-map-pin</v-icon>
                        </v-list-item-avatar>

                        <v-list-item-content>
                          <v-list-item-title>{{
                            item.companyAddress
                          }}</v-list-item-title>
                          <v-list-item-subtitle
                            >Company Address</v-list-item-subtitle
                          >
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-list-item>
                        <v-list-item-avatar>
                          <v-icon>fas fa-user-tie</v-icon>
                        </v-list-item-avatar>

                        <v-list-item-content>
                          <v-list-item-title>{{
                            item.firstName
                          }}</v-list-item-title>
                          <v-list-item-subtitle
                            >First Name</v-list-item-subtitle
                          >
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-list-item>
                        <v-list-item-avatar>
                          <v-icon>fas fa-user-tie</v-icon>
                        </v-list-item-avatar>

                        <v-list-item-content>
                          <v-list-item-title>{{
                            item.lastName
                          }}</v-list-item-title>
                          <v-list-item-subtitle>Last Name</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-list-item>
                        <v-list-item-avatar>
                          <v-icon>fas fa-phone</v-icon>
                        </v-list-item-avatar>

                        <v-list-item-content>
                          <v-list-item-title>{{
                            item.phoneNumber
                          }}</v-list-item-title>
                          <v-list-item-subtitle
                            >Phone Number</v-list-item-subtitle
                          >
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-list-item>
                        <v-list-item-avatar>
                          <v-icon>fas fa-envelope</v-icon>
                        </v-list-item-avatar>

                        <v-list-item-content>
                          <v-list-item-title>
                            <a :href="`mailto:` + item.email">{{
                              item.email
                            }}</a>
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            Email Address
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                  </v-row>
                </v-list>

                <div class="blue-grey lighten-5 mt-3 pa-3">
                  <h3 class="text-uppercase font-weight-light">
                    {{ pickupInfo }}
                  </h3>
                </div>
                <v-list two-line class="blue-grey lighten-5">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-list-item>
                        <v-list-item-avatar>
                          <v-icon>fas fa-home</v-icon>
                        </v-list-item-avatar>

                        <v-list-item-content>
                          <v-list-item-title>{{
                            item.pickupAddress
                          }}</v-list-item-title>
                          <v-list-item-subtitle>Address</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-list-item>
                        <v-list-item-avatar>
                          <v-icon>fas fa-map-pin</v-icon>
                        </v-list-item-avatar>

                        <v-list-item-content>
                          <v-list-item-title>{{
                            item.pickupCity
                          }}</v-list-item-title>
                          <v-list-item-subtitle>City</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-list-item>
                        <v-list-item-avatar>
                          <v-icon>fas fa-map-marker-alt</v-icon>
                        </v-list-item-avatar>

                        <v-list-item-content>
                          <v-list-item-title>{{
                            item.pickupState
                          }}</v-list-item-title>
                          <v-list-item-subtitle>State</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-list-item>
                        <v-list-item-avatar>
                          <v-icon>fas fa-map-marked-alt</v-icon>
                        </v-list-item-avatar>

                        <v-list-item-content>
                          <v-list-item-title>
                            {{ item.pickupCountry }}
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            Country
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                  </v-row>
                </v-list>

                <div class="mt-3 pa-3">
                  <h3 class="text-uppercase font-weight-light">
                    {{ deliveryInfo }}
                  </h3>
                </div>
                <v-list two-line>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-list-item>
                        <v-list-item-avatar>
                          <v-icon>fas fa-home</v-icon>
                        </v-list-item-avatar>

                        <v-list-item-content>
                          <v-list-item-title>{{
                            item.deliveryAddress
                          }}</v-list-item-title>
                          <v-list-item-subtitle>Address</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-list-item>
                        <v-list-item-avatar>
                          <v-icon>fas fa-map-pin</v-icon>
                        </v-list-item-avatar>

                        <v-list-item-content>
                          <v-list-item-title>{{
                            item.deliveryCity
                          }}</v-list-item-title>
                          <v-list-item-subtitle>City</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-list-item>
                        <v-list-item-avatar>
                          <v-icon>fas fa-map-marker-alt</v-icon>
                        </v-list-item-avatar>

                        <v-list-item-content>
                          <v-list-item-title>{{
                            item.deliveryState
                          }}</v-list-item-title>
                          <v-list-item-subtitle>State</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-list-item>
                        <v-list-item-avatar>
                          <v-icon>fas fa-map-marked-alt</v-icon>
                        </v-list-item-avatar>

                        <v-list-item-content>
                          <v-list-item-title>
                            {{ item.deliveryCountry }}
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            Country
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                  </v-row>
                </v-list>

                <div class="blue-grey lighten-5 mt-3 pa-3">
                  <h3 class="text-uppercase font-weight-light">
                    {{ packageInfo }}
                  </h3>
                </div>
                <v-list two-line class="blue-grey lighten-5">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-list-item>
                        <v-list-item-avatar>
                          <v-icon>fas fa-box</v-icon>
                        </v-list-item-avatar>

                        <v-list-item-content>
                          <v-list-item-title>{{
                            item.packageInformation
                          }}</v-list-item-title>
                          <v-list-item-subtitle
                            >Package Information</v-list-item-subtitle
                          >
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-list-item>
                        <v-list-item-avatar>
                          <v-icon>fas fa-box-tissue</v-icon>
                        </v-list-item-avatar>

                        <v-list-item-content>
                          <v-list-item-title>{{
                            item.numberOfPieces
                          }}</v-list-item-title>
                          <v-list-item-subtitle
                            >Number of Pieces</v-list-item-subtitle
                          >
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-list-item>
                        <v-list-item-avatar>
                          <v-icon>fas fa-pallet</v-icon>
                        </v-list-item-avatar>

                        <v-list-item-content>
                          <v-list-item-title>{{
                            item.weight
                          }}</v-list-item-title>
                          <v-list-item-subtitle>Weight</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-list-item>
                        <v-list-item-avatar>
                          <v-icon>fas fa-square</v-icon>
                        </v-list-item-avatar>

                        <v-list-item-content>
                          <v-list-item-title>
                            {{ item.dimensions }}
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            Dimensions
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                  </v-row>
                </v-list>

                <v-list three-line>
                  <v-row>
                    <v-col cols="12">
                      <v-list-item>
                        <v-list-item-avatar>
                          <v-icon>fas fa-file-alt</v-icon>
                        </v-list-item-avatar>

                        <v-list-item-content>
                          <v-list-item-title>{{
                            item.specialInstructions
                          }}</v-list-item-title>
                          <v-list-item-subtitle
                            >Special Instructions</v-list-item-subtitle
                          >
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                  </v-row>
                </v-list>
              </v-card-text>
              <v-card-actions>
                <v-btn color="blue-grey darken-1" text @click="dialog = false">
                  <v-icon>close</v-icon> Close
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn rounded large color="white" @click="generatePdf">
                  <v-icon color="white" left>cloud_download</v-icon>
                  Download
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-dialog>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import methods from "./methods";
import mounted from "./mounted";

export default {
  created() {
    document.title = "Quote Request";
  },
  name: "Quote",
  data() {
    return {
      appTitle: process.env.VUE_APP_TITLE,
      appShortName: process.env.VUE_APP_SHORT_NAME,
      dialog: null,
      userProfileId: null,
      loading: true,
      senderInfo: "Sender Information",
      pickupInfo: "Pickup Information",
      deliveryInfo: "Delivery Information",
      packageInfo: "Package Information",
      singleSelect: false,
      tableTitle: "Quote Request",
      selected: [],
      search: "",
      headers: [
        {
          text: "Company",
          align: "start",
          value: "companyName"
        },
        { text: "Address", value: "companyAddress" },
        { text: "Pickup City", value: "pickupCity" },
        { text: "Pickup State", value: "pickupState" },
        { text: "Delivery City", value: "deliveryCity" },
        { text: "Delivery State", value: "deliveryState" },
        { text: "Status", value: "status" }
      ],
      data: [],
      item: [],
      itemTitle: "Pickup Service Information",
      res: "",
      snackbar: false,
      multiLine: true,
      msgTimeout: 4000,
      msgColor: "primary",
      msgIcon: "done_all",
      msg: "",
      processed: "Processed",
      unprocessed: "Unprocessed",
      margins: {
        top: 20,
        bottom: 20,
        left: 15,
        width: 522
      }
    };
  },
  mixins: [methods, mounted]
};
</script>

<style lang="scss" scoped></style>
