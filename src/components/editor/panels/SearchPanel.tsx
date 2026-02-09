"use client";

import React from "react";
import { Search } from "lucide-react";
import { useReactFlow } from "reactflow";
import { NODE_TYPES_LIST, NODE_SCHEMAS } from "@/config/nodeSchemas";

// Use the dynamic list from config, mapping to the format SearchPanel expects if needed
// Actually NODE_TYPES_LIST elements already have { type, label, icon }
const NODE_TYPES = NODE_TYPES_LIST;

export function SearchPanel() {
    const { addNodes } = useReactFlow();

    const [searchQuery, setSearchQuery] = React.useState("");

    const filteredNodes = NODE_TYPES.filter(node =>
        node.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const categories = ["Input/Output", "Processing", "AI Models", "Utilities", "Math", "Logic"];
    const filteredCategories = categories.filter(cat =>
        cat.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const onAddNode = (type: string, label: string) => {
        const schema = NODE_SCHEMAS[type];
        if (!schema) return;

        const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
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
    return (
        <div className="p-4 space-y-4">
            {/* Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search nodes..."
                    className="w-full bg-[#1c1c1e] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-white/20 outline-none placeholder:text-gray-600"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Categories */}
            <div className="space-y-6">
                {(filteredNodes.length > 0 || !searchQuery) && (
                    <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Create Node</h3>
                        <div className="space-y-1">
                            {filteredNodes.map((item) => (
                                <button
                                    key={item.type}
                                    onClick={() => onAddNode(item.type, item.label)}
                                    className="w-full text-left px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white text-sm transition flex items-center gap-2"
                                >
                                    <item.icon className="w-4 h-4 text-gray-500" />
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {(filteredCategories.length > 0) && (
                    <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">All Categories</h3>
                        <div className="space-y-1">
                            {filteredCategories.map((item) => (
                                <button key={item} className="w-full text-left px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white text-sm transition">
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {filteredNodes.length === 0 && filteredCategories.length === 0 && (
                    <div className="text-center text-gray-500 text-sm py-8">
                        No results found
                    </div>
                )}
            </div>
        </div>
    );
}
