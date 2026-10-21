import { create } from 'zustand'

export const useNotifyStore = create((set) => ({
  message: '',
  type: 'info',
  open: false,
  actions: {
    notify: (message, type = 'info') => set({ message, type, open: true }),
    clear: () => set((state) => ({ ...state, open: false })),
  },
}))

export const useMessage = () => useNotifyStore( state => state.message)
export const useType = () => useNotifyStore((state) => state.type)
export const useOpen = () => useNotifyStore((state) => state.open)
export const useActions = () => useNotifyStore((state) => state.actions)