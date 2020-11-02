import { db } from "../../firebase/db";
export default {
  methods: {
    // Init Delete
    loadItem(item, amount) {
      this.currentItem = item;
      this.totalAmount = amount;
      this.itemDialog = true;
    },

    // Init Delete
    loadDeleteItem(item) {
      this.currentItem = item;
      this.deleteDialog = true;
    },

    // Init Pay
    loadPay(item) {
      this.currentItem = item;
      this.payDialog = true;
    },

    // Create slug
    sanitizeTitle: function(title) {
      var slug = "";
      // Change to lower case
      var titleLower = title.toLowerCase();
      // Letter "e"
      slug = titleLower.replace(/e|é|è|ẽ|ẻ|ẹ|ê|ế|ề|ễ|ể|ệ/gi, "e");
      // Letter "a"
      slug = slug.replace(/a|á|à|ã|ả|ạ|ă|ắ|ằ|ẵ|ẳ|ặ|â|ấ|ầ|ẫ|ẩ|ậ/gi, "a");
      // Letter "o"
      slug = slug.replace(/o|ó|ò|õ|ỏ|ọ|ô|ố|ồ|ỗ|ổ|ộ|ơ|ớ|ờ|ỡ|ở|ợ/gi, "o");
      // Letter "u"
      slug = slug.replace(/u|ú|ù|ũ|ủ|ụ|ư|ứ|ừ|ữ|ử|ự/gi, "u");
      // Letter "d"
      slug = slug.replace(/đ/gi, "d");
      // Trim the last whitespace
      slug = slug.replace(/\s*$/g, "");
      // Change whitespace to "-"
      slug = slug.replace(/\s+/g, "-");

      return slug;
    },

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

    addRow() {
      this.formData.items.push({
        title: "",
        description: "",
        qty: "",
        rate: "",
        amount: ""
      });
    },
    deleteRow(index) {
      this.formData.items.splice(index, 1);
    },

    // Compute Amount
    computeAmount(item) {
      item.amount = item.qty * item.rate;
      this.getTotal();
    },

    // Get Total Amount
    getTotal() {
      this.formData.items.forEach(item => {
        this.totalAmount += item.amount;
      });
    },

    // Add Item
    addItem() {
      let newNumber = this.data.length + 1;
      let number = "100" + newNumber;
      if (this.$refs.addForm.validate()) {
        this.processing = true;
        // Sanitize title
        let slug = this.sanitizeTitle(this.formData.title);
        let timestamp = Date.now();
        let taxAmount = this.totalAmount * this.tax;

        db.collection("invoice")
          .add({
            addedBy: this.userProfile.name,
            added: timestamp,
            number: number,
            title: this.formData.title,
            paymentInstruction: this.formData.paymentInstruction,
            tax: this.tax,
            items: this.formData.items,
            client: this.formData.client,
            clientId: this.formData.client.uid,
            status: this.formData.status,
            amountCharged: this.totalAmount + taxAmount,
            sentToClient: false,
            slug: slug + "-" + timestamp
          })
          .then(result => {
            this.res = result;
            this.processing = false;
            this.addDialog = false;
            this.snackbar = true;
            this.msg =
              "Invoice for ( " +
              this.formData.client.name +
              " )  has been generated successfully.";
            this.msgTimeout = 6500;
            this.msgIcon = "thumb_up";
            this.msgColor = "success";
            this.title = "";
            this.description = "";
            this.dialog = false;
          })
          .catch(error => {
            this.processing = false;
            this.snackbar = true;
            this.msg = "Error: " + error;
            this.msgTimeout = 6500;
            this.msgIcon = "thumb_down";
            this.msgColor = "error";
          });
      }
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
          this.msg = "Payment accepted.";
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

    // Delete news item
    deleteItem(id) {
      db.collection("invoice")
        .doc(id)
        .delete()
        .then(result => {
          this.res = result;
          this.snackbar = true;
          this.msg = "Invoice successfully deleted.";
          this.msgTimeout = 6500;
          this.msgIcon = "thumb_up";
          this.msgColor = "success";
          this.deleteDialog = false;
        })
        .catch(error => {
          this.snackbar = true;
          this.msg = "Error: " + error;
          this.msgTimeout = 6500;
          this.msgIcon = "thumb_down";
          this.msgColor = "error";
        });
    }
  }
};
