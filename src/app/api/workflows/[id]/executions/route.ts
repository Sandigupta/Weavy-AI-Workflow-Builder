import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

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

        // Verify workflow ownership
        const workflow = await prisma.workflow.findUnique({
            where: { id },
        });

        if (!workflow || workflow.userId !== user.id) {
            return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
        }

        // Fetch executions with steps
        const executions = await prisma.execution.findMany({
            where: { workflowId: id },
            include: {
                steps: {
                    orderBy: { startedAt: 'asc' }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 50 // Limit to last 50 executions
        });

        return NextResponse.json(executions);

    } catch (error) {
        console.error("Failed to fetch executions:", error);
        return NextResponse.json(
            { error: "Failed to fetch executions" },
            { status: 500 }
        );
    }
}
