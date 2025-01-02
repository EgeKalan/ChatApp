import React, { useRef, useState } from 'react';
import { BiPhotoAlbum, BiSend, BiCommentX  } from "react-icons/bi";
import { userChatStore } from '../../store/userChatStore';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../lib/axios';
import  socket  from 'socket.io-client';

const Messagelib = () => {

    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const {sendMessage, selectedUser} = userChatStore();
    const {sendImage} = userChatStore();

    

    const handleSendImage = async (e) => {
      const image = e.target.files[0];
      if (!image) {
        console.log("Resim seçilmedi");
        return;
      }

      console.log("seçilen dosya: ", image);
     
  
      sendImage(image); 
    };

      

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if(!text &&!imagePreview) return;
        try {
            const type= imagePreview ? "image" : "message";
            const payload = {
                type,
                text: type === "message" ? text.trim() : null,
                image: type ==="image" ? imagePreview : null,
            }

            await sendMessage(payload);

            setText("");
            if(fileInputRef.current) fileInputRef.current.value="";
        } catch (error) {
            console.error("Mesaj Gönderilemedi: ", error);
        }
    };


  return (
    <div className="p-4 w-full">
        {imagePreview && (
            <div className="mb-3 flex items-center gap-2">
                <div className='relative'>
                    <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                    />
                    <BiCommentX className="size-3"/>
                </div>
            </div>
        )}

    <div className="flex items-center gap-2"> 
      <div className="flex-1 flex gap-2">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleSendImage} 
        />

        <input
          type="text"
          placeholder="Mesaj"
          className="w-full input input-bordered rounded-lg input-sm sm:input-md"
          value={text}
          onChange={(e) => setText(e.target.value)} 
        />

        <button
          type="button"
          className={`hidden sm:flex btn ${imagePreview ? "text-green-400" : "text-red-400"}`}
          onClick={() => fileInputRef.current?.click()} 
        >
          <BiPhotoAlbum size={20} />
        </button>
      </div>

      <button
        type="button" 
        className={`btn btn-circle ${text.trim() || imagePreview ? "text-green-400" : ""}`}
        onClick={handleSendMessage} 
        disabled={!text.trim() && !imagePreview} 
      >
        <BiSend size={20} />
      </button>
    </div>


    </div>
  );
};

export default Messagelib;