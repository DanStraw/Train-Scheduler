//user input gets stored as 4 property values in firebase.
var config = {
    apiKey: "AIzaSyC19LhvK7GTaM_jCbH8awTMqDIqnlFYHaI",
    authDomain: "train-scheduler-f0c74.firebaseapp.com",
    databaseURL: "https://train-scheduler-f0c74.firebaseio.com",
    projectId: "train-scheduler-f0c74",
    storageBucket: "",
    messagingSenderId: "562170651140"
};
firebase.initializeApp(config);
var database = firebase.database();
var frequency = 0;

database.ref().on("child_added", function(snapshot) {
    var row = $("<tr>");
    var name = snapshot.val().name;
    var destination = snapshot.val().destination;
    var frequency = snapshot.val().frequency;
    var firstTrain = snapshot.val().firstTrain;
    var firstTrainConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
    var currentTime = moment();
    var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
    var tRemainder = diffTime % frequency;
    var minutesAway = frequency - tRemainder;
    var nextArrival = moment().add(minutesAway, "minutes");
    row.append("<td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + moment(nextArrival).format("hh:mm a") + "</td><td>" + minutesAway + "</td>");
    $("tbody").append(row);
});

$("#add-train").on("click", function(event) {
    var audioElement = document.createElement("audio");
    audioElement.setAttribute('src', 'assets/audio/train_whistle.mp3');
    event.preventDefault();
    //user inputs data into the 4 fields.
    var name = $("#name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = ($("#first-train").val().trim());
    var firstTrainArray = firstTrain.split(":");
    var firstTrainHour = firstTrainArray[0];
    var firstTrainMinute = firstTrainArray[1];
    console.log(firstTrain[2]);
    frequency = $("#frequency-input").val().trim();
    console.log(isNaN(frequency));
    
    //all fields must be filled in for data to be accepted
    if ((name == "") || (destination == "") || (firstTrain == "") || (frequency == "")) {
        $("#error").text("all fields must be completed");
        return false;
    } else if ((firstTrain.length !== 5) || (firstTrainHour < 0) ||(firstTrainHour >= 24) || (firstTrainMinute < 0) || 
    (firstTrainMinute >= 60) || (firstTrain[2] !== ":") || (isNaN(firstTrainArray[0])) || (isNaN(firstTrainArray[1]))){
        $("#error").text("Please enter first train time in military time (including the colon)");
        return false;
    } else if (isNaN(frequency)) {
        $("#error").text("Frequency must be a number");
        return false;
    } else {
        audioElement.play();
        database.ref().push( {
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
        });
        $("#error").remove();
        resetForm();
    }
});
function resetForm() {
    $("#name-input").val(this.placeholder);
    $("#destination-input").val(this.placeholder)
    $("#first-train").val(this.placeholder)
    $("#frequency-input").val(this.placeholder)
}