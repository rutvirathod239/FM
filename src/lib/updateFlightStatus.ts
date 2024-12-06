import Flight from "@/models/flightModel";
import connectToDatabase from "./db";
import moment from "moment";
import pusher from "./pusher";

export const updateFlightStatuses = async () => {
    await connectToDatabase();
    
    const flights = await Flight.find();

    for (const flight of flights) {
        const currentTime = moment();
        const departureTime = moment(flight.departureTime);
        const arrivalTime = moment(flight.arrivalTime);
        
        if (currentTime.isAfter(departureTime)) {
            if (currentTime.isBefore(arrivalTime)) {
                await Flight.findByIdAndUpdate(flight._id, { status: "Delayed" });
                await pusher.trigger('flight-status-channel', 'status-update', {
                    flightId: flight._id,
                    status: 'Delayed',
                });
          
            } else {
                await Flight.findByIdAndUpdate(flight._id, { status: "Cancelled" });
                await pusher.trigger('flight-status-channel', 'status-update', {
                    flightId: flight._id,
                    status: 'Cancelled',
                });
          
            }
        }
    }
};
