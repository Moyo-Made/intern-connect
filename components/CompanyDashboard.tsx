"use client";

import { Eye, User, Users, Building2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import Link from "next/link";
import { useEffect } from "react";
import { AuthUser, CompanyProfile } from "@/types/interface";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

import OverviewTab from "./OverviewTab";
import InternshipsTab from "./InternshipsTab";
import ApplicationsTab from "./ApplicationsTab";
import ProfileTab from "./ProfileTab";

const CompanyDashboard = () => {
	const [activeTab, setActiveTab] = useState("overview");

	const [userData] = useState<AuthUser | null>(null);
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(true);
	const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();

	useEffect(() => {
		// Don't redirect while auth is still loading
		if (authLoading) return;

		if (!isAuthenticated || !user) {
			router.push("/login");
			return;
		}

		// Redirect if wrong user type
		if (user.user.userType !== "COMPANY") {
			router.push("/dashboard/student");
		}
	}, [authLoading, isAuthenticated, user, router]);

	const handleLogout = () => {
		logout();
		router.push("/");
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<Link href="/">
							<div className="flex items-center space-x-3">
								<div className="relative">
									<svg
										width="32"
										height="32"
										viewBox="0 0 32 32"
										className="text-slate-800"
									>
										<circle
											cx="12"
											cy="16"
											r="8"
											fill="none"
											stroke="currentColor"
											strokeWidth="2.5"
											className="text-blue-600"
										/>
										<circle
											cx="20"
											cy="16"
											r="8"
											fill="none"
											stroke="currentColor"
											strokeWidth="2.5"
											className="text-slate-700"
										/>
										<circle
											cx="16"
											cy="16"
											r="2"
											fill="currentColor"
											className="text-blue-600"
										/>
									</svg>
								</div>
								<div className="flex flex-col">
									<span className="text-xl font-bold text-slate-800 leading-none">
										InternConnect
									</span>
								</div>
							</div>
						</Link>
						<div className="flex items-center space-x-4">
							<span className="text-gray-700">
								{isLoading
									? "Loading..."
									: `Welcome back, ${
											userData?.user.userType === "COMPANY"
												? (userData.profile as CompanyProfile).companyName
												: userData?.user?.email || "User"
										}`}
							</span>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center p-0 hover:bg-blue-600"
									>
										<Building2 className="w-4 h-4 text-white" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-56">
									<DropdownMenuLabel>
										{userData?.user.userType === "COMPANY"
											? (userData.profile as CompanyProfile).companyName
											: "User"}
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => setActiveTab("profile")}
										className="cursor-pointer"
									>
										<Building2 className="mr-2 h-4 w-4" />
										<span>Company Profile</span>
									</DropdownMenuItem>

									<DropdownMenuItem
										className="cursor-pointer text-red-600 focus:text-red-600"
										onClick={handleLogout}
									>
										<LogOut className="mr-2 h-4 w-4" />
										<span>Logout</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</div>
			</header>

			{/* Navigation */}
			<nav className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex space-x-8">
						{[
							{ id: "overview", label: "Overview", icon: Eye },
							{ id: "internships", label: "My Internships", icon: Building2 },
							{ id: "applications", label: "Applications", icon: Users },
							{ id: "profile", label: "Profile", icon: User },
						].map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
									activeTab === tab.id
										? "border-blue-500 text-blue-600"
										: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
								}`}
							>
								<tab.icon className="w-4 h-4" />
								<span>{tab.label}</span>
							</button>
						))}
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{activeTab === "overview" && <OverviewTab />}

				{activeTab === "internships" && <InternshipsTab onTabChange={setActiveTab} />}

				{activeTab === "applications" && <ApplicationsTab />}

				{activeTab === "profile" && <ProfileTab />}
			</main>
		</div>
	);
};

export default CompanyDashboard;
