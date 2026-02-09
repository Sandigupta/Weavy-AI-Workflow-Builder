import { create } from 'zustand';
import { Edge, Node } from 'reactflow';

interface ExecutionStep {
    nodeId: string;
    nodeName: string;
    nodeType: string;
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
    output?: any;
    error?: string;
    startedAt?: string;
    endedAt?: string;
    duration?: number; // in seconds
}

interface HistoryItem {
    id: string;
    action: string;
    time: string;
    scope: 'full' | 'partial' | 'single';
    scopeCount?: number; // Number of selected nodes
    status: 'success' | 'running' | 'failed';
    duration?: number; // in seconds
    steps: ExecutionStep[];
}

interface ExecutionState {
    isRunning: boolean;
    executionLog: string[];
    history: HistoryItem[];
    expandedExecutionId: string | null;
    saveWorkflow: (nodes: Node[], edges: Edge[], workflowId?: string, name?: string) => Promise<string>;
    stopExecution: (executionId: string) => Promise<void>;
    startExecution: (nodes: Node[], edges: Edge[], setNodes: (update: (nodes: Node[]) => Node[]) => void, startNodeIds?: string[], workflowId?: string) => Promise<void>;
    toggleExpanded: (executionId: string) => void;
    loadHistoryFromDb: (workflowId: string) => Promise<void>;
}

