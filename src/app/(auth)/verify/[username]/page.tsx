'use client'

import { useParams, useRouter } from "next/navigation";
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { ApiResponse } from "@/types/apiResponse";


const page = () => {
    const [isSubmiting, setIsSubmiting] = useState(false);
    const router = useRouter();
    const param = useParams();
    const { username } = param;
    const form = useForm({
        defaultValues: {
            code: ''
        }
    });

    const onSubmit = async (data: any) => {
        setIsSubmiting(true);
        try {
            const response = await axios.post('/api/verify-code', {
                username, code: data.code
            });
            toast.success(response.data.message);
            router.replace('/sign-in')
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message ?? "Error while Verifying user");
        }
        setIsSubmiting(false);
    }
    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Verificaton Code" {...field} type="text" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isSubmiting}>
                        {isSubmiting ? (<>Loading...</>) : ("Submit")}
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default page;