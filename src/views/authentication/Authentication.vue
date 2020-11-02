<template>
  <v-app>
    <v-main>
      <v-container class="fill-height auth-bg" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="8">
            <v-card class="elevation-12">
              <v-window v-model="step">
                <v-window-item :value="1">
                  <v-row>
                    <v-col cols="12" md="6" class="auth-inner-bg">
                      <v-card-text class="white--text mt-4">
                        <img :src="images.sideImage" alt="Welcome" />
                      </v-card-text>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-card-text class="mt-4">
                        <div class="text-center">
                          <img :src="images.logo" alt="Great Hayden Vineyard" />
                        </div>
                        <h3
                          class="text-center display2 blue-grey--text text--darken-4 text-uppercase font-weight-medium section-title mt-6"
                        >
                          <v-icon
                            color="blue-grey darken-4"
                            class="pa-2"
                            size="22"
                            >{{ signInIcon }}</v-icon
                          >
                          {{ signInTitle }} <span></span>
                        </h3>
                        <div class="text-center ma-6">
                          {{ signInWelcome }}
                        </div>
                        <v-form ref="signInForm" @submit.prevent="signIn">
                          <v-text-field
                            id="email"
                            label="Email Address"
                            name="Email"
                            prepend-icon="email"
                            type="email"
                            color="blue darken-4"
                            v-model="email"
                            :rules="emailRules"
                          ></v-text-field>
                          <v-text-field
                            id="password"
                            label="Password"
                            name="Password"
                            prepend-icon="lock"
                            color="blue darken-4"
                            v-model="password"
                            :value="password"
                            :append-icon="
                              value ? 'visibility' : 'visibility_off'
                            "
                            @click:append="() => (value = !value)"
                            :type="value ? 'password' : 'text'"
                          ></v-text-field>
                          <v-alert
                            v-if="hasError"
                            text
                            dense
                            color="error"
                            icon="warning"
                            border="left"
                            >{{ errorMessage }}</v-alert
                          >
                        </v-form>
                      </v-card-text>
                      <v-card-actions>
                        <v-row class="px-2">
                          <v-col cols="12" sm="6" md="6">
                            <v-btn
                              rounded
                              color="primary"
                              outlined=""
                              dark
                              @click="step++"
                            >
                              <v-icon left>person_add</v-icon>
                              {{ signUpTitle }}</v-btn
                            >
                          </v-col>
                          <v-col cols="12" sm="6" md="6" class="text-end">
                            <v-btn
                              color="primary"
                              dark
                              rounded
                              @click="signIn()"
                            >
                              <v-icon left v-if="!processing"
                                >assignment_ind</v-icon
                              >
                              <v-icon left v-else>fa-spinner fa-spin</v-icon>
                              {{ processing ? processingTitle : signInButton }}
                            </v-btn>
                          </v-col>
                          <v-col cols="12" class="f12">
                            {{ forgotPassword }}
                          </v-col>
                        </v-row>
                      </v-card-actions>
                    </v-col>
                  </v-row>
                </v-window-item>
                <v-window-item :value="2">
                  <v-row>
                    <v-col cols="12" md="6" class="auth-inner-bg">
                      <v-card-text class="white--text mt-4">
                        <img :src="images.sideImage" alt="Welcome" />
                      </v-card-text>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-card-text class="mt-4">
                        <div class="text-center">
                          <img :src="images.logo" alt="Great Hayden Vineyard" />
                        </div>
                        <h3
                          class="text-center display2 blue-grey--text text--darken-4 text-uppercase font-weight-medium section-title mt-6"
                        >
                          <v-icon
                            color="blue-grey darken-4"
                            class="pa-2"
                            size="22"
                            >{{ signInIcon }}</v-icon
                          >
                          {{ signUpIntro }} <span></span>
                        </h3>
                        <v-form ref="signUpForm" @submit.prevent="signUp">
                          <v-row>
                            <v-col cols="12" sm="7" md="7">
                              <v-text-field
                                id="name"
                                label="Full Name"
                                name="name"
                                prepend-icon="person"
                                type="text"
                                color="blue darken-4"
                                :rules="nameRules"
                                v-model="name"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="5" md="5">
                              <v-text-field
                                id="phoneNUmber"
                                label="Phone Number"
                                name="phoneNumber"
                                prepend-icon="phone"
                                type="text"
                                color="blue darken-4"
                                :rules="phoneNumberRules"
                                v-model="phoneNumber"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-text-field
                            id="officialDesignation"
                            label="Your Official Designation"
                            name="officialDesignation"
                            prepend-icon="work"
                            type="text"
                            color="blue darken-4"
                            :rules="officialDesignationRules"
                            v-model="officialDesignation"
                          ></v-text-field>
                          <v-text-field
                            id="email"
                            label="Email Address"
                            name="Email"
                            prepend-icon="email"
                            type="email"
                            color="blue darken-4"
                            v-model="email"
                            :rules="emailRules"
                          ></v-text-field>
                          <v-row>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field
                                id="password"
                                label="Password"
                                name="Password"
                                prepend-icon="lock"
                                color="blue darken-4"
                                v-model="password"
                                :rules="passwordRules"
                                hint="At least 8 characters containing a number, a character and a symbol"
                                :value="password"
                                :append-icon="
                                  value ? 'visibility' : 'visibility_off'
                                "
                                @click:append="() => (value = !value)"
                                :type="value ? 'password' : 'text'"
                              ></v-text-field>
                              <password
                                v-model="password"
                                badge
                                :strength-meter-only="true"
                              />
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field
                                id="confirmPassword"
                                label="Confirm Password"
                                name="ConfirmPassword"
                                prepend-icon="lock"
                                color="blue darken-4"
                                v-model="confirmPassword"
                                :rules="confirmpasswordRules"
                                :value="confirmPassword"
                                :append-icon="
                                  value ? 'visibility' : 'visibility_off'
                                "
                                @click:append="() => (value = !value)"
                                :type="value ? 'password' : 'text'"
                              ></v-text-field
                            ></v-col>
                          </v-row>
                        </v-form>
                        <v-alert
                          v-if="hasError"
                          text
                          dense
                          color="error"
                          icon="warning"
                          border="left"
                          >{{ errorMessage }}</v-alert
                        >
                      </v-card-text>
                      <v-card-actions>
                        <v-row class="px-2">
                          <v-col cols="12" sm="6" md="6">
                            <v-btn
                              rounded
                              color="primary"
                              outlined=""
                              dark
                              @click="step--"
                            >
                              <v-icon left>person_add</v-icon>
                              {{ signInButton }}</v-btn
                            >
                          </v-col>
                          <v-col cols="12" sm="6" md="6" class="text-end">
                            <v-btn
                              color="primary"
                              dark
                              rounded
                              @click="signUp()"
                            >
                              <v-icon left v-if="!processing"
                                >person_add</v-icon
                              >
                              <v-icon left v-else>fa-spinner fa-spin</v-icon>
                              {{ processing ? processingTitle : signUpTitle }}
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-card-actions>
                    </v-col>
                  </v-row>
                </v-window-item>
              </v-window>
            </v-card>
            <v-row class="footer-data white--text">
              <v-col cols="12" sm="7" md="7">
                @{{ new Date().getFullYear() }} {{ ownedBy }} {{ copyRight }}
              </v-col>
              <v-col cols="12" sm="5" md="5" class="text-end pr-7">
                {{ developerIntro
                }}<a :href="developerUrl">{{ developedBy }}</a>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Password from "vue-password-strength-meter";
