import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

export const usePersistentExampleStore = create(
  persist(
    set => ({
      name: "",
      setName: newName => set(state => ({name: newName})),
      resetName: () => set({name: ""}),
    }),
    {
      name: "exampleStore", // unique name
      storage: createJSONStorage(() => window.localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
