import { db, storageRef } from "../../firebase/db";
export default {
  methods: {
    updateRecord() {
      if (this.$refs.updateForm.validate()) {
        this.processing = true;
        db.collection("userProfile")
          .doc(this.userProfileId)
          .update({
            houseAddress: this.houseAddress,
            addressCity: this.addressCity,
            addressState: this.addressState,
            addressCountry: this.addressCountry
          })
          .then(docRef => {
            console.log(docRef);
            this.getUserProfile(this.userProfileId);
            this.processing = false;
            this.snackbar = true;
            this.msg = "Your profile has been successfully updated.";
            this.msgTimeout = 7500;
            this.msgIcon = "thumb_up";
            this.msgColor = "success";
          })
          .catch(error => {
            this.processing = false;
            console.log(error);
            this.snackbar = true;
            this.msg = "Your profile update failed. Please retry later.";
            this.msgTimeout = 7500;
            this.msgIcon = "thumb_down";
            this.msgColor = "error";
          });
      } else {
        this.snackbar = true;
        this.msg = "Kindly fill all required fields with accurate data.";
        this.msgTimeout = 7500;
        this.msgIcon = "sentiment_dissatisfied";
        this.msgColor = "warning";
      }
    },

    // Grab Image
    onPickFile() {
      this.$refs.fileInput.click();
    },

    onFilePicked(event) {
      const files = event.target.files;
      let fileName = files[0].name;
      if (fileName.lastIndexOf(".") <= 0) {
        this.snackbar = true;
        this.msg = "Please select a valid image file";
        this.msgTimeout = 6000;
        this.msgIcon = "thumb_down";
        this.msgColor = "warning";
      }
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.imageUrl = fileReader.result;
      });
      fileReader.readAsDataURL(files[0]);
      this.image = files[0];
    },

    uploadFile() {
      this.uploading = true;
      if (this.image) {
        let uploadTask = storageRef
          .child("prifleImages/" + this.userId)
          .put(this.image);
        uploadTask.on(
          "state_changed",
          snapshot => {
            var progress = (
              (snapshot.bytesTransferred / snapshot.totalBytes) *
              100
            ).toFixed(2);
            this.uploadText = "Upload Progress: " + progress + "% Done";
          },
          error => {
            this.snackbar = true;
            this.msg = error;
            this.msgTimeout = 6000;
            this.msgIcon = "thumb_down";
            this.msgColor = "warning";
          },
          res => {
            console.log(res);
            // Handle successful uploads on complete
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              this.fileUrl = downloadURL;
              // Update Database with PhotoUrl
              db.collection("userProfile")
                .doc(this.userProfileId)
                .update({
                  photoURL: downloadURL
                })
                .then(evnt => {
                  console.log(evnt);
                  this.getUserProfile(this.userProfileId);
                });
              this.uploading = false;
              this.snackbar = true;
              this.msg = "Image successfully uploaded";
              this.msgTimeout = 6000;
              this.msgIcon = "thumb_down";
              this.msgColor = "success";
              this.imageDialog = false;
            });
          }
        );
      } else {
        this.snackbar = true;
        this.msg = "Please select an image file";
        this.msgTimeout = 6000;
        this.msgIcon = "thumb_down";
        this.msgColor = "warning";
      }
    },

    // Get User Profile
    getUserProfile(id) {
      db.collection("userProfile")
        .doc(id)
        .get()
        .then(doc => {
          if (doc.exists) {
            this.$localStorage.set("userProfile", JSON.stringify(doc.data()));
            this.userProfile = doc.data();
            window.location.reload();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    // Get States
    getStates() {
      this.countryAdded = true;
      if (this.addressCountry != "Nigeria") {
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
        if (this.addressState === element.name) {
          this.cities = element.lgas;
        }
      });
    },

    // Get Cities
    getAddress() {
      this.cityAdded = true;
    }
  }
};
