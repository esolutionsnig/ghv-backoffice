<template>
  <div>
    <v-container class="fill-height">
      <v-layout>
        <v-row v-if="showTable">
          <v-col cols="12">
            <v-card flat class="scl">
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
                <v-spacer></v-spacer>
                <v-btn
                  rounded
                  large
                  color="primary"
                  outlined
                  @click="showTable = false"
                >
                  <v-icon color="primary" left>add</v-icon>
                  Add Item
                </v-btn>
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
                      <td>
                        <v-btn
                          class="mx-2"
                          dark
                          rounded
                          small
                          color="warning"
                          @click="loadItem(row.item)"
                        >
                          <v-icon left dark size="13">fas fa-edit</v-icon>
                          Update Status
                        </v-btn>
                      </td>
                      <td>{{ row.item.clientName }}</td>
                      <td>{{ row.item.title }}</td>
                      <td>{{ row.item.itemType }}</td>
                      <td>
                        <v-chip
                          v-if="
                            row.item.status == 'Packaged, Awaiting Shipment'
                          "
                          class="ma-2"
                          color="orange"
                          outlined
                        >
                          <v-avatar left>
                            <v-icon size="14">fas fa-box</v-icon>
                          </v-avatar>
                          {{ row.item.status }}
                        </v-chip>
                        <v-chip
                          v-else-if="
                            row.item.status == 'Shipped, Awaiting Delivery'
                          "
                          class="ma-2"
                          color="primary"
                          outlined
                        >
                          <v-avatar left>
                            <v-icon size="14">fas fa-shipping-fast</v-icon>
                          </v-avatar>
                          {{ row.item.status }}
                        </v-chip>
                        <v-chip
                          v-else-if="
                            row.item.status ==
                              'Arrived Delivery Location, Awaiting Pickup'
                          "
                          class="ma-2"
                          color="cyan"
                          outlined
                        >
                          <v-avatar left>
                            <v-icon size="14">fas fa-map-pin</v-icon>
                          </v-avatar>
                          {{ row.item.status }}
                        </v-chip>
                        <v-chip
                          v-else-if="row.item.status == 'Delivered'"
                          class="ma-2"
                          color="teal"
                          outlined
                        >
                          <v-avatar left>
                            <v-icon>done_all</v-icon>
                          </v-avatar>
                          {{ row.item.status }}
                        </v-chip>
                      </td>
                      <td>{{ row.item.airWayBillNumber }}</td>
                      <td>{{ row.item.currentLocation }}</td>
                      <td>{{ row.item.itemValuedAt | formatNumber }}</td>
                      <td>{{ row.item.amountCharged | formatNumber }}</td>
                      <td>{{ row.item.deliveryContactName }}</td>
                      <td>{{ row.item.deliveryContactPhone }}</td>
                      <td>{{ row.item.deliveryContactLocation }}</td>
                      <td>{{ row.item.itemFragile }}</td>
                      <td>{{ row.item.itemWeight }}</td>
                      <td>{{ row.item.itemQty }}</td>
                      <td>{{ row.item.itemDeliveryType }}</td>
                      <td>{{ row.item.itemDescription }}</td>
                    </tr>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col cols="12">
            <v-stepper v-model="e1">
              <v-stepper-header>
                <v-stepper-step :complete="e1 > 1" step="1">
                  <v-icon class="mr-3">fas fa-store</v-icon> Client Information
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="e1 > 2" step="2">
                  <v-icon class="mr-3">fas fa-box-open</v-icon> Item Packaging
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="e1 > 3" step="3">
                  <v-icon class="mr-3">fas fa-box</v-icon> Item Sealing
                </v-stepper-step>
              </v-stepper-header>

              <v-stepper-items>
                <v-stepper-content step="1">
                  <v-card class="mb-12">
                    <v-card-text>
                      <v-text-field
                        v-model="title"
                        :rules="titleRules"
                        label="Title"
                        required
                        outlined
                      ></v-text-field>
                      <v-text-field
                        v-model="clientName"
                        :rules="clientNameRules"
                        label="Client Name"
                        required
                        outlined
                      ></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn rounded text @click="showTable = true"
                        >Cancel</v-btn
                      >
                      <v-spacer></v-spacer>
                      <v-btn rounded color="primary" @click="moveOne()">
                        Next Step: Item Packaging
                        <v-icon right>fas fa-long-arrow-alt-right</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-stepper-content>

                <v-stepper-content step="2">
                  <v-card class="mb-12">
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" sm="4">
                          <v-text-field
                            v-model="itemQty"
                            :rules="itemQtyRules"
                            label="Number of items"
                            required
                            outlined
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                          <v-text-field
                            v-model="itemValuedAt"
                            :rules="itemValuedAtRules"
                            label="Item Valued At What Price"
                            required
                            outlined
                          ></v-text-field>
                          <h1 class="teal--text">
                            <small class="font-weight-light">&#8358;</small>
                            {{ itemValuedAt | formatNumber }}
                          </h1>
                        </v-col>
                        <v-col cols="12" sm="4">
                          <v-text-field
                            v-model="itemWeight"
                            :rules="itemWeightRules"
                            label="Item Weight"
                            required
                            outlined
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="4">
                          <v-row>
                            <v-col cols="12" sm="6"
                              >Is this item fragile?
                              <span class="ml-4">{{ itemFragile }}</span></v-col
                            >
                            <v-col cols="12" sm="6">
                              <v-chip
                                @click="setFragile(1)"
                                :class="{ fragileSet: active_el == 1 }"
                                class="mr-2"
                              >
                                <v-icon left size="14" color="white"
                                  >thumb_up</v-icon
                                >
                                YES
                              </v-chip>
                              <v-chip
                                @click="setFragile(2)"
                                :class="{ fragileSet: active_el == 2 }"
                                class="mr-2"
                              >
                                <v-icon left size="14" color="white"
                                  >thumb_up</v-icon
                                >
                                NO
                              </v-chip>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="8">
                          <v-row>
                            <v-col cols="12" sm="3"
                              >What is the item type?
                              <span class="ml-4">{{ itemType }}</span></v-col
                            >
                            <v-col cols="12" sm="9">
                              <v-chip
                                @click="setType(1)"
                                :class="{ typeSet: type == 1 }"
                                class="mr-2"
                              >
                                <v-icon left size="14">live_tv</v-icon>
                                ELECTRONICS
                              </v-chip>
                              <v-chip
                                @click="setType(2)"
                                :class="{ typeSet: type == 2 }"
                                class="mr-2"
                              >
                                <v-icon left size="14"
                                  >fas fa-file-invoice</v-icon
                                >
                                DOCUMENTS
                              </v-chip>
                              <v-chip
                                @click="setType(3)"
                                :class="{ typeSet: type == 3 }"
                                class="mr-2"
                              >
                                <v-icon left size="14">fas fa-lemon</v-icon>
                                PERISHABLES
                              </v-chip>
                              <v-chip
                                @click="setType(4)"
                                :class="{ typeSet: type == 4 }"
                                class="mr-2"
                              >
                                <v-icon left size="14"
                                  >fas fa-cloud-meatball</v-icon
                                >
                                OTHERS
                              </v-chip>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sm="3"
                          >Delivery type?
                          <span class="ml-4">{{
                            itemDeliveryType
                          }}</span></v-col
                        >
                        <v-col cols="12" sm="9">
                          <v-chip
                            @click="setMovement(1)"
                            :class="{ movementSet: movement == 1 }"
                            class="mr-2"
                          >
                            <v-icon left size="14">fas fa-truck-moving</v-icon>
                            TRUCK MOVEMENT
                          </v-chip>
                          <v-chip
                            @click="setMovement(2)"
                            :class="{ movementSet: movement == 2 }"
                            class="mr-2"
                          >
                            <v-icon left size="14">fas fa-biking</v-icon>
                            BIKE MOVEMENT
                          </v-chip>
                          <v-chip
                            @click="setMovement(3)"
                            :class="{ movementSet: movement == 3 }"
                            class="mr-2"
                          >
                            <v-icon left size="14"
                              >fas fa-plane-departure</v-icon
                            >
                            AIR MOVEMENT
                          </v-chip>
                          <v-chip
                            @click="setMovement(4)"
                            :class="{ movementSet: movement == 4 }"
                            class="mr-2"
                          >
                            <v-icon left size="14">fas fa-ship</v-icon>
                            SEA MOVEMENT
                          </v-chip>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12">
                          <v-textarea
                            outlined
                            name="itemDescription"
                            label="Package Description"
                            v-model="itemDescription"
                          ></v-textarea>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn text @click="e1 = 1">
                        <v-icon left>fas fa-long-arrow-alt-left</v-icon>
                        Back
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn rounded color="primary" @click="moveTwo()">
                        Next Step: Item Sealing
                        <v-icon right>fas fa-long-arrow-alt-right</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-stepper-content>

                <v-stepper-content step="3">
                  <v-card class="mb-12">
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" sm="4">
                          <v-text-field
                            v-model="deliveryContactName"
                            :rules="deliveryContactNameRules"
                            label="Receiver's Name"
                            required
                            outlined
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-text-field
                            v-model="amountCharged"
                            :rules="amountChargedRules"
                            label="Amount Charged"
                            required
                            outlined
                          ></v-text-field>
                          <h1 class="teal--text">
                            <small class="font-weight-light">&#8358;</small>
                            {{ amountCharged | formatNumber }}
                          </h1>
                        </v-col>
                        <v-col cols="12" sm="2">
                          <v-text-field
                            v-model="currentLocation"
                            :rules="currentLocationRules"
                            label="Current Location"
                            required
                            outlined
                            @change="getAirwayBillNumber"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <div
                            v-if="airWayBillNumber != ''"
                            class="teal white--text font-weight-thin pa-3"
                          >
                            <h3>
                              <small>Airway Bill Number: <br /></small
                              >{{ airWayBillNumber }}
                            </h3>
                          </div>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sm="7">
                          <v-text-field
                            v-model="deliveryContactLocation"
                            :rules="deliveryContactLocationRules"
                            label="Delivery Location"
                            required
                            outlined
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="5">
                          <v-text-field
                            v-model="deliveryContactPhone"
                            :rules="deliveryContactPhoneRules"
                            label="Receiver Phone Number"
                            required
                            outlined
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn text @click="e1 = 2">
                        <v-icon left>fas fa-long-arrow-alt-left</v-icon>
                        Back
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn
                        v-if="!processing"
                        rounded
                        color="primary"
                        @click="addConsignment()"
                      >
                        <v-icon left>fas fa-save</v-icon>
                        Submit
                      </v-btn>
                      <v-btn v-else rounded color="grey">
                        <v-icon left>fas fa-soundwave</v-icon>
                        {{ processingTitle }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </v-col>
        </v-row>

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

        <v-dialog v-model="dialog" width="600px">
          <v-form ref="uploadForm" @submit.prevent="uploadFile">
            <v-card class="text-center">
              <v-card-title class="primary white--text" dark>
                <div>
                  <span class="headline text-uppercase">
                    <span class="font-weight-thin">Updating:</span>
                    {{ item.title }}
                  </span>
                </div>
                <v-spacer></v-spacer>
                <v-btn fab small color="white" @click="dialog = false">
                  <v-icon color="primary">fas fa-times</v-icon>
                </v-btn>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="currentLocation"
                      :rules="currentLocationRules"
                      label="Consignment Current Location"
                      required
                      outlined
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    {{ updateMsg }}
                    <h3>
                      <small class="font-weight-light"
                        >Current Status Set To:
                      </small>
                      {{ currentStatus }}
                    </h3>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-chip
                      @click="setStatus(1)"
                      :class="{ statusSet: ss == 1 }"
                      class="mr-2"
                    >
                      <v-icon left size="14">fas fa-shipping-fast</v-icon>
                      SHIPPED
                    </v-chip>
                    <v-chip
                      @click="setStatus(2)"
                      :class="{ statusSet: ss == 2 }"
                      class="mr-2"
                    >
                      <v-icon left size="14">fas fa-map-pin</v-icon>
                      ARRIVED
                    </v-chip>
                    <v-chip
                      @click="setStatus(3)"
                      :class="{ statusSet: ss == 3 }"
                      class="ma-2"
                    >
                      <v-icon left size="14">done_all</v-icon>
                      DELIVERED
                    </v-chip>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="primary"
                  dark
                  rounded
                  outlined
                  @click="dialog = false"
                >
                  <v-icon left>cancel</v-icon>
                  Close
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  v-if="!processing"
                  rounded
                  color="primary"
                  @click="updateItem()"
                >
                  <v-icon left>fas fa-save</v-icon>
                  Save Changes
                </v-btn>
                <v-btn v-else rounded color="grey">
                  <v-icon left>fas fa-soundwave</v-icon>
                  {{ processingTitle }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
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
    document.title = "Consignments";
  },
  name: "Consignments",
  components: {},
  data() {
    return {
      appTitle: process.env.VUE_APP_TITLE,
      appShortName: process.env.VUE_APP_SHORT_NAME,
      updateMsg: "Choose the current status of the consignment",
      ss: 0,
      active_el: 0,
      type: 0,
      movement: 0,
      dialog: null,
      userProfileId: null,
      showTable: true,
      e1: 1,
      loading: true,
      tableTitle: "Consignments",
      title: "",
      clientName: "",
      airWayBillNumber: "",
      currentLocation: "",
      currentStatus: "",
      statusPackaged: "Packaged, Awaiting Shipment",
      statusShipped: "Shipped, Awaiting Delivery",
      statusArrived: "Arrived Delivery Location, Awaiting Pickup",
      statusDelivered: "Delivered",
      addedBy: "",
      deliveryContactName: "",
      deliveryContactPhone: "",
      deliveryContactLocation: "",
      amountCharged: 0,
      itemDescription: "",
      itemDeliveryType: "",
      itemFragile: "",
      itemQty: 0,
      itemType: "",
      itemValuedAt: 0,
      itemWeight: "",
      selected: [],
      search: "",
      headers: [
        { text: "ACTIONS", value: "id" },
        {
          text: "Client Name",
          align: "start",
          value: "clientName"
        },
        { text: "Title", value: "title" },
        { text: "Item Type", value: "itemType" },
        { text: "Consignment Status", value: "status" },
        { text: "Airway Bill Number", value: "airWayBillNumber" },
        { text: "Current Location", value: "currentLocation" },
        { text: "Valued At", value: "itemValuedAt" },
        { text: "Amount Charged", value: "amountCharged" },
        { text: "Receiver", value: "deliveryContactName" },
        { text: "Phone Number", value: "deliveryContactPhone" },
        { text: "Delivery Location", value: "deliveryContactLocation" },
        { text: "Item Fragile", value: "itemFragile" },
        { text: "Item Weight", value: "itemWeight" },
        { text: "Item Quantity", value: "itemQty" },
        { text: "Delivery Type", value: "deliveryType" },
        { text: "Description", value: "itemDescription" }
      ],
      data: [],
      item: [],
      itemTitle: "Services Information",
      res: "",
      snackbar: false,
      multiLine: true,
      msgTimeout: 4000,
      msgColor: "primary",
      msgIcon: "done_all",
      msg: "",
      currentLocationRules: [
        v => !!v || "Cpnsignment current location is required"
      ],
      titleRules: [v => !!v || "Title is required"],
      clientNameRules: [v => !!v || "Client name is required"],
      itemValuedAtRules: [v => !!v || "Item valued price is required"],
      itemWeightRules: [v => !!v || "Item weight is required"],
      itemQtyRules: [v => !!v || "Item quantity is required"],
      deliveryContactNameRules: [v => !!v || "Receiver name is required"],
      deliveryContactPhoneRules: [
        v => !!v || "Receiver phone number is required"
      ],
      deliveryContactLocationRules: [
        v => !!v || "Delivery location is required"
      ],
      amountChargedRules: [v => !!v || "Amount charged is required"],
      airWayBillNumberRules: [v => !!v || "Airway bill number is required"],
      processing: false,
      processingTitle: "Processing",
      saveBtn: "Save"
    };
  },
  mixins: [methods, mounted]
};
</script>

<style lang="scss" scoped>
.scl {
  overflow-y: auto !important;
  width: 1170px !important;
  max-width: 1170px !important;
}
.fragileSet {
  margin-right: 15px !important;
  color: #fff !important;
  background: teal !important;
}
.typeSet {
  margin-right: 15px !important;
  color: #fff !important;
  background: teal !important;
}
.movementSet {
  margin-right: 15px !important;
  color: #fff !important;
  background: teal !important;
}
.statusSet {
  margin: 15px !important;
  color: #fff !important;
  background: teal !important;
}
</style>
