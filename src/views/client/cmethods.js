import { db } from "../../firebase/db";
export default {
  methods: {
    // Copy Link
    copyLink(url) {
      let link = window.location.origin + "/invoice-detail/" + url;
      this.$copyText(link)
        .then(success => {
          this.snackbar = true;
          this.msg =
            "Invoice successfully copied. Next => Click the SEND INVOICE button to send this link to client via mail.";
          this.msgTimeout = 16500;
          this.msgIcon = "thumb_up";
          this.msgColor = "primary";
          this.res = success;
        })
        .catch(error => {
          this.snackbar = true;
          this.msg = "Invoice failed to copied. Please try again" + error;
          this.msgTimeout = 16500;
          this.msgIcon = "thumb_up";
          this.msgColor = "error";
        });
    },

    // Get client data
    getClientData() {
      db.collection("client")
        .where("slug", "==", this.url)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.clientData = doc.data();
          });
          //get invoices
          this.getClientInvoices();
        });
    },

    // Get client data
    getClientInvoices() {
      db.collection("invoice")
        .where("clientId", "==", this.clientData.uid)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.data.push(doc.data());
          });
          this.loading = false;
        });
    }
  }
};
