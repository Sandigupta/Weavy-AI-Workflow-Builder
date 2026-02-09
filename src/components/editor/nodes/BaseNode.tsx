"use client";

import React from "react";
import { Handle, Position } from "reactflow";
import { Settings, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BaseNodeProps {
    data: {
        label: string;
        content: React.ReactNode;
        inputs?: { id: string; label: string; type?: string; tooltipType?: string }[];
        outputs?: { id: string; label: string; type?: string; tooltipType?: string }[];
        isRunning?: boolean;
        isFinished?: boolean;
    };
    selected?: boolean;
    icon?: LucideIcon;
    className?: string;
}

export function BaseNode({ data, selected, icon: Icon, className }: BaseNodeProps) {
    const [hoveredHandle, setHoveredHandle] = React.useState<string | null>(null);

    const isRunning = data.isRunning;
    const isFinished = data.isFinished;

    return (
        <div
            className={cn(
                "bg-gray-900 border-2 rounded-xl shadow-2xl transition-all min-w-[280px]",
                className,
                selected ? "border-accent-yellow shadow-[0_0_20px_rgba(212,255,0,0.2)]" : "border-gray-700 hover:border-gray-600",
                isRunning && "border-accent-yellow shadow-[0_0_30px_rgba(212,255,0,0.4)] animate-pulse",
                isFinished && "border-green-500 shadow-[0_0_20px_rgba(0,255,0,0.2)]"
            )}
        >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-800 bg-gray-900/50 rounded-t-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4 text-accent-yellow" />}
                    <span className="text-white font-medium text-sm">{data.label}</span>
                </div>
                <button className="text-gray-500 hover:text-white transition">
                    <Settings className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                {data.content}
            </div>

            {/* Input Handles */}
            {data.inputs?.map((input, i) => (
                <div
                    key={input.id}
                    className="absolute flex items-center justify-center cursor-pointer"
                    style={{
                        top: 60 + i * 40,
                        left: -7,
                        width: 14,
                        height: 14,
                        zIndex: 50 // Ensure hover target is on top
                    }}
                    onMouseEnter={() => setHoveredHandle(input.id)}
                    onMouseLeave={() => setHoveredHandle(null)}
                >
                    <Handle
                        type="target"
                        position={Position.Left}
                        id={input.id}
                        className="!w-3.5 !h-3.5 !bg-[#4a5568] !border-[2px] !border-[#1a1a1a] hover:!bg-accent-yellow transition-colors !relative !inset-0 !transform-none !top-auto !left-auto"
                    />

                    {/* Tooltip (Left side) */}
                    {hoveredHandle === input.id && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-3 flex items-center pointer-events-none z-[100]">
                            <div className="bg-black/95 border border-white/20 text-white text-[10px] py-1.5 px-2.5 rounded shadow-xl whitespace-nowrap flex items-center gap-1.5 backdrop-blur-sm">
                                <span className="font-semibold text-white">{input.label}</span>
                                {(input.tooltipType || input.type) && (
                                    <span className="text-gray-400 text-[9px] font-mono border-l border-white/10 pl-1.5">
                                        {input.tooltipType || input.type}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {/* Output Handles */}
            {data.outputs?.map((output, i) => (
                <div
                    key={output.id}
                    className="absolute flex items-center justify-center cursor-pointer"
                    style={{
                        top: 60 + i * 40,
                        right: -7,
                        width: 14,
                        height: 14,
                        zIndex: 50
                    }}
                    onMouseEnter={() => setHoveredHandle(output.id)}
                    onMouseLeave={() => setHoveredHandle(null)}
                >
                    <Handle
                        type="source"
                        position={Position.Right}
                        id={output.id}
                        className="!w-3.5 !h-3.5 !bg-[#4a5568] !border-[2px] !border-[#1a1a1a] hover:!bg-accent-yellow transition-colors !relative !inset-0 !transform-none !top-auto !left-auto"
                    />

                    {/* Tooltip (Right side) */}
                    {hoveredHandle === output.id && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full pl-3 flex items-center pointer-events-none z-[100]">
                            <div className="bg-black/95 border border-white/20 text-white text-[10px] py-1.5 px-2.5 rounded shadow-xl whitespace-nowrap flex items-center gap-1.5 backdrop-blur-sm">
                                <span className="font-semibold text-white">{output.label}</span>
                                {(output.tooltipType || output.type) && (
                                    <span className="text-gray-400 text-[9px] font-mono border-l border-white/10 pl-1.5">
                                        {output.tooltipType || output.type}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
