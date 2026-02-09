import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getAuthUser } from "@/lib/auth";
import { validateDAG } from "@/utils/dag-validation";

const updateWorkflowSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    nodes: z.any().optional(),
    edges: z.any().optional(),
});

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const workflow = await prisma.workflow.findUnique({
            where: { id },
        });

        if (!workflow) {
            return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
        }

        // Auth Check - user owns this workflow
        if (workflow.userId !== user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        return NextResponse.json(workflow);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch workflow" }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const validatedData = updateWorkflowSchema.parse(body);

        // DAG Validation if edges are being updated
        if (validatedData.edges && !validateDAG(validatedData.edges)) {
            return NextResponse.json({ error: "Invalid Workflow: Cycle detected" }, { status: 400 });
        }

        const workflow = await prisma.workflow.findUnique({
            where: { id },
        });

        if (!workflow) {
            return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
        }

        if (workflow.userId !== user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const updatedWorkflow = await prisma.workflow.update({
            where: { id },
            data: {
                name: validatedData.name,
                description: validatedData.description,
                nodes: validatedData.nodes,
                edges: validatedData.edges,
            },
        });

        return NextResponse.json(updatedWorkflow);
    } catch (error) {
        console.error("Failed to update workflow:", error);
        return NextResponse.json(
            { error: "Failed to update workflow" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const workflow = await prisma.workflow.findUnique({
            where: { id },
        });

        if (!workflow) {
            return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
        }

        if (workflow.userId !== user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        await prisma.workflow.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete workflow:", error);
        return NextResponse.json(
            { error: "Failed to delete workflow" },
            { status: 500 }
        );
    }
}

