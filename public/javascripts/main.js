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
    document.getElementById('heart-rate-UI').innerText =
}

function updateTemperatureDisplay() {
    //TODO update UI
}


var time = 0;
var seconds;
var minutes;
var hours;
var working = true;
var time_array = [];
var heartrate_array = [];

function record_time() {
    if (working == true) {
        seconds = time % 60;
        if (seconds < 10) seconds = "0" + String(seconds);
        minutes = Math.floor(time / 60) % 60;
        if (minutes < 10) minutes = "0" + String(minutes);
        hours = Math.floor(time / 3600);
        if (hours < 10) hours = "0" + String(hours);
        document.getElementById("elapsedTime").innerHTML = "Elapsed Time: " + hours + ":" + minutes + ":" + seconds;
        time += 1;
        time_array.push(time);
        heartrate_array.push(Math.round(50 + Math.random() *(-50-50)))
    }
}

function togglepauseplay() {
    var x = document.getElementById("pausepart");
    var y = document.getElementById("playpart")
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
function plot_graph() {
    var dps = [];
    var chart = new CanvasJS.Chart("chartContainer",{
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
