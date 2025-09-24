"use client";

import { Building2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { AuthUser, CompanyProfile } from "@/types/interface";
import { authApi } from "@/lib/api-client";
import { Textarea } from "./ui/textarea";

const ProfileTab = () => {
	const [userData, setUserData] = useState<AuthUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				setIsLoading(true);
				const response = await authApi.me();
				if (response.success) {
					setUserData(response.data);
				}
			} catch (error) {
				console.error("Failed to fetch user data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserData();
	}, []);
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
								defaultValue={
									userData?.user.userType === "COMPANY"
										? (userData.profile as CompanyProfile).companyName
										: ""
								}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Email
							</label>
							<Input type="email" defaultValue={userData?.user?.email || ""} />
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Phone
							</label>
							<Input
								type="tel"
								defaultValue={
									userData?.user.userType === "COMPANY"
										? (userData.profile as CompanyProfile).phoneNumber || ""
										: ""
								}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Website
							</label>
							<Input
								type="url"
								defaultValue={
									userData?.user.userType === "COMPANY"
										? (userData.profile as CompanyProfile).website || ""
										: ""
								}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Description
							</label>
							<Textarea
								rows={4}
								defaultValue={
									userData?.user.userType === "COMPANY"
										? (userData.profile as CompanyProfile).description || ""
										: ""
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
						<Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
						<p className="text-sm text-gray-600 mb-2">Upload company logo</p>
						<Button variant="outline" size="sm">
							Choose File
						</Button>
					</div>
				</div>
			</div>

			<div className="mt-6 flex justify-end">
				<Button>Save Changes</Button>
			</div>
		</div>
	);
};

export default ProfileTab;
