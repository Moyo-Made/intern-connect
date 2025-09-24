"use client";

import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api-client";
import { StudentProfile } from "@/types/interface";
import { FileText } from "lucide-react";

const StudentProfileTab = () => {
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
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
				</div>

				{/* Skills & Resume */}
				<div className="space-y-6">
					<div className="bg-white rounded-lg shadow p-6">
						<h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
						<div className="space-y-2">
							<div className="flex flex-wrap gap-2">
								{(userData?.user.userType === "STUDENT"
									? (userData.profile as StudentProfile).skills || []
									: []
								).map((skill, index) => (
									<span
										key={index}
										className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
									>
										{skill}
									</span>
								))}
							</div>
							<button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
								+ Add Skill
							</button>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow p-6">
						<h3 className="text-lg font-medium text-gray-900 mb-4">Resume</h3>
						<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
							<FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
							<p className="text-sm text-gray-600 mb-2">
								{userData?.user.userType === "STUDENT"
									? (userData.profile as StudentProfile).resumeUrl
										? "Resume uploaded"
										: "No resume uploaded"
									: "No resume uploaded"}
							</p>
							<button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
								Update Resume
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="mt-6 flex justify-end">
				<button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors">
					Save Changes
				</button>
			</div>
		</div>
	);
};

export default StudentProfileTab;
