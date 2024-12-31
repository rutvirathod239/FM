import Flight from "@/models/flightModel";
import connectToDatabase from "./db";
import moment from "moment";
import Redis from "ioredis";

const redis = new Redis();

export const updateFlightStatuses = async () => {
    await connectToDatabase();
    
    const flights = await Flight.find();
    for (const flight of flights) {
        const currentTime = moment();
        const departureTime = moment(flight.departureTime);
        const arrivalTime = moment(flight.arrivalTime);
        
        if (currentTime.isAfter(departureTime)) {
            if (currentTime.isBefore(arrivalTime)) {
                if (flight.status !== 'Delayed') {
                    await Flight.findByIdAndUpdate(flight._id, { status: "Delayed" });
                    const message = JSON.stringify({ flightId: flight._id, flightNumber: flight.flightNumber, status: 'Delayed' });
                    await redis.publish("flight-updates", message);
                }
            } else {
                if (flight.status !== 'Cancelled') {
                    await Flight.findByIdAndUpdate(flight._id, { status: "Cancelled" });
                    const message = JSON.stringify({ flightId: flight._id, flightNumber: flight.flightNumber, status: 'Cancelled' });
                    await redis.publish("flight-updates", message);
                }
            }
        }
    }
};
