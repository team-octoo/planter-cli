import {create} from "zustand";
import {persist} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UsePersistentExampleStoreInterface {
  name: string;
  setName: Function;
  resetName: Function;
}

export const usePersistentExampleStore = create(
  persist<UsePersistentExampleStoreInterface>(
    set => ({
      name: "",
      setName: newName => set(state => ({name: newName})),
      resetName: () => set({name: ""}),
    }),
    {
      name: "example-storage", // unique name
      getStorage: () => AsyncStorage, // (optional) by default, 'localStorage' is used
    }
  )
);
