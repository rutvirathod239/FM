"use client"
import Dashboard from "@/Components/Dashboard";
import Headerbar from "@/Components/HeaderBar";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  path: "/api/socket",
});

export default function Home() {
  return (
    <div>
      <Headerbar />
      <Dashboard socket={socket}/>
    </div>
  );
}
