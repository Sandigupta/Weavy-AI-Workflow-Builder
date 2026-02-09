"use client";

import React from "react";
import { EditorSidebar } from "@/components/editor/EditorSidebar";
import { PanelArea } from "@/components/editor/panels/PanelArea";
import { ReactFlowProvider } from "reactflow";

export default function EditorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ReactFlowProvider>
            <div className="h-screen w-screen overflow-hidden bg-[#0a0a0a] text-white flex">
                <EditorSidebar />
                <PanelArea />
                <main className="flex-1 relative h-full w-full">
                    {children}
                </main>
            </div>
        </ReactFlowProvider>
    );
}
