const Chat = require("../models/ChatMessage");

const users = {};

const setupSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("register", (userId) => {
            users[userId] = socket.id;
        });

        socket.on("sendMessage", async ({ sender, receiver, message, file, fileType }) => {
            const chat = new Chat({ sender, receiver, message, file, fileType });
            await chat.save();

            // Send to receiver if online
            const receiverSocketId = users[receiver];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receiveMessage", chat);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            for (const [userId, socketId] of Object.entries(users)) {
                if (socketId === socket.id) delete users[userId];
            }
        });
    });
};

module.exports = setupSocket;
