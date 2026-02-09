"use client";

import React from "react";
import { BaseNode } from "./BaseNode";
import { Film } from "lucide-react";

import { NODE_SCHEMAS } from "@/config/nodeSchemas";

export function ExtractFrameNode({ data, selected }: any) {
    const schema = NODE_SCHEMAS.extractFrame;
    const effectiveData = {
        ...data,
        inputs: data.inputs || schema.inputs,
        outputs: data.outputs || schema.outputs,
    };
    return (
        <BaseNode
            selected={selected}
            icon={Film}
            data={{
                ...effectiveData,
                content: (
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-500">Timestamp or Percentage</label>
                        <input
                            type="text"
                            defaultValue="50%"
                            placeholder="e.g. 05:00 or 50%"
                            className="bg-[#1c1c1e] text-white text-xs p-2 rounded border border-white/10 outline-none focus:border-accent-yellow/50 placeholder:text-gray-700"
                        />
                    </div>
                )
            }}
        />
    );
}
