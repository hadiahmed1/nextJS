'use client'
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import { toast } from "sonner";
import { serialize } from "v8";
import MessageCard from "@/components/MessageCard";

const page = () => {
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        const getMessages = async () => {
            try {
                const response = await axios.get(`/api/get-messages`);
                console.log("Message:>>", response.data);
                setMessages(response.data.messages);
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                toast.error(axiosError.response?.data.message);
            }
        }
        getMessages();
    }, []);
    return (
        <div>DASHBOARD

        { messages.map(message => <MessageCard message={message} />) }
        </div>
    )
}

export default page;