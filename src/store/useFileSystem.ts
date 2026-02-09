import { create } from 'zustand';

export interface WorkflowFile {
    id: string;
    name: string;
    lastEdited: string;
    createdAt?: string;
    thumbnail?: string;
    folder?: string;
}

export interface Folder {
    id: string;
    name: string;
    children: Folder[];
    files: WorkflowFile[];
}

interface FileSystemState {
    files: WorkflowFile[];
    folders: Folder[];
    searchQuery: string;
    viewMode: 'grid' | 'list';

    // Actions
    fetchFiles: () => Promise<void>;
    addFile: (file: WorkflowFile) => void;
    deleteFile: (id: string) => void;
    renameFile: (id: string, newName: string) => void;
    setSearchQuery: (query: string) => void;
    setViewMode: (mode: 'grid' | 'list') => void;
}

export const useFileSystem = create<FileSystemState>((set) => ({
    files: [],
    folders: [],
    searchQuery: '',
    viewMode: 'grid',


    fetchFiles: async () => {
        try {
            const res = await fetch("/api/workflows");
            if (!res.ok) throw new Error("Failed to fetch workflows");
            const data = await res.json();

            // Map API data to WorkflowFile interface
            const mappedFiles: WorkflowFile[] = data.map((wf: any) => ({
                id: wf.id,
                name: wf.name || "Untitled",
                lastEdited: new Date(wf.updatedAt).toLocaleDateString(),
                createdAt: new Date(wf.createdAt).toLocaleDateString(),
                thumbnail: undefined // Add logic if you have thumbnails
            }));

            set({ files: mappedFiles });
        } catch (error) {
            console.error("Failed to fetch files:", error);
        }
    },

    addFile: (file) => set((state) => ({ files: [file, ...state.files] })),
    deleteFile: (id) => set((state) => ({ files: state.files.filter((f) => f.id !== id) })),
    renameFile: (id, newName) => set((state) => ({
        files: state.files.map((f) => (f.id === id ? { ...f, name: newName } : f)),
    })),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setViewMode: (mode) => set({ viewMode: mode }),
}));
