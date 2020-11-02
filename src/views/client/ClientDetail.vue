<template>
  <div class="profile">
    <v-container>
      <v-row>
        <v-col cols="12" md="3">
          <div class="card-item">
            <div class="card-header">
              <img :src="clientData.imageURL" class="card-header__img" />
              <div class="card-header__text">
                <span class="card-header__name">
                  {{ clientData.name }}
                </span>
                <span class="card-header__job">
                  Invoices:
                  {{ data.length | formatNumber }}
                </span>
              </div>
            </div>
            <ul class="card-detail">
              <li class="card-detail__li">
                <p class="card-detail__txt">
                  <span class="card-detail__icon mr-1">
                    <v-icon color="purple lighten-2">email</v-icon>
                  </span>
                  Email
                </p>
                <p class="card-detail__str">{{ clientData.email }}</p>
              </li>
              <li class="card-detail__li">
                <p class="card-detail__txt">
                  <span class="card-detail__icon mr-1">
                    <v-icon color="pink lighten-2">phone</v-icon>
                  </span>
                  Phone
                </p>
                <p class="card-detail__str">{{ clientData.phoneNumber }}</p>
              </li>
              <li class="card-detail__li">
                <p class="card-detail__txt">
                  <span class="card-detail__icon mr-1">
                    <v-icon color="teal lighten-2">home</v-icon>
                  </span>
                  Address
                </p>
                <p class="card-detail__str" v-html="clientData.address"></p>
              </li>
            </ul>
          </div>
        </v-col>
        <v-col cols="12" md="9">
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
                    :to="'/invoices'"
                  >
                    <v-icon color="primary" left>fas fa-eye</v-icon>
                    View All Invoices
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
                                :to="'/invoice-detail/' + row.item.slug"
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
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import methods from "./cmethods";
import mounted from "./cmounted";

export default {
  created() {
    document.title = "Client Detail";
  },
  name: "ClientDetail",
  data() {
    return {
      user: [],
      clientData: [],
      userProfile: [],
      loading: true,
      singleSelect: false,
      tableTitle: "Client Invoices",
      search: "",
      headers: [
        { text: "ACTIONS", value: "id" },
        {
          text: "Title",
          align: "start",
          value: "title"
        },
        { text: "Address", value: "address" },
        { text: "Email", value: "email" },
        { text: "Phone Number", value: "phoneNumber" },
        { text: "Added By", value: "addedBy" },
        { text: "Added On", value: "added" }
      ],
      selected: [],
      data: [],
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
  mixins: [methods, mounted]
};
</script>

<style lang="scss" scoped>
.v-list-item__content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-self: center;
  flex: 1 1;
  overflow: unset !important;
  padding: 12px 0;
}
.v-list-item__title,
.v-list-item__subtitle {
  flex: 1 1 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: unset !important;
}

.card {
  width: 100%;
  height: 100vh;

  &-item {
    position: relative;
    overflow: hidden;
    width: 99%;
    background-color: #f2f2f2;
    box-shadow: 0 8px 20px 10px rgba(89, 56, 49, 16%);
    border: 0 solid rgba(255, 255, 255, 30%);
    border-radius: 30px;
    transition: all 1s;

    &:nth-child(2) {
      margin-top: -50px;
      .card-header__bg {
        background-color: #183153;
      }
    }
  }

  &-header {
    position: relative;
    width: 100%;

    &__bg {
      z-index: 1;
      width: calc(100% + 50px);
      height: 310px;
      margin-top: -50%;
      margin-left: 50%;
      background-color: #183153;
      box-shadow: 0 0 28px 10px rgba(33, 150, 234, 30%);
      border-radius: 50%;
      transform: translateX(-50%);
    }

    &__img {
      position: relative;
      display: block;
      width: 300px;
      height: 300px;
      padding: 0;
      margin-right: auto;
      margin-left: auto;
      box-shadow: 0 9px 28px 8px rgba(93, 93, 93, 20%);
      border: 0 solid rgba(255, 255, 255, 60%);
      border-radius: 50%;
      transform: translateY(-50px);
      transition: all 1s;
      visibility: visible;
    }

    &__text {
      width: 100%;
      margin-top: -15px;
    }

    &__name {
      display: block;
      font-size: 22px;
      font-weight: 400;
      letter-spacing: 1.2px;
      text-align: center;
    }

    &__job {
      display: block;
      padding: 0 20px;
      color: #525151;
      font-size: 15px;
      line-height: 160%;
      letter-spacing: 1px;
      text-align: center;
    }
  }

  &-detail {
    width: 100%;
    padding: 0;
    margin: 20px 0;
    font-size: 15px;

    &__li {
      display: flex;
      align-items: center;
      width: 95%;
      padding: 6px 10px;
      margin: 8px auto;
      background: #ece9e9;
      border-radius: 10px;
      transition: all ease-in-out 1s;
    }

    &__txt {
      min-width: 35%;
      margin-bottom: 1px;
      color: #403f3f;
      font-weight: 300;
    }

    &__str {
      margin-bottom: 1px;
      color: #403f3f;
      font-weight: 400;
    }
  }

  &-social {
    display: flex;
    justify-content: center;
    height: 70px;
    background-color: #f5f4f7;
    border-top: 1px solid #d6d6d6;

    &__item {
      width: 100%;
      height: 40px;
      margin: 10px;
      border-radius: 10px 10px 0 0;
      cursor: pointer;
    }
  }
}

@media all and (max-width: 1024px) {
  .card {
    &-item {
      &:nth-child(2) {
        margin-top: 30px;
      }

      &:nth-child(3) {
        display: none;
      }
    }
  }
}

@media all and (max-width: 768px) {
  .card {
    &-bg-txt {
      font-size: 7.4vw;
    }
    &-item {
      &:nth-child(2) {
        display: none;
      }
    }
  }
}
</style>
