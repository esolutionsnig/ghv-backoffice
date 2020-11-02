import { db } from "../../firebase/db";
import jsPDF from "jspdf";

export default {
  methods: {
    // Fetch Item
    loadItem(item) {
      this.item = item;
      this.dialog = true;
    },

    //jspdf does not include the bootstrap style layout
    generatePdf() {
      const doc = new jsPDF("p", "pt", "A4");

      // doc.text("This is just a drill", 15, 15);

      const html = this.$refs.pickupService.innerHTML;

      doc.fromHTML(html, this.margins.left, this.margins.top, {
        width: this.margins.width
      });

      doc.save("pickupService.pdf");
    },

    // Mark Item as Processed
    markAsProcessed() {
      this.selected.forEach(value => {
        db.collection("pickupService")
          .doc(value)
          .update({
            status: this.processed
          })
          .then(result => {
            this.res = result;
            this.snackbar = true;
            this.msg = "Pickup service successfully marked as processed.";
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

    // Mark Item as Processed
    markAsUnprocessed() {
      this.selected.forEach(value => {
        db.collection("pickupService")
          .doc(value)
          .update({
            status: this.unprocessed
          })
          .then(result => {
            this.res = result;
            this.snackbar = true;
            this.msg = "Pickup service successfully marked as unprocessed.";
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
