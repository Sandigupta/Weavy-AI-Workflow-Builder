// Sample workflow templates data
// These define the workflows shown in the dashboard workflow library

export interface WorkflowTemplate {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    workflowFile: string; // Path to JSON file in public/workflows/
    category: "starter" | "marketing" | "video" | "editing";
}

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
    {
        id: "image-describer",
        title: "Image Describer",
        description: "Upload an image and get an AI-generated description",
        thumbnail: "/images/custom/aa6lo32y9qozccggmvll.avif",
        workflowFile: "/workflows/image-describer.json",
        category: "starter",
    },
    {
        id: "product-marketing",
        title: "Product Marketing Kit",
        description: "Generate marketing copy for a product image",
        thumbnail: "/images/custom/aak3ssgcgmo9nw2obolo.avif",
        workflowFile: "/workflows/product-marketing.json",
        category: "marketing",
    },
    {
        id: "video-frame-analyzer",
        title: "Video Frame Analyzer",
        description: "Extract a frame from video and analyze it with AI",
        thumbnail: "/images/custom/nrmmib8busacc8wi3z61.avif",
        workflowFile: "/workflows/video-frame-analyzer.json",
        category: "video",
    },
    {
        id: "image-editor",
        title: "Image Editor Pipeline",
        description: "Crop an image and describe the result",
        thumbnail: "/images/custom/nyfxshgadqckp8y3xftr.avif",
        workflowFile: "/workflows/image-editor.json",
        category: "editing",
    },
    {
        id: "text-generator",
        title: "Simple Text Generator",
        description: "Enter a prompt and get AI-generated text",
        thumbnail: "/images/custom/oxppciaxqvkao84e7vbw.avif",
        workflowFile: "/workflows/text-generator.json",
        category: "starter",
    },
    {
        id: "video-thumbnail",
        title: "Video Thumbnail",
        description: "Extract a thumbnail frame from any video",
        thumbnail: "/images/custom/py5swzybl1rocaaodomm.avif",
        workflowFile: "/workflows/video-thumbnail.json",
        category: "video",
    },
    {
        id: "quick-crop",
        title: "Quick Crop",
        description: "Upload an image and crop it to square",
        thumbnail: "/images/custom/q346rdjtgnoljav8ofwi.avif",
        workflowFile: "/workflows/quick-crop.json",
        category: "editing",
    },
    {
        id: "brand-writer",
        title: "Brand Voice Writer",
        description: "Generate branded content with a system persona",
        thumbnail: "/images/custom/tycelzmnejahr8svztrb.avif",
        workflowFile: "/workflows/brand-writer.json",
        category: "marketing",
    },
    {
        id: "story-writer",
        title: "Story Writer",
        description: "Generate creative stories from a simple idea",
        thumbnail: "/images/custom/vlxuswgdgeqxuhgfurfs.avif",
        workflowFile: "/workflows/story-writer.json",
        category: "starter",
    },
    {
        id: "code-explainer",
        title: "Code Explainer",
        description: "Explain code snippets in simple terms",
        thumbnail: "/images/custom/zn018lkdivctb46hopaz.avif",
        workflowFile: "/workflows/code-explainer.json",
        category: "starter",
    },
];

// Helper to load a workflow template
export async function loadWorkflowTemplate(templateId: string): Promise<any | null> {
    const template = WORKFLOW_TEMPLATES.find(t => t.id === templateId);
    if (!template) return null;

    try {
        const response = await fetch(template.workflowFile);
        if (!response.ok) throw new Error("Failed to load workflow");
        return await response.json();
    } catch (error) {
        console.error("Error loading workflow template:", error);
        return null;
    }
}
