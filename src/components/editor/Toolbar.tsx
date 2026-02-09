"use client";

import React, { useState, useEffect, useRef } from "react";
import { MousePointer, Hand, Undo, Redo, ChevronDown, Download, Upload } from "lucide-react";
import { useReactFlow, useViewport } from "reactflow";
import { cn } from "@/lib/utils";
import { useUndoStore } from "@/store/useUndoStore";
import { create } from "zustand";

// Store for interaction mode (shared between Toolbar and EditorCanvas)
interface InteractionModeState {
    mode: "select" | "pan";
    setMode: (mode: "select" | "pan") => void;
}

export const useInteractionMode = create<InteractionModeState>((set) => ({
    mode: "select",
    setMode: (mode) => set({ mode }),
}));

export function Toolbar() {
    const { zoomIn, zoomOut, zoomTo, fitView, getNodes, getEdges, setNodes, setEdges } = useReactFlow();
    const { zoom } = useViewport();
    const [showZoomMenu, setShowZoomMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { undo, redo, canUndo, canRedo } = useUndoStore();
    const { mode, setMode } = useInteractionMode();

    const handleUndo = () => {
        const result = undo(getNodes(), getEdges());
        if (result) {
            setNodes(result.nodes);
            setEdges(result.edges);
        }
    };

    const handleRedo = () => {
        const result = redo(getNodes(), getEdges());
        if (result) {
            setNodes(result.nodes);
            setEdges(result.edges);
        }
    };

    // Export workflow as JSON file
    const handleExport = () => {
        const nodes = getNodes();
        const edges = getEdges();

        const workflow = {
            version: "1.0",
            exportedAt: new Date().toISOString(),
            nodes: nodes.map(node => ({
                id: node.id,
                type: node.type,
                position: node.position,
                data: node.data,
            })),
            edges: edges.map(edge => ({
                id: edge.id,
                source: edge.source,
                target: edge.target,
                sourceHandle: edge.sourceHandle,
                targetHandle: edge.targetHandle,
            })),
        };

        const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `workflow-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Import workflow from JSON file
    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const content = event.target?.result as string;
                const workflow = JSON.parse(content);

                if (!workflow.nodes || !workflow.edges) {
                    alert("Invalid workflow file: missing nodes or edges");
                    return;
                }

                // Restore nodes with proper structure
                const importedNodes = workflow.nodes.map((node: any) => ({
                    id: node.id,
                    type: node.type,
                    position: node.position,
                    data: node.data,
                }));

                // Restore edges
                const importedEdges = workflow.edges.map((edge: any) => ({
                    id: edge.id,
                    source: edge.source,
                    target: edge.target,
                    sourceHandle: edge.sourceHandle,
                    targetHandle: edge.targetHandle,
                }));

                setNodes(importedNodes);
                setEdges(importedEdges);

                // Fit view after import
                setTimeout(() => fitView({ padding: 0.2 }), 100);

                console.log(`Imported workflow: ${importedNodes.length} nodes, ${importedEdges.length} edges`);
            } catch (err) {
                console.error("Import error:", err);
                alert("Failed to import workflow. Please check the file format.");
            }
        };
        reader.readAsText(file);

        // Reset file input so same file can be imported again
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowZoomMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const zoomPercentage = Math.round(zoom * 100);

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            {/* Hidden file input for import */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImport}
            />

            {/* Zoom Menu Popover */}
            {showZoomMenu && (
                <div
                    ref={menuRef}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-[#18181b] border border-white/10 rounded-lg shadow-2xl p-1.5 flex flex-col gap-0.5 animate-in fade-in slide-in-from-bottom-2 duration-200"
                >
                    <button
                        onClick={() => { zoomIn(); setShowZoomMenu(false); }}
                        className="flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded transition w-full"
                    >
                        <span>Zoom in</span>
                        <span className="text-gray-500 text-xs">Ctrl +</span>
                    </button>
                    <button
                        onClick={() => { zoomOut(); setShowZoomMenu(false); }}
                        className="flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded transition w-full"
                    >
                        <span>Zoom out</span>
                        <span className="text-gray-500 text-xs">Ctrl -</span>
                    </button>
                    <button
                        onClick={() => { zoomTo(1); setShowZoomMenu(false); }}
                        className="flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded transition w-full"
                    >
                        <span>Zoom to 100%</span>
                        <span className="text-gray-500 text-xs">Ctrl 0</span>
                    </button>
                    <button
                        onClick={() => { fitView(); setShowZoomMenu(false); }}
                        className="flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded transition w-full"
                    >
                        <span>Zoom to fit</span>
                        <span className="text-gray-500 text-xs">Ctrl 1</span>
                    </button>
                </div>
            )}

            {/* Toolbar */}
            <div className="flex items-center gap-1 bg-[#1c1c1e] border border-white/5 rounded-lg px-2 py-1.5 shadow-2xl">
                <button
                    onClick={() => setMode("select")}
                    className={cn(
                        "p-2 rounded-md transition",
                        mode === "select"
                            ? "bg-[#F2FF9F] text-black"
                            : "text-gray-400 hover:bg-white/10 hover:text-white"
                    )}
                    title="Select (V)"
                >
                    <MousePointer className="w-4 h-4 fill-current" />
                </button>
                <button
                    onClick={() => setMode("pan")}
                    className={cn(
                        "p-2 rounded-md transition",
                        mode === "pan"
                            ? "bg-[#F2FF9F] text-black"
                            : "text-gray-400 hover:bg-white/10 hover:text-white"
                    )}
                    title="Pan (H)"
                >
                    <Hand className="w-4 h-4" />
                </button>

                <div className="w-px h-4 bg-white/10 mx-2" />

                <button
                    onClick={handleUndo}
                    disabled={!canUndo}
                    className={cn("p-2 rounded-md transition", canUndo ? "hover:bg-white/10 text-gray-400 hover:text-white" : "text-gray-700 cursor-not-allowed")}
                    title="Undo"
                >
                    <Undo className="w-4 h-4" />
                </button>
                <button
                    onClick={handleRedo}
                    disabled={!canRedo}
                    className={cn("p-2 rounded-md transition", canRedo ? "hover:bg-white/10 text-gray-400 hover:text-white" : "text-gray-700 cursor-not-allowed")}
                    title="Redo"
                >
                    <Redo className="w-4 h-4" />
                </button>

                <div className="w-px h-4 bg-white/10 mx-2" />

                {/* Export Button */}
                <button
                    onClick={handleExport}
                    className="p-2 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition"
                    title="Export Workflow (JSON)"
                >
                    <Download className="w-4 h-4" />
                </button>

                {/* Import Button */}
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition"
                    title="Import Workflow (JSON)"
                >
                    <Upload className="w-4 h-4" />
                </button>

                <div className="w-px h-4 bg-white/10 mx-2" />

                <button
                    onClick={() => setShowZoomMenu(!showZoomMenu)}
                    className={cn(
                        "flex items-center gap-1 px-2 py-1 text-xs font-mono text-gray-400 hover:text-white transition rounded-md",
                        showZoomMenu && "bg-white/10 text-white"
                    )}
                >
                    {zoomPercentage}% <ChevronDown className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}

