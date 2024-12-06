"use client"
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerApi } from "@/lib/apiFunctions";
import Link from "next/link";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z
      .string()
      .email("Invalid email address")
      .nonempty("Email is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .refine((data: any) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords does not match'
      }),
});
type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
    const router = useRouter();
    const [submitError, setSubmitError] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setSubmitError("");
        try {
            await registerApi(data, router, reset);
        } catch (error) {
            console.error(error);
            setSubmitError("Something went wrong. Please try again.");
        }
    };

    return (<>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md w-full">
                <h1 className="text-2xl font-bold mb-4">Register</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name Field */}
                    <div className="relative">
                    Name
                    <Input
                        id="name"
                        {...register("name")}
                        placeholder="Enter your name"
                        className="mt-1"                
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm">{errors.name.message}</p>
                    )}
                    </div>

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

                    {/* Confirm Password Field */}
                    <div>
                        Confirm Password
                        <Input
                            id="confirmPassword"
                            type="password"
                            {...register("confirmPassword")}
                            placeholder="Confirm your password"
                            className="mt-1"
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm">
                            {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>
                    <div className="mt-4 text-right">
                        <p className="text-sm">
                            Already have an account?{" "}
                            <Link href="/login" className="text-blue-500 hover:underline">
                            Login here
                            </Link>
                        </p>
                    </div>
                    {/* Submit Button */}
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? "Submitting..." : "Register"}
                    </Button>
                    {submitError && (
                        <p className="text-red-500 text-sm mt-2">{submitError}</p>
                    )}
                </form>
            </div>
        </div>
    </>)
}
export default Register;