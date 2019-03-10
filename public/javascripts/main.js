var heartRate = 0;
var temp = 0;

//Receiving websockets from server
var socket = io();

socket.on('updateHeartRate', function(msg) {
    console.log("updated heart rate!");
    updateHeartRateDisplay();
});

socket.on('updateTemperature', function(msg) {
    temp = msg.temp;
    updateTemperatureDisplay();
});

function updateHeartRateDisplay() {
    //TODO update UI
}

function updateTemperatureDisplay() {
    //TODO update UI
}