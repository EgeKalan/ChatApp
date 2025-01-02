import {create} from "zustand";
import toast from 'react-hot-toast';
import {axiosInstance} from "../lib/axios";
import { useAuthStore } from './userAuthstore'

export const userChatStore = create((set, get) =>({
    messages: [],
    users: [],
    selectedUser: null,
    isMessagesLoading: false,
    isUsersLoading: false,
    


  getUsers: async () => {
    set({ isUsersLoading: true }); 
    try {
        const res = await axiosInstance.get("/messages/users"); 
        set({ users: res.data }); 
    } catch (error) {
        toast.error(error.response.data.message || "HATA"); 
    } finally {
        set({ isUsersLoading: false }); 
    }
  },
  

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  
  sendImage: async (image) => {
    const socket = useAuthStore.getState().socket;
    const {selectedUser} = get();

    const formData = new FormData();
    formData.append("image", image);
    
    for (var key of formData.entries()) {
      console.log(key[0] + ', ' + key[1]);
    }
    try {
      console.log("FormData: ", formData);

      const response = await axiosInstance.post(`/messages/upload/${selectedUser._id}`, 
        formData, 
        {
        headers:  {
          "Content-Type": "multipart/form-data",
        }
      });

      const imageUrl = response.data.url;
      console.log("Image: ", imageUrl);
      
      const newMessage = {
        senderId: useAuthStore.getState().authUser?._id,
        receiverId: selectedUser._id,
        imageUrl,
        type: 'image',
      };

      socket.emit("sendMessage", newMessage);
      
      console.log("Resim Gönderildi");
    } catch (error) {
      console.error("Resim Gönderilmedi", error);
      console.error("hata", error.response);
      toast.error("Resim Gönderilmedi", error);
    }

  },
  

  sendMessage: async (messageData) => {
    console.log("messageData", messageData);
    const{selectedUser} = get();
    const socket = useAuthStore.getState().socket;
    console.log("sendMessage: " + JSON.stringify(messageData));


    const newMessage = {
      senderId: useAuthStore.getState().authUser?._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      timeStamp:Date.now(),
    };
    socket.emit("sendMessage", newMessage);
  },

  listenToMessages: () =>{
    const socket = useAuthStore.getState().socket;
    console.log("listenToMessages");

    socket.on("receiveMessage", (newMessage) => {
      const { selectedUser, messages } = get();
      if (newMessage.senderId == selectedUser?._id || newMessage.senderId == useAuthStore.getState().authUser._id){
          set({ messages: [...messages, newMessage] });

      }
    });
  },

  unListenFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("receiveMessage");
    socket.off("loadMessages");
    socket.off("usersList");
  },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
