// listen for auth status changes


auth.onAuthStateChanged(user => {s



  if (user) {
 /*    // [START use_from_cache]
    db.collection("cities").where("state", "==", "CA")
    .onSnapshot({ includeMetadataChanges: true }, function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            if (change.type === "added") {
                console.log("New city: ", change.doc.data());
            }

            var source = snapshot.metadata.fromCache ? "local cache" : "server";
            console.log("Data came from " + source);
        });
    });
  // [END use_from_cache] */

    document.getElementById('loggedUserId').value = user.uid
    //console.log(user.uid);
    setupUI(user);  
    

    db.collection('products').onSnapshot(snapshot => {
      productListDisplay(snapshot.docs);
    }, err => console.log(err.message));

    var storageRef = firebase.storage().ref('images');
    storageRef.listAll().then(function (result) {
      result.items.forEach(function (imageRef) {
        // And finally display them
        featuredImageDisplay(imageRef);
        // console.log('got image');
      });
    }).catch(function (error) {
      switch (error.code) {
        case 'storage/object-not-found':
          console.log('File does not exist');
          // File doesn't exist
          break;

        case 'storage/unauthorized':
          console.log('User does not have permission to access the object');
          // User doesn't have permission to access the object
          break;

        case 'storage/canceled':
          console.log('User does not have permission to access the object');
          // User canceled the upload
          break;


        case 'storage/unknown':
          console.log('Unknown error occurred, inspect the server response :', error);
          // Unknown error occurred, inspect the server response
          break;
      }
      // Handle any errors
    });

  } else {
    setupUI();
    //setupPhoneNo();
  }
});

/* var disable =
  // [START disable_network]
  firebase.firestore().disableNetwork()
    .then(function () {
      // Do offline actions
      // [START_EXCLUDE]
      console.log("Network disabled!");
      // [END_EXCLUDE]
    });s
// [END disable_network]

var enable =
  // [START enable_network]
  firebase.firestore().enableNetwork()
    .then(function () {
      // Do online actions
      // [START_EXCLUDE]
      console.log("Network enabled!");
      // [END_EXCLUDE]
    });
// [END enable_network]
 */
//return Promise.all([enable, disable]);


// signup
const signupForm = document.querySelector('#register-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // get user info
  const email = signupForm['email'].value;
  const password = signupForm['password'].value;

  // sign up the user & add firestore data
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    db.collection('users').doc(cred.user.uid).set({
      phoneNumber: signupForm['mobileNo'].value,
      email: email,
    });
    db.collection('users').doc(cred.user.uid).collection("cart").add({

      productName: 'default',
      productQty: 0,
      productUID: 'default',
      productURL: 'default'

    })

  }).then(() => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    //signupForm.reset();
  }).catch(err => {
    console.log('auth error' + err);
  });
});

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut();
});

// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  // log the user in
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
  });

});









/* window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    "recaptcha-container",
    {
      size: "invisible",
      callback: function(response) {
        onSignInSubmit();
      }
    }
  );

function onSignInSubmit() {
    var phoneNumber = document.getElementById('login-phone-number').value;
    var appVerifier = window.recaptchaVerifier;
    firebase
        .auth()
        .signInWithPhoneNumber(phoneNumber, appVerifier)
        .then(function (confirmationResult) {

            this.alertCtrl.create({
                title: 'Enter the Confirmation code',
                inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
                buttons: [
                  { text: 'Cancel',
                    handler: data => { console.log('Cancel clicked'); }
                  },
                  { text: 'Send',
                    handler: data => {
                      confirmationResult.confirm(data.confirmationCode)
                        .then(function (result) {
                          var user = result.user;
                          // User signed in successfully.
                          console.log(result.user);
                          setupUI2(user)
                          // ...
                        }).catch(function (error) {
                          // User couldn't sign in (bad verification code?)
                          // ...
                        });
                    }
                  }
                ]
              });
        })
        .catch(function (error) {
            console.log(error);
        });

} */







