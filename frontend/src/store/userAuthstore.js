import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if(token){
      axiosInstance.defaults.headers["Authorization"] = token;
    }
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Auth check error: ", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      toast.success("Hesap başarılıyla oluşturuldu");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/auth/login", data);
      const token = res.data.token;
      localStorage.setItem("token", token);

      set({authUser: res.data.user});

      toast.success("Giriş Başarılı");

      get().connectSocket()
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      localStorage.removeItem("token");
      set({ authUser: null });
      toast.success("Çıkış Başarılı");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/updateProfile", data);
      set({ authUser: res.data });
      toast.success("Profil başarıyla güncellendi");
    } catch (error) {
      console.log("Profil güncellenirken hata:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const {authUser} = get();
    if(!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query:{
        userId: authUser._id,
      },
    });
    socket.connect();

    set({socket:socket});

    socket.on("connect", () =>{
      console.log("Socket connected", socket.id);
    });

    socket.on("getOnlineUser", (userIds) => {
      console.log("Online users: ", userIds);
      set({onlineUsers: userIds});
    });

    socket.on("disconnect", () =>{
      console.log("Socket disconnected", socket.id);
    });
  },

  disconnectSocket: () => {
    if(get().socket?.connected) get().socket.disconnect();
  },
  

}));
