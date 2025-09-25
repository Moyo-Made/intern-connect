"use client";

import {
	formatDate,
	getApplicationStatusColor,
	getApplicationStatusIcon,
} from "@/data/helper";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applicationsApi } from "@/lib/api-client";
import { useState } from "react";
import toast from "react-hot-toast";

const ApplicationsTab = () => {
	const [selectedResumeUrl, setSelectedResumeUrl] = useState<string | null>(
		null
	);
	const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
	const queryClient = useQueryClient();

	const {
		data: applicationsResponse,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["company-applications"],
		queryFn: () => applicationsApi.getCompanyApplications(),
		staleTime: 2 * 60 * 1000, // 2 minutes
	});

	const updateStatusMutation = useMutation({
		mutationFn: ({
			applicationId,
			status,
		}: {
			applicationId: string;
			status: string;
		}) => applicationsApi.updateStatus(applicationId, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["company-applications"] });
		},
	});

	const applications = applicationsResponse?.data?.applications || [];

	if (isLoading) {
		return (
			<div className="flex flex-col justify-center items-center py-8">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
				Loading applications...
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-50 border border-red-200 rounded-md p-4">
				<div className="text-red-800">
					Failed to load applications. Please try again.
				</div>
			</div>
		);
	}

	const ResumeModal = () =>
		isResumeModalOpen && (
			<div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
				<div className="bg-white p-6 rounded-lg max-w-4xl max-h-[90vh] w-full mx-4">
					<div className="flex justify-between items-center mb-4">
						<h3 className="text-lg font-medium">Student Resume</h3>
						<Button variant="ghost" onClick={() => setIsResumeModalOpen(false)}>
							✕
						</Button>
					</div>
					<div className="h-[70vh]">
						{selectedResumeUrl ? (
							<iframe
								src={selectedResumeUrl}
								className="w-full h-full border rounded"
								title="Student Resume"
							/>
						) : (
							<p>No resume available</p>
						)}
					</div>
				</div>
			</div>
		);

	return (
		<div>
			<h2 className="text-2xl font-bold text-gray-900 mb-6">Applications</h2>
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
							{applications.map((app: any) => (
								<tr key={app.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm font-medium text-gray-900">
											{app.studentName}
										</div>
										<div className="text-sm text-gray-500">{app.email}</div>
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
										<div className="text-sm text-gray-500">{app.major}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{formatDate(app.appliedAt)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											{getApplicationStatusIcon(app.status)}
											<Badge
												className={`ml-2 ${getApplicationStatusColor(app.status)} rounded-full`}
											>
												{app.status.toUpperCase()}
											</Badge>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => {
												if (app.resumeUrl) {
													setSelectedResumeUrl(app.resumeUrl);
													setIsResumeModalOpen(true);
												} else {
													toast.error("No resume available for this student");
												}
											}}
											className={
												app.resumeUrl
													? "cursor-pointer"
													: "cursor-not-allowed opacity-50"
											}
										>
											View Resume
										</Button>
										{app.status === "pending" && (
											<>
												<Button
													variant="ghost"
													size="sm"
													className="text-green-600 hover:text-green-700"
													onClick={() =>
														updateStatusMutation.mutate({
															applicationId: app.id,
															status: "ACCEPTED",
														})
													}
													disabled={updateStatusMutation.isPending}
												>
													{updateStatusMutation.isPending
														? "Accepting..."
														: "Accept"}
												</Button>
												<Button
													variant="ghost"
													size="sm"
													className="text-red-600 hover:text-red-700"
													onClick={() =>
														updateStatusMutation.mutate({
															applicationId: app.id,
															status: "REJECTED",
														})
													}
													disabled={updateStatusMutation.isPending}
												>
													{updateStatusMutation.isPending
														? "Rejecting..."
														: "Reject"}
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
			<ResumeModal />
		</div>
	);
};

export default ApplicationsTab;
