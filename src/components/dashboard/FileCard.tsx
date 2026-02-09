"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { WorkflowFile } from "@/store/useFileSystem";

export function FileCard(file: WorkflowFile) {
    return (
        <Link href={`/editor/${file.id}`}>
            <div className="group bg-[#121214] hover:bg-[#1c1c1e] rounded-xl overflow-hidden transition-colors border border-white/5 hover:border-white/10 cursor-pointer flex flex-col aspect-[3/4]">
                {/* Icon Placeholder Area - Always use symbol as requested */}
                <div className="flex-1 flex items-center justify-center relative">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                        {/* Top Box */}
                        <rect x="9" y="3" width="6" height="6" rx="1" />
                        {/* Bottom Boxes */}
                        <rect x="4" y="15" width="6" height="6" rx="1" />
                        <rect x="14" y="15" width="6" height="6" rx="1" />
                        {/* Connectivity Lines */}
                        <path d="M12 9v3" />
                        <path d="M7 15v-3h10v3" />
                    </svg>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/5 bg-[#121214]">
                    <h3 className="text-gray-200 text-sm font-medium truncate mb-1">{file.name}</h3>
                    <p className="text-[10px] text-gray-500">{file.lastEdited}</p>
                </div>
            </div>
        </Link>
    );
}
