import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { workflowOrchestrator } from "@/trigger/workflow-tasks";
import { getAuthUser } from "@/lib/auth";

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

        // Parse request body for selectedNodeIds
        let selectedNodeIds: string[] | undefined;
        try {
            const body = await req.json();
            selectedNodeIds = body.selectedNodeIds;
        } catch {
            // No body or invalid JSON - run full workflow
        }

        const workflow = await prisma.workflow.findUnique({
            where: { id },
        });

        if (!workflow) {
            return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
        }

        // Verify ownership
        if (workflow.userId !== user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Determine execution scope
        const scope = selectedNodeIds?.length
            ? (selectedNodeIds.length === 1 ? `single:${selectedNodeIds[0]}` : `partial:${selectedNodeIds.length}`)
            : "full";

        // Initialize Execution Record in DB
        const execution = await prisma.execution.create({
            data: {
                workflowId: workflow.id,
                userId: workflow.userId,
                status: "QUEUED",
                scope: scope
            }
        });

        // Trigger the Orchestrator Task (with optional selectedNodeIds)
        console.log("Triggering run with:", {
            executionId: execution.id,
            workflowId: workflow.id,
            hasSecretKey: !!process.env.TRIGGER_SECRET_KEY,
            secretKeyLength: process.env.TRIGGER_SECRET_KEY?.length
        });

        const run = await workflowOrchestrator.trigger({
            executionId: execution.id,
            workflowId: workflow.id,
            selectedNodeIds: selectedNodeIds // Pass selected nodes for partial execution
        });

        // Update Execution with Trigger ID
        await prisma.execution.update({
            where: { id: execution.id },
            data: { triggerId: run.id }
        });

        return NextResponse.json({
            success: true,
            executionId: execution.id,
            triggerRunId: run.id,
            scope: selectedNodeIds?.length ? `partial (${selectedNodeIds.length} nodes)` : "full"
        });

    } catch (error: any) {
        console.error("Failed to trigger execution details:", {
            message: error.message,
            stack: error.stack,
            cause: error.cause,
            name: error.name
        });
        return NextResponse.json(
            { error: "Failed to run workflow", details: error.message },
            { status: 500 }
        );
    }
}

