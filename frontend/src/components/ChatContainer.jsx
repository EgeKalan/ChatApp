import React, { useEffect, useRef } from "react";
import { userChatStore } from "../store/userChatStore";
import Chatlib from "./lib/Chatlib";
import Messagelib from "./lib/Messagelib";
import Messagelibrar from "./lib/Messagelibrar";
import { useAuthStore } from "../store/userAuthstore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, listenToMessages, unListenFromMessages } = userChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => { 
      getMessages(selectedUser._id);

      listenToMessages();

      return() =>unListenFromMessages();
  }, [selectedUser?._id, getMessages, listenToMessages, unListenFromMessages]); 

  useEffect(()=>{
    if(messageEndRef.current && messages){
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  },[messages])

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <Chatlib />
        <Messagelibrar />
        <Messagelib />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <Chatlib />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id} 
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">{formatMessageTime(message.createdAt)}</time>
            </div>
            <div className="chat-bubble flex flex-col">
                  { message.type === "image" && (
                    <img
                      src={message.imageUrl}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2"
                    />
                  )}
                  {message.type === "message" && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <Messagelib />
    </div>
  );
};

export default ChatContainer;
