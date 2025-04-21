import mongoose, { Schema, Document } from "mongoose";
import { Message, messageSchema } from "./Message.model";

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    isVerified: boolean;
    verificationCode: string;
    verificationCodeExpiry: Date;
    isAcceptingMessage: boolean;
    messages: Message[];
    createdAt: Date;
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: [true, "username already in use"]
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: [true, "email already in use"],
        match: [/.+\@.+\..+/, "Email is required"]
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    verificationCode: {
        type: String,
        required: true
    },
    verificationCodeExpiry: {
        type: Date,
        required: true
    },
    isAcceptingMessage: {
        type: Boolean,
        required: true,
        default: true
    },
    messages: [messageSchema],
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema));
export default UserModel;