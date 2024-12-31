import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { generateFlights } from '@/lib/generateFlights';

export async function POST() {
  try {
    await connectToDatabase();

    await generateFlights();

    return NextResponse.json(
        { message: 'Flights generated successfully' },
        { status: 200 }
    );
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                { message: 'Failed to generate flights', error: error?.message },
                { status: 500 }
            );
        }
    }
}
