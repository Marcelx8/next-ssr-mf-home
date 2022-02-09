import create, { UseBoundStore, StoreApi } from 'zustand';
export type InitialState = {
  count: number,
  increment: () => void,
  decrement: () => void
}
type store = UseBoundStore<InitialState, StoreApi<InitialState>>
const useStore: store;
export default useStore;