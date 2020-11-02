<template>
  <v-app>
    <component :is="layout">
      <router-view></router-view>
    </component>
  </v-app>
</template>

<script>
const general_layout = "general-layout";

export default {
  name: "App",
  computed: {
    layout() {
      return this.$route.meta.layout || general_layout;
    }
  }
};
</script>
<style lang="css">
.avatar-border {
  width: 81px;
  height: 81px;
  padding: 4px;
  margin: 10px;
  border: 2px solid #fff;
  border-radius: 50%;
}
.bottom-border {
  margin: 20px 0;
  border-bottom: 1px solid #183153;
}
.primary-color {
  color: #183153 !important;
}
.primary {
  background: #183153 !important;
}
.secondary {
  background: #af0000 !important;
}
.accent {
  background: #01579b !important;
}
.error {
  background: #f44336 !important;
}
.info {
  background: #2196f3 !important;
}
.success {
  background: #00bfa5 !important;
}
.warning {
  background: #ff8f00 !important;
}
.mlf {
  margin-left: 250px;
}
a {
  text-decoration: none !important;
}
a:hover {
  text-decoration: none !important;
}

.section-title {
  position: relative;
  padding-bottom: 10px;
  font-weight: 100 !important;
}
.section-title + * {
  margin-top: 40px;
}
.section-title:before,
.section-title:after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  width: 35px;
  height: 2px;
  margin-left: 6px;
  background: #32498d;
}
.section-title:after {
  right: 50%;
  left: auto;
  margin-right: 6px;
}
.section-title span:before,
.section-title span:after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  width: 6px;
  height: 6px;
  margin-top: -2px;
  margin-left: 2px;
  background: #32498d;
  border-radius: 50%;
}
.section-title span:after {
  right: 50%;
  left: auto;
  margin-right: 2px;
  margin-left: 0;
}

.section-title-white {
  position: relative;
  padding-bottom: 10px;
  font-weight: 100 !important;
}
.section-title-white + * {
  margin-top: 40px;
}
.section-title-white:before,
.section-title-white:after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  width: 35px;
  height: 2px;
  margin-left: 6px;
  background: #fff;
}
.section-title-white:after {
  right: 50%;
  left: auto;
  margin-right: 6px;
}
.section-title-white span:before,
.section-title-white span:after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  width: 6px;
  height: 6px;
  margin-top: -2px;
  margin-left: 2px;
  background: #fff;
  border-radius: 50%;
}
.section-title-white span:after {
  right: 50%;
  left: auto;
  margin-right: 2px;
  margin-left: 0;
}
.f12 {
  font-size: 12px;
}
.f13 {
  font-size: 13px;
}
.f14 {
  font-size: 14px;
}
.container.fill-height {
  display: flex;
  flex-wrap: wrap;
  align-items: unset !important;
}
</style>
