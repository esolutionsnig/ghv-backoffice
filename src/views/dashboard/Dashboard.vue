<template>
  <div class="dashboard">
    <v-row>
      <v-col cols="12" md="8">
        <v-container>
          <v-row>
            <v-col cols="12" md="9" offset-md="1">
              <v-text-field
                label="Search Consigment"
                prepend-inner-icon="search"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2" align="center" justify="center">
              <v-badge class="mt-5" color="error" overlap>
                <template slot="badge">2</template>
                <v-icon color="tertiary">mdi-bell</v-icon>
              </v-badge>
            </v-col>
            <v-col cols="12" md="12">
              <h1 class="headline mb-2 grey--text">Money Status</h1>
              <template>
                <div id="app">
                  <GChart
                    type="ColumnChart"
                    :data="chartData"
                    :options="chartOptions"
                  ></GChart>
                </div>
              </template>
            </v-col>
            <v-col cols="12" md12>
              <h1 class="headline mb-2 grey--text">Budgets</h1>
            </v-col>
            <v-col cols="12" md="8">
              <v-card>
                <v-list two-line>
                  <v-list-item>
                    <v-list-item-avatar color="blue darken-4">
                      <v-icon dark>fas fa-car</v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title
                        >Auto & Transportation</v-list-item-title
                      >
                      <v-list-item-subtitle>$750 left</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-content align="right">
                      <v-list-item-title class="indigo--text"
                        >$1,200</v-list-item-title
                      >
                      <v-list-item-subtitle>$500 of 1,200</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider inset></v-divider>
                  <v-list-item>
                    <v-list-item-avatar color="red">
                      <v-icon dark>fas fa-utensils</v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>Food & Drinks</v-list-item-title>
                      <v-list-item-subtitle>$750 left</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-content align="right">
                      <v-list-item-title class="red--text"
                        >$1,200</v-list-item-title
                      >
                      <v-list-item-subtitle>$500 of 1,200</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider inset></v-divider>
                  <v-list-item>
                    <v-list-item-avatar color="cyan">
                      <v-icon dark>fas fa-receipt</v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>Stationeries</v-list-item-title>
                      <v-list-item-subtitle>$750 left</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-content align="right">
                      <v-list-item-title class="cyan--text"
                        >$1,200</v-list-item-title
                      >
                      <v-list-item-subtitle>$500 of 1,200</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider inset></v-divider>
                  <v-list-item>
                    <v-list-item-avatar color="orange">
                      <v-icon dark>fas fa-gamepad</v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>Game</v-list-item-title>
                      <v-list-item-subtitle>$750 left</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-content align="right">
                      <v-list-item-title class="orange--text"
                        >$1,200</v-list-item-title
                      >
                      <v-list-item-subtitle>$500 of 1,200</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-card class="mx-auto" max-height="400">
                <v-img
                  class="white--text align-end"
                  height="150px"
                  :src="images.icon"
                ></v-img>
                <v-card-title class="pb-0">Lighning Delivery</v-card-title>
                <v-card-text class="text-primary">
                  <div>Ship from anywhere</div>
                  <div>We deliver to your doorstep</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
      <v-col cols="12" md="4">
        <v-container>
          <v-row>
            <v-col cols="12" md12>
              <v-list two-line>
                <v-list-item>
                  <v-list-item-avatar>
                    <v-img :src="images.iconSmall"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>AAE IdeaPro</v-list-item-title>
                    <v-list-item-subtitle
                      >aaeideapro@comp.com</v-list-item-subtitle
                    >
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon>fas fa-sign-out-alt</v-icon>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  created() {
    document.title = "Dashboard";
  },
  name: "Dashboard",
  data() {
    return {
      chartData: [
        ["Year", "Sales", "Experiences", "Profit"],
        ["2014", 1000, 400, 200],
        ["2015", 1170, 460, 250],
        ["2016", 660, 1120, 300],
        ["2017", 1030, 540, 350],
        ["2018", 1025, 530, 302],
        ["2019", 1040, 560, 356]
      ],
      chartOptions: {
        chart: {
          title: "Company Performance",
          subtitle: "Sales, Expenses, and Profit: 2014 - 2019"
        }
      },
      images: {
        icon: require("@/assets/icon.png"),
        iconSmall: require("@/assets/iconSmall.png")
      }
    };
  },
  methods: {
    // Reload Just Once
    reloadOnce() {
      if (this.$localStorage.get("reloaded")) {
        localStorage.removeItem("reloaded");
      } else {
        this.$localStorage.set("reloaded", "1");
        location.reload();
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
