"use client";

import React, { useCallback, useEffect } from "react";
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
    ReactFlowProvider,
    useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";

import { TextNode } from "./nodes/TextNode";
import { UploadImageNode } from "./nodes/UploadImageNode";
import { UploadVideoNode } from "./nodes/UploadVideoNode";
import { RunAnyLLMNode } from "./nodes/RunAnyLLMNode";
import { CropImageNode } from "./nodes/CropImageNode";
import { ExtractFrameNode } from "./nodes/ExtractFrameNode";
import { Toolbar, useInteractionMode } from "./Toolbar";
import { validateConnectionTypes, detectCycle } from "@/utils/workflowValidation";
import { useUndoStore } from "@/store/useUndoStore";
import { NODE_SCHEMAS } from "@/config/nodeSchemas";

import { OutputNode } from "./nodes/OutputNode";

// Register node types
const nodeTypes = {
    textNode: TextNode,
    uploadImage: UploadImageNode,
    uploadVideo: UploadVideoNode,
    runAnyLLM: RunAnyLLMNode,
    cropImage: CropImageNode,
    extractFrame: ExtractFrameNode,
    outputNode: OutputNode,
};

// Default initial nodes
const defaultNodes: Node[] = [
    {
        id: "1",
        type: "textNode",
        position: { x: 100, y: 100 },
        data: {
            ...NODE_SCHEMAS.textNode.initialData,
            inputs: NODE_SCHEMAS.textNode.inputs,
            outputs: NODE_SCHEMAS.textNode.outputs
        }
    },
    {
        id: "2",
        type: "runAnyLLM",
        position: { x: 500, y: 100 },
        data: {
            ...NODE_SCHEMAS.runAnyLLM.initialData,
            inputs: NODE_SCHEMAS.runAnyLLM.inputs,
            outputs: NODE_SCHEMAS.runAnyLLM.outputs
        }
    },
];

const defaultEdges: Edge[] = [];

interface EditorCanvasProps {
    templateUrl?: string;
    initialNodes?: Node[] | null;
    initialEdges?: Edge[] | null;
}

export default function EditorCanvas({ templateUrl, initialNodes, initialEdges }: EditorCanvasProps) {
    // Use initialNodes/Edges from database if provided, otherwise use defaults
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes || defaultNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges || defaultEdges);

    const { takeSnapshot } = useUndoStore();
    const { getNode, fitView } = useReactFlow();
    const { mode } = useInteractionMode();

    // Load template workflow if templateUrl is provided
    useEffect(() => {
        if (!templateUrl) return;

        const loadTemplate = async () => {
            try {
                console.log("Loading template from:", templateUrl);
                const response = await fetch(templateUrl);
                if (!response.ok) throw new Error("Failed to load template");

                const workflow = await response.json();

                if (workflow.nodes && workflow.edges) {
                    setNodes(workflow.nodes);
                    setEdges(workflow.edges);

                    // Fit view after loading
                    setTimeout(() => fitView({ padding: 0.2 }), 100);

                    console.log(`Loaded template: ${workflow.name || "Unknown"} - ${workflow.nodes.length} nodes, ${workflow.edges.length} edges`);
                }
            } catch (error) {
                console.error("Error loading template:", error);
            }
        };

        loadTemplate();
    }, [templateUrl, setNodes, setEdges, fitView]);

    // Snapshot handlers
    const onNodeDragStart = useCallback(() => {
        takeSnapshot(nodes, edges);
    }, [nodes, edges, takeSnapshot]);

    const onConnect = useCallback(
        (params: Connection) => {
            takeSnapshot(nodes, edges);
            setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: "#d4ff00", strokeWidth: 2 } }, eds));
        },
        [setEdges, nodes, edges, takeSnapshot]
    );

    const isValidConnection = useCallback(
        (connection: Connection) => {
            if (detectCycle(connection, edges)) {
                return false;
            }
            const sourceNode = getNode(connection.source || "");
            const targetNode = getNode(connection.target || "");
            return validateConnectionTypes(connection, sourceNode, targetNode);
        },
        [edges, getNode]
    );

    return (
        <div className="w-full h-full bg-[#0f0f0f]">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeDragStart={onNodeDragStart}
                isValidConnection={isValidConnection}
                nodeTypes={nodeTypes}
                fitView
                deleteKeyCode={["Delete", "Backspace"]}
                panOnDrag={mode === "pan"}
                selectionOnDrag={mode === "select"}
                className="bg-[#0f0f0f]"
            >
                <Background color="#2a2a2a" gap={20} size={1} />
                <Controls className="bg-gray-800 border-gray-700 text-white" />
                <MiniMap
                    className="!bg-gray-900 !border !border-gray-700"
                    nodeColor="#4a5568"
                    maskColor="rgba(0, 0, 0, 0.6)"
                />
                <Toolbar />
            </ReactFlow>
        </div>
    );
}

