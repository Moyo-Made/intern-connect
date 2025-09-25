"use client";

import { useEffect, useState } from "react";
import { Search, User, FileText, LogOut } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StudentProfile } from "@/types/interface";
import { useAuth } from "@/contexts/AuthContext";
import StudentProfileTab from "./StudentProfileTab";
import FindInternship from "./FindInternships";
import StudentsApplication from "./StudentsApplicationTab";
import Image from "next/image";

const StudentDashboard = () => {
	const [activeTab, setActiveTab] = useState("internships");
	const router = useRouter();
	const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();

	useEffect(() => {
		// Don't redirect while auth is still loading
		if (authLoading) return;

		if (!isAuthenticated || !user) {
			router.push("/login");
			return;
		}

		// Redirect if wrong user type
		if (user.user.userType !== "STUDENT") {
			router.push("/dashboard/company");
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
								{authLoading
									? "Loading..."
									: `Welcome back, ${
											user?.user.userType === "STUDENT"
												? (user.profile as StudentProfile).firstName
												: user?.user?.email || "User"
										}`}
							</span>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									{(user?.profile as StudentProfile)?.profilePictureUrl ? (
										<Image
											src={
												(user?.profile as StudentProfile).profilePictureUrl ||
												""
											}
											alt="Company logo"
											className="w-8 h-8 rounded-full object-cover"
											width={32}
											height={32}
										/>
									) : (
										<Button
											variant="ghost"
											className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center p-0 hover:bg-blue-600"
										>
											<User className="w-4 h-4 text-white" />
										</Button>
									)}
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-56">
									<DropdownMenuLabel>
										{user?.user.userType === "STUDENT"
											? `${(user.profile as StudentProfile).firstName} ${(user.profile as StudentProfile).lastName}`
											: user?.user?.email || "User"}
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => setActiveTab("profile")}
										className="cursor-pointer"
									>
										<User className="mr-2 h-4 w-4" />
										<span>Profile</span>
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
							{ id: "internships", label: "Find Internships", icon: Search },
							{ id: "applications", label: "My Applications", icon: FileText },
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
				{activeTab === "internships" && <FindInternship />}

				{activeTab === "applications" && <StudentsApplication />}

				{activeTab === "profile" && <StudentProfileTab />}
			</main>
		</div>
	);
};

export default StudentDashboard;
