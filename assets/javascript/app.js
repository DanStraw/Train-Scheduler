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

$("#add-train").on("click", function(event) {
    event.preventDefault();
    //user inputs data into the 4 fields.
    var name = $("#name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = ($("#first-train").val().trim());
    var firstTrainArray = firstTrain.split(":")
    var firstTrainHours = Number(firstTrainArray[0]);
    var firstTrainMinutes = Number(firstTrainArray[1]);
    frequency = Number($("#frequency-input").val().trim());
    console.log(firstTrainHours);
    //all fields must be filled in for data to be accepted
    if ((name === " ") || (destination === " ") || (firstTrain === " ") || (frequency === " ")){
        alert("all fields must be completed");
        resetForm();
        return false;
    //first train time and frequency must be number
    } else if ((typeof(firstTrainHours) !== "number") || (typeof(firstTrainMinutes) !== "number") || (typeof(frequency) !== "number")){
        alert("number required");
        resetForm();
        return false;
    //first train: HH must be between 00 & 23, mm must be between 00 and 59
    } else if ((firstTrainHours === undefined) || (firstTrainMinutes === undefined) || (firstTrainHours < 0) || (firstTrainHours > 23) ||(firstTrainMinutes < 0) || (firstTrainMinutes >= 60)) {
        alert("Please enter in military time (including the colon)")
        console.log(firstTrainHours, firstTrainMinutes);
        resetForm();
        return false;
    } 
});

function resetForm() {
    $("#name-input").val(this.placeholder);
    $("#destination-input").val(this.placeholder)
    $("#first-train").val(this.placeholder)
    $("#frequency-input").val(this.placeholder)
}
