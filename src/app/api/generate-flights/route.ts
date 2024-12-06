import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { generateFlights } from '@/lib/generateFlights';

export async function POST() {
  try {
    // Connect to the database
    await connectToDatabase();

    // Call the generateFlights function
    await generateFlights();

    return NextResponse.json(
        { message: 'Flights generated successfully' },
        { status: 200 }
    );
    } catch (error: any) {
        console.error('Error generating flights:', error);
        return NextResponse.json(
            { message: 'Failed to generate flights', error: error?.message },
            { status: 500 }
        );
    }
}
