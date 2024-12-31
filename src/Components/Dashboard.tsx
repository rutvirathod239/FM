import React from "react";
import FlightList from "./FlightList";
import { Socket } from "socket.io-client";

interface DashboardProps {
    socket: Socket;
}


const Dashboard: React.FC<DashboardProps> = ({ socket }) => {
    return (
    <div className="bg-white p-5">        
        <FlightList socket={socket} />
    </div>)
}
export default Dashboard;