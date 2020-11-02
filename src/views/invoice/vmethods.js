import { db } from "../../firebase/db";
export default {
  methods: {
    // Get invoice data
    getData() {
      db.collection("invoice")
        .where("slug", "==", this.url)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.data = doc.data();
          });
        });
    },

    // Print Invoice
    printInvoice() {
      this.$htmlToPaper("printSection");
    },

    // Accept Item
    acceptPay(id) {
      db.collection("invoice")
        .doc(id)
        .update({
          status: "Paid",
          amountPaid: this.amountPaidByClient
        })
        .then(result => {
          this.res = result;
          this.snackbar = true;
          this.msg = "Payment completed.";
          this.msgTimeout = 6500;
          this.msgIcon = "thumb_up";
          this.msgColor = "success";
          this.title = "";
          this.description = "";
          this.payDialog = false;
        })
        .catch(error => {
          this.snackbar = true;
          this.msg = "Error: " + error;
          this.msgTimeout = 6500;
          this.msgIcon = "thumb_down";
          this.msgColor = "error";
        });
    },

    // PAYSTACK
    callback: function(response) {
      console.log(response);
      // Update Invoice Status
      this.acceptPay();
    },
    close() {
      this.snackbar = true;
      this.msg = "Payment failed. Closed due to error.";
      this.msgTimeout = 6500;
      this.msgIcon = "thumb_down";
      this.msgColor = "error";
    }
  }
};
