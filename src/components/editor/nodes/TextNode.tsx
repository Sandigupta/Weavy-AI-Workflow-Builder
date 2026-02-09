"use client";

import React from "react";
import { Type, Wand2 } from "lucide-react";
import { BaseNode } from "./BaseNode";

import { useReactFlow } from "reactflow";
import { NODE_SCHEMAS } from "@/config/nodeSchemas";

export function TextNode({ id, data, selected }: any) {
    const { setNodes } = useReactFlow();
    const schema = NODE_SCHEMAS.textNode;
    const effectiveData = {
        ...data,
        inputs: data.inputs || schema.inputs,
        outputs: data.outputs || schema.outputs,
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setNodes((nodes) =>
            nodes.map((node) => {
                if (node.id === id) {
                    return { ...node, data: { ...node.data, text } };
                }
                return node;
            })
        );
    };

    return (
        <BaseNode
            selected={selected}
            icon={Type}
            data={{
                ...effectiveData,
                content: (
                    <div className="space-y-2">
                        <textarea
                            placeholder="Enter your prompt..."
                            className="w-full h-24 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs resize-none focus:border-accent-yellow outline-none font-mono"
                            defaultValue={data.text || ""}
                            onChange={handleChange}
                        />
                        <button className="flex items-center gap-2 text-xs text-gray-500 hover:text-accent-yellow transition">
                            <Wand2 className="w-3 h-3" />
                            <span>AI Enhance</span>
                        </button>
                    </div>
                )
            }}
        />
    );
}
