"use client";

import { Building2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { CompanyProfile } from "@/types/interface";
import { authApi, profileApi } from "@/lib/api-client";
import { Textarea } from "./ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface FormData {
	companyName: string;
	website: string;
	description: string;
}

const ProfileTab = () => {
	const [logoFile, setLogoFile] = useState<File | null>(null);
	const [logoPreview, setLogoPreview] = useState<string | null>(null);
	const [formData, setFormData] = useState<FormData>({
		companyName: "",
		website: "",
		description: "",
	});
	const queryClient = useQueryClient();

	const {
		data: userData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["user-profile"],
		queryFn: authApi.me,
		select: (response) => (response.success ? response.data : null),
		staleTime: 10 * 60 * 1000, // 10 minutes
	});

	// Update form data when userData loads
	useEffect(() => {
		if (userData?.user.userType === "COMPANY") {
			const profile = userData.profile as CompanyProfile;
			setFormData({
				companyName: profile.companyName || "",
				website: profile.website || "",
				description: profile.description || "",
			});
		}
	}, [userData]);

	const updateProfileMutation = useMutation({
		mutationFn: profileApi.updateCompanyProfile,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["user-profile"],
			});
			toast.success("Profile updated successfully!");
		},
		onError: (error) => {
			toast.error("Failed to update profile. Please try again.");
		},
	});

	const uploadLogoMutation = useMutation({
		mutationFn: profileApi.uploadLogo,
		onError: (error) => {
			toast.error("Failed to upload logo. Please try again.");
		},
	});

	const handleInputChange = (field: keyof FormData, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setLogoFile(file);
			const previewUrl = URL.createObjectURL(file);
			setLogoPreview(previewUrl);
		}
	};

	const handleSave = async () => {
		try {
			let logoUrl = (userData?.profile as CompanyProfile)?.logoUrl;

			// Upload logo first if there's a new file
			if (logoFile) {
				const uploadResult = await uploadLogoMutation.mutateAsync(logoFile);
				logoUrl = uploadResult.data.logoUrl;
			}

			await updateProfileMutation.mutateAsync({
				companyName: formData.companyName,
				website: formData.website,
				description: formData.description,
				logoUrl,
			});

			// Clear logo preview after successful save
			setLogoFile(null);
			setLogoPreview(null);
		} catch (error) {
			// Error handling is done in mutation onError callbacks
		}
	};

	if (isLoading) {
		return (
			<div className="flex flex-col justify-center items-center py-8">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
				Loading profile...
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-50 border border-red-200 rounded-md p-4">
				<div className="text-red-800">
					Failed to load profile data. Please try again.
				</div>
			</div>
		);
	}

	return (
		<div>
			<h2 className="text-2xl font-bold text-gray-900 mb-6">Company Profile</h2>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
					<h3 className="text-lg font-medium text-gray-900 mb-4">
						Company Information
					</h3>
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Company Name
							</label>
							<Input
								type="text"
								value={formData.companyName}
								onChange={(e) =>
									handleInputChange("companyName", e.target.value)
								}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Email
							</label>
							<Input
								type="email"
								value={userData?.user?.email || ""}
								disabled
								className="bg-gray-50"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Website
							</label>
							<Input
								type="url"
								value={formData.website}
								onChange={(e) => handleInputChange("website", e.target.value)}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Description
							</label>
							<Textarea
								rows={4}
								value={formData.description}
								onChange={(e) =>
									handleInputChange("description", e.target.value)
								}
							/>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<h3 className="text-lg font-medium text-gray-900 mb-4">
						Company Logo
					</h3>
					<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
						{logoPreview || (userData?.profile as CompanyProfile)?.logoUrl ? (
							<img
								src={
									logoPreview || (userData?.profile as CompanyProfile)?.logoUrl
								}
								alt="Company logo"
								className="mx-auto h-24 w-24 object-contain mb-4"
							/>
						) : (
							<Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
						)}
						<p className="text-sm text-gray-600 mb-2">
							{logoFile ? logoFile.name : "Upload company logo"}
						</p>
						<input
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							className="hidden"
							id="logo-upload"
						/>
						<Button
							variant="outline"
							size="sm"
							onClick={() => document.getElementById("logo-upload")?.click()}
						>
							Choose File
						</Button>
					</div>
				</div>
			</div>

			<div className="mt-6 flex justify-end">
				<Button
					onClick={handleSave}
					disabled={
						updateProfileMutation.isPending || uploadLogoMutation.isPending
					}
				>
					{updateProfileMutation.isPending || uploadLogoMutation.isPending
						? "Saving..."
						: "Save Changes"}
				</Button>
			</div>
		</div>
	);
};

export default ProfileTab;
