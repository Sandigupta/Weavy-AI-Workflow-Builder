"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Layers, Type, Image as ImageIcon, Box, Move3d } from "lucide-react";
import Image from "next/image";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function ControlOutcome() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Main Timeline
            tlRef.current = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 60%", // Starts when top of section hits 60% of viewport
                    end: "bottom top",
                    toggleActions: "play none none reverse",
                }
            })
                // 1. UI Mockup Slide Up
                .from(".ui-mockup", {
                    y: 100,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out"
                });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full bg-[#080808] py-32 overflow-hidden border-t border-white/5 control-section">
            {/* Background Glows */}
            <div className="absolute inset-0 z-0 opacity-40">
                <div className="absolute top-[-20%] left-[20%] w-[1000px] h-[1000px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[10%] w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none"></div>
            </div>

            <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
                {/* Heading */}
                <div className="text-center mb-24">
                    <h2 className="text-6xl md:text-8xl lg:text-9xl font-medium tracking-tighter text-white mb-8 leading-[0.9]">
                        Control the<br />
                        <span className="text-gray-500">Outcome</span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-400 font-normal max-w-2xl mx-auto leading-relaxed">
                        Layers, type, and blends—all the tools to bring your wildest ideas to life. Your creativity, our compositing power.
                    </p>
                </div>

                {/* UI Mockup Container */}
                <div className="relative w-full flex justify-center perspective-[2000px]">
                    <div className="ui-mockup relative w-full max-w-[1240px] aspect-[16/9] lg:aspect-[16/10] bg-[#111] rounded-xl border border-white/10 shadow-2xl overflow-hidden z-10 ring-1 ring-white/5 flex flex-col">

                        {/* 1. Header Bar */}
                        <div className="h-12 border-b border-white/10 bg-[#161616] flex items-center px-4 justify-between shrink-0">
                            <span className="text-xs font-semibold text-gray-300 ml-2">Title sequence</span>
                            <div className="flex gap-4">
                                <span className="text-[10px] text-gray-500 font-mono">1920x1080</span>
                                <span className="text-[10px] text-gray-500 font-mono">24fps</span>
                            </div>
                        </div>

                        {/* 2. Main Workspace */}
                        <div className="flex flex-1 overflow-hidden">
                            {/* Left Sidebar: Layers */}
                            <div className="w-64 border-r border-white/10 bg-[#0e0e0e] flex flex-col p-4 shrink-0 hidden md:flex">
                                <span className="text-[10px] uppercase tracking-widest text-[#666] font-semibold mb-4">Layers</span>
                                <div className="flex flex-col gap-1">
                                    <LayerItem icon={Box} label="Canvas" active={false} />
                                    <LayerItem icon={ImageIcon} label="Walkie Talkie" active={false} />
                                    <LayerItem icon={Type} label="Text Layer" active={true} />
                                    <LayerItem icon={Type} label="Text Layer" active={false} />
                                    <LayerItem icon={ImageIcon} label="Astronaut" active={false} />
                                    <LayerItem icon={ImageIcon} label="Spaceship" active={false} />
                                </div>
                            </div>

                            {/* Center Canvas */}
                            <div className="flex-1 bg-[#1a1a1a] relative overflow-hidden flex items-center justify-center">
                                {/* Grid Background */}
                                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>

                                {/* Main Composition Area */}
                                <div className="relative w-[80%] h-[80%] shadow-2xl overflow-hidden rounded-sm bg-black group">
                                    {/* Background Layer: Tunnel */}
                                    {/* Using a placeholder-like cinematic tunnel image from Unsplash */}
                                    <div className="absolute inset-0 w-full h-full">
                                        <Image
                                            src="/images/custom/aa6lo32y9qozccggmvll.avif"
                                            alt="Tunnel Background"
                                            fill
                                            unoptimized
                                            className="object-cover opacity-80"
                                        />
                                    </div>

                                </div>
                            </div>

                            {/* Right Sidebar: Properties */}
                            <div className="w-64 border-l border-white/10 bg-[#0e0e0e] flex flex-col p-4 shrink-0 hidden lg:flex">
                                <div className="mb-6">
                                    <span className="text-[10px] uppercase tracking-widest text-[#666] font-semibold flex items-center gap-2 mb-4">
                                        <Type className="w-3 h-3" /> Text Layer
                                    </span>
                                    <div className="space-y-4">
                                        <PropertyInput label="DIMENSIONS" value1="W 1024" value2="H 1240" />
                                        <PropertyInput label="POSITION" value1="X 240" value2="Y 724" />
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[9px] text-gray-500 font-bold tracking-wider">ROTATION</label>
                                            <div className="flex items-center bg-[#1a1a1a] rounded border border-white/10 px-2 py-1.5 text-xs text-gray-300 font-mono">
                                                <Move3d className="w-3 h-3 mr-2 text-gray-500" /> 90°
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-white/10 pt-4">
                                    <div className="flex gap-2 mb-4">
                                        <div className="bg-[#1a1a1a] border border-white/10 rounded p-2 flex-1">
                                            <span className="text-[9px] block text-gray-500 mb-1">OPACITY</span>
                                            <span className="text-xs font-mono">100%</span>
                                        </div>
                                        <div className="bg-[#1a1a1a] border border-white/10 rounded p-2 flex-1">
                                            <span className="text-[9px] block text-gray-500 mb-1">BLEND</span>
                                            <span className="text-xs font-mono">NORMAL</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[9px] text-gray-500 font-bold tracking-wider">FONT</label>
                                        <div className="bg-[#1a1a1a] rounded border border-white/10 px-2 py-1.5 text-xs text-gray-300 font-mono flex justify-between items-center">
                                            JETBRAINS MONO
                                            <span className="text-[10px] text-gray-600">▼</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function LayerItem({ icon: Icon, label, active }: { icon: any, label: string, active: boolean }) {
    return (
        <div className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${active ? "bg-[#222] text-white" : "text-gray-500 hover:bg-[#1a1a1a] hover:text-gray-300"}`}>
            <Icon className="w-3 h-3" />
            <span className="text-[11px] font-medium tracking-wide">{label}</span>
        </div>
    )
}

function PropertyInput({ label, value1, value2 }: { label: string, value1: string, value2: string }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[9px] text-gray-500 font-bold tracking-wider">{label}</label>
            <div className="flex gap-2">
                <div className="flex-1 bg-[#1a1a1a] rounded border border-white/10 px-2 py-1.5 text-xs text-gray-300 font-mono">
                    {value1}
                </div>
                <div className="flex-1 bg-[#1a1a1a] rounded border border-white/10 px-2 py-1.5 text-xs text-gray-300 font-mono">
                    {value2}
                </div>
            </div>
        </div>
    )
}
