import EditorCanvas from "@/components/editor/EditorCanvas";
import { EditorHeader } from "@/components/editor/EditorHeader";

interface PageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ template?: string }>;
}

import { prisma } from "@/lib/prisma";

export default async function EditorPage({ params, searchParams }: PageProps) {
    const { id } = await params;
    const { template } = await searchParams;

    let workflowName = "Untitled Workflow";
    let initialNodes = null;
    let initialEdges = null;

    if (id && id !== "new-file") {
        try {
            const workflow = await prisma.workflow.findUnique({
                where: { id },
                select: { name: true, nodes: true, edges: true }
            });
            if (workflow) {
                workflowName = workflow.name;
                initialNodes = workflow.nodes;
                initialEdges = workflow.edges;
            }
        } catch (error) {
            console.error("Failed to fetch workflow:", error);
        }
    }

    return (
        <div className="w-full h-full relative bg-dot-pattern">
            <EditorHeader title={workflowName} />
            <div className="absolute inset-0 z-0">
                <EditorCanvas
                    templateUrl={template}
                    initialNodes={initialNodes as any}
                    initialEdges={initialEdges as any}
                />
            </div>
        </div>
    );
}

