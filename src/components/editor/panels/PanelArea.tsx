"use client";

import React from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { SearchPanel } from "./SearchPanel";
import { HistoryPanel } from "./HistoryPanel";
import { NodeLibrary } from "./NodeLibrary";

// Placeholder for other panels
const PlaceholderPanel = ({ title }: { title: string }) => (
    <div className="p-4 text-gray-400 text-sm">
        {title} functionality coming soon.
    </div>
);

export function PanelArea() {
    const { activePanel, setActivePanel } = useEditorStore();

    if (!activePanel) return null;

    return (
        <div className="w-80 bg-[#121214] border-r border-white/5 flex flex-col h-full animate-in slide-in-from-left-5 duration-200 z-40 fixed md:relative left-[56px] md:left-auto top-0 bottom-0 shadow-2xl md:shadow-none">
            {/* Header */}
            <div className="h-14 border-b border-white/5 flex items-center justify-between px-4">
                <span className="text-white font-medium capitalize">{activePanel}</span>
                <button
                    onClick={() => setActivePanel(null)}
                    className="text-gray-500 hover:text-white transition"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {activePanel === 'search' && <SearchPanel />}
                {activePanel === 'history' && <HistoryPanel />}
                {activePanel === 'projects' && <PlaceholderPanel title="Projects" />}

                {/* Populated Panels via NodeLibrary */}
                {activePanel === 'assets' && (
                    <div className="p-4 space-y-4">
                        <NodeLibrary title="Media Input" filter={(n) => n.category === 'assets'} />
                    </div>
                )}
                {activePanel === 'models' && (
                    <div className="p-4 space-y-4">
                        <NodeLibrary title="AI Models" filter={(n) => n.category === 'models'} />
                    </div>
                )}
                {activePanel === 'generate' && (
                    <div className="p-4 space-y-4">
                        {/* Generate includes models, text input, and utility/output */}
                        <NodeLibrary title="Generation Tools" filter={(n) => n.category === 'generate' || n.category === 'models' || n.category === 'utility'} />
                    </div>
                )}
                {activePanel === 'gallery' && (
                    <div className="p-4 space-y-4">
                        <NodeLibrary title="Image Tools" filter={(n) => n.category === 'processing' || n.category === 'utility'} />
                    </div>
                )}
            </div>
        </div>
    );
}
