"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { UserType, CompanySize } from "@prisma/client";
import { useAuth } from "@/contexts/AuthContext";
import z from "zod";
import { registrationSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";

interface RegisterModalProps {
	isOpen: boolean;
	onClose: () => void;
	userType: UserType;
	onSwitchToSignup: () => void;
	title?: string;
}

type RegistrationData = z.infer<typeof registrationSchema>;

export default function RegisterModal({
	isOpen,
	onClose,
	userType,
	onSwitchToSignup,
	title,
}: RegisterModalProps) {
	const router = useRouter();
	const { register, isLoading, error, clearError } = useAuth();
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
		clearError();

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

		const result = await register(registrationData);

		if (result.success) {
			setSuccessMessage(result.message);
			const dashboardPath =
				userType === UserType.STUDENT
					? "/dashboard/student"
					: "/dashboard/company";

			setTimeout(() => {
				router.push(dashboardPath);
				onClose();
			}, 1500);
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
					<select
						name="graduationYear"
						value={formData.graduationYear}
						onChange={handleInputChange}
						className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
						required
					>
						{Array.from({ length: 7 }, (_, i) => {
							const year = new Date().getFullYear() + i;
							return (
								<option key={year} value={year}>
									{year}
								</option>
							);
						})}
					</select>
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
					<select
						name="industry"
						value={formData.industry}
						onChange={handleInputChange}
						className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
						required
					>
						<option value="">Select industry</option>
						<option value="Technology">Technology</option>
						<option value="Finance">Finance</option>
						<option value="Healthcare">Healthcare</option>
						<option value="Education">Education</option>
						<option value="Marketing">Marketing</option>
						<option value="Manufacturing">Manufacturing</option>
						<option value="Other">Other</option>
					</select>
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
					<select
						name="companySize"
						value={formData.companySize}
						onChange={handleInputChange}
						className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
						required
					>
						<option value={CompanySize.STARTUP}>Startup (1-10)</option>
						<option value={CompanySize.SMALL}>Small (11-50)</option>
						<option value={CompanySize.MEDIUM}>Medium (51-200)</option>
						<option value={CompanySize.LARGE}>Large (201-1000)</option>
						<option value={CompanySize.ENTERPRISE}>Enterprise (1000+)</option>
					</select>
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
