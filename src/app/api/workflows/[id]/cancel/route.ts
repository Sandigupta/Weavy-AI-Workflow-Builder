import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { runs } from "@trigger.dev/sdk/v3";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const executionId = id;

        if (!executionId) {
            return NextResponse.json({ error: "Execution ID required" }, { status: 400 });
        }

        // Cancel the run using Trigger.dev SDK
        try {
            const result = await runs.cancel(executionId);
            return NextResponse.json({ success: true, result });
        } catch (error: any) {
            // Include message for better debugging
            console.error("Trigger.dev cancel error:", error);

            // If run is already finished, it might throw. We can treat as success or specific error.
            if (error.message?.includes("not found") || error.message?.includes("finished")) {
                return NextResponse.json({ success: false, message: "Run not found or already finished" }, { status: 404 });
            }
            throw error;
        }

    } catch (error) {
        console.error("Failed to cancel execution:", error);
        return NextResponse.json(
            { error: "Failed to cancel execution" },
            { status: 500 }
        );
    }
}
