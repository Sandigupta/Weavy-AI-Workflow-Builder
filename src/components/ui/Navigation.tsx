"use client";

import React, { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { Menu } from "lucide-react";

export function Navigation() {
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 20);
    });

    return (
        <>
            {/* Top Banner */}
            <div className="bg-black text-white text-xs py-2.5 flex justify-center items-center gap-2 tracking-wide w-full relative z-50">
                <div className="flex items-center gap-1.5 opacity-90">
                    <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 text-green-400 fill-current">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    <span className="text-gray-400 mx-1">×</span>
                    <span className="font-semibold tracking-wider">W</span>
                    <span className="font-normal text-gray-300 ml-1">Weavy is now a part of Figma</span>
                </div>
            </div>

            {/* Navbar */}
            <motion.nav
                className={`w-full flex justify-between items-center px-6 md:px-10 border-b border-gray-200 sticky top-0 z-40 transition-all duration-500 ${scrolled ? "py-3 bg-white/60 backdrop-blur-md" : "py-5 bg-gray-50/80 backdrop-blur-sm"
                    }`}
            >
                <div className="flex items-center h-10">
                    <div className="flex flex-col gap-0.5 mr-4">
                        <div className="flex gap-0.5">
                            <div className="w-1.5 h-4 bg-black"></div>
                            <div className="w-1.5 h-4 bg-black"></div>
                            <div className="w-1.5 h-3 bg-black mt-1"></div>
                        </div>
                    </div>

                    <div className="flex items-center h-full gap-4">
                        <span className="font-medium text-sm tracking-tight text-gray-800">WEAVY</span>
                        <div className="w-[1px] h-full bg-gray-300"></div>
                        <span className="text-xs text-gray-500 leading-tight w-20">ARTISTIC INTELLIGENCE</span>
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-8 text-xs font-medium tracking-wide text-gray-600">
                    <a href="#" className="hover:text-black transition-colors">COLLECTIVE</a>
                    <a href="#" className="hover:text-black transition-colors">ENTERPRISE</a>
                    <a href="#" className="hover:text-black transition-colors">PRICING</a>
                    <a href="#" className="hover:text-black transition-colors">REQUEST A DEMO</a>
                    <Link href="/dashboard" className="hover:text-black transition-colors">SIGN IN</Link>
                    <Link
                        href="/dashboard"
                        className={`bg-[#F2FF9F] text-black transition-all duration-500 flex items-center justify-center hover:bg-[#e6f585] ${scrolled
                                ? "px-5 py-2 rounded-sm text-xs font-bold uppercase tracking-wide"
                                : "text-4xl px-10 py-6 rounded-bl-[50px] tracking-tight leading-none -mr-10 -my-6 h-[88px]"
                            }`}
                    >
                        {scrolled ? "START NOW" : "Start Now"}
                    </Link>
                </div>

                <button className="lg:hidden text-gray-800">
                    <Menu className="w-6 h-6" />
                </button>
            </motion.nav>
        </>
    );
}
