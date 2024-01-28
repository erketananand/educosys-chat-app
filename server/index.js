const app = require('express')();
const socket = require('socket.io');
const http = require('http').createServer(app);
const port = process.env.PORT || 5000;
const { getSocketCallback } = require('./socket')

http.listen(port, () => {
    console.log(`listening on ${port}`);
});

const io = socket(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "OPTIONS"]
    }
});

io.on('connection', getSocketCallback(io))
