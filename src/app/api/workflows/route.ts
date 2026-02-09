import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getAuthUser } from "@/lib/auth";
import { validateDAG } from "@/utils/dag-validation";

// Validation schema for creating a workflow
const createWorkflowSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    nodes: z.any(), // ReactFlow nodes JSON
    edges: z.any(), // ReactFlow edges JSON
});

export async function POST(req: Request) {
    try {
        // Get authenticated user
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const validatedData = createWorkflowSchema.parse(body);

        // DAG Validation
        if (!validateDAG(validatedData.edges || [])) {
            return NextResponse.json({ error: "Invalid Workflow: Cycle detected" }, { status: 400 });
        }

        const workflow = await prisma.workflow.create({
            data: {
                name: validatedData.name,
                description: validatedData.description,
                nodes: validatedData.nodes || [],
                edges: validatedData.edges || [],
                userId: user.id,
            },
        });

        return NextResponse.json(workflow);
    } catch (error) {
        console.error("Failed to create workflow:", error);
        return NextResponse.json(
            { error: "Failed to create workflow" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        // Get authenticated user
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const workflows = await prisma.workflow.findMany({
            where: { userId: user.id },
            orderBy: { updatedAt: "desc" },
        });

        return NextResponse.json(workflows);
    } catch (error) {
        console.error("Failed to fetch workflows:", error);
        return NextResponse.json(
            { error: "Failed to fetch workflows" },
            { status: 500 }
        );
    }
}

