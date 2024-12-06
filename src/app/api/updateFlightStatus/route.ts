import { startCronJob } from "@/lib/scheduler";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        startCronJob();
        return NextResponse.json(
            { message: "Flight statuses updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating flight statuses:", error);
        return NextResponse.json(
            { message: "Failed to update flight statuses" },
            { status: 500 }
        );
    }
}