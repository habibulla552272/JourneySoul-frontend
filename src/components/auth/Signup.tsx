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
    FormDescription,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { newUser } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";


// ✅ Step 1: Define form schema with Zod validation
const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const Signup = () => {
    // ✅ Step 2: Initialize form
    const route = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    // ✅ Step 3: Handle form submission


    const registerMutation = useMutation({
        mutationFn: newUser,
        onSuccess: (data) => {
            console.log("✅ User registered:", data);
            route.push("/login");
            toast.success("User registered successfully!");
        },
        onError: (error) => {
            console.error("❌ Registration failed:", error);
            toast.error(error.message || "Error registering user");
        },
    });
    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log("Register attempt:", values);
        registerMutation.mutate(values);
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-100">
                    Sign Up
                </h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        {/* Name Field */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-200">Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your name" {...field} />
                                    </FormControl>
                                    <FormDescription>This will be your display name.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email Field */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-200">Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email" type="email" {...field} />
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
                                    <FormLabel className="text-gray-700 dark:text-gray-200">Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your password" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">
                            {registerMutation.isPending ? "Registering..." : "Sign Up"}
                        </Button>
                    </form>
                </Form>
            </div>
        </section>
    );
};

export default Signup;
