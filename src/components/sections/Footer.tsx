"use client";

import React from "react";
import { Twitter, Instagram, Github, Linkedin, Youtube, Disc } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="relative bg-[#111] pt-10 px-4 md:px-6 pb-0 overflow-hidden font-sans">
            {/* Main Footer Card */}
            <div className="relative w-full max-w-[1600px] mx-auto bg-[#aab3a6] rounded-[48px] rounded-br-none p-10 md:p-14 lg:p-20 overflow-hidden min-h-[700px] flex flex-col justify-between">

                {/* Top Connector Line SVG */}
                <svg className="absolute bottom-[100px] right-0 w-[300px] h-[400px] pointer-events-none z-10" viewBox="0 0 300 400" fill="none">
                    {/* Curve connecting to the button */}
                    <path d="M 300 100 C 200 100, 100 250, 50 400" stroke="white" strokeWidth="1" fill="none" className="opacity-70" />
                    <circle cx="300" cy="100" r="3" fill="white" />
                </svg>

                {/* Header Section - Stacked Layout (Reverted) */}
                <div className="mb-24 flex flex-col md:flex-row items-start md:items-stretch gap-6 md:gap-16 pt-10">
                    <div className="flex flex-col">
                        <h2 className="text-[12vw] md:text-[8rem] lg:text-[9.5rem] font-normal tracking-[-0.035em] text-white leading-[0.82]">
                            Artificial
                        </h2>
                        <h2 className="text-[12vw] md:text-[8rem] lg:text-[9.5rem] font-normal tracking-[-0.035em] text-white leading-[0.82]">
                            Intelligence
                        </h2>
                    </div>

                    <div className="text-[8vw] md:text-[6rem] lg:text-[8rem] font-thin text-white/90 flex items-center justify-center pt-2 md:pt-10">
                        +
                    </div>

                    <div className="flex flex-col">
                        <h2 className="text-[12vw] md:text-[8rem] lg:text-[9.5rem] font-normal tracking-[-0.035em] text-white leading-[0.82]">
                            Human
                        </h2>
                        <h2 className="text-[12vw] md:text-[8rem] lg:text-[9.5rem] font-normal tracking-[-0.035em] text-white leading-[0.82]">
                            Creativity
                        </h2>
                    </div>
                </div>

                {/* Middle Section: Logo & Description */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-20 border-b border-white/20 pb-12">
                    {/* Logo */}
                    <div className="flex items-center gap-5">
                        <div className="flex gap-1.5 h-8 items-end">
                            <div className="w-2.5 h-full bg-white rounded-sm"></div>
                            <div className="w-2.5 h-full bg-white rounded-sm"></div>
                            <div className="w-2.5 h-2/3 bg-white rounded-sm"></div>
                        </div>
                        <div className="flex items-center h-full gap-5 text-white">
                            <span className="font-bold text-xl tracking-wider">WEAVY</span>
                            <div className="w-[1px] h-8 bg-white/40"></div>
                            <span className="text-[10px] font-medium tracking-[0.2em] leading-tight w-28 text-white/90">ARTISTIC INTELLIGENCE</span>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-white font-medium text-sm md:text-[15px] max-w-xl leading-relaxed opacity-90">
                        Weavy is a new way to create. We're bridging the gap between AI capabilities and human creativity, to continue the tradition of craft in artistic expression. We call it Artistic Intelligence.
                    </p>
                </div>

                {/* Bottom Links Section */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-y-10 gap-x-8 text-white w-full max-w-5xl">
                    {/* Col 1 */}
                    <div className="flex flex-col gap-3">
                        <h4 className="text-[11px] text-white/60 mb-2 font-medium tracking-wide">Get Started</h4>
                        <Link href="#" className="text-[11px] font-bold uppercase tracking-widest hover:text-white/80 transition-colors">REQUEST A DEMO</Link>
                        <Link href="#" className="text-[11px] font-bold uppercase tracking-widest hover:text-white/80 transition-colors">PRICING</Link>
                        <Link href="#" className="text-[11px] font-bold uppercase tracking-widest hover:text-white/80 transition-colors">ENTERPRISE</Link>
                    </div>

                    {/* Col 2 */}
                    <div className="flex flex-col gap-3">
                        <h4 className="text-[11px] text-white/60 mb-2 font-medium tracking-wide">Company</h4>
                        <Link href="#" className="text-[11px] font-bold uppercase tracking-widest hover:text-white/80 transition-colors">ABOUT</Link>
                        <Link href="#" className="text-[11px] font-bold uppercase tracking-widest hover:text-white/80 transition-colors">CAREERS</Link>
                        <Link href="#" className="text-[11px] font-bold uppercase tracking-widest hover:text-white/80 transition-colors">TRUST</Link>
                        <Link href="#" className="text-[11px] font-bold uppercase tracking-widest hover:text-white/80 transition-colors">TERMS</Link>
                        <Link href="#" className="text-[11px] font-bold uppercase tracking-widest hover:text-white/80 transition-colors">PRIVACY</Link>
                    </div>

                    {/* Col 3 */}
                    <div className="flex flex-col gap-3">
                        <h4 className="text-[11px] text-white/60 mb-2 font-medium tracking-wide">Connect</h4>
                        <Link href="#" className="text-[11px] font-bold uppercase tracking-widest hover:text-white/80 transition-colors">COLLECTIVE</Link>
                    </div>

                    {/* Col 4 */}
                    <div className="flex flex-col gap-3">
                        <h4 className="text-[11px] text-white/60 mb-2 font-medium tracking-wide">Resources</h4>
                        <Link href="#" className="text-[11px] font-bold uppercase tracking-widest hover:text-white/80 transition-colors">KNOWLEDGE CENTER</Link>
                    </div>

                    {/* Col 5: Socials */}
                    <div className="flex gap-5 items-start pt-1">
                        <Linkedin className="w-4 h-4 cursor-pointer hover:opacity-70 text-white" />
                        <Instagram className="w-4 h-4 cursor-pointer hover:opacity-70 text-white" />
                        <Twitter className="w-4 h-4 cursor-pointer hover:opacity-70 text-white" />
                        <Disc className="w-4 h-4 cursor-pointer hover:opacity-70 text-white" />
                        <Youtube className="w-4 h-4 cursor-pointer hover:opacity-70 text-white" />
                    </div>
                </div>

                {/* Footer Bottom Info */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-8 relative mt-20 md:mt-0">
                    <div className="flex items-center gap-5">
                        {/* SOC 2 Badge Mockup */}
                        <div className="w-12 h-12 rounded-full bg-[#2a2a2a] border border-white/10 flex items-center justify-center shrink-0">
                            <span className="text-[7px] text-white font-bold text-center leading-tight tracking-wider opacity-90">SOC 2<br />TYPE II</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[11px] font-bold text-white tracking-wide">SOC 2 Type II Certified</span>
                            <span className="text-[10px] text-white/60 font-medium">Your data is protected with industry-standard security controls.</span>
                        </div>
                    </div>

                    <div className="flex gap-6 pb-2 md:pb-0 md:mr-64">
                        <span className="text-[10px] font-bold text-white tracking-[0.15em] uppercase opacity-80">WEAVY © 2025.</span>
                        <span className="text-[10px] font-bold text-white tracking-[0.15em] uppercase opacity-80">ALL RIGHTS RESERVED.</span>
                    </div>
                </div>

                {/* Floating Start Now Button */}
                <div className="absolute bottom-0 right-0 bg-[#F2FF9F] px-14 py-8 rounded-tl-[40px] cursor-pointer hover:bg-[#e6f585] transition-colors z-20 group">
                    <span className="text-4xl md:text-[3.5rem] font-normal tracking-tight text-black group-hover:tracking-tighter transition-all duration-300">Start Now</span>
                </div>

            </div>
        </footer>
    );
}
