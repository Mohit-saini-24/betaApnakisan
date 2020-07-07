
// For an email/password user. Prompt the user for the password again.
let password = prompt('Please provide your password for reauthentication');
let credential = firebase.auth.EmailAuthProvider.credential(
    firebase.auth().currentUser.email, password);
auth.currentUser.reauthenticateWithCredential(credential)
    .then(result => {
        // User successfully reauthenticated. New ID tokens should be valid.
        console.log('// User successfully reauthenticated. New ID tokens should be valid.'+result)
    })
    .catch(error => {
        // An error occurred.
        window.location.href = '/login'
    });
