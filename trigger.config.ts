import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
    project: "proj_bvwcminjoblnrenhkpel", // Replace with actual Project Ref from Trigger.dev dashboard
    dirs: ["src/trigger"],
    runtime: "node",
    logLevel: "log",
    maxDuration: 60, // Required by newer CLI versions
    retries: {
        enabledInDev: true,
        default: {
            maxAttempts: 3,
            minTimeoutInMs: 1000,
            maxTimeoutInMs: 10000,
            factor: 2,
            randomize: true,
        },
    },
});
