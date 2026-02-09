"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play } from "lucide-react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Initial Fade In
            gsap.from(".hero-text", {
                y: 50,
                opacity: 0,
                duration: 1.2,
                stagger: 0.2,
                ease: "power3.out"
            });

            gsap.from(".hero-node", {
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                delay: 0.5,
                ease: "power2.out"
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <main ref={containerRef} className="relative w-full min-h-screen pt-12 md:pt-24 grid-bg selection:bg-[#F2FF9F] selection:text-black">
            <div className="max-w-[1600px] mx-auto px-6 md:px-10 mb-20">

                <div className="flex flex-row items-start relative z-20 pb-10">
                    {/* Left: Weavy */}
                    <h1 className="hero-text text-[6vw] md:text-[5.5vw] lg:text-[6vw] font-medium tracking-tighter text-black leading-none shrink-0 mr-[4vw]">
                        Weavy
                    </h1>

                    {/* Right: Artistic Intelligence + Description */}
                    <div className="flex flex-col">
                        <h1 className="hero-text text-[6vw] md:text-[5.5vw] lg:text-[6vw] font-medium tracking-tighter text-black leading-none whitespace-nowrap">
                            Artistic Intelligence
                        </h1>
                        <p className="hero-text text-lg md:text-xl text-gray-500 max-w-[500px] mt-6 leading-relaxed font-normal">
                            Turn your creative vision into scalable workflows. Access all AI models and professional editing tools in one node based platform.
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative w-full h-[800px] lg:h-[900px] overflow-hidden mt-10 border-t border-gray-200 bg-gradient-to-b from-gray-50 to-gray-100">
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                    <path d="M 280 250 C 350 250, 350 280, 420 300" stroke="#d1d5db" strokeWidth="2" fill="none" />
                    <path d="M 300 750 C 380 750, 380 600, 420 500" stroke="#d1d5db" strokeWidth="2" fill="none" />
                    <path d="M 720 300 C 750 300, 750 300, 780 300" stroke="#d1d5db" strokeWidth="2" fill="none" />
                    <path d="M 1000 300 C 1050 300, 1020 250, 1080 250" stroke="#d1d5db" strokeWidth="2" fill="none" />
                    <path d="M 1000 320 C 1030 320, 1030 400, 1080 500" stroke="#d1d5db" strokeWidth="2" fill="none" />
                </svg>

                <div className="relative w-full max-w-[1600px] mx-auto h-full px-10">

                    {/* Node 1: 3D */}
                    <div className="hero-node absolute top-16 left-10 w-48 z-20">
                        <div className="flex justify-between text-[10px] font-bold tracking-widest text-gray-500 mb-2 uppercase">
                            <span>3D</span><span>Rodin 2.0</span>
                        </div>
                        <div className="bg-gray-200 rounded-2xl p-0 overflow-hidden shadow-sm border border-gray-300/50 relative group">
                            <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-white border-2 border-gray-300 rounded-full z-30 translate-x-1/2"></div>
                            <img
                                src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop"
                                alt="3D Model"
                                className="w-full h-40 object-cover opacity-90 mix-blend-multiply filter contrast-125 grayscale hover:grayscale-0 transition-all duration-500"
                            />
                        </div>
                    </div>

                    {/* Node 2: Image (Center) */}
                    <div className="hero-node absolute top-48 left-[22%] w-80 z-20">
                        <div className="flex justify-between text-[10px] font-bold tracking-widest text-gray-500 mb-2 uppercase"><span>Image</span><span>Stable Diffusion</span></div>
                        <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-lg border border-gray-200 relative group">
                            <div className="absolute top-16 -left-1.5 w-3 h-3 bg-white border-2 border-gray-300 rounded-full z-30 -translate-x-1/2"></div>
                            <div className="absolute top-16 -right-1.5 w-3 h-3 bg-white border-2 border-gray-300 rounded-full z-30 translate-x-1/2"></div>
                            <img
                                src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop"
                                alt="Portrait"
                                className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </div>

                    {/* Node 3: Video (Right) */}
                    <div className="hero-node absolute top-36 right-4 lg:right-10 w-96 z-20">
                        <div className="flex justify-between items-center text-[10px] font-bold tracking-widest text-gray-500 mb-2 uppercase w-full"><span>Video</span><span>Minimax Video</span></div>
                        <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-xl border border-gray-200 relative group h-[600px]">
                            <div className="absolute top-24 -left-1.5 w-3 h-3 bg-white border-2 border-gray-300 rounded-full z-30 -translate-x-1/2"></div>
                            <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md font-mono z-30">1.00</div>
                            <img
                                src="https://images.unsplash.com/photo-1531123414780-f74242c2b052?q=80&w=800&auto=format&fit=crop"
                                alt="Video Output"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10">
                                <div className="bg-white/20 backdrop-blur-lg p-4 rounded-full border border-white/30">
                                    <Play className="w-8 h-8 text-white fill-current" />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent z-40"></div>
            </div>
        </main >
    );
}
