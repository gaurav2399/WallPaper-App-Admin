console.log("Hello world");
var config = {
    apiKey: "AIzaSyAy0YE0IICU1S48Z81yyJh-feRx63kCikQ",
    authDomain: "mywallpaperapp-1ce27.firebaseapp.com",
    databaseURL: "https://mywallpaperapp-1ce27.firebaseio.com",
    projectId: "mywallpaperapp-1ce27",
    storageBucket: "mywallpaperapp-1ce27.appspot.com",
    messagingSenderId: "148594201157",
    appId: "1:148594201157:web:c645eacfabcca74c"
};
// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(config);
}else{
    firebase.app();
}
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
.catch(function(error) {
    console.log(error.message);
});


var btn = "#myButton";
$(btn).click(function(){
    console.log("clicked");
    var email = $("#email").val();
    var password = $("#password").val();

    var result = firebase.auth().signInWithEmailAndPassword(email,password);
    
    result.catch( error => {

        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(`error code :: ${errorCode}`);
        console.log(`error message :: ${errorMessage}`);
    });
});

var btn2="#btn-logout";
$(btn2).click(function(){
    console.log("sign out btn clicked")
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        console.log("signed out.")
      }).catch(function(error) {
        // An error happened.
        console.log("error",e)
      });
})
function switchView(view){
    $.get({
        url:view,
        cache:false,
    }).then(function(data){
        $("#container").html(data);
    });
}
