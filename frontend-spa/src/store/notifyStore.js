import { create } from 'zustand'

const useNotifyStore = create((set) => ({
    message: '',
    type: '',
    actions: {
        setMessage: (message) => set(() => ({ message })),
        setType: (type) => set(() => ({ type }))
    }
}))

export const useMessage = () => useNotifyStore( state => state.message )
export const useType = () => useNotifyStore( state => state.type )
export const useActions = () => useNotifyStore( state => state.actions )