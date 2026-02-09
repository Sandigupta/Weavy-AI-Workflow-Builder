"use client";

import React from "react";
import { Link, Home, Search, Clock, Briefcase, FileImage, Box, Sparkles, Image as ImageIcon, HelpCircle, Disc, BarChart } from "lucide-react";
import { useEditorStore, EditorPanel } from "@/store/useEditorStore";
import { cn } from "@/lib/utils";

const sidebarItems: { icon: any, label: string, id: EditorPanel }[] = [
    { icon: Search, label: "Search", id: "search" },
    { icon: Clock, label: "History", id: "history" },
    { icon: Briefcase, label: "Projects", id: "projects" },
    { icon: FileImage, label: "Assets", id: "assets" },
    { icon: Box, label: "Models", id: "models" },
    { icon: Sparkles, label: "Generate", id: "generate" },
    { icon: ImageIcon, label: "Gallery", id: "gallery" },
];

export function EditorSidebar() {
    const { activePanel, togglePanel } = useEditorStore();

    return (
        <aside className="w-14 bg-[#09090b] border-r border-white/5 flex flex-col items-center py-4 h-full z-50">
            {/* Logo */}
            <BarChart className="w-6 h-6 mb-8 text-white" />

            {/* Nav Items */}
            <nav className="flex-1 flex flex-col gap-6">
                {sidebarItems.map((item, i) => (
                    <button
                        key={i}
                        onClick={() => togglePanel(item.id)}
                        className={cn(
                            "transition-colors relative",
                            activePanel === item.id ? "text-[#F2FF9F]" : "text-gray-500 hover:text-white"
                        )}
                        title={item.label}
                    >
                        <item.icon className="w-5 h-5" />
                        {activePanel === item.id && (
                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-1 h-8 bg-[#F2FF9F] rounded-r-full" />
                        )}
                    </button>
                ))}
            </nav>

            {/* Bottom Items */}
            <div className="flex flex-col gap-6 mt-auto">
                <button className="text-gray-500 hover:text-white transition-colors">
                    <HelpCircle className="w-5 h-5" />
                </button>
                <button className="text-gray-500 hover:text-white transition-colors">
                    <Disc className="w-5 h-5" />
                </button>
            </div>
        </aside>
    );
}
