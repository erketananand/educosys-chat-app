
const {
    addUser,
    getUser,
    deleteUser,
    getUsers
} = require('./users');
const {
    rooms,
    getRooms
} = require('./rooms');

const getSocketCallback = (io) => (socket) => {

    socket.on('joinRoom', (data, callback) => {
        const room = rooms[data.room.id - 1]
        const {
            user,
            error,
            type
        } = addUser(socket.id, data.userName, room, data.password);

        if (error) return callback({
            type,
            error
        })

        socket.join(user.room)

        socket.in(data.room.name).emit('notification', {
            title: 'Someone\'s here',
            description: `${user.name} just entered the room`,
            isEnter: true
        })

        io.in(data.room.name).emit('users', getUsers(data.room.name))

        rooms[data.room.id - 1].users.push(user)

        delete rooms.password
        socket.broadcast.emit('rooms', getRooms())

        return callback({
            'success': true,
            room
        })
    })

    socket.on('leaveRoom', () => {
        const user = deleteUser(socket.id)
        if (user) {
            io.in(user.room).emit('notification', {
                title: 'Someone just left',
                description: `${user.name} just left the room`,
                isEnter: false
            })
            io.in(user.room).emit('users', getUsers(user.room))
            //delete user
            rooms[user.roomId - 1].users = rooms[user.roomId - 1].users.filter(user => user.id !== socket.id)

            socket.broadcast.emit('rooms', getRooms())
        }
    })

    socket.on('sendMessage', message => {
        const user = getUser(socket.id)

        io.in(user.room).emit('message', {
            user: user.name,
            text: message,
            room: user.room,
            roomId: user.roomId
        });
    })

    socket.on("disconnect", () => {
        console.log("User disconnected");
        var userData = getUser(socket.id)
        rooms.filter(room => room.users.includes(userData) && room.users.splice(room.users.indexOf(userData), 1))
        const user = deleteUser(socket.id)

        if (user) {
            io.in(user.room).emit('notification', {
                title: 'Someone just left',
                description: `${user.name} just left the room`
            })
            io.in(user.room).emit('users', getUsers(user.room))
        }

        socket.broadcast.emit('rooms',  getRooms())

    })

    socket.on('getRooms', (callback) => {
        return callback({
            data: getRooms()

        })
    })
    
    socket.on('getRoom', (data, callback) => {
        const room = rooms[data - 1]

        if (room) {
            return callback({
                room
            })
        }
    })

}

module.exports = {
    getSocketCallback
};