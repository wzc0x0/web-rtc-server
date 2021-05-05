const io = require("socket.io")({
    cors: {
        origin: ['http://localhost:8000', 'http://192.168.199.183:8000', 'http://localhost:8080', 'https://hk.19921024.xyz']
    }
})

const randomStr = () => Math.random().toString(36).slice(2, 6);
io.on('connection', (socket) => {
    console.log(`connect: ${socket.id}`);

    socket.on('getRoomId', () => {
        // 下发roomId
        const roomId = randomStr();
        socket.join(roomId);
        socket.emit("roomId", roomId);
        socket.on('candidate', candidate => {
            socket.to(roomId).emit('candidate', candidate)
        })
        socket.on('offer', candidate => {
            socket.to(roomId).emit('offer', candidate)
        })
    })

    socket.on("join", (roomId) => {
        socket.join(roomId);
        socket.to(roomId).emit("receiveConnect");
        socket.on('answer', candidate => {
            socket.to(roomId).emit('answer', candidate)
        })
    })

    socket.on('disconnect', () => {
        console.log(`disconnect: ${socket.id}`);
    });
})

io.listen(3000);
console.log("server!")