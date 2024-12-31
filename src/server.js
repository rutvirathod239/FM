/* eslint-disable @typescript-eslint/no-require-imports */
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const Redis = require("ioredis");

const redis = new Redis();
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    const io = new Server(server, {
        path: "/api/socket",
        cors: {
        origin: "*",
        methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
        });
    });
    redis.subscribe("flight-updates", (err, count) => {
        if (err) {
            console.error("Failed to subscribe:", err);
        } else {
            console.log(`Subscribed to ${count} channel(s).`);
        }
    });

    redis.on("message", (channel, message) => {
        // console.log(`Received message from ${channel}: ${message}`);
        io.emit("flight-update", JSON.parse(message));
    });
    server.listen(3000, (err) => {
        if (err) throw err;
        console.log("> Ready on http://localhost:3000");
    });
});
