type Edge = {
    source: string;
    target: string;
}

export function validateDAG(edges: Edge[]): boolean {
    const adj = new Map<string, string[]>();

    // Build Adjacency List
    for (const edge of edges) {
        if (!adj.has(edge.source)) adj.set(edge.source, []);
        adj.get(edge.source)?.push(edge.target);
    }

    const visited = new Set<string>();
    const recStack = new Set<string>();

    function isCyclic(node: string): boolean {
        visited.add(node);
        recStack.add(node);

        const neighbors = adj.get(node) || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                if (isCyclic(neighbor)) return true;
            } else if (recStack.has(neighbor)) {
                return true;
            }
        }

        recStack.delete(node);
        return false;
    }

    // Check all nodes (in case of disconnected graphs)
    for (const node of adj.keys()) {
        if (!visited.has(node)) {
            if (isCyclic(node)) return false; // Cycle detected
        }
    }

    return true; // No cycles
}
