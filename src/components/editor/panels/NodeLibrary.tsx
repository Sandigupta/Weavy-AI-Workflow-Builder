"use client";

import React from "react";
import { Type, Image as ImageIcon, Video, Sparkles, Crop, Film } from "lucide-react";
import { useReactFlow } from "reactflow";

import { NODE_TYPES_LIST, NODE_SCHEMAS } from "@/config/nodeSchemas";

// Helper for ID generation
const generateId = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);

interface NodeLibraryProps {
    filter?: (node: typeof NODE_TYPES_LIST[0]) => boolean;
    title?: string;
}

export function NodeLibrary({ filter, title }: NodeLibraryProps) {
    const { addNodes } = useReactFlow();

    const onAddNode = (type: string) => {
        const schema = NODE_SCHEMAS[type];
        if (!schema) return;

        const id = generateId();

        addNodes({
            id,
            type,
            position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
            data: {
                ...schema.initialData,
                inputs: schema.inputs,
                outputs: schema.outputs
            },
        });
    };

    const filteredNodes = filter ? NODE_TYPES_LIST.filter(filter) : NODE_TYPES_LIST;

    if (filteredNodes.length === 0) return null;

    return (
        <div>
            {title && <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</h3>}
            <div className="space-y-1">
                {filteredNodes.map((item) => (
                    <button
                        key={item.type}
                        onClick={() => onAddNode(item.type)}
                        className="w-full text-left px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white text-sm transition flex items-center gap-2"
                    >
                        <item.icon className="w-4 h-4 text-gray-500" />
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
