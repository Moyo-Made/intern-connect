"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { UserType } from "@prisma/client";
import z from "zod";
import { registrationSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface RegisterModalProps {
	isOpen: boolean;
	onClose: () => void;
	userType: UserType;
	onSwitchToSignup: () => void;
	title?: string;
}

type RegistrationData = z.infer<typeof registrationSchema>;

enum CompanySize {
	STARTUP = "STARTUP",
	SMALL = "SMALL",
	MEDIUM = "MEDIUM",
	LARGE = "LARGE",
	ENTERPRISE = "ENTERPRISE",
}

export default function RegisterModal({
	isOpen,
	onClose,
	userType,
	onSwitchToSignup,
	title,
}: RegisterModalProps) {
	const router = useRouter();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		// Student fields
		firstName: "",
		lastName: "",
		university: "",
		major: "",
		graduationYear: new Date().getFullYear() + 1,
		phone: "",
		// Company fields
		companyName: "",
		industry: "",
		location: "",
		companySize: CompanySize.STARTUP,
		website: "",
		description: "",
	});
	const [validationErrors, setValidationErrors] = useState<
		Record<string, string>
	>({});
	const [successMessage, setSuccessMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	if (!isOpen) return null;

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === "graduationYear" ? parseInt(value) : value,
		}));

		// Clear validation error for this field
		if (validationErrors[name]) {
			setValidationErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setValidationErrors({});
		setSuccessMessage("");
		setError("");

		const registrationData: RegistrationData =
			userType === UserType.STUDENT
				? {
						email: formData.email,
						password: formData.password,
						userType: UserType.STUDENT,
						firstName: formData.firstName,
						lastName: formData.lastName,
						university: formData.university,
						major: formData.major,
						graduationYear: formData.graduationYear,
						phone: formData.phone || undefined,
					}
				: {
						email: formData.email,
						password: formData.password,
						userType: UserType.COMPANY,
						companyName: formData.companyName,
						industry: formData.industry,
						location: formData.location,
						companySize: formData.companySize,
						website: formData.website || undefined,
						description: formData.description || undefined,
					};

		setIsLoading(true);

		try {
			const response = await fetch("/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(registrationData),
			});

			const result = await response.json();

			// Handle registration failure
			if (!result.success) {
				if (result.errors) {
					// Handle validation errors from server
					const serverErrors: Record<string, string> = {};
					Object.entries(result.errors).forEach(([key, messages]) => {
						if (Array.isArray(messages)) {
							serverErrors[key] = messages[0];
						}
					});
					setValidationErrors(serverErrors);
				} else {
					setError(result.message);
				}
				return;
			}

			if (!result.data) {
				console.error("⚠️ No data in successful response");
				setError("Registration successful but no user data received");
				return;
			}

			// Verify user type matches expected type
			const userTypeFromResponse = result.data.user.userType;

			if (userTypeFromResponse !== userType) {
				console.error("❌ User type mismatch during registration");
				setError(
					`Registration error: Expected ${userType}, got ${userTypeFromResponse}`
				);
				return;
			}

			// Store token in localStorage
			if (result.data.token) {
				localStorage.setItem("authToken", result.data.token);
				// Also store in the backup location for consistency
				localStorage.setItem("token", result.data.token);
			}

			// Show success message
			setSuccessMessage(result.message || "Account created successfully!");

			// Determine dashboard path
			const dashboardPath =
				userType === UserType.STUDENT
					? "/dashboard/student"
					: "/dashboard/company";

			// Reset form data
			setFormData({
				email: "",
				password: "",
				firstName: "",
				lastName: "",
				university: "",
				major: "",
				graduationYear: new Date().getFullYear() + 1,
				phone: "",
				companyName: "",
				industry: "",
				location: "",
				companySize: CompanySize.STARTUP,
				website: "",
				description: "",
			});

			// Navigate after showing success message
			setTimeout(() => {
				router.push(dashboardPath);
				onClose();
			}, 1500);

			// Fallback navigation in case router.push doesn't work
			setTimeout(() => {
				if (window.location.pathname !== dashboardPath) {
					window.location.href = dashboardPath;
				}
			}, 3000);
		} catch (err) {
			console.error("💥 Registration error:", err);

			// More specific error handling
			if (err instanceof TypeError && err.message.includes("fetch")) {
				setError("Network error. Please check your internet connection.");
			} else if (err instanceof Error) {
				setError(`Registration failed: ${err.message}`);
			} else {
				setError("An unexpected error occurred. Please try again.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	const renderStudentFields = () => (
		<>
			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						First Name *
					</label>
					<input
						type="text"
						name="firstName"
						value={formData.firstName}
						onChange={handleInputChange}
						className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
						placeholder="Enter your first name"
						required
					/>
					{validationErrors.firstName && (
						<p className="text-red-500 text-sm mt-1">
							{validationErrors.firstName}
						</p>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Last Name *
					</label>
					<input
						type="text"
						name="lastName"
						value={formData.lastName}
						onChange={handleInputChange}
						className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
						placeholder="Enter your last name"
						required
					/>
					{validationErrors.lastName && (
						<p className="text-red-500 text-sm mt-1">
							{validationErrors.lastName}
						</p>
					)}
				</div>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					University *
				</label>
				<input
					type="text"
					name="university"
					value={formData.university}
					onChange={handleInputChange}
					className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
					placeholder="Enter your university"
					required
				/>
				{validationErrors.university && (
					<p className="text-red-500 text-sm mt-1">
						{validationErrors.university}
					</p>
				)}
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Major *
					</label>
					<input
						type="text"
						name="major"
						value={formData.major}
						onChange={handleInputChange}
						className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
						placeholder="e.g. Computer Science"
						required
					/>
					{validationErrors.major && (
						<p className="text-red-500 text-sm mt-1">
							{validationErrors.major}
						</p>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Graduation Year *
					</label>
					<Select
						value={formData.graduationYear?.toString() || ""}
						onValueChange={(value) =>
							setFormData((prev) => ({
								...prev,
								graduationYear: parseInt(value),
							}))
						}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select graduation year" />
						</SelectTrigger>
						<SelectContent>
							{Array.from({ length: 7 }, (_, i) => {
								const year = new Date().getFullYear() + i;
								return (
									<SelectItem key={year} value={year.toString()}>
										{year}
									</SelectItem>
								);
							})}
						</SelectContent>
					</Select>
					{validationErrors.graduationYear && (
						<p className="text-red-500 text-sm mt-1">
							{validationErrors.graduationYear}
						</p>
					)}
				</div>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Phone (Optional)
				</label>
				<input
					type="tel"
					name="phone"
					value={formData.phone}
					onChange={handleInputChange}
					className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
					placeholder="Enter your phone number"
				/>
			</div>
		</>
	);

	const renderCompanyFields = () => (
		<>
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Company Name *
				</label>
				<input
					type="text"
					name="companyName"
					value={formData.companyName}
					onChange={handleInputChange}
					className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
					placeholder="Enter company name"
					required
				/>
				{validationErrors.companyName && (
					<p className="text-red-500 text-sm mt-1">
						{validationErrors.companyName}
					</p>
				)}
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Industry *
					</label>
					<Select
						value={formData.industry}
						onValueChange={(value) =>
							setFormData((prev) => ({
								...prev,
								industry: value,
							}))
						}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select industry" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="Technology">Technology</SelectItem>
							<SelectItem value="Finance">Finance</SelectItem>
							<SelectItem value="Healthcare">Healthcare</SelectItem>
							<SelectItem value="Education">Education</SelectItem>
							<SelectItem value="Marketing">Marketing</SelectItem>
							<SelectItem value="Manufacturing">Manufacturing</SelectItem>
							<SelectItem value="Other">Other</SelectItem>
						</SelectContent>
					</Select>
					{validationErrors.industry && (
						<p className="text-red-500 text-sm mt-1">
							{validationErrors.industry}
						</p>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Company Size *
					</label>
					<Select
						value={formData.companySize}
						onValueChange={(value) =>
							setFormData((prev) => ({
								...prev,
								companySize: value as CompanySize,
							}))
						}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select company size" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={CompanySize.STARTUP}>
								Startup (1-10)
							</SelectItem>
							<SelectItem value={CompanySize.SMALL}>Small (11-50)</SelectItem>
							<SelectItem value={CompanySize.MEDIUM}>
								Medium (51-200)
							</SelectItem>
							<SelectItem value={CompanySize.LARGE}>
								Large (201-1000)
							</SelectItem>
							<SelectItem value={CompanySize.ENTERPRISE}>
								Enterprise (1000+)
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Location *
				</label>
				<input
					type="text"
					name="location"
					value={formData.location}
					onChange={handleInputChange}
					className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
					placeholder="e.g. San Francisco, CA"
					required
				/>
				{validationErrors.location && (
					<p className="text-red-500 text-sm mt-1">
						{validationErrors.location}
					</p>
				)}
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Website (Optional)
				</label>
				<input
					type="url"
					name="website"
					value={formData.website}
					onChange={handleInputChange}
					className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
					placeholder="https://yourcompany.com"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Description (Optional)
				</label>
				<textarea
					name="description"
					value={formData.description}
					onChange={handleInputChange}
					rows={3}
					className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
					placeholder="Brief description of your company..."
				/>
			</div>
		</>
	);

	// Use the title prop if provided, otherwise fall back to default
	const modalTitle =
		title || `${userType === UserType.STUDENT ? "Student" : "Company"} Sign Up`;

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
				<div className="p-8">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-2xl font-bold text-gray-800">{modalTitle}</h2>
						<button
							onClick={onClose}
							className="p-2 hover:bg-gray-100 text-black rounded-full transition-colors"
						>
							<X className="w-5 h-5" />
						</button>
					</div>

					{/* Success Message */}
					{successMessage && (
						<div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
							{successMessage}
						</div>
					)}

					{/* Error Message */}
					{error && (
						<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Email */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Email *
							</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleInputChange}
								className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
								placeholder="Enter your email"
								required
							/>
							{validationErrors.email && (
								<p className="text-red-500 text-sm mt-1">
									{validationErrors.email}
								</p>
							)}
						</div>

						{/* Password */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Password *
							</label>
							<input
								type="password"
								name="password"
								value={formData.password}
								onChange={handleInputChange}
								className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
								placeholder="Enter your password"
								required
							/>
							{validationErrors.password && (
								<p className="text-red-500 text-sm mt-1">
									{validationErrors.password}
								</p>
							)}
							<p className="text-xs text-gray-500 mt-1">
								Must be 8+ characters with uppercase, lowercase, and number
							</p>
						</div>

						{/* Dynamic Fields */}
						{userType === UserType.STUDENT
							? renderStudentFields()
							: renderCompanyFields()}

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-blue-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
						>
							{isLoading ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Creating Account...
								</>
							) : (
								"Create Account"
							)}
						</button>

						{/* Switch to Login */}
						<div className="text-center text-sm text-gray-600">
							Already have an account?{" "}
							<button
								type="button"
								onClick={onSwitchToSignup}
								className="text-blue-600 hover:underline font-medium"
							>
								Sign in
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
