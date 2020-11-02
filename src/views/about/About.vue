<template>
  <div>
    <v-container>
      <v-layout>
        <v-row style="min-height: 740px">
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
                      <td>{{ row.item.title }}</td>
                      <td v-html="row.item.description"></td>
                      <td>
                        <div v-if="row.item.photoURL == ''">
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
                          <img
                            :src="row.item.photoURL"
                            alt="About Us"
                            width="120"
                          />
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
                          Edit
                        </v-btn>
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

        <v-dialog v-model="dialog" width="700px">
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
                  v-model="formData.title"
                  :rules="titleRules"
                  label="Title"
                  required
                  outlined
                ></v-text-field>

                <vue-editor v-model="formData.description"></vue-editor>
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
                <span class="headline text-uppercase"
                  >Edit {{ itemTitle }}</span
                >
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
                  v-model="editFormData.title"
                  :rules="titleRules"
                  label="Title"
                  required
                  outlined
                ></v-text-field>

                <vue-editor
                  v-model="editFormData.description"
                  :value="editFormData.description"
                ></vue-editor>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="blue-grey darken-1"
                text
                @click="editDialog = false"
              >
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
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
import methods from "./methods";
import mounted from "./mounted";

export default {
  created() {
    document.title = "About Us";
  },
  name: "About",
  components: {
    VueEditor
  },
  data() {
    return {
      appTitle: process.env.VUE_APP_TITLE,
      appShortName: process.env.VUE_APP_SHORT_NAME,
      dialog: null,
      editDialog: null,
      imageDialog: null,
      userProfileId: null,
      loading: true,
      uploadingTitle: "Uploading",
      progress: 0,
      image: null,
      fileUrl: null,
      imageUrl: null,
      uploadText: "",
      uploadBtn: "Click to choose image",
      uploading: false,
      senderInfo: "Sender Information",
      pickupInfo: "Pickup Information",
      deliveryInfo: "Delivery Information",
      packageInfo: "Package Information",
      singleSelect: false,
      tableTitle: "About Us",
      formData: {
        title: "",
        description: "",
        photoURL: ""
      },
      editFormData: {
        id: "",
        title: "",
        description: ""
      },
      selected: [],
      search: "",
      headers: [
        {
          text: "Title",
          align: "start",
          value: "title"
        },
        { text: "Description", value: "description" },
        { text: "Image", value: "photoURL" },
        { text: "ACTIONS", value: "title" }
      ],
      data: [],
      item: [],
      itemTitle: "About Us Information",
      res: "",
      snackbar: false,
      multiLine: true,
      msgTimeout: 4000,
      msgColor: "primary",
      msgIcon: "done_all",
      msg: "",
      titleRules: [v => !!v || "About us title is required"],
      descriptionRules: [v => !!v || "About us description is required"],
      processing: false,
      processingTitle: "Processing",
      saveBtn: "Save"
    };
  },
  mixins: [methods, mounted]
};
</script>

<style lang="scss" scoped></style>
