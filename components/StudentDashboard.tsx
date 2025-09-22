"use client";

import { SetStateAction, useEffect, useState } from "react";
import {
	Search,
	Filter,
	MapPin,
	Building2,
	Clock,
	CheckCircle,
	XCircle,
	User,
	FileText,
	LogOut,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
import { AuthUser, StudentProfile } from "@/types/interface";
import { authApi } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";

const StudentDashboard = () => {
	const [activeTab, setActiveTab] = useState("internships");
	const [searchTerm, setSearchTerm] = useState("");
	const [locationFilter, setLocationFilter] = useState("");
	const [companyFilter, setCompanyFilter] = useState("");
	const [userData, setUserData] = useState<AuthUser | null>(null);
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
		if (user.user.userType !== "STUDENT") {
			router.push("/dashboard/company");
		}
	}, [authLoading, isAuthenticated, user, router]);

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

	// Mock data
	const internships = [
		{
			id: 1,
			title: "Frontend Developer Intern",
			company: "TechCorp",
			location: "San Francisco, CA",
			description:
				"Work with React and TypeScript to build user interfaces. Great opportunity to learn modern web development.",
			requirements: ["React", "JavaScript", "CSS"],
			posted: "2 days ago",
		},
		{
			id: 2,
			title: "Data Science Intern",
			company: "DataFlow Inc",
			location: "Remote",
			description:
				"Analyze large datasets and create machine learning models. Perfect for statistics or computer science students.",
			requirements: ["Python", "SQL", "Statistics"],
			posted: "1 week ago",
		},
		{
			id: 3,
			title: "Marketing Intern",
			company: "BrandMax",
			location: "New York, NY",
			description:
				"Support digital marketing campaigns and social media management. Learn about brand strategy.",
			requirements: ["Communication", "Social Media", "Analytics"],
			posted: "3 days ago",
		},
		{
			id: 4,
			title: "Software Engineering Intern",
			company: "StartupHub",
			location: "Austin, TX",
			description:
				"Full-stack development with modern technologies. Work directly with senior engineers.",
			requirements: ["JavaScript", "Node.js", "Git"],
			posted: "5 days ago",
		},
	];

	const applications = [
		{
			id: 1,
			internshipTitle: "Frontend Developer Intern",
			company: "TechCorp",
			appliedDate: "2024-01-15",
			status: "PENDING",
		},
		{
			id: 2,
			internshipTitle: "Data Science Intern",
			company: "DataFlow Inc",
			appliedDate: "2024-01-12",
			status: "ACCEPTED",
		},
		{
			id: 3,
			internshipTitle: "UX Design Intern",
			company: "DesignStudio",
			appliedDate: "2024-01-10",
			status: "REJECTED",
		},
	];

	const filteredInternships = internships.filter((internship) => {
		const matchesSearch =
			internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			internship.company.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesLocation =
			!locationFilter ||
			internship.location.toLowerCase().includes(locationFilter.toLowerCase());
		const matchesCompany =
			!companyFilter ||
			internship.company.toLowerCase().includes(companyFilter.toLowerCase());
		return matchesSearch && matchesLocation && matchesCompany;
	});

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "ACCEPTED":
				return <CheckCircle className="w-4 h-4 text-green-500" />;
			case "REJECTED":
				return <XCircle className="w-4 h-4 text-red-500" />;
			default:
				return <Clock className="w-4 h-4 text-yellow-500" />;
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "ACCEPTED":
				return "bg-green-100 text-green-800";
			case "REJECTED":
				return "bg-red-100 text-red-800";
			default:
				return "bg-yellow-100 text-yellow-800";
		}
	};

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
											user?.user.userType === "STUDENT"
												? (user.profile as StudentProfile).firstName
												: user?.user?.email || "User"
										}`}
							</span>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center p-0 hover:bg-blue-600"
									>
										<User className="w-4 h-4 text-white" />
									</Button>
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
				{activeTab === "internships" && (
					<div>
						{/* Search and Filters */}
						<div className="bg-white rounded-lg shadow p-6 mb-6">
							<div className="flex flex-col md:flex-row gap-4">
								<div className="flex-1">
									<div className="relative">
										<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
										<Input
											type="text"
											placeholder="Search internships or companies..."
											value={searchTerm}
											onChange={(e: {
												target: { value: SetStateAction<string> };
											}) => setSearchTerm(e.target.value)}
											className="pl-10"
										/>
									</div>
								</div>

								<div className="w-48">
									<Select
										value={locationFilter}
										onValueChange={setLocationFilter}
									>
										<SelectTrigger>
											<SelectValue placeholder="All Locations" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">All Locations</SelectItem>
											<SelectItem value="remote">Remote</SelectItem>
											<SelectItem value="san francisco">
												San Francisco
											</SelectItem>
											<SelectItem value="new york">New York</SelectItem>
											<SelectItem value="austin">Austin</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="w-48">
									<Select
										value={companyFilter}
										onValueChange={setCompanyFilter}
									>
										<SelectTrigger>
											<SelectValue placeholder="All Companies" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">All Companies</SelectItem>
											<SelectItem value="techcorp">TechCorp</SelectItem>
											<SelectItem value="dataflow">DataFlow Inc</SelectItem>
											<SelectItem value="brandmax">BrandMax</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>

						{/* Internships List */}
						<div className="space-y-4">
							{filteredInternships.map((internship) => (
								<div
									key={internship.id}
									className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
								>
									<div className="flex justify-between items-start mb-4">
										<div>
											<h3 className="text-lg font-semibold text-gray-900 mb-1">
												{internship.title}
											</h3>
											<div className="flex items-center space-x-4 text-gray-600">
												<div className="flex items-center">
													<Building2 className="w-4 h-4 mr-1" />
													<span>{internship.company}</span>
												</div>
												<div className="flex items-center">
													<MapPin className="w-4 h-4 mr-1" />
													<span>{internship.location}</span>
												</div>
												<span className="text-sm">{internship.posted}</span>
											</div>
										</div>
										<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
											Apply Now
										</button>
									</div>
									<p className="text-gray-700 mb-4">{internship.description}</p>
									<div className="flex flex-wrap gap-2">
										{internship.requirements.map((req, index) => (
											<span
												key={index}
												className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
											>
												{req}
											</span>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{activeTab === "applications" && (
					<div>
						<h2 className="text-2xl font-bold text-gray-900 mb-6">
							My Applications
						</h2>
						<div className="bg-white rounded-lg shadow overflow-hidden">
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Position
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Company
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Applied Date
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Status
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{applications.map((app) => (
											<tr key={app.id} className="hover:bg-gray-50">
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm font-medium text-gray-900">
														{app.internshipTitle}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-900">
														{app.company}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-500">
														{app.appliedDate}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex items-center">
														{getStatusIcon(app.status)}
														<span
															className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.status)}`}
														>
															{app.status}
														</span>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				)}

				{activeTab === "profile" && (
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
											defaultValue="Alex"
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Last Name
										</label>
										<input
											type="text"
											defaultValue="Johnson"
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Email
										</label>
										<input
											type="email"
											defaultValue="alex.johnson@email.com"
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Phone
										</label>
										<input
											type="tel"
											defaultValue="+1 (555) 123-4567"
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
										defaultValue="Stanford University"
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</div>
								<div className="mt-4">
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Major
									</label>
									<input
										type="text"
										defaultValue="Computer Science"
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</div>
							</div>

							{/* Skills & Resume */}
							<div className="space-y-6">
								<div className="bg-white rounded-lg shadow p-6">
									<h3 className="text-lg font-medium text-gray-900 mb-4">
										Skills
									</h3>
									<div className="space-y-2">
										<div className="flex flex-wrap gap-2">
											{[
												"JavaScript",
												"React",
												"Python",
												"SQL",
												"Git",
												"Node.js",
											].map((skill, index) => (
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
									<h3 className="text-lg font-medium text-gray-900 mb-4">
										Resume
									</h3>
									<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
										<FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
										<p className="text-sm text-gray-600 mb-2">
											Alex_Johnson_Resume.pdf
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
				)}
			</main>
		</div>
	);
};

export default StudentDashboard;
