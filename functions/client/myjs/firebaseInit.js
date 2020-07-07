const firebaseConfig = {
    apiKey: "AIzaSyBWkhAn0SNOkpA7uRgVq3GIyQVWIVuZGdI",
    authDomain: "betaapnakisan.firebaseapp.com",
    databaseURL: "https://betaapnakisan.firebaseio.com",
    projectId: "betaapnakisan",
    storageBucket: "betaapnakisan.appspot.com",
    messagingSenderId: "138906856039",
    appId: "1:138906856039:web:21d7899220c8122a65c2c2",
    measurementId: "G-8HKDX02V0X"
  };

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// [START fs_setup_cache]
db.settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
});
// [END fs_setup_cache]
// As httpOnly cookies are to be used, do not persist any state client side.





