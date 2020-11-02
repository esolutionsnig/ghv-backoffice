<template>
  <div class="profile">
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <div class="card-item">
            <div class="card-header">
              <div class="card-header__bg">
                <v-btn
                  color="white"
                  class="mr-9"
                  dark
                  large
                  absolute
                  bottom
                  right
                  fab
                  v-tooltip.bottom-start="'Change Profile Image'"
                  @click="imageDialog = true"
                >
                  <v-icon color="primary" size="43">add_photo_alternate</v-icon>
                </v-btn>
              </div>
              <img :src="userProfile.photoURL" class="card-header__img" />
              <div class="card-header__text">
                <span class="card-header__name">
                  {{ userProfile.name }}
                </span>
                <span class="card-header__job">
                  {{ userProfile.officialDesignation }}
                </span>
              </div>
            </div>
            <ul class="card-detail">
              <li class="card-detail__li">
                <p class="card-detail__txt">
                  <span class="card-detail__icon mr-1">
                    <v-icon color="purple lighten-2">email</v-icon>
                  </span>
                  Email Address
                </p>
                <p class="card-detail__str">{{ user.email }}</p>
              </li>
              <li class="card-detail__li">
                <p class="card-detail__txt">
                  <span class="card-detail__icon mr-1">
                    <v-icon color="pink lighten-2">phone</v-icon>
                  </span>
                  Phone Number
                </p>
                <p class="card-detail__str">{{ userProfile.phoneNumber }}</p>
              </li>
              <li class="card-detail__li">
                <p class="card-detail__txt">
                  <span class="card-detail__icon mr-1">
                    <v-icon color="teal lighten-2">home</v-icon>
                  </span>
                  House Address
                </p>
                <p class="card-detail__str">{{ userProfile.houseAddress }}</p>
              </li>
              <li class="card-detail__li">
                <p class="card-detail__txt">
                  <span class="card-detail__icon mr-4">
                    <v-icon color="orange lighten-2">fas fa-map-pin</v-icon>
                  </span>
                  Location
                </p>
                <p
                  class="card-detail__str"
                  v-if="userProfile.addressCity != ''"
                >
                  {{ userProfile.addressCity }}, {{ userProfile.addressState }},
                  {{ userProfile.addressCountry }}
                </p>
              </li>
            </ul>
          </div>
        </v-col>
        <v-col cols="12" md="6">
          <v-row>
            <v-col cols="12" md12>
              <h2
                class="text-center display2 blue-grey--text text--darken-4 text-uppercase font-weight-medium section-title"
              >
                <v-icon color="blue-grey darken-4" class="pa-2" size="28">
                  edit
                </v-icon>
                {{ editFormTitle }} <span></span>
              </h2>
              <v-row>
                <v-col cols="12">
                  Enter only valid information. Note that the entered address
                  will be verified by management. <br />
                  <span class="orange--text darken-3 text-uppercase"
                    >NOTE: All fields are required</span
                  >
                </v-col>
              </v-row>
              <v-card flat>
                <v-card-text>
                  <v-form ref="updateForm" @submit.prevent="updateRecord">
                    <v-row>
                      <v-col cols="12">
                        <v-autocomplete
                          name="Address Country"
                          :items="countries"
                          :rules="[
                            v => !!v || 'Country of residence is required'
                          ]"
                          item-text="name"
                          v-model="addressCountry"
                          label="Country of residence"
                          required
                          outlined
                          @change="getStates"
                        ></v-autocomplete>

                        <v-autocomplete
                          name="Address State"
                          :disabled="!countryAdded"
                          :items="states"
                          :rules="[
                            v => !!v || 'State of residence is required'
                          ]"
                          item-text="name"
                          v-model="addressState"
                          label="State of residence"
                          required
                          outlined
                          @change="getCities"
                        ></v-autocomplete>

                        <v-autocomplete
                          name="City"
                          :disabled="!stateAdded"
                          :items="cities"
                          :rules="[
                            v => !!v || 'Local government area is required'
                          ]"
                          item-text="name"
                          v-model="addressCity"
                          label="Local government area"
                          required
                          outlined
                          @change="getAddress"
                        ></v-autocomplete>
                        <v-textarea
                          outlined
                          name="House Address"
                          id="houseAddres"
                          label="House Address (Street Number and Name)"
                          v-model="houseAddress"
                          :rules="houseAddresRules"
                          :value="userProfile.houseAddres"
                          :disabled="!cityAdded"
                        ></v-textarea>
                      </v-col>
                    </v-row>
                  </v-form>
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
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    dark
                    rounded
                    large
                    :disabled="processing"
                    @click="updateRecord()"
                  >
                    <v-icon left v-if="!processing">save</v-icon>
                    <v-icon left v-else>fa-spinner fa-spin</v-icon>
                    {{ processing ? processingTitle : saveButton }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-col>

        <v-dialog v-model="imageDialog" width="600px">
          <v-form ref="uploadForm" @submit.prevent="uploadFile">
            <v-card class="text-center">
              <v-card-title>
                <span class="headline">File Uploader</span>
              </v-card-title>
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
                  @click="uploadFile()"
                >
                  <v-icon left v-if="!uploading">save</v-icon>
                  <v-icon left v-else>fa-spinner fa-spin</v-icon>
                  {{ uploading ? uploadingTitle : uploadBtn }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import methods from "./methods";
import mounted from "./mounted";

export default {
  created() {
    document.title = "Profile";
  },
  name: "Profile",
  data() {
    return {
      userId: "",
      uploadingTitle: "Uploading",
      progress: 0,
      image: null,
      fileUrl: null,
      imageUrl: null,
      uploadText: "",
      uploadBtn: "Click to choose image",
      imageDialog: false,
      uploading: false,
      disabled: 1,
      countryAdded: false,
      stateAdded: false,
      cityAdded: false,
      snackbar: false,
      multiLine: true,
      msgTimeout: 4000,
      msgColor: "primary",
      msgIcon: "done_all",
      msg: "",
      user: [],
      userProfile: [],
      userProfileImage: null,
      userProfileId: "",
      cancelButton: "Cancel",
      saveButton: "Save Changes",
      editFormTitle: "Update Your Record With Us",
      houseAddress: "",
      addressCity: "",
      addressState: "",
      addressCountry: "",
      countries: [],
      states: [],
      cities: [],
      houseAddresRules: [
        v => !!v || "Your house number and street name is required"
      ],
      processingTitle: "Processing",
      processing: false,
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        thumbnailWidth: 150,
        maxFilesize: 0.5,
        headers: { "My-Awesome-Header": "header value" }
      }
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
    width: 85%;
    margin: 30px;
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
