<template>
  <div>
    <v-app-bar app color="white" light>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>
        <v-img
          :src="images.logo"
          alt="Great Hayden Vineyard"
          width="220"
        ></v-img>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <div v-if="signedIn">
        <v-btn
          icon
          color="primary"
          v-tooltip.bottom-start="'My Profile'"
          @click="goToProfile()"
        >
          <v-icon>fa-user-tie</v-icon>
        </v-btn>

        <v-btn
          icon
          color="secondary"
          @click="signUserOut"
          v-tooltip.bottom-start="'Sign Out'"
        >
          <v-icon v-if="processing">fa-spinner fa-spin</v-icon>
          <v-icon v-else>power_settings_new</v-icon>
        </v-btn>
      </div>
    </v-app-bar>
    <nav>
      <v-navigation-drawer
        v-model="drawer"
        dark=""
        app
        class="primary nav-drawer version-data"
      >
        <v-row>
          <v-col cols="12" sm="4" md="4">
            <div class="avatar-border">
              <v-avatar class="white" size="70">
                <img :src="userProfile.photoURL" alt="A" />
              </v-avatar>
            </div>
          </v-col>
          <v-col cols="12" sm="8" md="8">
            <div class="my-4 mx-2">
              <h4 class="white--text font-weight-medium">
                {{ userProfile.name }}
              </h4>
              <small class="white--text font-weight-light">
                {{ userProfile.officialDesignation }}
              </small>
              <v-btn
                depressed
                small
                color="primary lighten-1"
                @click="goToProfile()"
                >View Profile</v-btn
              >
            </div>
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <v-list>
          <v-list-item
            v-for="link in links"
            :key="link.text"
            router
            :to="link.route"
            active-class="border"
          >
            <v-list-item-action>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ link.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <template v-slot:append>
          <div class="blue-grey darken-4 pa-2 text-center white--text">
            <v-icon size="15" class="mr-2">fas fa-tags</v-icon>{{ appVersion }}
          </div>
        </template>
      </v-navigation-drawer>
    </nav>
  </div>
</template>

<script>
import { auth } from "../firebase/db";
export default {
  created() {
    auth.onAuthStateChanged(user => {
      this.signedIn = !!user;
    });
  },
  data() {
    return {
      drawer: true,
      signedIn: false,
      processing: false,
      userProfile: [],
      links: [
        { icon: "fas fa-home", text: "Dashboard", route: "/" },
        {
          icon: "fas fa-house-user",
          text: "About Us",
          route: "/about-us"
        },
        {
          icon: "fas fa-suitcase",
          text: "Services",
          route: "/services"
        },
        {
          icon: "fas fa-map-marker-alt",
          text: "Contact Information",
          route: "/contact-information"
        },
        {
          icon: "fas fa-newspaper",
          text: "Newsletter",
          route: "/newsletter"
        },
        {
          icon: "fas fa-newspaper",
          text: "News",
          route: "/news"
        },
        {
          icon: "email",
          text: "Message",
          route: "/message"
        },
        {
          icon: "fas fa-tasks",
          text: "Pickup Service",
          route: "/pickup-service"
        },
        {
          icon: "fas fa-file-invoice",
          text: "Quote Request",
          route: "/quote-request"
        },
        {
          icon: "fas fa-truck-loading",
          text: "Consignment",
          route: "/consignment"
        },
        {
          icon: "store",
          text: "Clients",
          route: "/clients"
        },
        {
          icon: "fas fa-file-invoice",
          text: "Invoice",
          route: "/invoices"
        }
      ],
      images: {
        logo: require("@/assets/logo.png")
      },
      appVersion: "Version 1.0.1"
    };
  },
  mounted() {
    this.user = JSON.parse(this.$localStorage.get("user"));
    this.userProfile = JSON.parse(this.$localStorage.get("userProfile"));
  },
  methods: {
    // Go to profile page
    goToProfile() {
      this.$router.replace({ name: "Profile" });
    },
    // Sign User Out
    signUserOut() {
      this.processing = true;
      auth
        .signOut()
        .then(function() {
          localStorage.removeItem("user");
          localStorage.removeItem("userProfile");
          window.location.reload();
        })
        .catch(function() {});
    }
  }
};
</script>

<style lang="scss" scoped>
.border {
  border-left: 4px solid #fff;
}
</style>
