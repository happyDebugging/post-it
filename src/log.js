// Configuration Firebase
// var firebaseConfig = {
//     apiKey: "AIzaSyDm7qL28ccs6HgswcezkNMG3zy8Tk8El5E",
//       authDomain: "tourexploration2.firebaseapp.com",
//       databaseURL: "https://tourexploration2-default-rtdb.europe-west1.firebasedatabase.app",
//       projectId: "tourexploration2",
//       storageBucket: "tourexploration2.appspot.com",
//       messagingSenderId: "503852972480",
//       appId: "1:503852972480:web:e90e2d169dd7ee7f33b025",
//       measurementId: "G-MF1VLCT6K7"
//   };

// Initialize Firebase
// firebase.initializeApp(firebaseConfig);

// Reference to web event on Firebase
var eventWebAppRef = firebase.database().ref('eventWebApp');

// Date and time
var today = new Date();
var day = String(today.getDate()).padStart(2, '0');
var month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var year = today.getFullYear();
var hours = today.getHours();
var min = today.getMinutes();
// format date and time correct
hours = hours < 10 ? '0'+hours : hours; 
min = min < 10 ? '0'+min : min;
var date = day +"/"+ month +"/" +year;
var current_time = hours+":"+min;

// Location Data
var city, country, place;
// function to get data
function callback(response) {
    city = response.city;
    country = response.country;
    place = response.loc;
}
// retrieve GET data from site
$.ajax({
url:"https://ipinfo.io",
type : "GET",
async: false,
dataType : "json",
success : callback
})

// Number of clicks
var clicks = 0;
window.onclick = function() { 
    clicks += 1; 
    console.log("Clicks: "+clicks);
}

// Name of the page
var page = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
if(page === "") {page = "index.html"}

// Number of Errors
var errors = 0;

// Get time measurement
var start, end;
$(document).ready(function() { start = new Date(); });

// function to write events on firebase
function saveEventWebAppToDb(date, curr_time, country, city, place, timeSpent, clicks, page, errors) {
    eventWebAppRef.push({
      page: page,
      country: country,
      city: city,
      date : date,
      startTime : curr_time,
      coordinates : place,
      timeSpent: timeSpent,
      clicks: clicks, 
      mistakes: errors
  });
}

// Just before the user leaves the page 
window.addEventListener('beforeunload', function (e) { 
    // get the duration of session
    end = new Date();
    timeSpent= (end - start)/1000;
    // save data to firebase
    saveEventWebAppToDb(date, current_time, country, city, place, timeSpent, clicks, page, errors);
    e.returnValue = '';
}); 
