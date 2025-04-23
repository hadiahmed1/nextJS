'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios, { AxiosError } from "axios";
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ApiResponse } from "@/types/apiResponse"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import signInSchema from "@/schema/signIn.schema"
import { signIn } from "next-auth/react";
import { error } from "console";

const page = () => {
    const [isSubmiting, setIsSubmiting] = useState(false);
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });


    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmiting(true);
        const result = await signIn('credentials', {
            redirect: false,
            email: data.email,
            password: data.password
        });

        console.log("signIn :>>", result);

        if (result?.error) {
            toast.error("Unable to login");
        }
        if (result?.url) router.replace('/dashboard');
        setIsSubmiting(false);
    }
    
    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isSubmiting}>
                        {
                            isSubmiting ? (<>Loading...</>) : ("Submit")
                        }
                    </Button>
                </form>
            </Form>
        </div>
    )
};

export default page;