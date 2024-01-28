
const rooms = [

    {
        id: 1,
        name: 'Educosys HLD',
        description: 'Educosys HLD Room',
        users: [],
        status: 'open',
        hasPassword: false,
    },
    {
        id: 2,
        name: 'Educosys LLD',
        description: 'Educosys LLD Room',
        users: [],
        status: 'open',
        hasPassword: true,
        password: '123'

    },
    {
        id: 3,
        name: 'Educosys DSA',
        description: 'Educosys DSA Room',
        users: [],
        status: 'closed',
        hasPassword: false,
    }
];

const getRooms = () => {
    let getRooms = rooms.map(room => {
        return {
            id: room.id,
            name: room.name,
            description: room.description,
            status: room.status,
            hasPassword: room.hasPassword,
            users: room.users.length
        }
    })
    return getRooms;
}

module.exports = {
    rooms,
    getRooms
}