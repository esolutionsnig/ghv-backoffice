<template>
  <div>
    <v-container>
      <v-layout>
        <v-row>
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
                <v-spacer></v-spacer>
                <v-btn
                  rounded
                  large
                  color="primary"
                  outlined
                  @click="addDialog = true"
                >
                  <v-icon color="primary" left>add</v-icon>
                  Add Invoice
                </v-btn>
              </v-card-title>
              <v-card-text>
                <v-data-table
                  v-model="selected"
                  :search="search"
                  :headers="headers"
                  :items="data"
                  item-key="name"
                  class="elevation-1"
                  :loading="loading"
                  loading-text="Loading... Please wait"
                >
                  <template v-slot:item="row">
                    <tr>
                      <td>
                        <v-tooltip right>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              rounded
                              small
                              color="blue-grey"
                              dark
                              :to="'invoice-detail/' + row.item.slug"
                              class="ma-1"
                              v-bind="attrs"
                              v-on="on"
                            >
                              <v-icon size="15">fas fa-eye</v-icon>
                              View
                            </v-btn>
                          </template>
                          <span>View Invoice</span>
                        </v-tooltip>
                        <v-tooltip right>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              rounded
                              small
                              color="teal"
                              dark
                              @click="copyLink(row.item.slug)"
                              class="ma-1"
                              v-bind="attrs"
                              v-on="on"
                            >
                              <v-icon size="15" left>fas fa-clone</v-icon>
                              Copy Link
                            </v-btn>
                          </template>
                          <span>Copy Invoice Link</span>
                        </v-tooltip>
                        <div class="pa-2">
                          <v-tooltip right>
                            <template v-slot:activator="{ on, attrs }">
                              <a
                                target="_blank"
                                :href="'mailto:' + row.item.client.email"
                                v-bind="attrs"
                                v-on="on"
                              >
                                SEND INVOICE <v-icon size="15">send</v-icon>
                              </a>
                            </template>
                            <span>Send Invoice</span>
                          </v-tooltip>
                        </div>
                        <span v-if="!row.item.sentToClient">
                          <v-tooltip right>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                rounded
                                small
                                color="error"
                                @click="loadDeleteItem(row.item)"
                                class="ma-1"
                                v-bind="attrs"
                                v-on="on"
                              >
                                <v-icon size="15">delete_forever</v-icon>
                                Delete
                              </v-btn>
                            </template>
                            <span>Delete Invoice</span>
                          </v-tooltip>
                        </span>
                      </td>
                      <td>{{ row.item.number }}</td>
                      <td>{{ row.item.title }}</td>
                      <td>{{ row.item.client.name }}</td>
                      <td>
                        <h2>
                          {{ row.item.amountCharged | formatNumber }}
                        </h2>
                      </td>
                      <td>
                        <h2>
                          {{ row.item.amountPaid | formatNumber }}
                        </h2>
                        <span v-if="row.item.sentToClient">
                          <v-btn
                            v-if="row.item.status != 'Paid'"
                            rounded
                            small
                            color="white"
                            light
                            @click="loadPay(row.item)"
                            class="ma-1"
                          >
                            <v-icon left size="13"
                              >account_balance_wallet</v-icon
                            >
                            Accept Pay
                          </v-btn>
                        </span>
                      </td>
                      <td>
                        <v-btn
                          rounded
                          small
                          color="white"
                          light
                          @click="
                            loadItem(row.item.items, row.item.amountCharged)
                          "
                          class="ma-1"
                        >
                          <v-icon left size="13">fas fa-eye</v-icon>
                          View Items
                        </v-btn>
                      </td>
                      <td>
                        <v-chip
                          v-if="row.item.status == 'Not Sent, Unpaid'"
                          color="red darken-2"
                          text-color="white"
                        >
                          {{ row.item.status }}
                        </v-chip>
                        <v-chip
                          v-else-if="row.item.status == 'Sent, Unpaid'"
                          color="orange darken-2"
                          text-color="white"
                        >
                          {{ row.item.status }}
                        </v-chip>
                        <v-chip
                          v-else-if="row.item.status == 'Paid'"
                          color="teal darken-2"
                          text-color="white"
                        >
                          {{ row.item.status }}
                        </v-chip>
                      </td>
                      <td>{{ row.item.addedBy }}</td>
                      <td>
                        {{
                          parseInt(row.item.added)
                            | moment("dddd, MMMM Do YYYY, h:mm:ss a")
                        }}
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-card-text>
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
      </v-layout>
    </v-container>

    <v-dialog v-model="itemDialog" width="700px">
      <v-card>
        <v-card-title class="primary white--text" dark>
          <div>
            <span class="headline text-uppercase">Invoice Items</span>
          </div>
          <v-spacer></v-spacer>
          <small>&#8358;</small>
          {{ totalAmount | formatNumber }}
          <v-spacer></v-spacer>
          <v-btn fab small color="white" @click="itemDialog = false">
            <v-icon color="primary">fas fa-times</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="my-6 py-3">
          <v-list three-line shaped v-for="(item, i) in currentItem" :key="i">
            <v-subheader>{{ item.title }}</v-subheader>
            <v-list-item-group>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>labels</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-html="item.title"></v-list-item-title>
                  <v-list-item-subtitle>Title</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>info</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    v-html="item.description"
                  ></v-list-item-title>
                  <v-list-item-subtitle>Description</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>info</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.qty | formatNumber }} @ &#8358;{{
                      item.rate | formatNumber
                    }}
                    each
                  </v-list-item-title>
                  <v-list-item-subtitle>Quantity & Rate</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>account_balance_wallet</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    <h1>
                      <small>&#8358;</small>{{ item.amount | formatNumber }}
                    </h1>
                  </v-list-item-title>
                  <v-list-item-subtitle>Amount Charged</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-grey darken-1" text @click="itemDialog = false">
            <v-icon>close</v-icon> Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="addDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="addDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Invoice Generator </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              :disabled="processing"
              rounded
              large
              color="white"
              light
              @click="addItem()"
            >
              {{ processing ? processingTitle : saveBtn }}
              <v-icon color="primary" right v-if="!processing">send</v-icon>
              <v-icon color="primary" right v-else>fa-spinner fa-spin</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container>
          <v-form
            lazy-validation
            ref="addForm"
            @submit.prevent="addItem(data.length)"
          >
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="formData.title"
                  :rules="titleRules"
                  label="Invoice Title"
                  required
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-autocomplete
                  v-model="formData.client"
                  :items="clients"
                  item-text="name"
                  label="Select Client"
                  :rules="clientRules"
                  return-object
                  single-line
                  required
                  outlined
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row v-for="item in formData.items" :key="item.index">
              <v-col cols="2">
                <v-text-field
                  v-model="item.title"
                  :rules="titleRules"
                  label="Title"
                  required
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-textarea
                  v-model="item.description"
                  :rules="descriptionRules"
                  required
                  outlined
                  label="Description"
                  rows="1"
                ></v-textarea>
              </v-col>
              <v-col cols="1">
                <v-text-field
                  v-model="item.qty"
                  :rules="qtyRules"
                  label="Qty"
                  required
                  outlined
                  @change="computeAmount(item)"
                ></v-text-field>
                {{ item.qty | formatNumber }}
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="item.rate"
                  :rules="rateRules"
                  label="Rate"
                  required
                  outlined
                  @change="computeAmount(item)"
                ></v-text-field>
                <small>&#8358;</small>
                {{ item.rate | formatNumber }}
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="item.amount"
                  :rules="amountRules"
                  label="Amount"
                  required
                  outlined
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="1">
                <v-btn
                  color="red darken-2"
                  dark
                  x-large
                  @click="deleteRow(item.index)"
                >
                  Delete
                </v-btn>
              </v-col>
            </v-row>
            <v-btn color="teal darken-2" dark x-large @click="addRow">
              Add New Invoice Item
            </v-btn>
            <v-row>
              <v-col cols="8"></v-col>
              <v-col cols="4" class="white--text">
                <v-row>
                  <v-col
                    cols="6"
                    sm="7"
                    class="blue-grey black--text lighten-5"
                  >
                    <h2 class="font-weight-light">Sub-Total</h2>
                    <h3 class="font-weight-light">Tax @ 7.5%</h3>
                  </v-col>
                  <v-col
                    cols="6"
                    sm="5"
                    class="blue-grey black--text lighten-4"
                  >
                    <h2>
                      <small>&#8358;</small>
                      {{ totalAmount | formatNumber }}
                    </h2>
                    <h3>
                      <small>&#8358;</small>
                      {{ (totalAmount * tax) | formatNumber }}
                    </h3>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6" sm="7" class="orange">
                    <h2 class="font-weight-light">Total Amount</h2>
                  </v-col>
                  <v-col cols="6" sm="5" class="orange darken-3">
                    <h2>
                      <small>&#8358;</small>
                      {{ (totalAmount + totalAmount * tax) | formatNumber }}
                    </h2>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6" sm="7" class="teal">
                    <h2 class="font-weight-light">Total Paid</h2>
                  </v-col>
                  <v-col cols="6" sm="5" class="teal darken-2">
                    <h2>
                      <small>&#8358;</small>
                      0
                    </h2>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6" sm="7" class="red">
                    <h2 class="font-weight-light">Amount Due</h2>
                  </v-col>
                  <v-col cols="6" sm="5" class="red darken-2">
                    <h2>
                      <small>&#8358;</small>
                      {{ (totalAmount + totalAmount * tax) | formatNumber }}
                    </h2>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                Payment Instruction
              </v-col>
              <v-col cols="12">
                <vue-editor v-model="formData.paymentInstruction"></vue-editor>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" width="700px">
      <v-card>
        <v-card-title class="primary white--text" dark>
          <div>
            <span class="headline text-uppercase">Delete {{ itemTitle }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn fab small color="white" @click="deleteDialog = false">
            <v-icon color="primary">fas fa-times</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="my-6 py-3">
          <h2 class="red--text">
            Are you sure you want to delete ( {{ currentItem.title }} )
            information?
          </h2>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue-grey darken-1" text @click="deleteDialog = false">
            <v-icon>close</v-icon> Close
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            rounded
            large
            color="red"
            dark
            @click="deleteItem(currentItem.id)"
          >
            <v-icon color="white">delete_forever</v-icon>
            Delete Item
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="payDialog" width="700px">
      <v-card>
        <v-card-title class="primary white--text" dark>
          <div>
            <span class="headline text-uppercase">Accept Payment</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn fab small color="white" @click="payDialog = false">
            <v-icon color="primary">fas fa-times</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="my-6 py-3">
          <h2 class="font-weight-light">
            Ensure you have received payment from client before proceeding with
            the following step.
          </h2>
          <v-row>
            <v-col cols="12">
              <h2 class="font-weight-light">
                Total Amount Charged
                <strong class="blue-grey--text">
                  <small>&#8358;</small>
                  {{ currentItem.amountCharged | formatNumber }}
                </strong>
              </h2>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="amountPaidByClient"
                label="How much did client pay in?"
                required
                outlined
                type="tel"
              ></v-text-field>
              {{ amountPaidByClient | formatNumber }}
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue-grey darken-1" text @click="payDialog = false">
            <v-icon>close</v-icon> Close
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            rounded
            large
            color="teal"
            dark
            @click="acceptPay(currentItem.id)"
          >
            <v-icon color="white">check</v-icon>
            Accept Payment
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import methods from "./methods";
import mounted from "./mounted";
import { VueEditor } from "vue2-editor";

export default {
  created() {
    document.title = "News";
  },
  name: "News",
  components: {
    VueEditor
  },
  data() {
    return {
      totalAmount: 0,
      totalAmountCharged: 0,
      tax: 0.075,
      currentInputIndex: 0,
      rows: [],
      user: [],
      userProfile: [],
      currentItem: [],
      loading: true,
      payDialog: false,
      itemDialog: false,
      loadNewInvoice: false,
      singleSelect: false,
      addDialog: false,
      deleteDialog: false,
      saveBtn: "Save Invoice",
      processing: false,
      processingTitle: "Processing",
      tableTitle: "Invoices",
      itemTitle: "Add New Invoice",
      selected: [],
      search: "",
      headers: [
        { text: "ACTIONS", value: "id" },
        { text: "Number", value: "number" },
        {
          text: "Title",
          align: "start",
          value: "title"
        },
        { text: "Client", value: "client" },
        { text: "Amount in Naira", value: "amountCharged" },
        { text: "Paid in Naira", value: "amountPaid" },
        { text: "Items", value: "items" },
        { text: "Status", value: "status" },
        { text: "Added By", value: "addedBy" },
        { text: "Added On", value: "added" }
      ],
      data: [],
      clients: [],
      res: "",
      amountPaidByClient: 0,
      formData: {
        number: "",
        title: "",
        paymentInstruction: "",
        client: [],
        items: [],
        status: "Not Sent, Unpaid"
      },
      numberRules: [v => !!v || "Invoice number is required"],
      titleRules: [v => !!v || "Invoice title is required"],
      clientRules: [v => !!v || "Invoice client is required"],
      amountRules: [v => !!v || "Invoice amount is required"],
      qtyRules: [v => !!v || "Invoice quantity is required"],
      descriptionRules: [v => !!v || "Invoice description is required"],
      rateRules: [v => !!v || "Invoice rate is required"],
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
