import create from 'zustand';

export const useExampleStore = create(set => ({
  name: '',
  setName: (newName) => set(state => ({name: newName})),
  resetName: () => set(state => ({name: ''})),
}));
