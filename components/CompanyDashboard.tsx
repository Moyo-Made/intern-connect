"use client";

import {
	Plus,
	Search,
	Eye,
	User,
	Users,
	Building2,
	MapPin,
	Calendar,
	LogOut,
	Edit,
	Trash2,
	CheckCircle,
	XCircle,
	Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Link from "next/link";
import { useEffect } from "react";
import { authApi } from "@/lib/api-client";
import { AuthUser, CompanyProfile } from "@/types/interface";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const CompanyDashboard = () => {
	const [activeTab, setActiveTab] = useState("overview");
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [selectedInternship, setSelectedInternship] = useState(null);
	const [userData, setUserData] = useState<AuthUser | null>(null);
	const router = useRouter();

	// Form state for creating new internships
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		location: "",
		requirements: "",
		type: "full-time",
		duration: "3-months",
	});

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
			location: "San Francisco, CA",
			type: "Full-time",
			applications: 24,
			status: "active",
			posted: "2024-01-15",
			description: "Work with React and TypeScript to build user interfaces.",
			requirements: ["React", "JavaScript", "CSS"],
		},
		{
			id: 2,
			title: "Backend Developer Intern",
			location: "Remote",
			type: "Part-time",
			applications: 18,
			status: "active",
			posted: "2024-01-12",
			description: "Build APIs and work with databases.",
			requirements: ["Node.js", "Python", "SQL"],
		},
		{
			id: 3,
			title: "UX Design Intern",
			location: "New York, NY",
			type: "Full-time",
			applications: 31,
			status: "closed",
			posted: "2024-01-08",
			description: "Design user interfaces and conduct user research.",
			requirements: ["Figma", "Adobe Creative Suite", "User Research"],
		},
	];

	const applications = [
		{
			id: 1,
			studentName: "Sarah Chen",
			internshipTitle: "Frontend Developer Intern",
			appliedDate: "2024-01-16",
			status: "pending",
			email: "sarah.chen@email.com",
			university: "Stanford University",
			major: "Computer Science",
		},
		{
			id: 2,
			studentName: "Mike Johnson",
			internshipTitle: "Frontend Developer Intern",
			appliedDate: "2024-01-15",
			status: "accepted",
			email: "mike.j@email.com",
			university: "UC Berkeley",
			major: "Computer Science",
		},
		{
			id: 3,
			studentName: "Emma Davis",
			internshipTitle: "Backend Developer Intern",
			appliedDate: "2024-01-14",
			status: "rejected",
			email: "emma.davis@email.com",
			university: "MIT",
			major: "Software Engineering",
		},
	];

	const handleInputChange = (e: { target: { name: any; value: any } }) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e: { preventDefault: () => void }) => {
		e.preventDefault();
		setShowCreateModal(false);
		setFormData({
			title: "",
			description: "",
			location: "",
			requirements: "",
			type: "full-time",
			duration: "3-months",
		});
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "active":
				return "bg-green-100 text-green-800";
			case "closed":
				return "bg-gray-100 text-gray-800";
			case "draft":
				return "bg-yellow-100 text-yellow-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getApplicationStatusColor = (status: string) => {
		switch (status) {
			case "accepted":
				return "bg-green-100 text-green-800";
			case "rejected":
				return "bg-red-100 text-red-800";
			default:
				return "bg-yellow-100 text-yellow-800";
		}
	};

	const getApplicationStatusIcon = (status: string) => {
		switch (status) {
			case "accepted":
				return <CheckCircle className="w-4 h-4 text-green-500" />;
			case "rejected":
				return <XCircle className="w-4 h-4 text-red-500" />;
			default:
				return <Clock className="w-4 h-4 text-yellow-500" />;
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
				{activeTab === "overview" && (
					<div>
						<div className="mb-8">
							<h2 className="text-2xl font-bold text-gray-900 mb-2">
								Dashboard Overview
							</h2>
							<p className="text-gray-600">
								Manage your internship postings and track applications
							</p>
						</div>

						{/* Stats Cards */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
							<div className="bg-white rounded-lg shadow p-6">
								<div className="flex items-center">
									<div className="p-2 bg-blue-100 rounded-lg">
										<Building2 className="w-6 h-6 text-blue-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-600">
											Active Internships
										</p>
										<p className="text-2xl font-bold text-gray-900">2</p>
									</div>
								</div>
							</div>
							<div className="bg-white rounded-lg shadow p-6">
								<div className="flex items-center">
									<div className="p-2 bg-green-100 rounded-lg">
										<Users className="w-6 h-6 text-green-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-600">
											Total Applications
										</p>
										<p className="text-2xl font-bold text-gray-900">73</p>
									</div>
								</div>
							</div>
							<div className="bg-white rounded-lg shadow p-6">
								<div className="flex items-center">
									<div className="p-2 bg-yellow-100 rounded-lg">
										<Clock className="w-6 h-6 text-yellow-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-600">
											Pending Reviews
										</p>
										<p className="text-2xl font-bold text-gray-900">12</p>
									</div>
								</div>
							</div>
							<div className="bg-white rounded-lg shadow p-6">
								<div className="flex items-center">
									<div className="p-2 bg-purple-100 rounded-lg">
										<CheckCircle className="w-6 h-6 text-purple-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-600">Hired</p>
										<p className="text-2xl font-bold text-gray-900">8</p>
									</div>
								</div>
							</div>
						</div>

						{/* Recent Applications */}
						<div className="bg-white rounded-lg shadow">
							<div className="px-6 py-4 border-b border-gray-200">
								<h3 className="text-lg font-medium text-gray-900">
									Recent Applications
								</h3>
							</div>
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Student
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Position
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Applied
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Status
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Actions
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{applications.slice(0, 5).map((app) => (
											<tr key={app.id} className="hover:bg-gray-50">
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm font-medium text-gray-900">
														{app.studentName}
													</div>
													<div className="text-sm text-gray-500">
														{app.email}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-900">
														{app.internshipTitle}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{app.appliedDate}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex items-center">
														{getApplicationStatusIcon(app.status)}
														<Badge
															className={`ml-2 ${getApplicationStatusColor(app.status)}`}
														>
															{app.status.toUpperCase()}
														</Badge>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
													<Button variant="ghost" size="sm">
														View
													</Button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				)}

				{activeTab === "internships" && (
					<div>
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-2xl font-bold text-gray-900">
								My Internships
							</h2>
							<Button
								onClick={() => setShowCreateModal(true)}
								className="flex items-center space-x-2"
							>
								<Plus className="w-4 h-4" />
								<span>Post New Internship</span>
							</Button>
						</div>

						<div className="space-y-4">
							{internships.map((internship) => (
								<div
									key={internship.id}
									className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
								>
									<div className="flex justify-between items-start mb-4">
										<div className="flex-1">
											<div className="flex items-center space-x-3 mb-2">
												<h3 className="text-lg font-semibold text-gray-900">
													{internship.title}
												</h3>
												<Badge className={getStatusColor(internship.status)}>
													{internship.status.toUpperCase()}
												</Badge>
											</div>
											<div className="flex items-center space-x-4 text-gray-600 mb-2">
												<div className="flex items-center">
													<MapPin className="w-4 h-4 mr-1" />
													<span>{internship.location}</span>
												</div>
												<div className="flex items-center">
													<Calendar className="w-4 h-4 mr-1" />
													<span>Posted {internship.posted}</span>
												</div>
												<div className="flex items-center">
													<Users className="w-4 h-4 mr-1" />
													<span>{internship.applications} applications</span>
												</div>
											</div>
											<p className="text-gray-700">{internship.description}</p>
										</div>
										<div className="flex space-x-2 ml-4">
											<Button variant="outline" size="sm">
												<Edit className="w-4 h-4 mr-1" />
												Edit
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={() => setActiveTab("applications")}
											>
												<Eye className="w-4 h-4 mr-1" />
												View Applications
											</Button>
											<Button
												variant="outline"
												size="sm"
												className="text-red-600 hover:text-red-700"
											>
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>
									</div>
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
							Applications
						</h2>
						<div className="bg-white rounded-lg shadow overflow-hidden">
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Student
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Position
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												University
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Applied
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Status
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Actions
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{applications.map((app) => (
											<tr key={app.id} className="hover:bg-gray-50">
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm font-medium text-gray-900">
														{app.studentName}
													</div>
													<div className="text-sm text-gray-500">
														{app.email}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-900">
														{app.internshipTitle}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-900">
														{app.university}
													</div>
													<div className="text-sm text-gray-500">
														{app.major}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{app.appliedDate}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex items-center">
														{getApplicationStatusIcon(app.status)}
														<Badge
															className={`ml-2 ${getApplicationStatusColor(app.status)}`}
														>
															{app.status.toUpperCase()}
														</Badge>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
													<Button variant="ghost" size="sm">
														View Resume
													</Button>
													{app.status === "pending" && (
														<>
															<Button
																variant="ghost"
																size="sm"
																className="text-green-600 hover:text-green-700"
															>
																Accept
															</Button>
															<Button
																variant="ghost"
																size="sm"
																className="text-red-600 hover:text-red-700"
															>
																Reject
															</Button>
														</>
													)}
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
						<h2 className="text-2xl font-bold text-gray-900 mb-6">
							Company Profile
						</h2>
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
										<Input
											type="email"
											defaultValue={userData?.user?.email || ""}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Phone
										</label>
										<Input
											type="tel"
											defaultValue={
												userData?.user.userType === "COMPANY"
													? (userData.profile as CompanyProfile).phoneNumber ||
														""
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
													? (userData.profile as CompanyProfile).description ||
														""
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
									<p className="text-sm text-gray-600 mb-2">
										Upload company logo
									</p>
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
				)}
			</main>

			{/* Create Internship Modal */}
			{showCreateModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="px-6 py-4 border-b border-gray-200">
							<h3 className="text-lg font-medium text-gray-900">
								Post New Internship
							</h3>
						</div>
						<div onSubmit={handleSubmit} className="p-6 space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Job Title
								</label>
								<Input
									type="text"
									name="title"
									value={formData.title}
									onChange={handleInputChange}
									placeholder="e.g. Frontend Developer Intern"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Location
								</label>
								<Input
									type="text"
									name="location"
									value={formData.location}
									onChange={handleInputChange}
									placeholder="e.g. San Francisco, CA or Remote"
									required
								/>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Type
									</label>
									<Select
										value={formData.type}
										onValueChange={(value) =>
											setFormData((prev) => ({ ...prev, type: value }))
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="full-time">Full-time</SelectItem>
											<SelectItem value="part-time">Part-time</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Duration
									</label>
									<Select
										value={formData.duration}
										onValueChange={(value) =>
											setFormData((prev) => ({ ...prev, duration: value }))
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="3-months">3 months</SelectItem>
											<SelectItem value="6-months">6 months</SelectItem>
											<SelectItem value="12-months">12 months</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Description
								</label>
								<Textarea
									name="description"
									value={formData.description}
									onChange={handleInputChange}
									rows={4}
									placeholder="Describe the internship role, responsibilities, and what the intern will learn..."
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Requirements
								</label>
								<Textarea
									name="requirements"
									value={formData.requirements}
									onChange={handleInputChange}
									rows={3}
									placeholder="List the skills, technologies, or qualifications required (comma-separated)"
									required
								/>
							</div>
							<div className="flex justify-end space-x-3 pt-4 border-t">
								<Button
									type="button"
									variant="outline"
									onClick={() => setShowCreateModal(false)}
								>
									Cancel
								</Button>
								<Button type="button" onClick={handleSubmit}>
									Post Internship
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CompanyDashboard;
