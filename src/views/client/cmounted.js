export default {
  mounted() {
    this.user = JSON.parse(this.$localStorage.get("user"));
    this.userProfile = JSON.parse(this.$localStorage.get("userProfile"));

    this.getClientData();
  }
};
