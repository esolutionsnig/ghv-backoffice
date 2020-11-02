import { db, storageRef } from "../../firebase/db";
export default {
  methods: {
    // Fetch Item
    loadItem(item) {
      this.editFormData.id = item.id;
      this.editFormData.name = item.name;
      this.editFormData.email = item.email;
      this.editFormData.phoneNumber = item.phoneNumber;
      this.editFormData.address = item.address;
      this.editDialog = true;
    },

    // Init Upload
    initUpload(item) {
      this.editFormData.id = item.id;
      this.editFormData.name = item.name;
      this.editFormData.email = item.email;
      this.editFormData.phoneNumber = item.phoneNumber;
      this.editFormData.address = item.address;
      this.imageDialog = true;
    },

    // Init Delete
    loadDeleteItem(item) {
      this.currentItem = item;
      this.deleteDialog = true;
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
    addItem() {
      if (this.$refs.addForm.validate()) {
        this.processing = false;
        // Sanitize title
        let slug = this.sanitizeTitle(this.formData.name);
        let timestamp = Date.now();
        db.collection("client")
          .add({
            addedBy: this.userProfile.name,
            added: timestamp,
            name: this.formData.name,
            address: this.formData.address,
            email: this.formData.email,
            phoneNumber: this.formData.phoneNumber,
            imageURL: this.formData.imageURL,
            uid: timestamp,
            slug: slug
          })
          .then(result => {
            this.res = result;
            this.processing = false;
            this.snackbar = true;
            this.msg =
              "Client ( " +
              this.formData.title +
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
      }
    },

    // Edit Item
    editItem(id) {
      if (this.$refs.editForm.validate()) {
        let timestamp = Date.now();
        this.processing = false;
        db.collection("client")
          .doc(id)
          .update({
            added: timestamp,
            addedBy: this.userProfile.name,
            name: this.editFormData.name,
            address: this.editFormData.address,
            email: this.editFormData.email,
            phoneNumber: this.editFormData.phoneNumber
          })
          .then(result => {
            this.res = result;
            this.processing = false;
            this.snackbar = true;
            this.msg =
              "Client information ( " +
              this.editFormData.title +
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

    uploadFile(id) {
      this.uploading = true;
      if (this.image) {
        let uploadTask = storageRef.child("clientImages/" + id).put(this.image);
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
              db.collection("client")
                .doc(id)
                .update({
                  imageURL: downloadURL
                })
                .then(evnt => {
                  console.log(evnt);
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

    // Delete news item
    deleteItem(id) {
      db.collection("client")
        .doc(id)
        .delete()
        .then(result => {
          this.res = result;
          this.snackbar = true;
          this.msg = "Client successfully deleted.";
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
