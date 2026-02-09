import { create } from 'zustand';
import { Node, Edge } from 'reactflow';

interface GraphState {
    nodes: Node[];
    edges: Edge[];
}

interface UndoState {
    past: GraphState[];
    future: GraphState[];
    takeSnapshot: (nodes: Node[], edges: Edge[]) => void;
    undo: (currentNodes: Node[], currentEdges: Edge[]) => GraphState | null;
    redo: (currentNodes: Node[], currentEdges: Edge[]) => GraphState | null;
    canUndo: boolean;
    canRedo: boolean;
}

const MAX_HISTORY = 20;

export const useUndoStore = create<UndoState>((set, get) => ({
    past: [],
    future: [],
    canUndo: false,
    canRedo: false,

    takeSnapshot: (nodes, edges) => {
        const { past } = get();
        // Don't save if same as last (simple check)
        // In real app, deep check or debounce is better.

        const newPast = [...past, { nodes, edges }];
        if (newPast.length > MAX_HISTORY) newPast.shift();

        set({
            past: newPast,
            future: [], // Clear future on new action
            canUndo: true,
            canRedo: false
        });
    },

    undo: (currentNodes, currentEdges) => {
        const { past, future } = get();
        if (past.length === 0) return null;

        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);

        set({
            past: newPast,
            future: [{ nodes: currentNodes, edges: currentEdges }, ...future],
            canUndo: newPast.length > 0,
            canRedo: true
        });

        return previous;
    },

    redo: (currentNodes, currentEdges) => {
        const { past, future } = get();
        if (future.length === 0) return null;

        const next = future[0];
        const newFuture = future.slice(1);

        set({
            past: [...past, { nodes: currentNodes, edges: currentEdges }],
            future: newFuture,
            canUndo: true,
            canRedo: newFuture.length > 0
        });

        return next;
    }
}));
