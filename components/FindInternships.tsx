"use client";

import { SetStateAction, useMemo, useState } from "react";
import { Input } from "./ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { Building2, MapPin, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { applicationsApi, internshipsApi } from "@/lib/api-client";
import ApplyModal from "./modals/ApplyModal";
import { Internship } from "@/types/interface";

const FindInternship = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [locationFilter, setLocationFilter] = useState("");
	const [companyFilter, setCompanyFilter] = useState("");
	const [applyModal, setApplyModal] = useState<{
		internship: Internship | null;
		isOpen: boolean;
	}>({ internship: null, isOpen: false });

	const {
		data: internshipsResponse,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["internships", { searchTerm, locationFilter }],
		queryFn: () =>
			internshipsApi.getAll({
				search: searchTerm || undefined,
				location: locationFilter !== "all" ? locationFilter : undefined,
			}),
	});

	const ApplicationButton = ({ internship }: any) => {
		const { data: applicationStatus, isLoading } = useQuery({
			queryKey: ["internship-status", internship.id],
			queryFn: () => applicationsApi.getStatus(internship.id),
			enabled: !!internship.id,
		});

		if (isLoading) {
			return (
				<button
					disabled
					className="bg-gray-300 text-gray-500 px-4 py-2 rounded-md font-medium cursor-not-allowed"
				>
					Loading...
				</button>
			);
		}

		const hasApplied = applicationStatus?.data?.hasApplied;

		return (
			<button
				onClick={() =>
					!hasApplied && setApplyModal({ internship, isOpen: true })
				}
				disabled={hasApplied}
				className={`px-4 py-2 rounded-md font-medium transition-colors ${
					hasApplied
						? "bg-green-100 text-green-700 border border-green-300 cursor-default"
						: "bg-blue-600 hover:bg-blue-700 text-white"
				}`}
			>
				{hasApplied ? "✓ Applied" : "Apply Now"}
			</button>
		);
	};

	const filteredInternships = useMemo(() => {
		if (!internshipsResponse?.data?.internships) return [];

		return internshipsResponse.data.internships.filter(
			(internship: { company: { companyName: string } }) => {
				const matchesCompany =
					!companyFilter ||
					companyFilter === "all" ||
					internship.company.companyName
						.toLowerCase()
						.includes(companyFilter.toLowerCase());
				return matchesCompany;
			}
		);
	}, [internshipsResponse?.data?.internships, companyFilter]);

	return (
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
								onChange={(e: { target: { value: SetStateAction<string> } }) =>
									setSearchTerm(e.target.value)
								}
								className="pl-10"
							/>
						</div>
					</div>

					<div className="w-48">
						<Select value={locationFilter} onValueChange={setLocationFilter}>
							<SelectTrigger>
								<SelectValue placeholder="All Locations" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Locations</SelectItem>
								<SelectItem value="remote">Remote</SelectItem>
								<SelectItem value="san francisco">San Francisco</SelectItem>
								<SelectItem value="new york">New York</SelectItem>
								<SelectItem value="austin">Austin</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="w-48">
						<Select value={companyFilter} onValueChange={setCompanyFilter}>
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
			{isLoading ? (
				<div className="flex justify-center items-center py-8">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
				</div>
			) : (
				<div className="space-y-4">
					{filteredInternships.map((internship: any) => (
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
											<span>{internship.company.companyName}</span>
										</div>
										<div className="flex items-center">
											<MapPin className="w-4 h-4 mr-1" />
											<span>{internship.location}</span>
										</div>
										<span className="text-sm">{internship.posted}</span>
									</div>
								</div>
								<ApplicationButton internship={internship} />
							</div>
							<p className="text-gray-700 mb-4">{internship.description}</p>
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
			{applyModal.isOpen && applyModal.internship && (
				<ApplyModal
					internship={applyModal.internship}
					isOpen={applyModal.isOpen}
					onClose={() => setApplyModal({ internship: null, isOpen: false })}
				/>
			)}
		</div>
	);
};

export default FindInternship;
