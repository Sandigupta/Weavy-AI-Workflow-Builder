"use client";

import React from "react";
import Link from "next/link";
import { Play, MousePointer2, ChevronLeft } from "lucide-react";
import { useExecutionStore } from "@/store/useExecutionStore";
import { useReactFlow, useStore } from "reactflow";
import { cn } from "@/lib/utils";

// Selector to count selected nodes reactively
const selectedNodesCountSelector = (state: any) =>
    state.getNodes().filter((n: any) => n.selected).length;

export function EditorHeader({ title }: { title: string }) {
    const { startExecution, isRunning } = useExecutionStore();
    const { getNodes, getEdges, setNodes } = useReactFlow();

    // Get selected count reactively
    const selectedCount = useStore(selectedNodesCountSelector);

    const handleRun = () => {
        const nodes = getNodes();
        const selectedNodes = nodes.filter(n => n.selected);
        const edges = getEdges();

        // Get workflow ID from URL, not from title
        const pathSegments = window.location.pathname.split('/');
        const currentId = pathSegments[pathSegments.length - 1]; // "new-file" or actual ID

        if (selectedNodes.length > 0) {
            startExecution(nodes, edges, setNodes, selectedNodes.map(n => n.id), currentId);
        } else {
            startExecution(nodes, edges, setNodes, undefined, currentId);
        }
    };

    const titleRef = React.useRef<HTMLInputElement>(null);
    const [isSaving, setIsSaving] = React.useState(false);

    const handleSave = async () => {
        // Assume 'new-file' or ID is in title/URL, but for now we need workflowID
        // In a real app, we get ID from params. Here we might need to pass it or get from store.
        // For this demo, let's assume the ID is passed via props or available in URL logic.
        // Since EditorHeader doesn't have ID, we might need to rely on the parent page or store.
        // BUT, startExecution takes workflowId. 
        // Let's grab it from the URL since this component is inside the editor page [id]
        const pathSegments = window.location.pathname.split('/');
        const currentId = pathSegments[pathSegments.length - 1]; // "new-file" or ID
        const currentTitle = titleRef.current?.value || "Untitled Workflow";

        setIsSaving(true);
        try {
            const newId = await useExecutionStore.getState().saveWorkflow(getNodes(), getEdges(), currentId, currentTitle);
            if (newId && newId !== currentId) {
                // Update URL without reload if it was new-file
                window.history.replaceState(null, '', `/editor/${newId}`);
            }
            // Artificial delay to show the "glow" if save is too fast
            await new Promise(resolve => setTimeout(resolve, 500));
            alert("Workflow Saved!");
        } catch (e) {
            console.error(e);
            alert("Failed to save");
        } finally {
            setIsSaving(false);
        }
    };

    const handleStop = () => {
        // Need current execution ID. store.history[0]?.id if running?
        const currentExecution = useExecutionStore.getState().history[0];
        if (currentExecution && isRunning) {
            useExecutionStore.getState().stopExecution(currentExecution.id);
        }
    };

    return (
        <div className="absolute top-4 left-16 right-4 flex items-center justify-between z-50 pointer-events-none">
            <div className="flex items-center gap-3 pointer-events-auto">
                <Link
                    href="/dashboard"
                    className="p-2 bg-[#1c1c1e] hover:bg-[#2a2a2e] text-gray-400 hover:text-white rounded-lg border border-white/5 transition-colors"
                    title="Back to Dashboard"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Link>

                {/* Title Input */}
                <div className="bg-[#1c1c1e] px-4 py-2 rounded-lg border border-white/5 flex items-center">
                    <input
                        ref={titleRef}
                        type="text"
                        defaultValue={title || "Untitled Workflow"}
                        className="bg-transparent text-white text-sm font-medium outline-none w-48"
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex gap-3 pointer-events-auto">
                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={cn(
                        "text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 border border-white/5 transition-all duration-300",
                        isSaving
                            ? "bg-[#F2FF9F] text-black shadow-[0_0_15px_rgba(242,255,159,0.5)] scale-105"
                            : "bg-[#1c1c1e] hover:bg-[#2a2a2e] text-white"
                    )}
                >
                    {isSaving ? (
                        <>
                            <span className="animate-spin mr-1">⟳</span> Saving...
                        </>
                    ) : (
                        "Save"
                    )}
                </button>

                {/* Run/Stop Button */}
                {isRunning ? (
                    <button
                        onClick={handleStop}
                        className="px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                            <rect x="4" y="4" width="16" height="16" rx="2" />
                        </svg>
                        Stop
                    </button>
                ) : (
                    <button
                        onClick={handleRun}
                        className={cn(
                            "px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2",
                            selectedCount > 0
                                ? "bg-[#F2FF9F] text-black hover:bg-[#e6f585]"
                                : "bg-white/10 hover:bg-white/20 text-white"
                        )}
                    >
                        {selectedCount > 0 ? (
                            <>
                                <MousePointer2 className="w-3.5 h-3.5" />
                                Run {selectedCount} Selected
                            </>
                        ) : (
                            <>
                                <Play className="w-3.5 h-3.5 fill-current" />
                                Run All
                            </>
                        )}
                    </button>
                )}


            </div>
        </div>
    );
}

