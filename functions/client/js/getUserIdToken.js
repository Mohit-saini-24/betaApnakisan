window.onload = async function () {


    const customTokenReceived = document.getElementById('customTokenReceived').value;
    console.log('token received...........' + customTokenReceived)
    
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

    auth.signInWithCustomToken(customTokenReceived)
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            console.log(errorCode);
            var errorMessage = error.message;
            console.log('redirect to login', errorMessage);
            return window.location.href = '/login';

            // ...
        });
    return sendToken(customTokenReceived)


}

function sendToken(idToken) {
    console.log("Posting " + idToken);
    var xhr = new XMLHttpRequest();
    var params = `token=${idToken}`;
    xhr.open('POST', "/login", true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    return new Promise(function (resolve, reject) {
        xhr.onreadystatechange = function () {//Call a function when the state changes.
            if (xhr.readyState == 4 && xhr.status == 200) {
                resolve();
            } else if (xhr.readyState == 4 && xhr.status != 200) {
                reject("Invalid http return status");
            }
        }
        return xhr.send(params);
    });
}