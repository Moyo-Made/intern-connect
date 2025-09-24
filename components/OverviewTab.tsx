import { applications } from "@/data/data";
import {
	getApplicationStatusColor,
	getApplicationStatusIcon,
} from "@/data/helper";
import { Building2, CheckCircle, Clock, Users } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const OverviewTab = () => {
	return (
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
										<div className="text-sm text-gray-500">{app.email}</div>
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
												className={`ml-2 ${getApplicationStatusColor(app.status)} rounded-full`}
											>
												{app.status.toUpperCase()}
											</Badge>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<Button variant="ghost" size="sm" className="cursor-pointer">
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
	);
};

export default OverviewTab;
