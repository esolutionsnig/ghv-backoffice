import { db } from "../../firebase/db";
export default {
  methods: {
    sendMessage() {
      this.selected.forEach(value => {
        db.collection("contactUsMessage")
          .doc(value)
          .update({
            status: this.responded
          })
          .then(result => {
            this.res = result;
            this.snackbar = true;
            this.msg = "Message successfully marked as contacted.";
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
    },
    deleteItem() {
      this.selected.forEach(value => {
        db.collection("contactUsMessage")
          .doc(value)
          .delete()
          .then(result => {
            this.res = result;
            this.snackbar = true;
            this.msg = "Message successfully deleted.";
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
  }
};
