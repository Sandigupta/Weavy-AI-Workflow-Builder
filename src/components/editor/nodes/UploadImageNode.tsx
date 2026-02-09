"use client";

import React, { useRef, useState } from "react";
import { BaseNode } from "./BaseNode";
import { Image as ImageIcon, Upload, X, Loader2 } from "lucide-react";

import { NODE_SCHEMAS } from "@/config/nodeSchemas";

import { useReactFlow } from "reactflow";

export function UploadImageNode({ id, data, selected }: any) {
    const { setNodes } = useReactFlow();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const schema = NODE_SCHEMAS.uploadImage;
    const effectiveData = {
        ...data,
        inputs: data.inputs || schema.inputs,
        outputs: data.outputs || schema.outputs,
    };

    const updateNodeUrl = (url: string) => {
        setNodes((nodes) =>
            nodes.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        data: { ...node.data, imageUrl: url, output: url },
                    };
                }
                return node;
            })
        );
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateNodeUrl(e.target.value);
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadError(null);

        try {
            // Get upload config from our API
            const configRes = await fetch("/api/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "image" }),
            });
            const config = await configRes.json();

            if (config.mock) {
                // Transloadit not configured - use local file URL for preview
                const localUrl = URL.createObjectURL(file);
                updateNodeUrl(localUrl);
                setUploadError("Using local preview (Transloadit not configured)");
            } else {
                // Upload to Transloadit
                const formData = new FormData();
                formData.append("params", config.params);
                formData.append("signature", config.signature);
                formData.append("file", file);

                const uploadRes = await fetch(config.endpoint, {
                    method: "POST",
                    body: formData,
                });
                const result = await uploadRes.json();

                console.log("Transloadit response:", result);

                // Check various possible response structures
                const uploadedFile =
                    result.results?.[":original"]?.[0] ||  // Our step name
                    result.results?.original?.[0] ||       // Alternative
                    result.uploads?.[0];                    // Direct uploads array

                if (result.ok === "ASSEMBLY_COMPLETED" && uploadedFile?.ssl_url) {
                    updateNodeUrl(uploadedFile.ssl_url);
                } else if (result.error) {
                    throw new Error(result.error);
                } else {
                    // Fallback: try to get any URL from the response
                    const anyUrl = uploadedFile?.url || uploadedFile?.ssl_url;
                    if (anyUrl) {
                        updateNodeUrl(anyUrl);
                    } else {
                        console.error("Full response:", JSON.stringify(result, null, 2));
                        throw new Error("Upload completed but no URL in response");
                    }
                }
            }
        } catch (err: any) {
            setUploadError(err.message || "Upload failed");
            console.error("Upload error:", err);
        } finally {
            setIsUploading(false);
        }
    };

    const handleClearImage = () => {
        updateNodeUrl("");
        setUploadError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <BaseNode
            selected={selected}
            icon={ImageIcon}
            data={{
                ...effectiveData,
                content: (
                    <div className="flex flex-col gap-2 p-2">
                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            className="hidden"
                            onChange={handleFileSelect}
                        />

                        {/* Preview / Upload Area */}
                        {effectiveData.imageUrl ? (
                            <div className="relative w-full h-32 bg-black/50 rounded-lg overflow-hidden border border-white/10 group">
                                <img src={effectiveData.imageUrl} alt="Preview" className="w-full h-full object-contain" />
                                <button
                                    className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleClearImage();
                                    }}
                                >
                                    <X className="w-3 h-3 text-white" />
                                </button>
                            </div>
                        ) : (
                            <div
                                className="w-full h-24 bg-[#1c1c1e] border border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-neon-main hover:text-neon-main transition-colors cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mb-1 animate-spin" />
                                        <span className="text-[10px]">Uploading...</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-5 h-5 mb-1" />
                                        <span className="text-[10px]">Click to upload</span>
                                        <span className="text-[8px] text-gray-600">JPG, PNG, WEBP, GIF</span>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Error message */}
                        {uploadError && (
                            <span className="text-[9px] text-yellow-500">{uploadError}</span>
                        )}

                        {/* URL Input (alternative) */}
                        <input
                            type="text"
                            className="w-full bg-[#1c1c1e] text-xs text-gray-300 px-2 py-1 rounded border border-white/10 focus:border-neon-main outline-none"
                            placeholder="Or paste URL..."
                            value={effectiveData.imageUrl || ""}
                            onChange={handleUrlChange}
                            onKeyDown={(e) => e.stopPropagation()}
                        />
                    </div>
                )
            }}
        />
    );
}

