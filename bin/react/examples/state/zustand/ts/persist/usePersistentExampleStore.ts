import create from 'zustand';
import {persist} from 'zustand/middleware';

interface UsePersistentExampleStore {
  name: string;
}

export const usePersistentExampleStore = create(
  persist<UsePersistentExampleStore>(
    set => ({
      name: '',
      setName: newName => set(state => ({name: newName})),
      resetName: () => set({name: ''}),
    }),
    {
      name: 'exampleStore', // unique name
      getStorage: () => window.localStorage, // (optional) by default, 'localStorage' is used
    },
  ),
);
