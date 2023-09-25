import create from 'zustand';

interface User {
  name: string;
  profileImage: string;
}

interface AppState {
  title: string;
  user: User;
  setTitle: (title: string) => void;
}

const useStore = create<AppState>((set) => ({
  title: 'Panel',
  user: {
    name: 'Nombre de Usuario',
    profileImage: 'url_de_la_imagen_del_perfil.jpg',
  },
  setTitle: (title) => set({ title }),
}));

export default useStore;