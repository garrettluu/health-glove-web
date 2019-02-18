var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Receiving websockets */
io.on('connection', function (socket) {
    socket.on('update', function(msg) {
      socket.emit('updateHeartRate', msg);
    });
});

module.exports = router;
