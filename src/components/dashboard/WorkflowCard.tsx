"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface WorkflowCardProps {
    id: string;
    title: string;
    thumbnail: string;
    description?: string;
    workflowFile?: string;
    category?: string;
}

export function WorkflowCard({ id, title, thumbnail, description, workflowFile }: WorkflowCardProps) {
    // Link to editor with template query param if workflowFile is provided
    const href = workflowFile
        ? `/editor/new-file?template=${encodeURIComponent(workflowFile)}`
        : `/editor/${id}`;

    return (
        <Link href={href} title={description}>
            <div className="group relative bg-[#1c1c1e] rounded-xl overflow-hidden cursor-pointer w-full aspect-[4/2.5]">
                {/* Image */}
                <Image
                    src={thumbnail}
                    alt={title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                {/* Content (Inside, Bottom) */}
                <div className="absolute bottom-0 left-0 w-full p-4">
                    <h3 className="text-white font-semibold text-sm drop-shadow-md">{title}</h3>
                    {description && (
                        <p className="text-gray-400 text-[10px] mt-0.5 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}

