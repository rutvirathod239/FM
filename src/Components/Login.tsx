"use client"
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/Components/ui/input";
import { Button } from "@/components/ui/button";
import { loginApi } from "@/lib/apiFunctions";
import Link from "next/link";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
    email: z
      .string()
      .email("Invalid email address")
      .nonempty("Email is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
});
type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
    const router = useRouter();
    const [submitError, setSubmitError] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setSubmitError("");
        try {
            await loginApi(data, router, reset);
        } catch (error) {
            console.error(error);
            setSubmitError("Something went wrong. Please try again.");
        }
    };

    return (<>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md w-full">
                <h1 className="text-2xl font-bold mb-4">Login</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email Field */}
                    <div>
                        Email
                        <Input
                            id="email"
                            {...register("email")}
                            placeholder="Enter your email"
                            className="mt-1"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        Password
                        <Input
                            id="password"
                            type="password"
                            {...register("password")}
                            placeholder="Enter your password"
                            className="mt-1"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm">{errors.password.message}</p>
                        )}
                    </div>
                    <div className="mt-4 text-right">
                        <p className="text-sm">                            
                            <Link href="/" className="text-blue-500 hover:underline">
                                Sign Up!
                            </Link>
                        </p>
                    </div>
                    {/* Submit Button */}
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? "Submitting..." : "Login"}
                    </Button>
                    {submitError && (
                        <p className="text-red-500 text-sm mt-2">{submitError}</p>
                    )}
                </form>
            </div>
        </div>
    </>)
}
export default Login;