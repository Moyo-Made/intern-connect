import { formatDate, getApplicationStatusColor, getStatusIcon } from "@/data/helper";
import { applicationsApi } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

const StudentsApplicationTab = () => {
	const {
		data: applicationsResponse,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["my-applications"],
		queryFn: applicationsApi.getMyApplications,
		staleTime: 5 * 60 * 1000, // 5 minutes
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
	return (
		<div>
			<h2 className="text-2xl font-bold text-gray-900 mb-6">My Applications</h2>
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
							{applications.map((app: any) => (
								<tr key={app.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm font-medium text-gray-900">
											{app.internship.title}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">
											{app.internship.company.companyName}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-500">
											{formatDate(app.appliedAt)}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											{getStatusIcon(app.status)}
											<span
												className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getApplicationStatusColor(app.status)}`}
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
	);
};

export default StudentsApplicationTab;
