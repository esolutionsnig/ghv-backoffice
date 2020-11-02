import { db } from "../../firebase/db";
export default {
  methods: {
    sendMessage() {},
    deleteItem() {
      this.selected.forEach(value => {
        db.collection("mailingList")
          .doc(value)
          .delete()
          .then(result => {
            this.res = result;
            this.snackbar = true;
            this.msg = "Subscriber successfully deleted.";
            this.msgTimeout = 6500;
            this.msgIcon = "thumb_up";
            this.msgColor = "success";
          })
          .catch(error => {
            this.snackbar = true;
            this.msg = "Error: " + error;
            this.msgTimeout = 6500;
            this.msgIcon = "thumb_down";
            this.msgColor = "error";
          });
      });
    }
    // Get User Profile
    // getUserProfile(id) {
    //   db.collection("userProfile")
    //     .doc(id)
    //     .get()
    //     .then(doc => {
    //       if (doc.exists) {
    //         this.$localStorage.set("userProfile", JSON.stringify(doc.data()));
    //         this.userProfile = doc.data();
    //         window.location.reload();
    //       }
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // },
  }
};
