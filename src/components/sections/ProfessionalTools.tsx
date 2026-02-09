"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const tools = [
    { id: "default", name: "Default", image: "/images/tools/68223c9e9705b88c35e76dec_Default@2x.avif" },
    { id: "blur", name: "Blur", image: "/images/tools/68224564b78bd840120b7a38_Blur@2x.avif" },
    { id: "invert", name: "Invert", image: "/images/tools/68224563d93b3ce65b54f07b_Invert@2x-p-1600.avif" },
    { id: "crop", name: "Crop", image: "/images/tools/68224563af147b5d7c2496ff_Crop@2x.avif" },
    { id: "mask", name: "Mask", image: "/images/tools/68224563d5cb54c747f189ae_Mask@2x-p-1600.avif" },
    { id: "inpaint", name: "Inpaint", image: "/images/tools/682245639e16941f61edcc06_Inpaint@2x.avif" },
    { id: "upscale", name: "Upscale", image: "/images/tools/682245638e6550c59d0bce8f_Upscale@2x-p-1600.avif" },
    { id: "painter", name: "Painter", image: "/images/tools/682245634dee7dac1dc3ac42_Painter@2x-p-1600.avif" },
];

export function ProfessionalTools() {
    const [activeTool, setActiveTool] = useState(tools[0]);

    // Ref for the section to track scroll
    const sectionRef = useRef<HTMLDivElement>(null);

    // We'll use a simple approach: The list is long, the image is sticky.
    // We can use IntersectionObserver on the list items to trigger the image change.
    // Or just hover on desktop as per PRD "Hovering over tool name switches". 
    // PRD also says "Tool list stays fixed while user scrolls". Wait.
    // "Use list of tool names on right as vertical tabs... Tool list stays fixed while user scrolls through section"
    // Actually, usually the content (image) stays fixed and the list scrolls, OR the list stays fixed and the image scrolls?
    // "Large tool preview image on left... List of tool names on right... Tool list stays fixed"
    // This implies the image should probably change based on scroll or hover.
    // PRD: "Desktop Interaction: Hovering over tool name switches... Tool list stays fixed"
    // OK, if it switches on hover, then it's just a pinned section.

    return (
        <section ref={sectionRef} className="py-20 bg-bg-dark border-t border-white/5 relative min-h-screen">
            <div className="container mx-auto px-4 h-full">
                <div className="flex flex-col md:flex-row gap-12 items-start h-full">

                    {/* Sticky Image Preview */}
                    <div className="w-full md:w-3/5 sticky top-24 h-[70vh] rounded-3xl overflow-hidden glass-panel border border-white/10">
                        <div className="relative w-full h-full">
                            <Image
                                key={activeTool.id}
                                src={activeTool.image}
                                alt={activeTool.name}
                                fill
                                className="object-cover transition-opacity duration-300 animate-in fade-in"
                            />
                            <div className="absolute top-6 left-6 px-4 py-2 bg-black/60 backdrop-blur rounded-lg text-white font-mono text-sm border border-white/10">
                                Tool: {activeTool.name}
                            </div>
                        </div>
                    </div>

                    {/* Tool List (Vertical Tabs) */}
                    <div className="w-full md:w-2/5 flex flex-col gap-4 py-10">
                        <h2 className="text-4xl font-display font-bold text-white mb-8">Professional Tools</h2>

                        <div className="space-y-2">
                            {tools.map((tool) => (
                                <div
                                    key={tool.id}
                                    className={cn(
                                        "group cursor-pointer p-6 rounded-2xl transition-all duration-300 border",
                                        activeTool.id === tool.id
                                            ? "bg-white/10 border-white/20 translate-x-4"
                                            : "bg-transparent border-transparent hover:bg-white/5 hover:border-white/5"
                                    )}
                                    onMouseEnter={() => setActiveTool(tool)}
                                >
                                    <h3 className={cn(
                                        "text-xl font-medium transition-colors",
                                        activeTool.id === tool.id ? "text-accent-yellow" : "text-gray-400 group-hover:text-white"
                                    )}>
                                        {tool.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-2 opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto transition-all overflow-hidden duration-300">
                                        Advanced {tool.name.toLowerCase()} controls for precise editing.
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
