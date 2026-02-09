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
        const execution = await prisma.execution.findUnique({
            where: { id },
            include: {
                steps: true,
            },
        });

        if (!execution) {
            return NextResponse.json({ error: "Execution not found" }, { status: 404 });
        }

        if (execution.userId !== user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json(execution);
    } catch (error) {
        console.error("Failed to fetch execution:", error);
        return NextResponse.json(
            { error: "Failed to fetch execution" },
            { status: 500 }
        );
    }
}