import methods from "./methods";
import mounted from "./mounted";

export default {
  created() {
    document.title = "Authentication";
  },
  name: "Authentication",
  data() {
    return {
      step: 1,
      secureLength: 8,
      value: String,
      errorMessage: "",
      signedIn: false,
      hasError: false,
      loggedInUser: [],
      forgotPassword:
        "Forgotten your password? Click to here to RESET YOUR PASSWORD",
      signInWelcome: "Welcome back, please sign in to your account.",
      signInTitle: "Authentication",
      signInButton: "Sign In",
      signInIcon: "security",
      signUpIntro: "Join Us",
      signUpIcon: "group_add",
      signUpTitle: "Create An Account",
      developerIntro: "Powered By: ",
      developedBy: "Etech Data Services",
      developerUrl: "https://etech-ng.web.app/",
      ownedBy: "Great Hayden Vineyard Services Limited.",
      copyRight: "All right reserved",
      images: {
        sideImage: require("@/assets/authinnerbg.jpg"),
        logo: require("@/assets/greathayden-logo-2.png")
      },
      name: "",
      phoneNumber: "",
      officialDesignation: "",
      houseAddress: "",
      addressCity: "",
      addressState: "",
      addressCountry: "",
      email: "",
      password: "",
      confirmPassword: "",
      nameRules: [v => !!v || "Your name is required"],
      phoneNumberRules: [v => !!v || "Your phone number is required"],
      officialDesignationRules: [
        v => !!v || "Your official designation is required"
      ],
      emailRules: [
        v => !!v || "Email address name is required",
        v =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "Invalid Email address"
      ],
      passwordRules: [
        v => !!v || "Password is required",
        v => v.length > 7 || "Minimum of 8 characters required"
      ],
      confirmpasswordRules: [
        v => !!v || "Password confirmation is required",
        v => v.length > 7 || "Minimum of 8 characters required",
        v => v === this.password || "Passwors do not match"
      ],
      processingTitle: "Processing",
      processing: false,
      defaultImage:
        "https://res.cloudinary.com/etechdataservices/image/upload/v1595279243/user-laptop-512_syfg7p.png"
    };
  },
  components: { Password },
  props: {
    source: String
  },
  mixins: [methods, mounted]
};
</script>

<style lang="scss" scoped>
.auth-bg {
  height: 100%;
  background-image: url("../../assets/backoffice.png");
  background-repeat: no-repeat;
  /* Center and scale the image nicely */
  background-position: center;
  background-size: cover;
}
.auth-inner-bg {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  // height: 100%;
  height: 700px;
  background-color: #eff2f7;
}
.footer-data {
  font-size: 14px !important;
  text-shadow: 1px 1px 1px #000;
}
div.absolute {
  position: absolute;
  bottom: 20px;
  width: 28%;
}
</style>
