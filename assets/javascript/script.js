$(document).ready(function() {

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCI0WZc5VQdYBjoiBJytHj2WZ30qXz3sDQ",
authDomain: "trainschedule-14bc1.firebaseapp.com",
databaseURL: "https://trainschedule-14bc1.firebaseio.com",
projectId: "trainschedule-14bc1",
storageBucket: "",
messagingSenderId: "38919996616"
};

firebase.initializeApp(config);

    var database = firebase.database();
    updateCurrentTime();
    setInterval(function () { updateCurrentTime() }, 1000);

    // Update Current Time On Page
    function updateCurrentTime () {
        $('#currentTime').text(moment().format('h:mm:ss A'))
    }

    // Capture Button Click
    $("#addTrain").on("click", function (event) {
        event.preventDefault();

        // Grabbed values from text boxes
        var trainName = $("#trainName").val().trim();
        var destination = $("#destination").val().trim();
        var firstTrain = $("#firstTrain").val().trim();
        var freq = $("#interval").val().trim();

        // Code for handling the push
        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrain: firstTrain,
            frequency: freq
        });
    });


    // Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
    database.ref().on("child_added", function (childSnapshot) {

        var newTrain = childSnapshot.val().trainName;
        var newLocation = childSnapshot.val().destination;
        var newFirstTrain = childSnapshot.val().firstTrain;
        var newFreq = childSnapshot.val().frequency;

        // First Time (pushed back 1 year to make sure it comes before current time)
        var startTimeConverted = moment(newFirstTrain, "hh:mm").subtract(1, "years");

        // Difference between the times
        var diffTime = moment().diff(moment(startTimeConverted), "minutes");

        // Time apart (remainder)
        var tRemainder = diffTime % newFreq;

        // Minute(s) Until Train
        var tMinutesTillTrain = newFreq - tRemainder;

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        var catchTrain = moment(nextTrain).format("HH:mm");

        // Display In Table
        $("#all-display").append(
            ' <tr><td>' + newTrain +
            ' </td><td>' + newLocation +
            ' </td><td>' + newFreq +
            ' </td><td>' + catchTrain +
            ' </td><td>' + tMinutesTillTrain + ' </td></tr>');

        // Clear input fields
        $("#trainName, #destination, #firstTrain, #interval").val("");
        return false;
    },
        //Handle the errors
        function (errorObject) {
            console.log("Errors handled: " + errorObject.code);
        });


}); //end document ready

