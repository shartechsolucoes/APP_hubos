import { create } from 'zustand';

type AccessLevel = {
	accessLevel: number;
	handleAccessLevel: (level: number) => void;
};

const useAccessLevelStore = create<AccessLevel>((set) => ({
	accessLevel: 0,
	handleAccessLevel: (level) => set({ accessLevel: level }),
}));

export default useAccessLevelStore;
