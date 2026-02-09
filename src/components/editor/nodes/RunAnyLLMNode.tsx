"use client";

import React from "react";
import { BaseNode } from "./BaseNode";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore, ReactFlowState, useReactFlow } from "reactflow";

// Selector for efficiency
const connectionSelector = (s: ReactFlowState) => s.edges;

function RunLLMContent({ id, data }: { id: string, data: any }) {
    const edges = useStore(connectionSelector);
    const { setNodes } = useReactFlow();

    const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newModel = e.target.value;
        setNodes((nodes) =>
            nodes.map((node) => {
                if (node.id === id) {
                    return { ...node, data: { ...node.data, model: newModel } };
                }
                return node;
            })
        );
    };

    // Check connections manually
    const isSystemConnected = edges.some(e => e.target === id && e.targetHandle === 'system_prompt');
    const isUserConnected = edges.some(e => e.target === id && e.targetHandle === 'user_message');

    return (
        <div className="space-y-3">
            {/* Model Selector */}
            <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-500">Model</label>
                <select
                    value={data.model || "gemini-2.0-flash"}
                    onChange={handleModelChange}
                    className="w-full bg-[#1c1c1e] text-white text-xs p-2 rounded border border-white/10 outline-none focus:border-accent-yellow/50 cursor-pointer"
                >
                    <option value="gemini-2.0-flash">Gemini 2.0 Flash (Balanced, Text/Image/Video)</option>
                    <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash Experimental (Latest)</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (Complex Reasoning, High Intelligence)</option>
                </select>
            </div>

            {/* System Prompt Input */}
            <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-500">System Prompt</label>
                <textarea
                    disabled={isSystemConnected}
                    placeholder={isSystemConnected ? "Connected to input node" : "Enter system instructions..."}
                    className={cn(
                        "w-full bg-[#1c1c1e] text-white text-xs p-2 rounded border border-white/10 outline-none resize-none focus:border-accent-yellow/50 h-16",
                        isSystemConnected && "opacity-50 cursor-not-allowed bg-[#121214] text-gray-500 italic"
                    )}
                />
            </div>

            {/* User Message Input */}
            <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-500">User Message</label>
                <textarea
                    disabled={isUserConnected}
                    placeholder={isUserConnected ? "Connected to input node" : "Enter prompt..."}
                    className={cn(
                        "w-full bg-[#1c1c1e] text-white text-xs p-2 rounded border border-white/10 outline-none resize-none focus:border-accent-yellow/50 h-20",
                        isUserConnected && "opacity-50 cursor-not-allowed bg-[#121214] text-gray-500 italic"
                    )}
                />
            </div>

            <div className="text-[10px] text-gray-500 font-mono mt-2">
                OUTPUT
            </div>

            <div className="min-h-[60px] max-h-[200px] overflow-y-auto bg-black/40 rounded p-2 border border-white/5">
                {data.output ? (
                    <p className="text-xs text-gray-200 whitespace-pre-wrap">
                        {typeof data.output === 'object'
                            ? (data.output.output || data.output.text || JSON.stringify(data.output, null, 2))
                            : data.output}
                    </p>
                ) : (
                    <p className="text-xs text-gray-600 italic">Model output will appear here...</p>
                )}
            </div>
        </div>
    );
}

import { NODE_SCHEMAS } from "@/config/nodeSchemas";

export function RunAnyLLMNode({ id, data, selected }: any) {
    const schema = NODE_SCHEMAS.runAnyLLM;
    const effectiveData = {
        ...data,
        inputs: data.inputs || schema.inputs,
        outputs: data.outputs || schema.outputs,
    };

    return (
        <BaseNode
            selected={selected}
            icon={Sparkles}
            className="min-w-[320px]"
            data={{
                ...effectiveData,
                content: (
                    <RunLLMContent id={id} data={data} />
                ),
                isRunning: data.isRunning,
                isFinished: data.isFinished
            }}
        />
    );
}
