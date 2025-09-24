import {
	getApplicationStatusColor,
	getApplicationStatusIcon,
} from "@/data/helper";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { applications } from "@/data/data";

const ApplicationsTab = () => {
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
							{applications.map((app) => (
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
	);
};

export default ApplicationsTab;
