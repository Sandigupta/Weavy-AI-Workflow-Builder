import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { MonitorPlay } from "lucide-react";
import Image from "next/image";

interface OutputNodeData {
    label?: string;
    output?: any; // The content to display
    outputType?: "text" | "image" | "video"; // Optional explicit type
}

export const OutputNode = memo(({ data, selected }: NodeProps<OutputNodeData>) => {

    // Helper to detect content type if not explicitly provided
    const detectType = (content: any): "text" | "image" | "video" => {
        if (data.outputType) return data.outputType;

        if (typeof content === "string") {
            // Check for common image hosting services
            const imageHosts = [
                'placehold.co',
                'via.placeholder.com',
                'placeholder.com',
                'imagekit.io',
                'cloudinary.com',
                'imgix.net',
                'transloadit.com',
                'assembly.transloadit.com'
            ];

            if (imageHosts.some(host => content.includes(host))) return "image";

            // Check for image extensions
            if (content.match(/\.(jpeg|jpg|gif|png|webp|avif|svg)($|\?)/i)) return "image";
            // Check for video extensions
            if (content.match(/\.(mp4|webm|ogg|mov|avi|mkv)($|\?)/i)) return "video";
            // Check for data URLs
            if (content.startsWith("data:image/")) return "image";
            if (content.startsWith("data:video/")) return "video";
        }
        return "text";
    };

    const content = data.output;
    const type = detectType(content);

    return (
        <div
            className={`
                min-w-[300px] max-w-[500px] bg-[#1c1c1e] text-white rounded-xl border-2 shadow-xl transition-all
                ${selected ? "border-[#F2FF9F] shadow-[#F2FF9F]/20" : "border-white/10 hover:border-white/20"}
            `}
        >
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/5 rounded-t-lg">
                <div className="p-1.5 bg-blue-500/20 rounded-md">
                    <MonitorPlay className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-sm font-semibold text-gray-200">
                    {data.label || "Output Display"}
                </div>
            </div>

            {/* Content Area */}
            <div className="p-4 bg-[#0a0a0a]/50 min-h-[100px] flex items-center justify-center relative group">
                {!content ? (
                    <div className="text-gray-500 text-sm italic text-center animate-pulse">
                        Waiting for output...
                    </div>
                ) : (
                    <div className="w-full">
                        {type === "image" && typeof content === "string" && (
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/10">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={content}
                                    alt="Output"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        )}

                        {type === "video" && typeof content === "string" && (
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/10 bg-black">
                                <video
                                    src={content}
                                    controls
                                    className="w-full h-full"
                                />
                            </div>
                        )}

                        {type === "text" && (
                            <div className="bg-[#1c1c1e] rounded-lg p-3 border border-white/5 max-h-[300px] overflow-y-auto custom-scrollbar">
                                <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono break-all">
                                    {typeof content === 'object' ? JSON.stringify(content, null, 2) : String(content)}
                                </pre>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Input Handle */}
            <Handle
                type="target"
                position={Position.Left}
                id="input"
                className="!bg-[#F2FF9F] !w-3 !h-3 !border-2 !border-[#1c1c1e]"
            />
        </div>
    );
});

OutputNode.displayName = "OutputNode";
