/** @format */

import { create } from "zustand";

export const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  tasks: [],
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  removeTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
  updateTask: (id, updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...updatedTask } : t
      ),
    })),
    posts: [],
    setPosts: (posts) => set({ posts }),
}));
