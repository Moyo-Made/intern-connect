"use client";

import React, { useState } from "react";
import { X, Loader2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

interface LoginModalProps {
	isOpen: boolean;
	onClose: () => void;
	userType: "STUDENT" | "COMPANY";
	onSwitchToSignup: () => void;
	onLoginSuccess?: (data: any) => void;
	title?: string;
}

interface LoginResponse {
	success: boolean;
	message: string;
	data?: {
		user: {
			id: string;
			email: string;
			userType: string;
			isVerified: boolean;
			createdAt: string;
			lastLoginAt?: string;
		};
		profile: any;
		token: string;
	};
	errors?: Record<string, string[]>;
}

const LoginModal = ({
	isOpen,
	onClose,
	userType,
	onSwitchToSignup,
	onLoginSuccess,
}: LoginModalProps) => {
	const router = useRouter();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [validationErrors, setValidationErrors] = useState<
		Record<string, string>
	>({});

	if (!isOpen) return null;

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));

		// Clear validation error for this field
		if (validationErrors[name]) {
			setValidationErrors((prev) => ({ ...prev, [name]: "" }));
		}

		// Clear auth error when user starts typing
		if (error) setError("");
	};

	const validateForm = () => {
		const errors: Record<string, string> = {};

		if (!formData.email.trim()) {
			errors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			errors.email = "Please enter a valid email address";
		}

		if (!formData.password.trim()) {
			errors.password = "Password is required";
		}

		return errors;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Clear previous errors
		setValidationErrors({});
		setError("");

		// Validate form
		const errors = validateForm();
		if (Object.keys(errors).length > 0) {
			setValidationErrors(errors);
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: formData.email,
					password: formData.password,
				}),
			});

			const result: LoginResponse = await response.json();

			// Handle login failure
			if (!result.success) {
				if (result.errors) {
					// Handle validation errors from server
					const serverErrors: Record<string, string> = {};
					Object.entries(result.errors).forEach(([key, messages]) => {
						serverErrors[key] = messages[0]; // Take first error message
					});
					setValidationErrors(serverErrors);
				} else {
					setError(result.message);
				}
				return;
			}

			if (!result.data) {
				console.error("⚠️ No data in successful response");
				setError("Login successful but no user data received");
				return;
			}

			// Verify user type matches expected type
			const userTypeFromResponse = result.data.user.userType;

			if (userTypeFromResponse !== userType) {
				console.error("❌ User type mismatch");
				setError(
					`This account is registered as ${userTypeFromResponse.toLowerCase()}, not ${userType.toLowerCase()}`
				);
				return;
			}

			// Determine dashboard path
			const dashboardPath =
				userType === "STUDENT" ? "/dashboard/student" : "/dashboard/company";

			// Call success callback first (if provided)
			if (onLoginSuccess) {
				try {
					onLoginSuccess(result.data);
				} catch (callbackError) {
					console.error("💥 Error in onLoginSuccess callback:", callbackError);
					// Don't return here - continue with navigation
				}
			}

			// Store token in localStorage as backup
			if (result.data.token) {
				localStorage.setItem("authToken", result.data.token);
			}

			// Reset form state
			setFormData({ email: "", password: "" });
			setValidationErrors({});
			setError("");

			// Close modal
			onClose();

			// Navigate to dashboard
			router.push(dashboardPath);

			// Force page refresh as fallback (only if navigation seems stuck)
			setTimeout(() => {
				if (window.location.pathname !== dashboardPath) {
					window.location.href = dashboardPath;
				}
			}, 1000);
		} catch (err) {
			console.error("💥 Login error:", err);

			// More specific error handling
			if (err instanceof TypeError && err.message.includes("fetch")) {
				setError("Network error. Please check your internet connection.");
			} else if (err instanceof Error) {
				setError(`Error: ${err.message}`);
			} else {
				setError("An unexpected error occurred. Please try again.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		setFormData({ email: "", password: "" });
		setValidationErrors({});
		setError("");
		onClose();
	};

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
				<div className="p-8">
					{/* Header */}
					<div className="flex justify-between items-center mb-6">
						<div>
							<h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
							<p className="text-sm text-gray-600 mt-1">
								Welcome back, {userType === "STUDENT" ? "Student" : "Company"}
							</p>
						</div>
						<button
							onClick={handleClose}
							className="p-2 hover:bg-gray-100 rounded-full transition-colors"
							disabled={isLoading}
						>
							<X className="h-5 w-5" />
						</button>
					</div>

					{/* Error Alert */}
					{error && (
						<div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
							<p className="text-sm">{error}</p>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Email Field */}
						<div className="space-y-2">
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700"
							>
								Email Address
							</label>
							<input
								id="email"
								name="email"
								type="email"
								value={formData.email}
								onChange={handleInputChange}
								placeholder="Enter your email address"
								className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
									validationErrors.email ? "border-red-500" : "border-gray-300"
								}`}
								disabled={isLoading}
							/>
							{validationErrors.email && (
								<p className="text-sm text-red-600">{validationErrors.email}</p>
							)}
						</div>

						{/* Password Field */}
						<div className="space-y-2">
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700"
							>
								Password
							</label>
							<div className="relative">
								<input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									value={formData.password}
									onChange={handleInputChange}
									placeholder="Enter your password"
									className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
										validationErrors.password
											? "border-red-500"
											: "border-gray-300"
									}`}
									disabled={isLoading}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
									disabled={isLoading}
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4 text-gray-500" />
									) : (
										<Eye className="h-4 w-4 text-gray-500" />
									)}
								</button>
							</div>
							{validationErrors.password && (
								<p className="text-sm text-red-600">
									{validationErrors.password}
								</p>
							)}
						</div>

						{/* Forgot Password Link */}
						<div className="text-right">
							<button
								type="button"
								className="text-sm text-blue-600 hover:underline"
								disabled={isLoading}
							>
								Forgot password?
							</button>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-blue-500 text-white font-semibold py-3 rounded-xl hover:bg-blue-600 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
						>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Signing in...
								</>
							) : (
								"Sign In"
							)}
						</button>

						{/* Switch to Signup */}
						<div className="text-center pt-4 border-t border-gray-200">
							<p className="text-sm text-gray-600">
								Don't have an account?{" "}
								<button
									type="button"
									onClick={onSwitchToSignup}
									className="text-blue-600 hover:underline font-medium"
									disabled={isLoading}
								>
									Sign up
								</button>
							</p>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default LoginModal;
