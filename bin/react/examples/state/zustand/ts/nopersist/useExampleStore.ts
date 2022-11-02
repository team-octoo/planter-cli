import create from "zustand";

interface UsePersistentExampleStore {
  name: string;
}

export const useExampleStore = create<UsePersistentExampleStore>(set => ({
  name: "",
  setName: (newName: string) => set(state => ({name: newName})),
  resetName: () => set(state => ({name: ""})),
}));
