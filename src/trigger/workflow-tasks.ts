import { task, logger } from "@trigger.dev/sdk/v3";
import { prisma } from "../lib/prisma";

import { cropImage, extractFrame } from "./media-tasks";

// ==== TOPOLOGICAL SORT & PARALLEL EXECUTION ====

interface NodeDef {
    id: string;
    type: string;
    data: any;
}

interface EdgeDef {
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
}

/**
 * Topological sort using Kahn's algorithm.
 * Returns nodes grouped by levels - nodes in the same level can run in parallel.
 */
function topologicalSortLevels(nodes: NodeDef[], edges: EdgeDef[]): NodeDef[][] {
    const nodeMap = new Map<string, NodeDef>();
    nodes.forEach(n => nodeMap.set(n.id, n));

    // Build in-degree map and adjacency list
    const inDegree = new Map<string, number>();
    const adjacency = new Map<string, string[]>();

    nodes.forEach(n => {
        inDegree.set(n.id, 0);
        adjacency.set(n.id, []);
    });

    edges.forEach(e => {
        inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1);
        adjacency.get(e.source)?.push(e.target);
    });

    // Kahn's algorithm with level tracking
    const levels: NodeDef[][] = [];
    let queue: string[] = [];

    // Start with nodes that have no incoming edges (in-degree = 0)
    inDegree.forEach((degree, nodeId) => {
        if (degree === 0) queue.push(nodeId);
    });

    while (queue.length > 0) {
        // All nodes in current queue are at the same level
        const currentLevel: NodeDef[] = [];
        const nextQueue: string[] = [];

        for (const nodeId of queue) {
            const node = nodeMap.get(nodeId);
            if (node) currentLevel.push(node);

            // Reduce in-degree of all targets
            for (const targetId of adjacency.get(nodeId) || []) {
                const newDegree = (inDegree.get(targetId) || 1) - 1;
                inDegree.set(targetId, newDegree);
                if (newDegree === 0) {
                    nextQueue.push(targetId);
                }
            }
        }

        if (currentLevel.length > 0) {
            levels.push(currentLevel);
        }
        queue = nextQueue;
    }

    return levels;
}

/**
 * Get selected nodes and all their upstream dependencies.
 * This ensures that when running partial execution, we also run any nodes
 * that the selected nodes depend on for their inputs.
 */
function getNodesWithDependencies(
    allNodes: NodeDef[],
    edges: EdgeDef[],
    selectedIds: Set<string>
): NodeDef[] {
    const nodeMap = new Map<string, NodeDef>();
    allNodes.forEach(n => nodeMap.set(n.id, n));

    // Build reverse adjacency (target -> sources)
    const dependencies = new Map<string, string[]>();
    allNodes.forEach(n => dependencies.set(n.id, []));
    edges.forEach(e => {
        dependencies.get(e.target)?.push(e.source);
    });

    // BFS to find all dependencies
    const nodesToRun = new Set<string>(selectedIds);
    const queue = [...selectedIds];

    while (queue.length > 0) {
        const nodeId = queue.shift()!;
        const deps = dependencies.get(nodeId) || [];
        for (const depId of deps) {
            if (!nodesToRun.has(depId)) {
                nodesToRun.add(depId);
                queue.push(depId);
            }
        }
    }

    return allNodes.filter(n => nodesToRun.has(n.id));
}

