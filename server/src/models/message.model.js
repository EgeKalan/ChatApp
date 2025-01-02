import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum : ['message','image'],
            default: 'message'
        },
        text: {
            type: String,
            required: function() {
                return this.type === "message";
            },
        },
        imageUrl: {
            type: String,
            required: function() {
                return this.type === "image";
            },
        },

    },
    { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema); 

export default Message;