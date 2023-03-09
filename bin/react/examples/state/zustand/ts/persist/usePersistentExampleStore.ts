import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

interface UsePersistentExampleStoreInterface {
  name: string;
}

export const usePersistentExampleStore = create(
  persist<UsePersistentExampleStoreInterface>(
    set => ({
      name: "",
      setName: (newName: string) => set(state => ({name: newName})),
      resetName: () => set({name: ""}),
    }),
    {
      name: "exampleStore", // unique name
      storage: createJSONStorage(() => window.localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
