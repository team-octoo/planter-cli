import create from "zustand";
import {persist} from "zustand/middleware";

export const usePersistentExampleStore = create(
  persist(
    set => ({
      name: "",
      setName: newName => set(state => ({name: newName})),
      resetName: () => set({name: ""}),
    }),
    {
      name: "exampleStore", // unique name
      getStorage: () => window.localStorage, // (optional) by default, 'localStorage' is used
    }
  )
);
