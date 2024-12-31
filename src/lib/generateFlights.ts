import FlightModel from '../models/flightModel';

export async function generateFlights() {
    console.log("generateFlights called");
    const types = ['Commercial', 'Military', 'Private'];
    const statuses = ['Scheduled', 'In-flight', 'Cancelled', 'Delayed'];
    const locations = ['India','New York', 'London', 'Dubai', 'Singapore', 'Tokyo','Chicago', 'Melborne', 'New Jersy'];
    const generatedFlightNumbers = new Set<string>();

    try {
        const existingFlights = await FlightModel.find();
        const currentCount = existingFlights.length;

        if (currentCount >= 400) {
            console.log('Sufficient flights are already in the database.');
            return;
        }
        console.log(`Current flight count: ${currentCount}. Adding ${400 - currentCount} new flights...`);
        for (const flight of existingFlights) {
            generatedFlightNumbers.add(flight.flightNumber);
        }
        const flightsToGenerate = 400 - currentCount;

        for (let i = 0; i < flightsToGenerate; i++) {
            let flightNumber: string;

            do {
                flightNumber = `FL${Math.floor(1000 + Math.random() * 9000)}`;
            } while (generatedFlightNumbers.has(flightNumber));

            generatedFlightNumbers.add(flightNumber);
            const origin = locations[Math.floor(Math.random() * locations.length)];
            const destination = locations[Math.floor(Math.random() * locations.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const type = types[Math.floor(Math.random() * types.length)];
            const scheduledTime = new Date(Date.now() + Math.random() * 86400000);

            const departureTime = new Date(scheduledTime.getTime() + Math.random() * 900000);
            const flightDuration = Math.floor(Math.random() * 180) + 60; 
            const arrivalTime = new Date(departureTime.getTime() + flightDuration * 60000);

            await FlightModel.create({ flightNumber, origin, destination, status, type, scheduledTime, departureTime, arrivalTime });
        }
    
    } catch (error) {
        console.error('Error in generateFlights:', error);
        throw new Error('Failed to generate flights');
    }
}
