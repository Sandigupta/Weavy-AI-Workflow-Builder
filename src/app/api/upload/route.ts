import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// This endpoint returns Transloadit assembly parameters for client-side uploads
// The actual upload happens directly from the browser to Transloadit servers

export async function POST(request: NextRequest) {
    try {
        const { type } = await request.json(); // "image" or "video"

        const key = process.env.TRANSLOADIT_KEY;
        const secret = process.env.TRANSLOADIT_SECRET;

        if (!key || !secret) {
            // Return mock response if Transloadit not configured
            return NextResponse.json({
                mock: true,
                message: "Transloadit not configured. Use URL input instead.",
            }, { status: 200 });
        }

        // Create expiry timestamp (UTC, ISO format without milliseconds)
        const expires = new Date(Date.now() + 1000 * 60 * 30)
            .toISOString()
            .replace(/\.\d{3}Z$/, "+00:00");

        // Simplified assembly params - just upload and return the file
        const params = {
            auth: {
                key,
                expires,
            },
            steps: {
                ":original": {
                    robot: "/upload/handle",
                },
            },
        };

        const paramsString = JSON.stringify(params);

        // Transloadit uses sha1 by default for signatures
        // Signature format: "sha1:" + hex digest
        const signature = "sha1:" + crypto
            .createHmac("sha1", secret)
            .update(paramsString)
            .digest("hex");

        console.log("Transloadit params:", paramsString);
        console.log("Generated signature:", signature);

        return NextResponse.json({
            mock: false,
            params: paramsString,
            signature,
            endpoint: "https://api2.transloadit.com/assemblies",
        });
    } catch (error: any) {
        console.error("Upload config error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

