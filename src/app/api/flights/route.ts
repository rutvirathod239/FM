import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import FlightModel from '@/models/flightModel';

export async function GET() {
    await connectToDatabase();
    const flights = await FlightModel.find();
    return NextResponse.json(flights);
}

export async function POST(req: Request) {
    await connectToDatabase();
    const data = await req.json();
    const flight = await FlightModel.create(data);
    return NextResponse.json(flight, { status: 201 });
}

export async function PATCH(req: Request) {
    try {
        await connectToDatabase();
        const { flightId, status } = await req.json();

        if (!flightId || !status) {
            return NextResponse.json(
                { message: "Flight ID and status are required." },
                { status: 400 }
            );
        }

        const updatedFlight = await FlightModel.findByIdAndUpdate(
            flightId,
            { status },
            { new: true }
        );
        if (!updatedFlight) {
            return NextResponse.json(
                { message: "Flight not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Flight status updated successfully.",
            flight: updatedFlight,
        });
    } catch (error) {
        console.error("Error updating flight status:", error);
        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}