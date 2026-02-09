"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const screenshots = [
    "/images/workflow-to-app/download.avif",
    "/images/workflow-to-app/download (1).avif",
    "/images/workflow-to-app/68262b7678811e48ff42f7db_Frame 427321160.avif",
    "/images/workflow-to-app/68262b76a834003529b7f5d7_Group 7798.avif",
];

export function WorkflowToApp() {
    return (
        <section className="py-32 bg-bg-dark overflow-hidden">
            <div className="container mx-auto px-4 text-center mb-16">
                <h2 className="text-4xl md:text-7xl font-display font-bold leading-tight">
                    <span className="block text-white">From Workflow</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent-green to-accent-yellow">
                        to App Mode
                    </span>
                </h2>
            </div>

            <div className="relative max-w-7xl mx-auto h-[600px] flex items-center justify-center">
                {screenshots.map((src, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-xl overflow-hidden shadow-2xl border border-white/10"
                        style={{
                            width: "300px",
                            height: "auto",
                            aspectRatio: "16/9",
                            top: `${20 + (i % 2) * 20}%`,
                            left: `${10 + i * 20}%`,
                            zIndex: i,
                        }}
                        animate={{
                            y: [0, -20, 0],
                        }}
                        transition={{
                            duration: 4 + i,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.5,
                        }}
                    >
                        <Image
                            src={src}
                            alt={`App Screenshot ${i + 1}`}
                            width={600}
                            height={400}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
