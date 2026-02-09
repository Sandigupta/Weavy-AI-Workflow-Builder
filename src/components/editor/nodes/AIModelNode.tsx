"use client";

import React, { useState } from "react";
import { Sparkles, Loader } from "lucide-react";
import { BaseNode } from "./BaseNode";

export function AIModelNode({ data, selected }: any) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleRun = () => {
        setIsGenerating(true);
        setTimeout(() => setIsGenerating(false), 2000);
    };

    return (
        <BaseNode
            selected={selected}
            icon={Sparkles}
            data={{
                label: "Flux Pro 1.1",
                inputs: [{ id: "prompt", label: "Prompt" }, { id: "image", label: "Image" }],
                outputs: [{ id: "result", label: "Result" }],
                content: (
                    <div className="space-y-3">
                        <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs focus:border-accent-yellow outline-none">
                            <option>Flux Pro 1.1 Ultra</option>
                            <option>Stable Diffusion 3.5</option>
                            <option>DALL-E 3</option>
                        </select>

                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>Steps</span>
                                <span>25</span>
                            </div>
                            <input type="range" className="w-full accent-accent-yellow h-1 bg-gray-700 rounded-lg appearance-none" />
                        </div>

                        <button
                            onClick={handleRun}
                            disabled={isGenerating}
                            className="w-full bg-white/5 hover:bg-white/10 text-accent-yellow border border-accent-yellow/20 rounded-lg py-2 text-xs font-medium transition flex items-center justify-center gap-2"
                        >
                            {isGenerating ? <Loader className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                            {isGenerating ? "Generating..." : "Generate"}
                        </button>
                    </div>
                )
            }}
        />
    );
}
