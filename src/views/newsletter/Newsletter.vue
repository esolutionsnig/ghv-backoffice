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
                      <td>{{ row.item.name }}</td>
                      <td>{{ row.item.email }}</td>
                      <td>
                        <v-chip
                          v-if="row.item.status == 'Activated'"
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
                  color="primary"
                  @click="sendMessage()"
                >
                  <v-icon left dark>email</v-icon>
                  Send {{ selected.length }} Clients Message
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  class="mx-2"
                  dark
                  large
                  color="error"
                  @click="deleteItem()"
                >
                  <v-icon left dark>email</v-icon>
                  Delete {{ selected.length }} Items
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
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import methods from "./methods";
import mounted from "./mounted";

export default {
  created() {
    document.title = "Newsletter Subscribers";
  },
  name: "Newsletter",
  data() {
    return {
      userProfileId: null,
      loading: true,
      singleSelect: false,
      tableTitle: "Newsletter Subscribers",
      selected: [],
      search: "",
      headers: [
        {
          text: "Subscriber Name",
          align: "start",
          value: "name"
        },
        { text: "Email Address", value: "email" },
        { text: "Subscription Status", value: "status" }
      ],
      data: [],
      res: "",
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
