"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi, profileApi } from "@/lib/api-client";
import { StudentProfile } from "@/types/interface";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

const StudentProfileTab = () => {
	const [profilePicture, setProfilePicture] = useState<File | null>(null);
	const [profilePreview, setProfilePreview] = useState<string | null>(null);
	const [skills, setSkills] = useState<string[]>([]);
	const [newSkill, setNewSkill] = useState("");
	const [resumeFile, setResumeFile] = useState<File | null>(null);
	const [resumePreview, setResumePreview] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		phone: "",
		university: "",
		major: "",
		graduationYear: "",
		bio: "",
		portfolioUrl: "",
		linkedinUrl: "",
		githubUrl: "",
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

	useEffect(() => {
		if (userData?.user.userType === "STUDENT") {
			const profile = userData.profile as StudentProfile;
			setFormData({
				firstName: profile.firstName || "",
				lastName: profile.lastName || "",
				phone: profile.phone || "",
				university: profile.university || "",
				major: profile.major || "",
				graduationYear: profile.graduationYear?.toString() || "",
				bio: profile.bio || "",
				portfolioUrl: profile.portfolioUrl || "",
				linkedinUrl: profile.linkedinUrl || "",
				githubUrl: profile.githubUrl || "",
			});
		}
	}, [userData]);

	const updateProfileMutation = useMutation({
		mutationFn: profileApi.updateStudentProfile,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user-profile"] });
			toast.success("Profile updated successfully!");
		},
	});

	const uploadImageMutation = useMutation({
		mutationFn: (file: File) => profileApi.uploadImage(file, "student-avatar"),
		onSuccess: () => {
			// Also invalidate queries after image upload
			queryClient.invalidateQueries({ queryKey: ["user-profile"] });
		},
	});

	const uploadResumeMutation = useMutation({
		mutationFn: (file: File) => profileApi.uploadImage(file, "student-resume"),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user-profile"] });
			toast.success("Resume uploaded successfully!");
		},
	});

	const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setResumeFile(file);
			setResumePreview(file.name);
		}
	};

	const handleProfilePictureChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = e.target.files?.[0];
		if (file) {
			setProfilePicture(file);
			const previewUrl = URL.createObjectURL(file);
			setProfilePreview(previewUrl);
		}
	};

	// Initialize skills from userData
	useEffect(() => {
		if (userData?.user.userType === "STUDENT") {
			const userSkills = (userData.profile as StudentProfile).userSkills || [];
			setSkills(userSkills.map((userSkill: any) => userSkill.skill.name));
		}
	}, [userData]);

	const addSkill = () => {
		if (newSkill.trim() && !skills.includes(newSkill.trim())) {
			setSkills([...skills, newSkill.trim()]);
			setNewSkill("");
		}
	};

	const removeSkill = (skillToRemove: string) => {
		setSkills(skills.filter((skill) => skill !== skillToRemove));
	};

	const handleSave = async () => {
		// Add this validation
		if (
			!formData.firstName ||
			!formData.lastName ||
			!formData.university ||
			!formData.major
		) {
			toast.error("Please fill in all required fields");
			return;
		}

		let profilePictureUrl = (userData?.profile as StudentProfile)
			?.profilePictureUrl;
		let resumeUrl = (userData?.profile as StudentProfile)?.resumeUrl;

		if (profilePicture) {
			const uploadResult =
				await uploadImageMutation.mutateAsync(profilePicture);

			profilePictureUrl = uploadResult.data.profilePictureUrl;
		}

		if (resumeFile) {
			const uploadResult = await uploadResumeMutation.mutateAsync(resumeFile);
			resumeUrl = uploadResult.data.resumeUrl;
		}

		setIsSaving(true);

		const dataToSend = {
			...formData,
			graduationYear: parseInt(formData.graduationYear),
			profilePictureUrl,
			resumeUrl,
		};

		// Save profile and skills
		await Promise.all([
			updateProfileMutation.mutateAsync(dataToSend),
			profileApi.updateStudentSkills(skills),
		]);

		setIsSaving(false);
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
			<h2 className="text-2xl font-bold text-gray-900 mb-6">Profile</h2>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Basic Info */}
				<div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
					<h3 className="text-lg font-medium text-gray-900 mb-4">
						Personal Information
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								First Name
							</label>
							<input
								type="text"
								defaultValue={
									userData?.user.userType === "STUDENT"
										? (userData.profile as StudentProfile).firstName || ""
										: ""
								}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										firstName: e.target.value,
									}))
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Last Name
							</label>
							<input
								type="text"
								defaultValue={
									userData?.user.userType === "STUDENT"
										? (userData.profile as StudentProfile).lastName || ""
										: ""
								}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, lastName: e.target.value }))
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Email
							</label>
							<input
								type="email"
								defaultValue={userData?.user?.email || ""}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, email: e.target.value }))
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Phone
							</label>
							<input
								type="tel"
								defaultValue={
									userData?.user.userType === "STUDENT"
										? (userData.profile as StudentProfile).phone || ""
										: ""
								}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, phone: e.target.value }))
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
					</div>
					<div className="mt-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							University
						</label>
						<input
							type="text"
							defaultValue={
								userData?.user.userType === "STUDENT"
									? (userData.profile as StudentProfile).university || ""
									: ""
							}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, university: e.target.value }))
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
					<div className="mt-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Major
						</label>
						<input
							type="text"
							defaultValue={
								userData?.user.userType === "STUDENT"
									? (userData.profile as StudentProfile).major || ""
									: ""
							}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, major: e.target.value }))
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					<div className="mt-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Graduation Year
						</label>
						<input
							type="text"
							defaultValue={
								userData?.user.userType === "STUDENT"
									? (userData.profile as StudentProfile).graduationYear || ""
									: ""
							}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									graduationYear: e.target.value,
								}))
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					<div className="mt-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Bio
						</label>
						<textarea
							rows={3}
							value={formData.bio}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, bio: e.target.value }))
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="Tell us about yourself..."
						/>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Portfolio URL
							</label>
							<input
								type="url"
								value={formData.portfolioUrl}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										portfolioUrl: e.target.value,
									}))
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								LinkedIn URL
							</label>
							<input
								type="url"
								value={formData.linkedinUrl}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										linkedinUrl: e.target.value,
									}))
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
					</div>
				</div>

				<div className="space-y-6">
					{/* Profile Picture */}
					<div className="bg-white rounded-lg shadow p-6">
						<h3 className="text-lg font-medium text-gray-900 mb-4">
							Profile Picture
						</h3>
						<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
							{profilePreview ||
							(userData?.profile as StudentProfile)?.profilePictureUrl ? (
								<Image
									src={
										profilePreview ||
										(userData?.profile as StudentProfile)?.profilePictureUrl ||
										""
									}
									alt="Profile picture"
									className="mx-auto h-24 w-24 rounded-full object-cover mb-4"
									width={96}
									height={96}
								/>
							) : (
								<div className="mx-auto h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
									<span className="text-2xl text-gray-400">
										{userData?.profile
											? `${(userData.profile as StudentProfile).firstName?.[0]}${(userData.profile as StudentProfile).lastName?.[0]}`
											: "?"}
									</span>
								</div>
							)}
							<input
								type="file"
								accept="image/*"
								onChange={handleProfilePictureChange}
								className="hidden"
								id="profile-picture-upload"
							/>
							<button
								type="button"
								onClick={() =>
									document.getElementById("profile-picture-upload")?.click()
								}
								className="text-blue-600 hover:text-blue-700 text-sm font-medium"
							>
								Update Photo
							</button>
						</div>
					</div>
					<div className="bg-white rounded-lg shadow p-6">
						<h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
						<div className="space-y-2">
							<div className="flex flex-wrap gap-2">
								{skills.map((skill, index) => (
									<span
										key={index}
										className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center"
									>
										{skill}
										<button
											onClick={() => removeSkill(skill)}
											className="ml-1 text-blue-600 hover:text-blue-800"
										>
											×
										</button>
									</span>
								))}
							</div>
							<div className="flex gap-2 mt-2">
								<input
									type="text"
									value={newSkill}
									onChange={(e) => setNewSkill(e.target.value)}
									placeholder="Enter a skill"
									className="px-2 py-1 border border-gray-300 rounded text-sm"
									onKeyPress={(e) => e.key === "Enter" && addSkill()}
								/>
								<button
									onClick={addSkill}
									className="text-blue-600 hover:text-blue-700 text-sm font-medium"
								>
									+ Add
								</button>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow p-6">
						<h3 className="text-lg font-medium text-gray-900 mb-4">Resume</h3>
						<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
							<FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
							<p className="text-sm text-gray-600 mb-2">
								{resumePreview
									? `Selected: ${resumePreview}`
									: userData?.user.userType === "STUDENT"
										? (userData.profile as StudentProfile).resumeUrl
											? "Resume uploaded"
											: "No resume uploaded"
										: "No resume uploaded"}
							</p>
							<input
								type="file"
								accept=".pdf,.doc,.docx"
								onChange={handleResumeChange}
								className="hidden"
								id="resume-upload"
							/>
							<button
								onClick={() =>
									document.getElementById("resume-upload")?.click()
								}
								className="text-blue-600 hover:text-blue-700 text-sm font-medium"
							>
								Update Resume
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="mt-6 flex justify-end">
				<button
					onClick={handleSave}
					disabled={isSaving}
					className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md font-medium transition-colors"
				>
					{isSaving ? "Saving..." : "Save Changes"}
				</button>
			</div>
		</div>
	);
};

export default StudentProfileTab;