export const useExecutionStore = create<ExecutionState>((set, get) => ({
    isRunning: false,
    executionLog: [],
    history: [],
    expandedExecutionId: null,

    toggleExpanded: (executionId: string) => {
        set(state => ({
            expandedExecutionId: state.expandedExecutionId === executionId ? null : executionId
        }));
    },

    loadHistoryFromDb: async (workflowId: string) => {
        try {
            const res = await fetch(`/api/workflows/${workflowId}/executions`);
            if (!res.ok) return;

            const executions = await res.json();
            const historyItems: HistoryItem[] = executions.map((exec: any) => ({
                id: exec.id,
                action: formatScope(exec.scope),
                time: new Date(exec.createdAt).toLocaleTimeString(),
                scope: parseScopeType(exec.scope),
                scopeCount: parseScopeCount(exec.scope),
                status: exec.status === 'COMPLETED' ? 'success' : exec.status === 'FAILED' ? 'failed' : 'running',
                duration: exec.startedAt && exec.endedAt
                    ? (new Date(exec.endedAt).getTime() - new Date(exec.startedAt).getTime()) / 1000
                    : undefined,
                steps: (exec.steps || []).map((step: any) => ({
                    nodeId: step.nodeId,
                    nodeName: step.nodeName || step.nodeId,
                    nodeType: step.nodeType || 'unknown',
                    status: step.status,
                    output: step.output,
                    error: step.error,
                    startedAt: step.startedAt,
                    endedAt: step.endedAt,
                    duration: step.startedAt && step.endedAt
                        ? (new Date(step.endedAt).getTime() - new Date(step.startedAt).getTime()) / 1000
                        : undefined
                }))
            }));

            set({ history: historyItems });
        } catch (error) {
            console.error("Failed to load history:", error);
        }
    },

    saveWorkflow: async (nodes, edges, workflowId, name) => {
        const workflowData = {
            name: name || "Untitled Workflow",
            nodes: nodes,
            edges: edges
        };

        // Handle 'new-file' or 404 by creating new workflow
        if (workflowId === 'new-file') {
            const createRes = await fetch(`/api/workflows`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...workflowData })
            });

            if (!createRes.ok) throw new Error("Failed to create workflow");

            const created = await createRes.json();
            return created.id;
        } else {
            let res = await fetch(`/api/workflows/${workflowId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(workflowData)
            });

            if (!res.ok) {
                if (res.status === 404) {
                    const createRes = await fetch(`/api/workflows`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...workflowData })
                    });

                    if (!createRes.ok) throw new Error("Failed to create workflow");

                    const created = await createRes.json();
                    return created.id;
                } else {
                    throw new Error("Failed to save workflow");
                }
            }
            return workflowId!;
        }
    },

    stopExecution: async (executionId) => {
        try {
            await fetch(`/api/workflows/${executionId}/cancel`, { method: 'POST' });
            // Optimistically update status to 'failed' (canceled)
            set(state => ({
                isRunning: false,
                history: state.history.map(h =>
                    h.id === executionId ? { ...h, status: 'failed' } : h
                )
            }));
        } catch (error) {
            console.error("Failed to stop execution:", error);
        }
    },

    startExecution: async (nodes, edges, setNodes, startNodeIds, workflowId) => {
        set({ isRunning: true, executionLog: [] });

        try {
            // Save first
            const currentWorkflowId = await get().saveWorkflow(nodes, edges, workflowId);

            const runRes = await fetch(`/api/workflows/${currentWorkflowId}/run`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    selectedNodeIds: startNodeIds
                })
            });

            if (!runRes.ok) {
                const errorData = await runRes.json().catch(() => ({}));
                console.error("Run failed details:", errorData);
                throw new Error(`Failed to start run: ${errorData.details || runRes.statusText}`);
            }

            const runData = await runRes.json();
            const executionId = runData.executionId;

            // Determine scope for display
            const scope: 'full' | 'partial' | 'single' = !startNodeIds?.length
                ? 'full'
                : startNodeIds.length === 1
                    ? 'single'
                    : 'partial';
            const scopeLabel = scope === 'full'
                ? 'Full Workflow'
                : scope === 'single'
                    ? 'Single Node'
                    : `${startNodeIds!.length} Nodes Selected`;

            // Add history entry with steps
            set(state => ({
                history: [
                    {
                        id: executionId,
                        action: scopeLabel,
                        time: new Date().toLocaleTimeString(),
                        scope,
                        scopeCount: startNodeIds?.length,
                        status: 'running',
                        steps: []
                    },
                    ...state.history
                ]
            }));

            // Poll Status
            const intervalId = setInterval(async () => {
                const statusRes = await fetch(`/api/executions/${executionId}`);
                if (!statusRes.ok) return;

                const statusData = await statusRes.json();

                // Update Nodes based on Steps
                if (statusData.steps) {
                    console.log("[Execution] Updating nodes with steps:", statusData.steps.map((s: any) => ({ nodeId: s.nodeId, status: s.status, hasOutput: !!s.output })));
                    setNodes((nds) => nds.map(n => {
                        const step = statusData.steps.find((s: any) => s.nodeId === n.id);
                        if (step) {
                            // Preserve existing output if new output is undefined
                            const newOutput = step.output ?? n.data.output;
                            console.log(`[Execution] Node ${n.id} update:`, { status: step.status, hasNewOutput: !!step.output, preservedOutput: !!newOutput });
                            return {
                                ...n,
                                data: {
                                    ...n.data,
                                    isRunning: step.status === 'RUNNING',
                                    isFinished: step.status === 'COMPLETED' || step.status === 'FAILED',
                                    output: newOutput
                                }
                            };
                        }
                        return n;
                    }));

                    // Update history with steps
                    set(state => ({
                        history: state.history.map(h => {
                            if (h.id === executionId) {
                                return {
                                    ...h,
                                    steps: statusData.steps.map((step: any) => {
                                        const node = nodes.find(n => n.id === step.nodeId);
                                        return {
                                            nodeId: step.nodeId,
                                            nodeName: node?.data?.label || step.nodeId,
                                            nodeType: node?.type || 'unknown',
                                            status: step.status,
                                            output: step.output,
                                            error: step.error,
                                            startedAt: step.startedAt,
                                            endedAt: step.endedAt,
                                            duration: step.startedAt && step.endedAt
                                                ? (new Date(step.endedAt).getTime() - new Date(step.startedAt).getTime()) / 1000
                                                : undefined
                                        };
                                    })
                                };
                            }
                            return h;
                        })
                    }));
                }

                if (statusData.status === 'COMPLETED' || statusData.status === 'FAILED' || statusData.status === 'CANCELED') {
                    clearInterval(intervalId);
                    set({ isRunning: false });

                    const duration = statusData.startedAt && statusData.endedAt
                        ? (new Date(statusData.endedAt).getTime() - new Date(statusData.startedAt).getTime()) / 1000
                        : undefined;

                    set(state => ({
                        history: state.history.map(h =>
                            h.id === executionId
                                ? { ...h, status: statusData.status === 'COMPLETED' ? 'success' : 'failed', duration }
                                : h
                        )
                    }));
                }
            }, 1000);

        } catch (error) {
            console.error("Execution failed:", error);
            set({ isRunning: false });
        }
    }
}));

// Helper functions
function formatScope(scope: string | null): string {
    if (!scope || scope === 'full') return 'Full Workflow';
    if (scope.startsWith('single:')) return 'Single Node';
    if (scope.startsWith('partial:')) {
        const count = scope.split(':')[1];
        return `${count} Nodes Selected`;
    }
    return 'Run';
}

function parseScopeType(scope: string | null): 'full' | 'partial' | 'single' {
    if (!scope || scope === 'full') return 'full';
    if (scope.startsWith('single:')) return 'single';
    return 'partial';
}

function parseScopeCount(scope: string | null): number | undefined {
    if (!scope) return undefined;
    if (scope.startsWith('partial:')) return parseInt(scope.split(':')[1]);
    if (scope.startsWith('single:')) return 1;
    return undefined;
}

