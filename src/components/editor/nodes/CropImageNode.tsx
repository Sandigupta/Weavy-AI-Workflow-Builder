"use client";

import React from "react";
import { BaseNode } from "./BaseNode";
import { Crop } from "lucide-react";

import { NODE_SCHEMAS } from "@/config/nodeSchemas";

export function CropImageNode({ data, selected }: any) {
    const schema = NODE_SCHEMAS.cropImage;
    const effectiveData = {
        ...data,
        inputs: data.inputs || schema.inputs,
        outputs: data.outputs || schema.outputs,
    };
    return (
        <BaseNode
            selected={selected}
            icon={Crop}
            data={{
                ...effectiveData,
                content: (
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-gray-500">X Position %</label>
                            <input type="number" defaultValue={0} className="bg-[#1c1c1e] text-white text-xs p-1.5 rounded border border-white/10 outline-none focus:border-accent-yellow/50" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-gray-500">Y Position %</label>
                            <input type="number" defaultValue={0} className="bg-[#1c1c1e] text-white text-xs p-1.5 rounded border border-white/10 outline-none focus:border-accent-yellow/50" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-gray-500">Width %</label>
                            <input type="number" defaultValue={100} className="bg-[#1c1c1e] text-white text-xs p-1.5 rounded border border-white/10 outline-none focus:border-accent-yellow/50" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-gray-500">Height %</label>
                            <input type="number" defaultValue={100} className="bg-[#1c1c1e] text-white text-xs p-1.5 rounded border border-white/10 outline-none focus:border-accent-yellow/50" />
                        </div>
                    </div>
                )
            }}
        />
    );
}
