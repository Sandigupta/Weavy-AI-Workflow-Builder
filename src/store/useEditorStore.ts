import { create } from 'zustand';

export type EditorPanel = 'search' | 'history' | 'projects' | 'assets' | 'models' | 'generate' | 'gallery' | null;

interface EditorStore {
    activePanel: EditorPanel;
    setActivePanel: (panel: EditorPanel) => void;
    togglePanel: (panel: EditorPanel) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
    activePanel: null,
    setActivePanel: (panel) => set({ activePanel: panel }),
    togglePanel: (panel) => set((state) => ({
        activePanel: state.activePanel === panel ? null : panel
    })),
}));
