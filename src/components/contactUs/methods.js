import { db } from "../../firebase/db";

export default {
  methods: {
    // Add Item to Database
    addItem(id) {
      if (id && this.$refs.addForm.validate()) {
        this.processing = false;
        db.collection("contactInformation")
          .add({
            addedBy: id,
            title: this.title,
            address: this.address,
            email: this.email,
            country: this.country,
            state: this.state,
            city: this.city,
            weekdaysOpening: this.weekdaysOpening,
            weekdaysClosing: this.weekdaysClosing,
            weekendsOpening: this.weekendsOpening,
            weekendsClosing: this.weekendsClosing,
            phoneNumber: this.phoneNumber,
            phoneNumberDial: this.phoneNumberDial
          })
          .then(result => {
            this.res = result;
            this.processing = false;
            this.snackbar = true;
            this.msg =
              "New office location ( " +
              this.title +
              " )  has been added successfully.";
            this.msgTimeout = 6500;
            this.msgIcon = "thumb_up";
            this.msgColor = "success";
            this.$refs.addForm.reset();
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

    // Delete item from database
    deleteItem(id) {
      db.collection("contactInformation")
        .doc(id)
        .delete()
        .then(result => {
          this.res = result;
          this.snackbar = true;
          this.msg = "Office location has been deleted successfully.";
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
    },

    // Call Office
    async callOffice(id) {
      console.log("Calling");
      console.log(id);
    },

    // Email Office
    async emailOffice(id) {
      console.log("Emailing");
      console.log(id);
    },

    // Reset form
    reset() {
      this.$refs.form.reset();
    },

    // Get States
    getStates() {
      this.countryAdded = true;
      if (this.country != "Nigeria") {
        this.states = [
          {
            name: "Others",
            lgas: ["Others"]
          }
        ];
      }
    },

    // Get Cities
    getCities() {
      this.stateAdded = true;
      this.states.forEach(element => {
        if (this.state === element.name) {
          this.cities = element.lgas;
        }
      });
    }
  }
};
