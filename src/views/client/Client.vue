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
                  @click="dialog = true"
                >
                  <v-icon color="primary" left>add</v-icon>
                  Add Client
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
                        <v-btn
                          rounded
                          small
                          color="cyan"
                          dark
                          :to="'client/' + row.item.slug"
                          class="ma-1"
                        >
                          <v-icon left size="13">fas fa-eye</v-icon>
                          View Client
                        </v-btn>
                        <v-btn
                          rounded
                          small
                          color="orange"
                          @click="loadItem(row.item)"
                          class="ma-1"
                        >
                          <v-icon left size="13">edit</v-icon>
                          Edit
                        </v-btn>
                        <v-btn
                          rounded
                          small
                          color="error"
                          @click="loadDeleteItem(row.item)"
                          class="ma-1"
                        >
                          <v-icon left size="13">delete</v-icon>
                          Delete
                        </v-btn>
                      </td>
                      <td>
                        <div v-if="row.item.imageURL == ''">
                          <v-btn
                            rounded
                            outlined
                            small
                            color="blu-grey"
                            @click="initUpload(row.item)"
                          >
                            <v-icon left color="blue-grey" size="13"
                              >cloud_upload</v-icon
                            >
                            Upload Image
                          </v-btn>
                        </div>
                        <div v-else>
                          <img :src="row.item.imageURL" alt="N" width="100" />
                          <br />
                          <v-btn
                            rounded
                            outlined
                            small
                            color="blu-grey"
                            @click="initUpload(row.item)"
                          >
                            <v-icon left color="blue-grey" size="13"
                              >cloud_upload</v-icon
                            >
                            Change Image
                          </v-btn>
                        </div>
                      </td>
                      <td>{{ row.item.name }}</td>
                      <td v-html="row.item.address"></td>
                      <td>
                        <a :href="'mailto:' + row.item.email">
                          {{ row.item.email }}
                        </a>
                      </td>
                      <td>{{ row.item.phoneNumber }}</td>
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

    <v-dialog v-model="dialog" width="800px">
      <v-card>
        <v-card-title class="primary white--text" dark>
          <div>
            <span class="headline text-uppercase">{{ itemTitle }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn fab small color="white" @click="dialog = false">
            <v-icon color="primary">fas fa-times</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="my-6 py-3">
          <v-form lazy-validation ref="addForm" @submit.prevent="addItem">
            <v-text-field
              v-model="formData.name"
              :rules="nameRules"
              label="Client Name"
              required
              outlined
            ></v-text-field>
            <v-text-field
              v-model="formData.email"
              :rules="emailRules"
              label="Client Email Address"
              required
              outlined
              type="email"
            ></v-text-field>
            <v-text-field
              v-model="formData.phoneNumber"
              :rules="phoneNumberRules"
              label="Client Phone Number"
              required
              outlined
            ></v-text-field>
            <vue-editor v-model="formData.address"></vue-editor>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue-grey darken-1" text @click="dialog = false">
            <v-icon>close</v-icon> Close
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="processing"
            rounded
            large
            color="primary"
            dark
            @click="addItem"
          >
            <v-icon color="white" left v-if="!processing">save</v-icon>
            <v-icon color="white" left v-else>fa-spinner fa-spin</v-icon>
            {{ processing ? processingTitle : saveBtn }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editDialog" width="700px">
      <v-card>
        <v-card-title class="primary white--text" dark>
          <div>
            <span class="headline text-uppercase">Edit {{ itemTitle }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn fab small color="white" @click="editDialog = false">
            <v-icon color="primary">fas fa-times</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="my-6 py-3">
          <v-form lazy-validation ref="editForm" @submit.prevent="editItem">
            <v-text-field
              v-model="editFormData.name"
              :rules="nameRules"
              label="Client Name"
              required
              outlined
            ></v-text-field>
            <v-text-field
              v-model="editFormData.email"
              :rules="emailRules"
              label="Client Email Address"
              required
              outlined
              type="email"
            ></v-text-field>
            <v-text-field
              v-model="editFormData.phoneNumber"
              :rules="phoneNumberRules"
              label="Client Phone Number"
              required
              outlined
            ></v-text-field>
            <vue-editor v-model="editFormData.address"></vue-editor>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue-grey darken-1" text @click="editDialog = false">
            <v-icon>close</v-icon> Close
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="processing"
            rounded
            large
            color="primary"
            dark
            @click="editItem(editFormData.id)"
          >
            <v-icon color="white" left v-if="!processing">save</v-icon>
            <v-icon color="white" left v-else>fa-spinner fa-spin</v-icon>
            {{ processing ? processingTitle : saveBtn }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="imageDialog" width="600px">
      <v-form ref="uploadForm" @submit.prevent="uploadFile">
        <v-card class="text-center">
          <v-card-title class="primary white--text" dark>
            <div>
              <span class="headline text-uppercase">
                <span class="font-weight-thin">Editing:</span>
                {{ editFormData.title }}
              </span>
            </div>
            <v-spacer></v-spacer>
            <v-btn fab small color="white" @click="imageDialog = false">
              <v-icon color="primary">fas fa-times</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <h3 class="font-weight-thin">
              Ensure you select on valid and official images
            </h3>

            <v-row>
              <v-col cols="12" sm="2" md="2"></v-col>
              <v-col cols="12" sm="8" md="8">
                <v-img
                  v-if="imageUrl"
                  :src="imageUrl"
                  height="350px"
                  width="350"
                >
                </v-img>
              </v-col>
              <v-col cols="12" sm="2" md="2"></v-col>
            </v-row>

            <div class="my-3"></div>

            <v-btn
              v-if="!uploading"
              outlined
              color="primary"
              @click="onPickFile"
            >
              <v-icon color="primary" left>cloud_upload</v-icon>
              {{ uploadBtn }}
            </v-btn>
            <input
              type="file"
              style="display: none"
              ref="fileInput"
              accept="image/*"
              @change="onFilePicked"
            />

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
          </v-card-text>
          <v-card-actions>
            <span v-if="uploading">
              <v-progress-linear
                indeterminate
                color="primary"
                height="15"
              ></v-progress-linear>
              {{ uploadText }}
            </span>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="uploading"
              color="primary"
              dark
              rounded
              large
              @click="uploadFile(editFormData.id)"
            >
              <v-icon left v-if="!uploading">save</v-icon>
              <v-icon left v-else>fa-spinner fa-spin</v-icon>
              {{ uploading ? uploadingTitle : "Upload Image" }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
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
            Are you sure you want to delete ( {{ currentItem.name }} )
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
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
import methods from "./methods";
import mounted from "./mounted";

export default {
  created() {
    document.title = "Client";
  },
  name: "Client",
  components: {
    VueEditor
  },
  data() {
    return {
      user: [],
      userProfile: [],
      currentItem: [],
      loading: true,
      singleSelect: false,
      dialog: null,
      deleteDialog: null,
      editDialog: null,
      imageDialog: null,
      uploadingTitle: "Uploading",
      progress: 0,
      image: null,
      fileUrl: null,
      imageUrl: null,
      uploadText: "",
      uploadBtn: "Click to choose image",
      uploading: false,
      saveBtn: "Save Changes",
      processing: false,
      processingTitle: "Processing",
      tableTitle: "Client",
      itemTitle: "Add Client Item",
      selected: [],
      search: "",
      headers: [
        { text: "ACTIONS", value: "id" },
        { text: "Logo", value: "imageURL" },
        {
          text: "Name",
          align: "start",
          value: "name"
        },
        { text: "Address", value: "address" },
        { text: "Email", value: "email" },
        { text: "Phone Number", value: "phoneNumber" },
        { text: "Added By", value: "addedBy" },
        { text: "Added On", value: "added" }
      ],
      data: [],
      res: "",
      formData: {
        name: "",
        address: "",
        email: "",
        added: "",
        addedBy: "",
        phoneNumber: "",
        imageURL: "https://s1.logaster.com/static/v3/img/products/logo.png"
      },
      editFormData: {
        id: "",
        name: "",
        addedBy: "",
        address: "",
        email: "",
        phoneNumber: ""
      },
      nameRules: [v => !!v || "Client name is required"],
      addressRules: [v => !!v || "Client address is required"],
      phoneNumberRules: [v => !!v || "Client phone number is required"],
      emailRules: [v => !!v || "Client email address is required"],
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
