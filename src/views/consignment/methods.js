import { db } from "../../firebase/db";

export default {
  methods: {
    // Move to packaging
    moveOne() {
      if (this.title != "" && this.clientName != "") {
        this.e1 = 2;
      } else {
        this.snackbar = true;
        this.msg = "Error: Please fill all fields";
        this.msgTimeout = 6500;
        this.msgIcon = "thumb_down";
        this.msgColor = "error";
      }
    },
    moveTwo() {
      if (
        this.itemDeliveryType != "" &&
        this.itemFragile != "" &&
        this.itemQty != "" &&
        this.itemType != "" &&
        this.itemValuedAt != "" &&
        this.itemWeight != ""
      ) {
        this.e1 = 3;
      } else {
        this.snackbar = true;
        this.msg = "Error: Please fill all fields";
        this.msgTimeout = 6500;
        this.msgIcon = "thumb_down";
        this.msgColor = "error";
      }
    },
    moveThree() {
      if (
        this.currentLocation != "" &&
        this.deliveryContactName != "" &&
        this.deliveryContactPhone != "" &&
        this.deliveryContactLocation != "" &&
        this.amountCharged != ""
      ) {
        this.e1 = 4;
      } else {
        this.snackbar = true;
        this.msg = "Error: Please fill all fields";
        this.msgTimeout = 6500;
        this.msgIcon = "thumb_down";
        this.msgColor = "error";
      }
    },

    // Set Item Fragile State
    setFragile(el) {
      this.active_el = el;
      if (el == 1) {
        this.itemFragile = "YES";
      } else if (el == 2) {
        this.itemFragile = "NO";
      }
    },

    // Set Item Fragile State
    setMovement(el) {
      this.movement = el;
      if (el == 1) {
        this.itemDeliveryType = "TRUCK MOVEMENT";
      } else if (el == 2) {
        this.itemDeliveryType = "BIKE MOVEMENT";
      } else if (el == 3) {
        this.itemDeliveryType = "AIR MOVEMENT";
      } else if (el == 4) {
        this.itemDeliveryType = "SEA MOVEMENT";
      }
    },

    // Set Item Type
    setType(el) {
      this.type = el;
      if (el == 1) {
        this.itemType = "ELECTRONICS";
      } else if (el == 2) {
        this.itemType = "DOCUMENTS";
      } else if (el == 3) {
        this.itemType = "PERISHABLES";
      } else if (el == 4) {
        this.itemType = "OTHERS";
      }
    },

    // Set Item status
    setStatus(el) {
      this.ss = el;
      if (el == 1) {
        this.currentStatus = this.statusShipped;
      } else if (el == 2) {
        this.currentStatus = this.statusArrived;
      } else if (el == 3) {
        this.currentStatus = this.statusDelivered;
      }
    },

    // Fetch Item
    loadItem(item) {
      this.item = item;
      this.dialog = true;
    },

    // Get Airway Bill Number
    getAirwayBillNumber() {
      let curTimeStamp = Math.round(+new Date() / 1000);
      this.airWayBillNumber = "GHVL-ABN-" + curTimeStamp;
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

    // Add Item
    addConsignment() {
      this.processing = true;
      // Sanitize title
      let slug = this.sanitizeTitle(this.title);
      db.collection("consignment")
        .add({
          title: this.title,
          clientName: this.clientName,
          airWayBillNumber: this.airWayBillNumber,
          status: this.statusPackaged,
          addedBy: this.userProfileId,
          deliveryContactName: this.deliveryContactName,
          deliveryContactPhone: this.deliveryContactPhone,
          deliveryContactLocation: this.deliveryContactLocation,
          amountCharged: this.amountCharged,
          itemDescription: this.itemDescription,
          itemDeliveryType: this.itemDeliveryType,
          itemFragile: this.itemFragile,
          itemQty: this.itemQty,
          itemType: this.itemType,
          itemValuedAt: this.itemValuedAt,
          itemWeight: this.itemWeight,
          currentLocation: this.currentLocation,
          slug: slug
        })
        .then(result => {
          this.res = result;
          this.processing = false;
          this.showTable = true;
          this.snackbar = true;
          this.msg =
            "New consignment ( " +
            this.title +
            " )  has been added successfully.";
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
    },

    // Edit Item
    updateItem() {
      if (this.currentLocation == "" || this.currentStatus == "") {
        this.processing = false;
        this.snackbar = true;
        this.msg = "Error: Kindly set the current status and location.";
        this.msgTimeout = 6500;
        this.msgIcon = "thumb_down";
        this.msgColor = "error";
      } else {
        this.processing = true;
        db.collection("consignment")
          .doc(this.item.id)
          .update({
            currentLocation: this.currentLocation,
            status: this.currentStatus
          })
          .then(result => {
            this.res = result;
            this.processing = false;
            this.dialog = false;
            this.snackbar = true;
            this.msg =
              "Consignment ( " +
              this.item.title +
              " )  has been updated successfully.";
            this.msgTimeout = 6500;
            this.msgIcon = "thumb_up";
            this.msgColor = "success";
            this.title = "";
            this.description = "";
            this.editDialog = false;
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
    }
  }
};
