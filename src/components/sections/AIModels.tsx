"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const backgroundImages = [
    "https://images.unsplash.com/photo-1444464666168-49d633b86797?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop"
];

export function AIModels() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const items = gsap.utils.toArray<HTMLElement>(".model-item");

            items.forEach((item, i) => {
                ScrollTrigger.create({
                    trigger: item,
                    start: "top center",
                    end: "bottom center",
                    onEnter: () => setActiveIndex(i),
                    onEnterBack: () => setActiveIndex(i),
                });
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="models-section" className="relative w-full h-[300vh] bg-[#050505]">
            <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center">

                {/* Background Carousel */}
                <div id="bg-container" className="absolute inset-0 z-0 w-full h-full">
                    {backgroundImages.map((src, i) => (
                        <div
                            key={i}
                            className={cn(
                                "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                                activeIndex === i ? "opacity-100" : "opacity-0"
                            )}
                        >
                            <img src={src} className="w-full h-full object-cover opacity-40" alt={`Background ${i}`} />
                        </div>
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/20"></div>
                </div>

                <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center h-full">

                    {/* Left Text */}
                    <div className="lg:col-span-5 flex flex-col justify-center">
                        <h2 className="text-6xl md:text-7xl lg:text-8xl text-white tracking-tighter leading-[0.95] mb-8 font-medium">
                            Use all AI<br />
                            models,<br />
                            together at<br />
                            last
                        </h2>
                        <p className="text-sm md:text-base text-gray-300 max-w-md leading-relaxed opacity-90 font-medium">
                            AI models and professional editing tools in one node-based platform. Turn creative vision into scalable workflows without compromising quality.
                        </p>
                    </div>

                    {/* Right Scroll List */}
                    <div className="lg:col-span-7 flex flex-col items-start lg:pl-10 h-[70vh] justify-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none"></div>

                        <div ref={listRef} className="flex flex-col gap-4 w-full">
                            {["GPT img 1", "Wan", "SD 3.5", "Runway Gen-4", "Flux Pro 1.1 Ultra"].map((model, i) => (
                                <div
                                    key={model}
                                    className={cn(
                                        "model-item text-6xl md:text-7xl lg:text-[6rem] leading-tight tracking-tight font-normal select-none transition-all duration-500",
                                        activeIndex === i ? "text-white scale-100" : "text-white/20 scale-95 blur-[2px]"
                                    )}
                                >
                                    <h3 className="pointer-events-none py-10">{model}</h3>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
