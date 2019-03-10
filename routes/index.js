module.exports = function(io) {
    const express = require('express');
    const router = express.Router();
    const http = require('http');
    const dgram = require('dgram');
    const client = dgram.createSocket('udp4');

    //Hard-coded IP address, will be replaced soon
    var pi_ip = 'http://192.168.43.252:3000';

    const START = '/startheartrate';
    const STOP = '/stopheartrate';
    const POLL = '/heartrate';

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
        client.addMembership(MULTICAST_IP, 'localhost:3000');
    });

    //Get the IP of the raspberry pi via multicast
    client.on('message', (message, remote) => {
        //TODO: if message matches something
        pi_ip = remote.address + ':3000';
        console.log(pi_ip);
    });
    // */

    io.on('connection', function (socket) {
        console.log("Test");
        socket.emit('updateHeartRate');
    });

    /* Send GET requests to pi */

    //Send a get request to start measuring heart rate
    function startHeartRate() {
        http.get(pi_ip + START, (res) => {
            console.log("Received response!");
        });
    }

    //Send a get request to get the value of the heart rate
    function pollHeartRate() {
        http.get(pi_ip + POLL, (res) => {
            console.log("Received response!");
            console.log(JSON.stringify(res.headers));

            var bodyChunks = [];
            res.on('data', function(chunk) {
                // You can process streamed parts here...
                bodyChunks.push(chunk);
            }).on('end', function() {
                var body = Buffer.concat(bodyChunks);
                console.log('BODY: ' + body);

                console.log(body.toJSON().heartRate);
            });

        });
    }

    //Send a get request to stop measuring heart rate
    function stopHeartRate() {
        http.get(pi_ip + STOP, (res) => {
            console.log("Receieved response!");
            // console.log(res);
            //TODO handle response data
        });
    }

    startHeartRate();

    setInterval(pollHeartRate, 1000);

    return router;
};

