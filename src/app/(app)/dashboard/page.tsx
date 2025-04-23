'use client'
import { useEffect } from "react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import { toast } from "sonner";

const page = () => {

    useEffect(() => {
        const getMessages = async () => {
            try {
                const response = await axios.get(`/api/get-messages`);
                console.log("Message:>>",response.data);
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                toast.error(axiosError.response?.data.message);
            }
        }
        getMessages();
    }, []);
    return (
        <div>DASHBOARD</div>
    )
}

export default page;