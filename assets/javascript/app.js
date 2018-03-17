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
    var name = snapshot.val().train.name;
    var destination = snapshot.val().train.destination;
    var frequency = snapshot.val().train.frequency;
    var firstTrain = snapshot.val().train.firstTrain;
    var firstTrainConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
    var currentTime = moment();
    var day = moment().format('MMM Do YYYY');
    console.log(day);
    var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
    var tRemainder = diffTime % frequency;
    var minutesAway = frequency - tRemainder;
    var nextArrival = moment().add(minutesAway, "minutes");
    var arrivalDay = nextArrival.format('MMM Do YYYY');
    console.log(arrivalDay);
    if (day === arrivalDay) {
        row.append("<td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + moment(nextArrival).format("hh:mm a") + "</td><td>" + minutesAway + "</td>");
        $("tbody").append(row);
    } else {
        row.append("<td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + moment(nextArrival).format("hh:mm a") + " " + arrivalDay + "</td><td>" + minutesAway + "</td>");
        $("tbody").append(row);
    }
});

$("#add-train").on("click", function(event) {
    var audioElement = document.createElement("audio");
    audioElement.setAttribute('src', 'assets/audio/train_whistle.mp3');
    event.preventDefault();
    //user inputs data into the 4 fields.
    var train = {
        name: $("#name-input").val().trim(),
        destination: $("#destination-input").val().trim(),
        firstTrain: $("#first-train").val().trim(),
        frequency: $("#frequency-input").val().trim(),
    }
    var firstTrainArray = train.firstTrain.split(":");
    var firstTrainHour = firstTrainArray[0];
    var firstTrainMinute = firstTrainArray[1];
    
    //all fields must be filled in for data to be accepted
    if ((train.name == "") || (train.destination == "") || (train.firstTrain == "") || (train.frequency == "")) {
        $("#error").text("all fields must be completed");
        return false;
    } else if ((train.firstTrain.length !== 5) || (firstTrainHour < 0) ||(firstTrainHour >= 24) || (firstTrainMinute < 0) || 
    (firstTrainMinute >= 60) || (train.firstTrain[2] !== ":") || (isNaN(firstTrainArray[0])) || (isNaN(firstTrainArray[1]))){
        $("#error").text("Please enter first train time in military time (including the colon)");
        return false;
    } else if (isNaN(train.frequency)) {
        $("#error").text("Frequency must be a number");
        return false;
    } else {
        audioElement.play();
        database.ref().push( {
            train: train,
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