"use client";

import React, { useRef, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const workflows = [
    {
        title: "Wan LoRa – Rotate",
        image: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg",
        nodes: [
            { x: 50, y: 76, label: "PROMPT", box: true },
            { x: 250, y: 76, label: "WAN 2.1", box: true }
        ]
    },
    {
        title: "Multiple Models",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
        nodes: [] // simplified for brevity
    },
    {
        title: "Wan LoRa Inflate",
        image: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg",
        nodes: []
    },
    {
        title: "Contrast Control",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
        nodes: []
    },
    {
        title: "Film Grain FX",
        image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop",
        nodes: []
    }
];

export function Workflows() {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!sliderRef.current) return;
        setIsDown(true);
        setStartX(e.pageX - sliderRef.current.offsetLeft);
        setScrollLeft(sliderRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDown(false);
    };

    const handleMouseUp = () => {
        setIsDown(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDown || !sliderRef.current) return;
        e.preventDefault();
        const x = e.pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed
        sliderRef.current.scrollLeft = scrollLeft - walk;
    };

    const scroll = (offset: number) => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };

    return (
        <section className="relative w-full bg-[#0a0a0a] py-32 overflow-hidden border-t border-white/5 select-none">
            <div className="max-w-[1600px] mx-auto px-6 md:px-10">
                {/* Header */}
                <div className="mb-16 relative z-10">
                    <h2 className="text-6xl md:text-7xl lg:text-8xl font-medium tracking-tighter text-white mb-8 leading-[0.9]">
                        Explore Our<br />Workflows
                    </h2>
                    <p className="text-gray-400 font-medium text-sm md:text-base max-w-xl leading-relaxed">
                        From multi-layer compositing to matte manipulation, Weavy keeps up with your creativity
                        with all the editing tools you recognize and rely on.
                    </p>
                </div>

                {/* Carousel */}
                <div
                    ref={sliderRef}
                    className={cn(
                        "relative w-full overflow-x-auto no-scrollbar pb-10",
                        isDown ? "cursor-grabbing" : "cursor-grab"
                    )}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                >
                    <div className="flex gap-6 w-max px-1">
                        {workflows.map((wf, i) => (
                            <div key={i} className="group relative w-[320px] md:w-[480px] flex-shrink-0 transition-transform duration-300">
                                <div className="flex justify-between items-end mb-4 px-1">
                                    <h3 className="text-white text-base font-medium tracking-wide">{wf.title}</h3>
                                </div>
                                <div className="relative aspect-[16/9] bg-[#111] rounded-lg overflow-hidden border border-white/10 shadow-lg select-none pointer-events-none group-hover:pointer-events-auto">
                                    <img src={wf.image} alt={wf.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 ease-out" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>

                                    {/* Overlay SVG - Mock */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-80 pointer-events-none">
                                        <svg width="300" height="150" viewBox="0 0 300 150" fill="none" className="w-3/4 h-3/4 drop-shadow-lg">
                                            <rect x="20" y="60" width="60" height="24" rx="12" stroke="white" strokeWidth="1" fill="rgba(0,0,0,0.5)" />
                                            <text x="50" y="76" textAnchor="middle" fill="white" fontSize="8" fontFamily="sans-serif">PROMPT</text>
                                        </svg>
                                    </div>

                                    <div className="absolute bottom-4 left-4 bg-[#F2FF9F] text-black text-[10px] font-bold px-3 py-1.5 rounded-[2px] hover:bg-[#e6f585] cursor-pointer transition-colors z-20 pointer-events-auto">
                                        Try
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Nav Buttons */}
                <div className="flex gap-3 mt-8">
                    <button onClick={() => scroll(-500)} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300 group">
                        <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-black" />
                    </button>
                    <button onClick={() => scroll(500)} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300 group">
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-black" />
                    </button>
                </div>

            </div>
        </section>
    );
}
