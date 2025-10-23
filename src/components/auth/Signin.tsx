"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { loginUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";


// import your API function (you can create a similar one as newUser)


// ✅ Step 1: Define validation schema
const formSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

// ✅ Step 2: Component
const Login = () => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // ✅ Step 3: Handle form submit
    const router = useRouter();

    const loginMutation = useMutation({
        mutationFn: (data: {
            email: string;
            password: string;
        }
        ) => loginUser(data),
        onSuccess: (data) => {
            const token = data?.data?.access?.token;
            if (token) {
                localStorage.setItem("token", token);
                toast.success("Login successful!");
                console.log("✅ Login success:", token);
                router.push("/");
            } else {
                toast.error("No token received from server");
            }
        },
        onError: (error) => {
            console.error("❌ Login failed:", error);
            toast.error(error.message || "Invalid email or password!");
        },
    });
    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log("Login attempt:", values);
        loginMutation.mutate(values);
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-100">
                    Login
                </h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        {/* Email Field */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-200">
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your email"
                                            type="email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password Field */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-200">
                                        Password
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your password"
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">
                            {loginMutation.isPending ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                </Form>
            </div>
        </section>
    );
};

export default Login;
