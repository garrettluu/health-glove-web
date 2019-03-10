var heartRate = 0;
var temp = 0;
var time = 0;
var seconds;
var minutes;
var hours;
var working = true;
var time_array = [];
var heartrate_array = [];

var irArray = [];

//Receiving websockets from server
var socket = io();

socket.on('updateHeartRate', (msg) => {
    // console.log(msg);
    updateHeartRateDisplay(msg.heartRate);
});

socket.on('updateIR', (msg) => {
    // console.log(msg);
    record_time(msg.ir, irArray);
});

// socket.on('updateTemperature', function(msg) {
//     temp = msg.temp;
//     updateTemperatureDisplay();
// });

function updateHeartRateDisplay(value) {
    if (value === -1) {
        document.getElementById('heart-rate-UI').innerText =
            "No pulse detected"
    } else {
        document.getElementById('heart-rate-UI').innerText =
            "Current: " + value;
    }
    record_time(value, heartrate_array);
}

function updateTemperatureDisplay() {
    //TODO update UI
}

function startWorkout() {
    socket.emit('startHeartRate');
    console.log("Begin polling heart rate");
    setInterval(() => {socket.emit('pollHeartRate')}, 1000);
    setInterval(() => {socket.emit('pollIR')}, 50);
}

function startButton() {
      var start = document.getElementById("startWorkout");
      var workout = document.getElementById("workout");
      /**if (x.style.display === "none") {
        x.style.display = "block";
      } else {
        x.style.display = "none";
      }*/
      if ($(start).is(':visible')) {
        $(start).slideUp('slow');
        $(workout).slideDown('slow');
      } else {
        $(start).slideDown('fast');
        $(workout).slideUp('fast');
      }

      console.log("Start button clicked");

    }

// document.getElementById('startButton').onclick = function () {
//     startButton();
    // startWorkout();
// };

function record_time(heartrate, array) {
    if (working === true) {
        seconds = time % 60;
        if (seconds < 10) seconds = "0" + String(seconds);
        minutes = Math.floor(time / 60) % 60;
        if (minutes < 10) minutes = "0" + String(minutes);
        hours = Math.floor(time / 3600);
        if (hours < 10) hours = "0" + String(hours);
        document.getElementById("elapsedTime").innerHTML = "Elapsed Time: " + hours + ":" + minutes + ":" + seconds;
        time += 1;
        time_array.push(time);
        array.push(heartrate)
    }
}

function togglepauseplay() {
    var x = document.getElementById("pausepart");
    var y = document.getElementById("playpart");
    if (x.style.display === "none") {
        x.style.display = "block";
        y.style.display = "none";
    } else {
        x.style.display = "none";
        y.style.display = "block";
    }
}
function stopworkout() {
    working = false
}
// Graphing Tool
function plotHeartRate() {
    var dps = [];
    var chart = new CanvasJS.Chart("heartRateChartContainer",{
        theme: "light2",
        title :{
            text: "Your Heart Rate for the past 30 seconds"
        },
        axisX: {
            title: "Time Elapsed (seconds)"
        },
        axisY: {
            title: "Beats per Minute (bpm)"
        },
        data: [{
            type: "line",
            dataPoints : dps
        }]
    });

// Initial Values
    var xVal = 0;
    var yVal = 10;
    var newDataCount = 6;
    var updateChart = function () {
        yVal = heartrate_array[xVal-1];
        dps.push({x: xVal,y: yVal,});
        xVal++;
        if (dps.length >  30 )
        {
            dps.shift();
        }
        chart.render();

        // update chart after specified time.
    };
    setInterval(updateChart, 1000);
}

function plotIR() {
    var dps = [];
    var chart = new CanvasJS.Chart("IRChartContainer",{
        theme: "light2",
        title :{
            text: "IR Data"
        },
        axisX: {
            title: "Time Elapsed (seconds)"
        },
        axisY: {
            title: "IR Reading"
        },
        data: [{
            type: "line",
            dataPoints : dps
        }]
    });

// Initial Values
    var xVal = 0;
    var yVal = 10;
    var newDataCount = 6;
    var updateChart = function () {
        yVal = irArray[xVal-1];
        dps.push({x: xVal,y: yVal,});
        xVal++;
        if (dps.length > 100 )
        {
            dps.shift();
        }
        chart.render();

        // update chart after specified time.
    };
    setInterval(updateChart, 50);
}