export const workflowOrchestrator = task({
    id: "workflow-orchestrator",
    run: async (payload: { executionId: string; workflowId: string; selectedNodeIds?: string[] }, { ctx }) => {
        const isPartialRun = payload.selectedNodeIds && payload.selectedNodeIds.length > 0;
        logger.log(`Starting workflow execution (${isPartialRun ? "PARTIAL" : "FULL"} - PARALLEL MODE)`, {
            payload,
            selectedCount: payload.selectedNodeIds?.length
        });

        // 1. Update Execution Status to RUNNING
        await prisma.execution.update({
            where: { id: payload.executionId },
            data: {
                status: "RUNNING",
                startedAt: new Date()
            }
        });

        const execution = await prisma.execution.findUnique({
            where: { id: payload.executionId },
            include: { workflow: true }
        });

        if (!execution) {
            throw new Error("Execution not found");
        }

        const { nodes, edges } = execution.workflow;
        let nodesList = nodes as unknown as NodeDef[];
        let edgesList = edges as unknown as EdgeDef[];

        // Filter to selected nodes if partial execution
        if (isPartialRun && payload.selectedNodeIds) {
            const selectedSet = new Set(payload.selectedNodeIds);

            // Get selected nodes and their upstream dependencies
            const nodesToRun = getNodesWithDependencies(nodesList, edgesList, selectedSet);
            nodesList = nodesToRun;

            // Filter edges to only include edges between nodes we're running
            const nodeIdSet = new Set(nodesToRun.map(n => n.id));
            edgesList = edgesList.filter(e => nodeIdSet.has(e.source) && nodeIdSet.has(e.target));

            logger.log(`Partial execution: ${nodesToRun.length} nodes (including dependencies)`);
        }

        // Store outputs by Node ID
        const outputs: Record<string, any> = {};

        // ==== PARALLEL EXECUTION WITH TOPOLOGICAL SORT ====
        const levels = topologicalSortLevels(nodesList, edgesList);
        logger.log(`Workflow has ${levels.length} levels for execution`, {
            levelSizes: levels.map(l => l.length)
        });

        for (let levelIndex = 0; levelIndex < levels.length; levelIndex++) {
            const level = levels[levelIndex];
            logger.log(`Executing level ${levelIndex + 1}/${levels.length} with ${level.length} node(s) in parallel`);

            // Execute all nodes in this level in parallel
            const promises = level.map(node => executeNode(node, edgesList, outputs, payload.executionId));
            const results = await Promise.all(promises);

            // Store all outputs from this level
            for (let i = 0; i < level.length; i++) {
                outputs[level[i].id] = results[i];
            }
        }

        // 4. Update Execution (COMPLETED)
        await prisma.execution.update({
            where: { id: payload.executionId },
            data: {
                status: "COMPLETED",
                endedAt: new Date()
            }
        });

        return { success: true, levels: levels.length };
    },
});

/**
 * Execute a single node with proper error handling
 */
async function executeNode(
    node: NodeDef,
    edgesList: EdgeDef[],
    outputs: Record<string, any>,
    executionId: string
): Promise<any> {
    logger.log(`Processing node ${node.id} (${node.type})`);

    // Create Execution Step (RUNNING)
    const step = await prisma.executionStep.create({
        data: {
            executionId: executionId,
            nodeId: node.id,
            status: "RUNNING",
            startedAt: new Date(),
            logs: [`Starting ${node.type} node`]
        }
    });

    let output: any = null;

    try {
        // Resolve Inputs from Edges
        const incomingEdges = edgesList.filter(e => e.target === node.id);

        const getInput = (handleId: string) => {
            const edge = incomingEdges.find(e => e.targetHandle === handleId);
            if (!edge) return null;
            return outputs[edge.source];
        };

        const getAnyInput = () => {
            if (incomingEdges.length === 0) return null;
            return outputs[incomingEdges[0].source];
        };

        switch (node.type) {
            case "llm-node":
            case "runAnyLLM":
            case "run-all-llm":
                const systemPromptInput = getInput("system_prompt");
                const userMessageInput = getInput("user_message") || getAnyInput();
                const imagesInput = getInput("images");

                const systemPrompt = systemPromptInput?.text || systemPromptInput?.output || null;
                const userMessage = userMessageInput?.text || userMessageInput?.output || node.data.prompt || "Hello AI";

                let imageUrls: string[] = [];
                if (imagesInput) {
                    // Check various property names that different nodes might use
                    const imgUrl = imagesInput.outputUrl || imagesInput.output || imagesInput.image_url ||
                        (typeof imagesInput === 'string' ? imagesInput : null);
                    if (imgUrl && Array.isArray(imgUrl)) {
                        imageUrls = imgUrl;
                    } else if (imgUrl && typeof imgUrl === 'string') {
                        imageUrls = [imgUrl];
                    }
                }

                logger.log(`LLM Node images resolved:`, { imageUrls, imagesInput });

                const llmResult = await runLLMNode.triggerAndWait({
                    nodeId: node.id,
                    prompt: userMessage,
                    systemPrompt: systemPrompt,
                    images: imageUrls,
                    model: node.data.model || "gemini-2.0-flash",
                    executionId: executionId
                });

                if (!llmResult.ok) throw llmResult.error;
                output = llmResult.output;
                break;

            case "text-node":
            case "textNode":
                const text = node.data.text || "No text";
                logger.log(`Text Node ${node.id}: ${text}`);
                output = { text, output: text };
                await new Promise(r => setTimeout(r, 300)); // Faster for parallel
                break;

            case "uploadImage":
                output = { output: node.data.imageUrl || "" };
                break;

            case "uploadVideo":
                output = { output: node.data.videoUrl || "" };
                break;

            case "crop-image":
            case "cropImage":
                const imageInput = getInput("image_url") || getAnyInput();
                const cropResult = await cropImage.triggerAndWait({
                    imageUrl: imageInput?.output || node.data.imageUrl || "https://picsum.photos/200/300",
                    width: node.data.width || 100,
                    height: node.data.height || 100,
                    x: node.data.x || 0,
                    y: node.data.y || 0
                });

                if (!cropResult.ok) throw cropResult.error;
                output = cropResult.output;
                break;

            case "extract-frame":
            case "extractFrame":
                const videoInput = getInput("video_url") || getAnyInput();
                const frameResult = await extractFrame.triggerAndWait({
                    videoUrl: videoInput?.output || node.data.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    timestamp: node.data.timestamp || 0
                });

                if (!frameResult.ok) throw frameResult.error;
                output = frameResult.output;
                break;

            case "outputNode":
            case "output-node":
                const anyInput = getInput("input") || getAnyInput();
                // Pass through the input to the output.
                // We handle object/string/array logic in the component, but here we just need to pass the raw data.
                // If it's an object with 'output' key (like from LLM), we might want to extract it, 
                // but the component can also handle raw objects. 
                // Let's try to be smart: if it has 'output' or 'outputUrl' or 'image_url', prefer that.

                let finalOutput = anyInput;
                if (anyInput) {
                    finalOutput = anyInput.output || anyInput.outputUrl || anyInput.image_url || anyInput.text || anyInput;
                }

                output = finalOutput || { message: "No input received" };
                logger.log(`Output Node processing:`, { input: anyInput, finalOutput });
                break;

            default:
                logger.log(`Unknown node type: ${node.type}`);
                output = { message: "Unknown node type" };
        }

        // Update Step (COMPLETED)
        await prisma.executionStep.update({
            where: { id: step.id },
            data: {
                status: "COMPLETED",
                endedAt: new Date(),
                output: output ? output : {}
            }
        });

        return output;

    } catch (error: any) {
        logger.error(`Error processing node ${node.id}`, { error });
        await prisma.executionStep.update({
            where: { id: step.id },
            data: {
                status: "FAILED",
                endedAt: new Date(),
                error: error.message
            }
        });
        throw error;
    }
}

