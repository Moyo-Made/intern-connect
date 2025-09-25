"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Calendar, Edit, Eye, MapPin, Plus, Trash2, Users } from "lucide-react";
import { Badge } from "./ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { internshipsApi } from "@/lib/api-client";
import toast from "react-hot-toast";
import { InternshipData } from "@/lib/validation";
import { Internship } from "@prisma/client";
import { formatDate, getStatusColor } from "@/data/helper";

interface InternshipsTabProps {
	onTabChange: (tab: string) => void;
}

const InternshipsTab = ({ onTabChange }: InternshipsTabProps) => {
	const [showEditModal, setShowEditModal] = useState(false);
	const [editingInternship, setEditingInternship] = useState<Internship | null>(
		null
	);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		location: "",
		requirements: "",
		duration: "",
		stipend: "",
	});
	const [showCreateModal, setShowCreateModal] = useState(false);

	const queryClient = useQueryClient();

	const { data: internshipsData, isLoading: internshipsLoading } = useQuery({
		queryKey: ["internships"],
		queryFn: () => internshipsApi.getAll(),
		staleTime: 5 * 60 * 1000,
	});

	const createInternshipMutation = useMutation({
		mutationFn: internshipsApi.create,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["internships"] });
			toast.success("Internship created successfully!");
		},
	});

	const updateInternshipMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<InternshipData> }) =>
			internshipsApi.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["internships"] });
			toast.success("Internship updated successfully!");
		},
		onError: (error: any) => {
			toast.error(
				error?.response?.data?.message || "Failed to update internship"
			);
		},
	});

	const deleteInternshipMutation = useMutation({
		mutationFn: internshipsApi.delete,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["internships"] });
			toast.success("Internship deleted successfully!");
		},
		onError: (error: any) => {
			toast.error(
				error?.response?.data?.message || "Failed to delete internship"
			);
		},
	});

	const internships = internshipsData?.data?.internships || [];

	const handleInputChange = (e: { target: { name: any; value: any } }) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault();

		try {
			const submitData = {
				...formData,
				stipend: formData.stipend ? parseInt(formData.stipend) : undefined,
			};

			await createInternshipMutation.mutateAsync(submitData);

			toast.success("Internship posted successfully!");
			setShowCreateModal(false);
			setFormData({
				title: "",
				description: "",
				location: "",
				requirements: "",
				duration: "",
				stipend: "",
			});
		} catch (error: any) {
			toast.error(
				error?.response?.data?.message || "Failed to create internship"
			);
			console.error("Error creating internship:", error);
		}
	};

	const handleEditSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault();

		if (!editingInternship) return;

		try {
			const submitData = {
				...formData,
				stipend: formData.stipend ? parseInt(formData.stipend) : undefined,
			};

			await updateInternshipMutation.mutateAsync({
				id: editingInternship.id,
				data: submitData,
			});

			setShowEditModal(false);
			setEditingInternship(null);
			setFormData({
				title: "",
				description: "",
				location: "",
				requirements: "",
				duration: "",
				stipend: "",
			});
		} catch (error: any) {
			console.error("Error updating internship:", error);
		}
	};
	return (
		<div>
			<div>
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold text-gray-900">My Internships</h2>
					<Button
						onClick={() => setShowCreateModal(true)}
						className="flex items-center space-x-0.5 cursor-pointer"
					>
						<Plus className="w-4 h-4" />
						<span>Post New Internship</span>
					</Button>
				</div>

				{internshipsLoading ? (
					<div className="flex flex-col justify-center items-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
						Loading internships...
					</div>
				) : (
					<div className="space-y-4">
						{internships.map((internship: any) => (
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
											<Badge className={getStatusColor(internship.isActive)}>
												{internship.isActive ? "ACTIVE" : "INACTIVE"}
											</Badge>
										</div>
										<div className="flex items-center space-x-4 text-gray-600 mb-2">
											<div className="flex items-center">
												<MapPin className="w-4 h-4 mr-1" />
												<span>{internship.location}</span>
											</div>
											<div className="flex items-center">
												<Calendar className="w-4 h-4 mr-1" />
												<span>Posted {formatDate(internship.createdAt)}</span>
											</div>
											<div className="flex items-center">
												<Users className="w-4 h-4 mr-1" />
												<span>
													<span>
														{internship.applicationCount ||
															internship._count?.applications ||
															0}{" "}
													</span>{" "}
													applications
												</span>
											</div>
										</div>
										<p className="text-gray-700">{internship.description}</p>
									</div>
									<div className="flex space-x-2 ml-4">
										<Button
											variant="outline"
											size="sm"
											onClick={() => {
												setEditingInternship(internship);
												setFormData({
													title: internship.title,
													description: internship.description,
													location: internship.location,
													requirements: Array.isArray(internship.requirements)
														? internship.requirements.join(", ")
														: internship.requirements,
													duration: internship.duration,
													stipend: internship.stipend?.toString() || "",
												});
												setShowEditModal(true);
											}}
											className="cursor-pointer"
										>
											<Edit className="w-4 h-4 mr-1" />
											Edit
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => onTabChange("applications")}
											className="cursor-pointer"
										>
											<Eye className="w-4 h-4 mr-1" />
											View Applications
										</Button>
										<Button
											variant="outline"
											size="sm"
											className="text-red-600 hover:text-red-700 cursor-pointer"
											onClick={() => {
												if (
													confirm(
														"Are you sure you want to delete this internship?"
													)
												) {
													deleteInternshipMutation.mutate(internship.id);
												}
											}}
										>
											<Trash2 className="w-4 h-4" />
										</Button>
									</div>
								</div>
								<div className="flex flex-wrap gap-2">
									{internship.requirements.map(
										(req: any, index: null | undefined) => (
											<span
												key={index}
												className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
											>
												{req}
											</span>
										)
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Create Internship Modal */}
			{showCreateModal && (
				<div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center p-4 z-50">
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
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Duration
									</label>
									<Select
										value={formData.duration}
										onValueChange={(value) =>
											setFormData((prev) => ({
												...prev,
												duration: value as InternshipData["duration"],
											}))
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select duration" />
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
									className="cursor-pointer"
								>
									Cancel
								</Button>
								<Button
									type="button"
									onClick={handleSubmit}
									disabled={createInternshipMutation.isPending}
									className="cursor-pointer"
								>
									{createInternshipMutation.isPending
										? "Posting..."
										: "Post Internship"}
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Edit Internship Modal */}
			{showEditModal && (
				<div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="px-6 py-4 border-b border-gray-200">
							<h3 className="text-lg font-medium text-gray-900">
								Edit Internship
							</h3>
						</div>
						<div className="p-6 space-y-4">
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
										Duration
									</label>
									<Select
										value={formData.duration}
										onValueChange={(value) =>
											setFormData((prev) => ({
												...prev,
												duration: value as InternshipData["duration"],
											}))
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
									onClick={() => {
										setShowEditModal(false);
										setEditingInternship(null);
									}}
									className="cursor-pointer"
								>
									Cancel
								</Button>
								<Button
									type="button"
									onClick={handleEditSubmit}
									disabled={updateInternshipMutation.isPending}
									className="cursor-pointer"
								>
									{updateInternshipMutation.isPending
										? "Updating..."
										: "Update Internship"}
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default InternshipsTab;
