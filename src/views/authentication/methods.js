import { auth, db } from "../../firebase/db";
export default {
  methods: {
    signIn() {
      if (this.$refs.signInForm.validate()) {
        this.processing = true;
        auth
          .signInWithEmailAndPassword(this.email, this.password)
          .then(user => {
            this.loggedInUser = user;
            this.$localStorage.set("user", JSON.stringify(user.user));
            db.collection("userProfile")
              .where("userId", "==", user.user.uid)
              .get()
              .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                  this.$localStorage.set(
                    "userProfile",
                    JSON.stringify(doc.data())
                  );
                });
              })
              .catch(error => {
                console.log(error);
              });
            this.$router.replace({ name: "Dashboard" });
          })
          .catch(error => {
            this.processing = false;
            this.hasError = true;
            this.errorMessage = error.message;
          });
      }
    },
    signUp() {
      if (this.$refs.signUpForm.validate()) {
        this.processing = true;
        auth
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(userCredentials => {
            if (userCredentials) {
              this.$localStorage.set(
                "user",
                JSON.stringify(userCredentials.user)
              );
              userCredentials;
              db.collection("userProfile")
                .add({
                  userId: userCredentials.user.uid,
                  name: this.name,
                  phoneNumber: this.phoneNumber,
                  photoURL: this.defaultImage,
                  officialDesignation: this.officialDesignation,
                  houseAddress: this.houseAddress,
                  addressCity: this.addressCity,
                  addressState: this.addressState,
                  addressCountry: this.addressCountry
                })
                .then(docRef => {
                  db.collection("userProfile")
                    .doc(docRef.id)
                    .get()
                    .then(doc => {
                      if (doc.exists) {
                        this.$localStorage.set(
                          "userProfile",
                          JSON.stringify(doc.data())
                        );
                        this.$localStorage.set(
                          "userProfileId",
                          JSON.stringify(doc.id)
                        );
                      } else {
                        console.log("No Data Found");
                      }
                    })
                    .catch(error => {
                      console.log(error);
                    });
                });
            }
          })
          .catch(error => {
            this.processing = false;
            this.hasError = true;
            this.errorMessage = error.message;
          });
      }
    }
  }
};
