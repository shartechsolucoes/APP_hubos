import { create } from 'zustand';

type AccessLevel = {
	accessLevel: number;
	userName: string;
	userId: string;
	handleAccessLevel: (level: number) => void;
	handleUserName: (name: string) => void;
	handleUserId: (id: string) => void;
};

const useAccessLevelStore = create<AccessLevel>((set) => ({
	accessLevel: 0,
	userName: '',
	userId: '',
	handleAccessLevel: (level) => set({ accessLevel: level }),
	handleUserName: (name) => set({ userName: name }),
	handleUserId: (id) => set({ userId: id }),
}));

export default useAccessLevelStore;
