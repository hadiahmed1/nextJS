'use client'
import { useDebounceValue } from "usehooks-ts"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ApiResponse } from "@/types/apiResponse"
import signUpSchema from "@/schema/signUp.schema"
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

const page = () => {
    const [username, setUsername] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [isCheckingUsername, setisCheckingUsername] = useState(false);
    const [isSubmiting, setIsSubmiting] = useState(false);
    const debouncedUsername = useDebounceValue(username, 1000);
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: '',
            username:'',
            password: ''
        }
    });
    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (debouncedUsername[0].length > 0) {
                setisCheckingUsername(true);
                try {
                    const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername[0]}`);
                    console.log(response.data)
                    setUsernameMessage(response.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    toast.error(axiosError.response?.data.message);
                    setUsernameMessage(axiosError.response?.data.message ?? "Error while checking username");
                } finally {
                    setisCheckingUsername(false);
                }
            }
        }
        checkUsernameUnique();
    }, [debouncedUsername[0]]);
    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmiting(true);
        try {
            const response = await axios.post('/api/sign-up', data);
            toast(response.data.message);
            router.replace(`/verify/${username}`)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast(axiosError.response?.data.message ?? "Error while checking username");
        }
        setIsSubmiting(false);
    }
    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="username" {...field} onChange={(e)=>{
                                        field.onChange(e);
                                        setUsername(e.target.value);
                                    }} type="text"  />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                            isSubmiting?(<>Loading...</>):("Submit")
                        }
                    </Button>
                </form>
            </Form>
        </div>
    )
};

export default page;

// export default function Component() {
//     const { data: session } = useSession()
//     if (session) {
//         return (
//             <>
//                 Signed in as {session.user.email} <br />
//                 <button onClick={() => signOut()}>Sign out</button>
//             </>
//         )
//     }
//     return (
//         <>
//             Not signed in <br />
//             <button className="bg-green-700 border-2 border-white p-1" onClick={() => signIn()}>Sign in</button>
//         </>
//     )
// }