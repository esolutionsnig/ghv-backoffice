import { db } from "../../firebase/db";
export default {
  mounted() {
    this.userProfileId = JSON.parse(this.$localStorage.get("userProfileId"));

    this.$bind("data", db.collection("ourServices")).then(
      () => (this.loading = false)
    );
  }
};
