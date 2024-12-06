import cron from "node-cron";
import { updateFlightStatuses } from "@/lib/updateFlightStatus";

export const startCronJob = () => {
    cron.schedule("*/2 * * * *", async () => {
        try {
            await updateFlightStatuses();
        } catch (error) {
            console.error("Error updating flight statuses:", error);
        }
    });
}
