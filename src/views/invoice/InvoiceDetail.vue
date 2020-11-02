<template>
  <div class="grey lighten-3 pa-9" style="min-height: 700px">
    <v-container class="pa-8 white" style="border-radius: 30px !important">
      <div id="printSection">
        <v-row>
          <v-col cols="12" sm="8">
            <h1 class="font-weight-light text-uppercase text-center">
              Invoice
            </h1>
          </v-col>
          <v-col cols="12" sm="4" class="text-right">
            <p class="font-weight-light text-uppercase">
              Date:
              {{
                parseInt(data.added) | moment("dddd, MMMM Do YYYY, h:mm:ss a")
              }}
            </p>
            <p class="font-weight-light text-uppercase">
              Invoice Number:
              {{ data.number }}
            </p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6">
            <v-row>
              <v-col cols="12">
                <h3 class="font-weight-light">From:</h3>
                <div>{{ ghv.name }}</div>
                <div>
                  <small>Phone Number</small>:
                  <p v-html="ghv.phoneNumber"></p>
                </div>
                <div>
                  <small>Email Address</small>:
                  <p v-html="ghv.email"></p>
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" sm="6">
            <v-row class="text-right">
              <v-col cols="12" v-if="data.client">
                <h3 class="font-weight-light">To:</h3>
                <div>{{ data.client.name }}</div>
                <div>
                  <small>Phone Number</small>:
                  <p v-html="data.client.phoneNumber"></p>
                </div>
                <div>
                  <small>Email Address</small>:
                  <p v-html="data.client.email"></p>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <table width="100%">
              <thead
                style="padding: 30px 20px; color: #fff; font-size: 22px;  background: #183153;"
              >
                <tr class="thead">
                  <th width="20%">Title</th>
                  <th width="40%">Description</th>
                  <th width="8%">Qty</th>
                  <th width="12%">Rate</th>
                  <th width="20%">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in data.items" :key="item.index">
                  <td style="padding: 5px 10px;">{{ item.title }}</td>
                  <td style="padding: 5px 10px;">{{ item.description }}</td>
                  <td style="padding: 5px 10px;">
                    {{ item.qty | formatNumber }}
                  </td>
                  <td style="padding: 5px 10px;">
                    <small>&#8358;</small> {{ item.rate | formatNumber }}
                  </td>
                  <td style="padding: 5px 10px;">
                    <h3>
                      <small>&#8358;</small>{{ item.amount | formatNumber }}
                    </h3>
                  </td>
                </tr>
              </tbody>
            </table>
          </v-col>
        </v-row>
        <v-row style="margin-top: 60px">
          <v-col cols="8"></v-col>
          <v-col cols="4" style="color: #fff;">
            <v-row>
              <v-col
                cols="6"
                sm="7"
                style="padding: 20px; background: #eceff1; color: #000;"
              >
                <h2 style="font-weight: 300">Sub-Total</h2>
                <h3 style="font-weight: 300">Tax @ 7.5%</h3>
              </v-col>
              <v-col
                cols="6"
                sm="5"
                style="padding: 20px; background: #cfd8dc; color: #000;"
              >
                <h2>
                  <small>&#8358;</small>
                  {{
                    (data.amountCharged - data.amountCharged * data.tax)
                      | formatNumber
                  }}
                </h2>
                <h3>
                  <small>&#8358;</small>
                  {{ (data.amountCharged * data.tax) | formatNumber }}
                </h3>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="6"
                sm="7"
                style="padding: 20px; background: #ff9800; color: #fff; font-weight: 300;"
              >
                <h2>Total Amount</h2>
              </v-col>
              <v-col
                cols="6"
                sm="5"
                style="padding: 20px; background: #ef6c00; color: #fff;"
              >
                <h2>
                  <small>&#8358;</small>
                  {{ data.amountCharged | formatNumber }}
                </h2>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="6"
                sm="7"
                style="padding: 20px; background: #009688; color: #fff; font-weight: 300;"
              >
                <h2>Total Paid</h2>
              </v-col>
              <v-col
                cols="6"
                sm="5"
                style="padding: 20px; background: #00796b; color: #fff;"
              >
                <h2>
                  <small>&#8358;</small>
                  0
                </h2>
              </v-col>
            </v-row>
            <v-row v-if="data.status != 'Paid'">
              <v-col
                cols="6"
                sm="7"
                style="padding: 20px; background: #f44336; color: #fff; font-weight: 300;"
              >
                <h2 class="font-weight-light">Amount Due</h2>
              </v-col>
              <v-col
                cols="6"
                sm="5"
                style="padding: 20px; background: #af0000; color: #fff;"
              >
                <h2>
                  <small>&#8358;</small>
                  {{ data.amountBalance | formatNumber }}
                </h2>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row style="padding: 20px; background: #eceff1; margin: 40px 0">
          <v-col cols="12">
            <h4 class="font-weight-light">
              Payment Instruction
            </h4>
            <p>Please make all cheques payable to Great Hayden Vineyard.</p>
            <p>Yu can as well make a bank transfer to the following account:</p>
            <ul>
              <li>Account Name: Great Hayden Vineyard</li>
              <li>Bank Name : Fidelity Bank</li>
              <li>Account Number : 4011312694</li>
            </ul>
            <p>
              Once payment is made, send us a mail containing your payment
              evidence to enbale us mark your invoice as PAID.
            </p>

            <h3>
              For convenience sake, kindly use our trusted Payment platform by
              clicking the MAKE PAYMENT button below.
            </h3>
          </v-col>
        </v-row>
      </div>

      <v-row>
        <!-- <v-col cols="12" sm="6"></v-col> -->
        <v-col cols="12" class="text-center" v-if="data.client">
          <v-btn x-large color="white" class="mr-3" light @click="printInvoice">
            <v-icon left>fas fa-print</v-icon>
            Print Invoice
          </v-btn>

          <paystack
            v-if="data.status != 'Paid'"
            :amount="data.amountBalance * 100"
            :email="data.client.email"
            :paystackkey="paystackkey"
            :reference="reference"
            :callback="callback"
            :close="close"
            :embed="false"
            class="paystack-btn"
          >
            <v-icon left color="white">fas fa-money-bill-alt</v-icon>
            Make Payment
          </paystack>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import methods from "./vmethods";
