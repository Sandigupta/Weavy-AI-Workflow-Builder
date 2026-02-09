"use client";

import React from "react";
import { Image as ImageIcon, Upload } from "lucide-react";
import { BaseNode } from "./BaseNode";

export function ImageInputNode({ data, selected }: any) {
    return (
        <BaseNode
            selected={selected}
            icon={ImageIcon}
            data={{
                label: "Image Input",
                outputs: [{ id: "image", label: "Image" }],
                content: (
                    <div className="w-full h-32 bg-gray-900 rounded-lg border border-dashed border-gray-700 flex flex-col items-center justify-center text-gray-500 hover:border-gray-500 hover:text-gray-300 transition cursor-pointer">
                        <Upload className="w-6 h-6 mb-2" />
                        <span className="text-xs">Upload Image</span>
                    </div>
                )
            }}
        />
    );
}
