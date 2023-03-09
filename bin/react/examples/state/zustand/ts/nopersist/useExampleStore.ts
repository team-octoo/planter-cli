import {create} from "zustand";

interface UseExampleStoreInterface {
  name: string;
}

export const useExampleStore = create<UseExampleStoreInterface>(set => ({
  name: "",
  setName: (newName: string) => set(state => ({name: newName})),
  resetName: () => set(state => ({name: ""})),
}));