import mounted from "./vmounted";
import paystack from "vue-paystack";

export default {
  created() {
    document.title = "Invoice Detail";
  },
  name: "InvoiceDetail",
  components: {
    paystack
  },
  data() {
    return {
      user: [],
      userProfile: [],
      paystackkey: "sk_test_df054cea9f445a692657a1ece4e053f283491b9f",

      loading: true,
      data: [],
      ghv: {
        name: "Great Hayden Vineyard Services Limited",
        email: "info@greathayden.com",
        phoneNumber: "+234 (0) 903 605 0308",
        address:
          "<p>1, Airport Road, Opposite Pilgrims and Cargo Terminal Access Gate,</p><p> HAJJ Camp.</p><p>Lagos, Nigeria.</p>"
      },
      res: "",
      snackbar: false,
      multiLine: true,
      msgTimeout: 4000,
      msgColor: "primary",
      msgIcon: "done_all",
      msg: "",
      url: this.$route.params.id
    };
  },
  computed: {
    reference() {
      let text = "";
      let possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (let i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    }
  },
  mixins: [methods, mounted]
};
</script>

<style lang="scss" scoped>
.paystack-btn {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 auto;
  padding: 12px 15px;
  color: #fff;
  font-weight: 500;
  letter-spacing: 2px;
  text-decoration: none;
  text-indent: 2px;
  text-transform: uppercase;
  vertical-align: middle;
  white-space: nowrap;
  background: #183153;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 20%), 0 2px 2px 0 rgba(0, 0, 0, 14%);
  // 0 1px 5px 0 rgba(0, 0, 0, 12%);
  border-radius: 4px;
  outline: 0;
  transition-duration: 1s;
  transition-property: box-shadow, transform, opacity;
  transition-timing-function: cubic-bezier(40%, 0, 20%, 1);
}
</style>
