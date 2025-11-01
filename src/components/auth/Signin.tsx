// app/login/page.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
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
import Link from "next/link";

const formSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const router = useRouter();

    const loginMutation = useMutation({
        mutationFn: (data: { email: string; password: string }) =>
            loginUser(data),
        onSuccess: (data) => {
            const token = data?.data?.access?.token;
            const userId = data?.data?._id;
            const userRole = data?.data?.role; // Make sure your API returns role

            console.log('Login response:', data);

            if (token && userId) {
                // ✅ Store token in cookies (accessible by middleware)
                Cookies.set('token', token, {
                    expires: 10, // 1 day
                    path: '/',
                    sameSite: 'lax',
                    secure: process.env.NODE_ENV === 'production'
                });

                // ✅ Store user data in cookies for middleware
                Cookies.set('userId', userId, {
                    expires: 10,
                    path: '/',
                    sameSite: 'lax'
                });

                if (userRole) {
                    Cookies.set('userRole', userRole, {
                        expires: 10,
                        path: '/',
                        sameSite: 'lax'
                    });
                }

                // ✅ Optional: Also store in localStorage for client-side convenience
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId);
                if (userRole) {
                    localStorage.setItem('userRole', userRole);
                }

                toast.success("Login successful!");

                // ✅ Redirect logic
                const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
                localStorage.removeItem('redirectAfterLogin');
                console.log("✅ Login success, redirecting to:", redirectPath);
                router.push(redirectPath);
            } else {
                toast.error("No token received from server");
            }
        },
        onError: (error: Error) => {
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
                        <p className="text-xs md:sm">
                            If you don&apos;t have an account, please{" "}
                            <Link href="/signup" className="text-blue-600 hover:underline font-medium">
                                Sign up
                            </Link>
                            .
                        </p>
                        <Button
                            type="submit"
                            className="w-full cursor-pointer"
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                </Form>
            </div>
        </section>
    );
};

export default Login;