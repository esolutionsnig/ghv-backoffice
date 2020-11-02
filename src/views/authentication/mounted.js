import { auth } from "../../firebase/db";
export default {
  mounted() {
    auth.onAuthStateChanged(user => {
      if (user == null) {
        console.log("Empty Reqs");
      } else {
        this.$router.replace({ name: "Dashboard" });
      }
    });
  }
};