export const runLLMNode = task({
    id: "run-llm-node",
    run: async (payload: { nodeId: string, prompt: string, systemPrompt?: string, images?: string[], model: string, executionId: string }) => {
        logger.log("Running LLM Node", { ...payload, images: payload.images?.length });

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("GEMINI_API_KEY not set");

        // Map friendlier names to API model names
        // Map friendlier names to API model names
        let validModel = "gemini-2.0-flash"; // Safe default with vision support

        if (payload.model) {
            const m = payload.model.trim();
            // Handle "Gemini 2.0 Flash" -> use experimental or flash
            if (m === "Gemini 2.0 Flash" || m === "gemini-2.0-flash") validModel = "gemini-2.0-flash";
            else if (m === "Gemini 1.5 Flash" || m === "gemini-1.5-flash") validModel = "gemini-2.0-flash"; // Upgrade deprecated 1.5 to 2.0
            else if (m === "Gemini Pro" || m === "gemini-pro") validModel = "gemini-2.0-flash"; // Upgrade legacy to Flash
            else if (m.startsWith("gemini-")) validModel = m; // Pass through valid IDs
        }

        console.log(`Mapping model '${payload.model}' to '${validModel}'`);

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${validModel}:generateContent?key=${apiKey}`;

        // Construct Content Parts
        const parts: any[] = [];

        // 1. Add Text Prompt
        if (payload.prompt) {
            parts.push({ text: payload.prompt });
        }

        // 2. Add Images (Fetch and convert to Base64)
        if (payload.images && payload.images.length > 0) {
            for (const imgUrl of payload.images) {
                try {
                    // Start of rudimentary image fetching
                    // In a real app, use a dedicated library or robust fetch with timeout
                    const imgResp = await fetch(imgUrl);
                    if (!imgResp.ok) {
                        logger.error(`Failed to fetch image: ${imgUrl}`);
                        continue;
                    }
                    const arrayBuffer = await imgResp.arrayBuffer();
                    const base64String = Buffer.from(arrayBuffer).toString("base64");
                    const mimeType = imgResp.headers.get("content-type") || "image/jpeg";

                    parts.push({
                        inlineData: {
                            mimeType: mimeType,
                            data: base64String
                        }
                    });
                } catch (e) {
                    logger.error(`Error processing image ${imgUrl}`, { error: e });
                }
            }
        }

        // Construct Request Body
        const requestBody: any = {
            contents: [{ parts }]
        };

        // Add System Instruction if present (only some models support it, but 1.5 Flash does)
        if (payload.systemPrompt) {
            requestBody.systemInstruction = {
                parts: [{ text: payload.systemPrompt }]
            };
        }

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                logger.error("Gemini API Error", { status: response.status, body: errorText });
                throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";

            return {
                output: generatedText
            };
        } catch (error: any) {
            logger.error("Failed to call Gemini API", { error });
            throw error;
        }
    }
});
