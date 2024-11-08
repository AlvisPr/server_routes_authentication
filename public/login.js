const firebaseConfig = {
    apiKey: "AIzaSyBOSLVGvX-iX3u-ehQLDbRY7iRgIpTKbgc",
    authDomain: "server-routes-authentication.firebaseapp.com",
    projectId: "server-routes-authentication",
    storageBucket: "server-routes-authentication.firebasestorage.app",
    messagingSenderId: "918983272073",
    appId: "1:918983272073:web:bbf835eedd62f84ce40858"
};

firebase.initializeApp(firebaseConfig);

const email = document.getElementById('email');
const password = document.getElementById('password');
const login = document.getElementById('login');
const signup = document.getElementById('signup');
const logout = document.getElementById('logout');
const loginMsg = document.getElementById('loginMsg');
const routeMsg = document.getElementById('routeMsg');

login.addEventListener('click', (e) => {
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email.value, password.value);
    promise.catch(e => loginMsg.innerHTML = e.message);
});

signup.addEventListener('click', (e) => {
    const auth = firebase.auth();
    const promise = auth.createUserWithEmailAndPassword(email.value, password.value);
    promise.catch(e => loginMsg.innerHTML = e.message);
});

logout.addEventListener('click', (e) => {
    firebase.auth().signOut();
});

firebase.auth().onAuthStateChanged(firebaseUser => {
    console.log("Auth state changed:", firebaseUser);
    if(firebaseUser) {
        console.log("User is logged in:", firebaseUser);  
        logout.style.display = "inline";
        email.style.display = "none";
        password.style.display = "none";
        login.style.display = "none";
        signup.style.display = "none";
        loginMsg.style.display = "none";
        loginMsg.innerHTML = "Authentication Success";
    } else {
        console.log("User is not logged in");
        email.style.display = "inline";
        password.style.display = "inline";
        logout.style.display = "none";
        login.style.display = "inline";
        signup.style.display = "inline";
        loginMsg.style.display = "block";
        loginMsg.innerHTML = "Not Authenticated";
    }
});

function callSecureRoute() {
  firebase.auth().currentUser.getIdToken()
    .then(idToken => {
     console.log("idToken", idToken);
     (async () => {
        let response = await fetch(`/auth`, {
            method: 'GET',
            headers: {
                'Authorization': idToken
            }
        });
        let text = await response.text();
        console.log("response text", text);
        routeMsg.innerHTML = text;
        })();
    })
    .catch(e => routeMsg.innerHTML = e.message);
}

function callOpenRoute() {
    routeMsg.innerHTML = "Call Auth Route";
    (async () => {
        let response = await fetch('/open');
        let text = await response.text();
        console.log("response text", text);
        routeMsg.innerHTML = text;
    })();
}