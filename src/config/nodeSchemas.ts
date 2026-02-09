import { LucideIcon, Type, Image as ImageIcon, Video, Sparkles, Crop, Film } from "lucide-react";

export interface PortSchema {
    id: string;
    label: string;
    type: 'text' | 'image' | 'video' | 'any';
    tooltipType?: string; // Overrides 'type' in UI tooltip for extra detail (e.g. "text, optional")
}

export interface NodeSchema {
    type: string;
    label: string;
    icon: LucideIcon;
    category: string;
    inputs: PortSchema[];
    outputs: PortSchema[];
    initialData?: Record<string, any>;
}

export const NODE_SCHEMAS: Record<string, NodeSchema> = {
    textNode: {
        type: "textNode",
        label: "Text Prompt",
        icon: Type,
        category: "generate",
        inputs: [],
        outputs: [{ id: "text", label: "Text", type: "text" }],
        initialData: { label: "Text Prompt" }
    },
    uploadImage: {
        type: "uploadImage",
        label: "Upload Image",
        icon: ImageIcon,
        category: "assets",
        inputs: [],
        outputs: [{ id: "image_url", label: "Image", type: "image" }],
        initialData: { label: "Upload Image" }
    },
    uploadVideo: {
        type: "uploadVideo",
        label: "Upload Video",
        icon: Video,
        category: "assets",
        inputs: [],
        outputs: [{ id: "video_url", label: "Video", type: "video" }],
        initialData: { label: "Upload Video" }
    },
    runAnyLLM: {
        type: "runAnyLLM",
        label: "Run LLM",
        icon: Sparkles,
        category: "models",
        inputs: [
            { id: "system_prompt", label: "System Prompt", type: "text", tooltipType: "text, optional" },
            { id: "user_message", label: "User Message", type: "text", tooltipType: "text, required" },
            { id: "images", label: "Images", type: "image", tooltipType: "image, optional, multiple" }
        ],
        outputs: [{ id: "output", label: "Response", type: "text" }],
        initialData: { label: "Run LLM", output: "", model: "gemini-2.0-flash" }
    },
    cropImage: {
        type: "cropImage",
        label: "Crop Image",
        icon: Crop,
        category: "processing",
        inputs: [{ id: "image_url", label: "Image", type: "image" }],
        outputs: [{ id: "output", label: "Cropped", type: "image" }],
        initialData: { label: "Crop Image" }
    },
    extractFrame: {
        type: "extractFrame",
        label: "Extract Frame",
        icon: Film,
        category: "processing",
        inputs: [{ id: "video_url", label: "Video", type: "video" }],
        outputs: [{ id: "output", label: "Image", type: "image" }],
        initialData: { label: "Extract Frame" }
    },
    outputNode: {
        type: "outputNode",
        label: "Output Display",
        icon: Sparkles, // Or MonitorPlay if imported
        category: "utility",
        inputs: [{ id: "input", label: "Any Output", type: "any", tooltipType: "any" }],
        outputs: [],
        initialData: { label: "Output Display" }
    }
};

export const NODE_TYPES_LIST = Object.values(NODE_SCHEMAS);
