module.exports = function(io) {
    const express = require('express');
    const router = express.Router();
    const http = require('http');
    const dgram = require('dgram');
    const client = dgram.createSocket('udp4');

    //Hard-coded IP address, will be replaced soon
    var pi_ip = 'http://192.168.43.252:3000';
    // var pi_ip;

    const START = '/startheartrate';
    const STOP = '/stopheartrate';
    const POLL = '/heartrate';

    const IR = '/rawir';

    const MULTICAST_PORT = 3333;
    const MULTICAST_IP = '224.0.0.116';

    /* Receiving GET for home page. */
    router.get('/', function (req, res, next) {
        res.render('index', {title: 'Express'});
    });

    // /*
    client.on('listening', () => {
        // var address = client.address();
        client.setBroadcast(true);
        client.setMulticastTTL(MULTICAST_PORT);
        client.addMembership(MULTICAST_IP);
    });

    //Get the IP of the raspberry pi via multicast
    client.on('message', (message, remote) => {
        if (JSON.parse(message.toString())["name"] === "HealthGlove") {
            pi_ip = "http://" + remote.address + ':3000';
            console.log(pi_ip);
        }
    });
    // */

    io.on('connection', function (socket) {
        console.log("Socket.io connected");
        socket.on('startHeartRate', startHeartRate);
        socket.on('pollHeartRate', () => {
            pollHeartRate(socket);
        });

        socket.on('pollIR', () => {
            pollIR(socket);
        })
    });

    /* Send GET requests to pi */

    //Send a get request to start measuring heart rate
    function startHeartRate() {
        console.log(pi_ip + START);
        http.get(pi_ip + START, (res) => {
            console.log("Started heart rate");
        });
    }

    //Send a get request to get the value of the heart rate
    function pollHeartRate(socket) {
        http.get(pi_ip + POLL, (res) => {
            console.log("Received heart rate response");
            // console.log(JSON.stringify(res.headers));

            //Parse JSON
            let bodyChunks = [];
            res.on('data', function(chunk) {
                bodyChunks.push(chunk);
            }).on('end', function() {
                let body = Buffer.concat(bodyChunks);
                // console.log('BODY: ' + body);

                let jsonObject = JSON.parse(body.toString());

                //Emit a socket to update the client
                socket.emit('updateHeartRate', jsonObject);
            });
        });
    }

    function pollIR(socket) {
        http.get(pi_ip + IR, (res) => {
            console.log("Received IR response");
            // console.log(JSON.stringify(res.headers));

            //Parse JSON
            let bodyChunks = [];
            res.on('data', function(chunk) {
                bodyChunks.push(chunk);
            }).on('end', function() {
                let body = Buffer.concat(bodyChunks);
                // console.log('BODY: ' + body);

                let jsonObject = JSON.parse(body.toString());

                //Emit a socket to update the client
                socket.emit('updateIR', jsonObject);
            });
        });
    }

    //Send a get request to stop measuring heart rate
    function stopHeartRate() {
        http.get(pi_ip + STOP, (res) => {
            console.log("Stopped heart rate data");
        });
    }

    // setInterval(pollHeartRate, 1000);

    return router;
};

