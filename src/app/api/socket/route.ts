import { NextResponse } from "next/server";
import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";

let io: SocketIOServer | null = null;

const globalForIO = global as unknown as { _httpServer?: HTTPServer; _io?: SocketIOServer };

export async function GET() {
    try {
        if (!globalForIO._io) {
            if (!globalForIO._httpServer) {
                throw new Error("HTTP server not found. Ensure you have configured the server correctly.");
            }

            io = new SocketIOServer(globalForIO._httpServer, {
                path: "/api/socket",
                cors: {
                origin: "*",
                methods: ["GET", "POST"],
                },
            });

            io.on("connection", (socket) => {
                console.log("Client connected:", socket.id);

                socket.on("disconnect", () => {
                console.log("Client disconnected:", socket.id);
                });
            });

            globalForIO._io = io;
            console.log("Socket.io server initialized.");
        }
        return NextResponse.json({ message: "Socket.io server is ready." });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error initializing Socket.io:", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
  
        console.error("Unexpected error:", error);
        return NextResponse.json({ error: "Unexpected error occurred." }, { status: 500 });
  }
}
