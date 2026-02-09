"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// Dummy data for "Workflow" nodes that will fade out
const workflowNodes = [
    { id: "compositor", label: "Compositor", x: 60, y: 60, color: "bg-gray-400", rotation: 8.8 },
    { id: "ref-1", label: "Image Reference", x: 20, y: 70, color: "bg-gray-600", rotation: 5.7 },
    { id: "ref-2", label: "Style", x: 70, y: 20, color: "bg-blue-300", rotation: 5.9 },
    { id: "mask", label: "Mask", x: 80, y: 80, color: "bg-red-300", rotation: -3.9 },
];

export function AppMode() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const toggleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=200%", // Pin duration
                    pin: true,
                    scrub: 1,
                    // markers: true, // internal debug
                }
            });

            // 1. Helpers fade out and move away
            tl.to(".workflow-node", {
                scale: 0.5,
                opacity: 0,
                x: (i) => i % 2 === 0 ? -100 : 100, // scatter further
                y: (i) => i < 2 ? -100 : 100,
                duration: 1,
                ease: "power1.in"
            }, 0);

            // 2. App components move to final positions
            // Prompt Card -> Left sidebar
            tl.to("#card-prompt", {
                top: "20%",
                left: "10%",
                x: 0,
                y: 0,
                rotation: 0,
                width: "20%",
                height: "auto",
                scale: 1,
                borderRadius: "12px",
                duration: 2,
                ease: "power2.inOut"
            }, 0);

            // Output Card -> Main center/right
            tl.to("#card-output", {
                top: "15%",
                left: "35%",
                x: 0,
                y: 0,
                rotation: 0,
                width: "40%",
                scale: 1,
                duration: 2,
                ease: "power2.inOut"
            }, 0);

            // Image Node -> Becomes a simplified preview or fades
            tl.to("#card-image", {
                top: "60%",
                left: "35%",
                x: 0,
                y: 0,
                rotation: 0,
                width: "15%",
                duration: 2,
                ease: "power2.inOut"
            }, 0);


            // 3. Toggle Switch Animation
            tl.to(toggleRef.current, {
                left: "auto",
                right: "4px",
                backgroundColor: "#000", // Keep it black or change color
                duration: 1.5,
                ease: "power2.inOut"
            }, 0);

            // 4. Text Opacity Crossfade
            tl.to(".text-workflow", { opacity: 0.3, duration: 1 }, 0);
            tl.to(".text-appmode", {
                opacity: 1,
                backgroundImage: "linear-gradient(to right, #000, #000)", // Solid black/dark
                duration: 1
            }, 0);

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full h-screen bg-[#FDFDFD] overflow-hidden flex flex-col pt-32">

            {/* Header / Toggle */}
            <div className="relative z-20 flex flex-col items-center justify-center mb-10">
                <div className="flex items-center gap-6 text-5xl md:text-7xl lg:text-8xl tracking-tighter font-medium">
                    <span className="text-workflow transition-colors text-black">From Workflow</span>

                    {/* Toggle */}
                    <div className="relative w-24 h-12 bg-[#F2FF9F] rounded-full mx-4">
                        <div
                            ref={toggleRef}
                            className="absolute top-1 left-1 w-10 h-10 bg-black rounded-full shadow-md"
                        ></div>
                    </div>

                    <span className="text-appmode text-gray-300 opacity-50 bg-clip-text">to App Mode</span>
                </div>
            </div>

            {/* Animation Container */}
            <div ref={containerRef} className="relative w-full flex-1 max-w-[1600px] mx-auto">

                {/* --- Workflow Only Nodes (Fade Out) --- */}
                {workflowNodes.map((node, i) => (
                    <div
                        key={node.id}
                        className={cn(
                            "workflow-node absolute p-4 rounded-lg shadow-sm border border-black/5 flex items-center justify-center font-mono text-xs font-bold text-white z-0",
                            node.color
                        )}
                        style={{
                            top: `${node.y}%`,
                            left: `${node.x}%`,
                            width: "140px",
                            height: "100px",
                            transform: `rotate(${node.rotation}deg)`
                        }}
                    >
                        {node.label}
                    </div>
                ))}


                {/* --- App Components (Transform) --- */}

                {/* 1. Prompt Card */}
                <div
                    id="card-prompt"
                    className="absolute bg-[#F0F0EE] p-6 rounded-2xl shadow-xl z-10 origin-center"
                    style={{
                        top: "40%",
                        left: "15%",
                        width: "300px",
                        transform: "rotate(-5deg)"
                    }}
                >
                    <div className="bg-[#F2FF9F] inline-block px-2 py-1 mb-4 text-[10px] font-bold tracking-widest uppercase">Prompt</div>
                    <p className="text-sm font-medium leading-relaxed text-gray-800">
                        A transparent, green-tinted mechanical weave machine. It has a cylindrical component on the left, producing thin paths...
                    </p>
                </div>

                {/* 2. Output Card */}
                <div
                    id="card-output"
                    className="absolute bg-white rounded-2xl shadow-2xl overflow-hidden z-20"
                    style={{
                        top: "20%",
                        left: "50%",
                        width: "400px",
                        aspectRatio: "1/1",
                        transform: "rotate(5deg)"
                    }}
                >
                    <div className="absolute top-4 left-4 bg-[#F2FF9F] z-10 px-2 py-1 text-[10px] font-bold tracking-widest uppercase">Output</div>
                    <img
                        src="https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=800&auto=format&fit=crop"
                        className="w-full h-full object-cover"
                        alt="Output"
                    />
                </div>

                {/* 3. Image Input Card */}
                <div
                    id="card-image"
                    className="absolute bg-gray-100 rounded-xl overflow-hidden shadow-lg border-2 border-white z-10"
                    style={{
                        top: "60%",
                        left: "70%",
                        width: "200px",
                        aspectRatio: "3/4",
                        transform: "rotate(-8deg)"
                    }}
                >
                    <div className="absolute bottom-2 left-2 text-[10px] font-bold bg-black/50 text-white px-2 py-1 backdrop-blur-sm rounded">Ref</div>
                    <img
                        src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop"
                        className="w-full h-full object-cover"
                        alt="Input"
                    />
                </div>

            </div>
        </section>
    );
}
