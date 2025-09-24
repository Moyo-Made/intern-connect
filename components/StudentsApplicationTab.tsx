import { studentApplications } from '@/data/data'
import { getApplicationStatusColor, getStatusIcon } from '@/data/helper'
import React from 'react'

const StudentsApplicationTab = () => {
  return (
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
										{studentApplications.map((app) => (
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
  )
}

export default StudentsApplicationTab;
