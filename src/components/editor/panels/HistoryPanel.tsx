"use client";

import React from "react";
import { ChevronDown, ChevronRight, Clock, AlertCircle } from "lucide-react";
import { useExecutionStore } from "@/store/useExecutionStore";
import { cn } from "@/lib/utils";

// Status indicator with glowing effect
function StatusDot({ status, size = "sm" }: { status: 'success' | 'running' | 'failed' | 'COMPLETED' | 'RUNNING' | 'FAILED' | 'PENDING', size?: "sm" | "md" }) {
    const normalizedStatus = status.toLowerCase();
    const isSuccess = normalizedStatus === 'success' || normalizedStatus === 'completed';
    const isRunning = normalizedStatus === 'running';
    const isFailed = normalizedStatus === 'failed';

    const sizeClasses = size === "md" ? "w-3 h-3" : "w-2.5 h-2.5";

    return (
        <div className={cn(
            "rounded-full",
            sizeClasses,
            isSuccess && "bg-green-500 shadow-[0_0_8px_2px_rgba(34,197,94,0.6)]",
            isRunning && "bg-yellow-400 shadow-[0_0_8px_2px_rgba(250,204,21,0.6)] animate-pulse",
            isFailed && "bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.6)]",
            !isSuccess && !isRunning && !isFailed && "bg-gray-500"
        )} />
    );
}

// Format duration nicely
function formatDuration(seconds?: number): string {
    if (!seconds) return "";
    if (seconds < 1) return `${(seconds * 1000).toFixed(0)}ms`;
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    return `${Math.floor(seconds / 60)}m ${(seconds % 60).toFixed(0)}s`;
}

// Truncate output for display
function truncateOutput(output: any): string {
    if (!output) return "";
    const str = typeof output === 'string' ? output : JSON.stringify(output);
    return str.length > 60 ? str.substring(0, 60) + "..." : str;
}

export function HistoryPanel() {
    const { history, expandedExecutionId, toggleExpanded } = useExecutionStore();

    return (
        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
            <div className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Execution History
                </h3>

                {history.length === 0 && (
                    <p className="text-xs text-gray-600 italic py-4 text-center">
                        No executions recorded yet. Run a workflow to see history.
                    </p>
                )}

                {history.map((item) => {
                    const isExpanded = expandedExecutionId === item.id;

                    return (
                        <div
                            key={item.id}
                            className="bg-[#1c1c1e] rounded-lg border border-white/5 overflow-hidden"
                        >
                            {/* Main Row - Clickable */}
                            <button
                                onClick={() => toggleExpanded(item.id)}
                                className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
                            >
                                {/* Expand Icon */}
                                <div className="text-gray-500">
                                    {isExpanded ? (
                                        <ChevronDown className="w-4 h-4" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4" />
                                    )}
                                </div>

                                {/* Status Dot */}
                                <StatusDot status={item.status} size="md" />

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-white truncate">
                                            {item.action}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {item.time}
                                        </span>
                                    </div>
                                    {item.duration && (
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <Clock className="w-3 h-3 text-gray-600" />
                                            <span className="text-xs text-gray-500">
                                                {formatDuration(item.duration)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </button>

                            {/* Expanded Content - Node Details */}
                            {isExpanded && item.steps.length > 0 && (
                                <div className="px-4 pb-3 border-t border-white/5">
                                    <div className="mt-2 space-y-1 ml-2 border-l border-white/10 pl-3">
                                        {item.steps.map((step, idx) => (
                                            <div key={`${step.nodeId}-${idx}`} className="relative py-1.5">
                                                {/* Tree connector */}
                                                <div className="absolute -left-[13px] top-3 w-2 h-px bg-white/10" />

                                                {/* Node Row */}
                                                <div className="flex items-start gap-2">
                                                    <StatusDot status={step.status} />

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-medium text-gray-300">
                                                                {step.nodeName}
                                                            </span>
                                                            <span className="text-[10px] text-gray-600 bg-white/5 px-1.5 py-0.5 rounded">
                                                                {step.nodeType}
                                                            </span>
                                                            {step.duration && (
                                                                <span className="text-[10px] text-gray-500">
                                                                    {formatDuration(step.duration)}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Output or Error */}
                                                        {step.error ? (
                                                            <div className="flex items-start gap-1 mt-1">
                                                                <AlertCircle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                                                                <span className="text-xs text-red-400">
                                                                    {step.error}
                                                                </span>
                                                            </div>
                                                        ) : step.output ? (
                                                            <div className="mt-1 text-xs text-gray-500 bg-black/20 px-2 py-1 rounded font-mono truncate">
                                                                → {truncateOutput(step.output)}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Expanded but no steps yet */}
                            {isExpanded && item.steps.length === 0 && item.status === 'running' && (
                                <div className="px-4 pb-3 border-t border-white/5">
                                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                        <div className="w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                                        Starting execution...
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

