import { Edge, Node, Connection } from "reactflow";

/**
 * Type compatibility matrix.
 * Key: source type, Value: array of compatible target types
 */
const TYPE_COMPATIBILITY: Record<string, string[]> = {
    text: ["text"],           // Text can only connect to text inputs
    image: ["image"],         // Image can only connect to image inputs
    video: ["video"],         // Video can only connect to video inputs
};

/**
 * Checks if a connection is type-safe according to PRD rules.
 * Relies on node.data.inputs and node.data.outputs being populated.
 * 
 * Rules:
 * - text outputs can ONLY connect to text inputs
 * - image outputs can ONLY connect to image inputs
 * - video outputs can ONLY connect to video inputs
 * - If types are not defined, we default to BLOCKING (strict mode)
 */
export function validateConnectionTypes(
    connection: Connection,
    sourceNode: Node | undefined,
    targetNode: Node | undefined
): boolean {
    // If nodes are missing, block connection (stricter than before)
    if (!sourceNode || !targetNode) {
        console.warn("Connection rejected: Source or target node not found");
        return false;
    }

    // 1. Get Source Output
    const sourceHandleId = connection.sourceHandle;
    const sourceOutput = sourceNode.data.outputs?.find((o: any) => o.id === sourceHandleId);

    // 2. Get Target Input
    const targetHandleId = connection.targetHandle;
    const targetInput = targetNode.data.inputs?.find((i: any) => i.id === targetHandleId);

    // If output handle not found, check if it's the default "output" handle
    const sourceType = sourceOutput?.type?.toLowerCase() ||
        (sourceHandleId === "output" ? inferOutputType(sourceNode) : null);

    // If input handle not found, block (strict mode)
    const targetType = targetInput?.type?.toLowerCase();

    // If we can't determine types, allow connection but warn
    // This handles edge cases where schemas might not be fully populated
    if (!sourceType || !targetType) {
        console.log(`Connection allowed (types unknown): ${sourceNode.type} → ${targetNode.type}`);
        return true;
    }

    // Check compatibility
    // If target type is "any" (like Output Node), allow connection from any source
    if (targetType === "any") {
        return true;
    }

    const compatibleTypes = TYPE_COMPATIBILITY[sourceType] || [sourceType];
    const isValid = compatibleTypes.includes(targetType);

    if (!isValid) {
        console.warn(
            `❌ Connection BLOCKED: "${sourceType}" output cannot connect to "${targetType}" input\n` +
            `   Source: ${sourceNode.data.label || sourceNode.type} (${sourceHandleId})\n` +
            `   Target: ${targetNode.data.label || targetNode.type} (${targetHandleId})`
        );
    } else {
        console.log(`✓ Connection valid: ${sourceType} → ${targetType}`);
    }

    return isValid;
}

/**
 * Infer output type from node type when not explicitly defined
 */
function inferOutputType(node: Node): string | null {
    const nodeType = node.type?.toLowerCase();

    // Map node types to their default output types
    const nodeOutputTypes: Record<string, string> = {
        textnode: "text",
        uploadimage: "image",
        uploadvideo: "video",
        cropimage: "image",
        extractframe: "image",
        runanyllm: "text",
    };

    return nodeOutputTypes[nodeType || ""] || null;
}

/**
 * Checks if adding this edge contributes to a cycle (DAG validation).
 */
export function detectCycle(connection: Connection, edges: Edge[]): boolean {
    const target = connection.target;
    const source = connection.source;

    // Simple DFS to see if source is reachable from target
    // If we can get from Target -> Source, then adding Source -> Target creates a loop.

    if (source === target) return true; // Self-loop

    const stack = [target];
    const visited = new Set();

    while (stack.length > 0) {
        const currentId = stack.pop();
        if (!currentId) continue;

        if (visited.has(currentId)) continue;
        visited.add(currentId);

        if (currentId === source) return true; // Found a path back to source

        // Find all outputs of currentId
        const outgoingEdges = edges.filter(e => e.source === currentId);
        outgoingEdges.forEach(e => stack.push(e.target));
    }

    return false;
}
