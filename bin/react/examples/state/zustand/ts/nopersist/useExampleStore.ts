import {create} from "zustand";

interface UseExampleStoreInterface {
  name: string;
  setName: Function;
  resetName: Function;
}

export const useExampleStore = create<UseExampleStoreInterface>(set => ({
  name: "",
  setName: (newName: string) => set(state => ({name: newName})),
  resetName: () => set(state => ({name: ""})),
}));
