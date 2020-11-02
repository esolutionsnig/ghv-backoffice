import { db } from "../../firebase/db";
export default {
  mounted() {
    this.user = JSON.parse(this.$localStorage.get("user"));
    this.userProfile = JSON.parse(this.$localStorage.get("userProfile"));

    this.$bind("data", db.collection("news")).then(
      () => (this.loading = false)
    );
  }
};
